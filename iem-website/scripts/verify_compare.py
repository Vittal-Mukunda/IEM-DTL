"""
Stage two of template verification: compare what the engine produced against
the document it replicates, and write the report.

    python scripts/verify_compare.py [templateId]

Requires PyMuPDF, Pillow and NumPy:

    pip install pymupdf pillow numpy

Why Python for this half: the engine must stay the single source of truth, so
stage one runs the real TypeScript code. But the comparison is image forensics
— rasterise, register, diff — and PyMuPDF does that in a few lines where the
Node ecosystem needs a native canvas build that does not survive CI.

Registration matters. Several of the originals are samples embedded inside a
careers-guide chapter: Harvard's sits 69pt down the page, Columbia's is printed
at about 71% scale. Diffing without correcting for that would report a wrong
answer with great confidence. So the comparator recovers the scale and offset
from matched text runs first, reports them, and measures everything else in
that registered frame.
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
VERIFY = ROOT / ".verify"
TEMPLATES = ROOT / "public" / "templates"
REPORT = ROOT / "docs" / "resume-builder" / "verification_report.md"
DPI = 150

# A run has to land within this many points of its counterpart to count as
# correctly placed. 2pt is under a millimetre — below what anyone perceives,
# and well under one line of leading.
PLACEMENT_TOLERANCE_PT = 2.0


@dataclass
class Span:
    """One extracted word, at its baseline-ish bottom-left corner."""

    text: str
    x: float
    y: float
    size: float
    font: str

    @property
    def key(self) -> str:
        """Case-folded, for matching.

        Templates whose original uses a true small-cap face report "Education"
        where ours synthesises the effect and reports "EDUCATION". The glyphs
        look the same on the page; only the extracted string differs.
        """
        return self.text.casefold()


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def load_words(path: Path, page_index: int, font_filter: str | None) -> list[Span]:
    """Word-level extraction, anchored on the text **baseline**.

    Two decisions here, both learned the hard way:

    * Words, not spans. The original groups a whole contact line into one span
      while the generated PDF draws one run per style change, so span
      boundaries would never line up. Words are the granularity both agree on.

    * The baseline, not the bounding box. `get_text("words")` reports a box
      derived from the font's ascent and descent, which differ between Times
      New Roman and Tinos even though their advance widths are identical — so
      box-bottom comparisons show a phantom offset that varies by word. The
      span origin is the real baseline and is font-independent.
    """
    doc = pymupdf.open(path)
    page = doc[page_index]
    words: list[Span] = []

    for block in page.get_text("rawdict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                if font_filter and not re.search(font_filter, span["font"], re.I):
                    continue
                baseline = round(span["origin"][1], 2)
                size = round(span["size"], 2)
                current = ""
                start_x = None
                for char in span["chars"]:
                    if char["c"].isspace():
                        if current and start_x is not None:
                            words.append(Span(current, round(start_x, 2), baseline, size, span["font"]))
                        current, start_x = "", None
                        continue
                    if start_x is None:
                        start_x = char["origin"][0]
                    current += char["c"]
                if current and start_x is not None:
                    words.append(Span(current, round(start_x, 2), baseline, size, span["font"]))

    doc.close()
    return words


def fit_axis(source: np.ndarray, target: np.ndarray) -> tuple[float, float]:
    src_c = source - source.mean()
    dst_c = target - target.mean()
    denom = float((src_c * src_c).sum())
    scale = float((src_c * dst_c).sum() / denom) if denom > 1e-9 else 1.0
    return scale, float(target.mean() - scale * source.mean())


def fit_affine(pairs: list[tuple[Span, Span]]) -> tuple[float, float, float, float]:
    """Least-squares fit of  target = scale * source + offset,  per axis.

    The axes are fitted **independently**. A shared scale was tried first and
    was actively misleading: a small systematic error in the leadings pulled the
    single scale off 1.0, which then shifted every x by two points and reported
    a horizontal problem that did not exist. Fitting separately keeps a vertical
    fault vertical — and if the two scales genuinely diverge, that divergence is
    itself worth seeing.
    """
    if len(pairs) < 3:
        return 1.0, 1.0, 0.0, 0.0

    sx, dx = fit_axis(
        np.array([a.x for a, _ in pairs], dtype=float),
        np.array([b.x for _, b in pairs], dtype=float),
    )
    sy, dy = fit_axis(
        np.array([a.y for a, _ in pairs], dtype=float),
        np.array([b.y for _, b in pairs], dtype=float),
    )
    return sx, sy, dx, dy


def match_spans(source: list[Span], target: list[Span]) -> list[tuple[Span, Span]]:
    """Pair spans by text. Texts appearing once on each side anchor the fit.

    One- and two-letter tokens are skipped: a unique "A" or "&" on a two-column
    page is almost always the same glyph in the other column, and a 200pt false
    pair pulls the affine fit off 1.0. Tokens that already sit more than a
    column apart are skipped for the same reason. Guide-page y offsets (Harvard
    ~65pt) stay inside the 120pt window.
    """
    by_text: dict[str, list[Span]] = {}
    for span in target:
        by_text.setdefault(span.key, []).append(span)

    unique: list[tuple[Span, Span]] = []
    source_counts: dict[str, int] = {}
    for span in source:
        source_counts[span.key] = source_counts.get(span.key, 0) + 1

    for span in source:
        if len(span.text) < 3:
            continue
        candidates = by_text.get(span.key)
        if not candidates or len(candidates) != 1 or source_counts[span.key] != 1:
            continue
        other = candidates[0]
        if abs(span.x - other.x) > 120 or abs(span.y - other.y) > 120:
            continue
        unique.append((span, other))
    return unique


def match_all(source: list[Span], target: list[Span], sx: float, sy: float, dx: float, dy: float):
    """After registration, pair every source span with its nearest same-text peer."""
    remaining = list(target)
    matched: list[tuple[Span, Span, float, float]] = []
    unmatched: list[Span] = []

    for span in source:
        want_x = sx * span.x + dx
        want_y = sy * span.y + dy
        best = None
        best_d = 1e18
        for candidate in remaining:
            if candidate.key != span.key:
                continue
            d = (candidate.x - want_x) ** 2 + (candidate.y - want_y) ** 2
            if d < best_d:
                best_d = d
                best = candidate
        if best is None:
            unmatched.append(span)
            continue
        remaining.remove(best)
        matched.append((span, best, best.x - want_x, best.y - want_y))

    return matched, unmatched, remaining


def rasterise(path: Path, page_index: int) -> np.ndarray:
    doc = pymupdf.open(path)
    pix = doc[page_index].get_pixmap(dpi=DPI, colorspace=pymupdf.csGRAY)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width)
    doc.close()
    return img.copy()


def guide_chrome(path: Path, page_index: int, font_filter: str | None, mask_drawings: bool):
    """Regions of the original that belong to the guide, not the résumé.

    Derived, not hand-drawn. Hand-picked rectangles were tried first and quietly
    ate the candidate's name along with the callout beside it — the whole point
    of a verifier is that it cannot be fooled by its own configuration.

    Two sources, both reliable:
      * every text span set in a family the résumé does not use (the callouts
        are Minion Pro, the chapter title ACaslon Pro, the running head
        Baskerville Old Face);
      * every vector drawing, when the template says so — in these guides the
        résumé itself contains no rules, so all of them are annotation boxes
        and leader lines.
    """
    doc = pymupdf.open(path)
    page = doc[page_index]
    boxes: list[tuple[float, float, float, float]] = []

    if font_filter:
        for block in page.get_text("dict")["blocks"]:
            if block["type"] != 0:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    if span["text"].strip() and not re.search(font_filter, span["font"], re.I):
                        x0, y0, x1, y1 = span["bbox"]
                        boxes.append((x0 - 1, y0 - 1, x1 + 1, y1 + 1))

    if mask_drawings:
        for drawing in page.get_drawings():
            r = drawing["rect"]
            boxes.append((r.x0 - 1, r.y0 - 1, r.x1 + 1, r.y1 + 1))

    doc.close()
    return boxes


def mask_regions(img: np.ndarray, regions) -> np.ndarray:
    """White out regions, in points, on a raster measured in pixels."""
    k = DPI / 72.0
    out = img.copy()
    h, w = out.shape
    for x0, y0, x1, y1 in regions:
        out[
            max(0, int(y0 * k)) : min(h, int(np.ceil(y1 * k))),
            max(0, int(x0 * k)) : min(w, int(np.ceil(x1 * k))),
        ] = 255
    return out


def ink(img: np.ndarray, threshold: int = 160) -> np.ndarray:
    return img < threshold


def dilate(mask: np.ndarray, radius: int = 1) -> np.ndarray:
    out = mask.copy()
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            out |= np.roll(np.roll(mask, dy, axis=0), dx, axis=1)
    return out


def compare_images(original: np.ndarray, generated: np.ndarray, scale: float, dx: float, dy: float):
    """Register the generated raster onto the original, then compare the ink."""
    k = DPI / 72.0
    pil = Image.fromarray(generated)

    # The fit is  generated = scale * original + offset,  so going the other
    # way — generated back into the original's frame — is
    #   original = (generated - offset) / scale.
    inv = 1.0 / scale if abs(scale) > 1e-9 else 1.0
    new_size = (max(1, int(pil.width * inv)), max(1, int(pil.height * inv)))
    pil = pil.resize(new_size, Image.LANCZOS)

    canvas = Image.new("L", (original.shape[1], original.shape[0]), 255)
    canvas.paste(pil, (int(round(-dx * k * inv)), int(round(-dy * k * inv))))
    reg = np.array(canvas)

    a = ink(original)
    b = ink(reg)
    if not a.any() and not b.any():
        return 1.0, 1.0, reg

    # Plain pixel agreement, and an ink-overlap score that ignores the vast
    # white background (which would otherwise flatter every result).
    agreement = float((a == b).mean())
    overlap = float((dilate(a, 2) & b).sum() + (a & dilate(b, 2)).sum())
    total = float(a.sum() + b.sum())
    ink_score = overlap / total if total else 1.0
    return agreement, min(1.0, ink_score), reg


def verify(template_id: str) -> dict | None:
    template_dir = VERIFY / template_id
    if not template_dir.is_dir():
        return None

    config_path = TEMPLATES / template_id / "verify.json"
    config = json.loads(config_path.read_text(encoding="utf-8")) if config_path.exists() else {}
    original_pdf = TEMPLATES / template_id / "original.pdf"

    results = []
    for fixture_dir in sorted(template_dir.iterdir()):
        meta = json.loads((fixture_dir / "meta.json").read_text(encoding="utf-8"))
        generated_pdf = fixture_dir / "generated.pdf"
        entry = {"fixture": fixture_dir.name, "meta": meta, "scored": False}

        is_replication = fixture_dir.name.endswith("-original")
        if is_replication and original_pdf.exists():
            page = config.get("page", 1) - 1
            src = load_words(original_pdf, page, config.get("includeFontPattern"))
            dst = load_words(generated_pdf, 0, None)

            anchors = match_spans(src, dst)
            sx, sy, dx, dy = fit_affine(anchors)
            matched, missing, extra = match_all(src, dst, sx, sy, dx, dy)

            residuals = [(abs(rx), abs(ry)) for _, _, rx, ry in matched]
            within = sum(1 for rx, ry in residuals if max(rx, ry) <= PLACEMENT_TOLERANCE_PT)
            placement = within / len(src) if src else 0.0
            rms = (
                float(np.sqrt(np.mean([rx**2 + ry**2 for rx, ry in residuals])))
                if residuals
                else 0.0
            )

            orig_img = rasterise(original_pdf, page)
            chrome = guide_chrome(
                original_pdf,
                page,
                config.get("includeFontPattern"),
                config.get("maskDrawings", False),
            )
            chrome += [tuple(r) for r in config.get("maskRegions", [])]
            if chrome:
                orig_img = mask_regions(orig_img, chrome)
            gen_img = rasterise(generated_pdf, 0)
            agreement, ink_score, reg = compare_images(orig_img, gen_img, (sx + sy) / 2, dx, dy)

            Image.fromarray(
                np.stack([orig_img, reg, np.full_like(orig_img, 255)], axis=-1)
            ).save(fixture_dir / "diff.png")

            worst = sorted(
                ((max(abs(rx), abs(ry)), s.text, rx, ry) for s, _, rx, ry in matched),
                reverse=True,
            )[:6]

            entry.update(
                scored=True,
                registration={
                    "scaleX": round(sx, 5),
                    "scaleY": round(sy, 5),
                    "dx": round(dx, 2),
                    "dy": round(dy, 2),
                },
                counts={"original": len(src), "generated": len(dst), "matched": len(matched)},
                placement=placement,
                rms=rms,
                pixel=agreement,
                ink=ink_score,
                missing=[s.text for s in missing][:8],
                extra=[s.text for s in extra][:8],
                worst=worst,
            )

        results.append(entry)

    return {"template": template_id, "results": results}


def pct(value: float) -> str:
    return f"{value * 100:.1f}%"


def write_report(reports: list[dict]) -> None:
    lines: list[str] = [
        "# Template verification report",
        "",
        "Generated by `npm run verify:templates`. Do not edit — regenerate.",
        "",
        f"Rasterised at {DPI} dpi. Placement tolerance {PLACEMENT_TOLERANCE_PT}pt.",
        "",
        "**Registration.** Several originals are samples printed inside a careers-guide",
        "chapter, so they sit at an offset (and sometimes a reduced scale) that has",
        "nothing to do with layout fidelity. The scale and offset below are recovered",
        "from matched text runs and reported openly; every other number is measured",
        "after correcting for them.",
        "",
    ]

    # Headline table first, so the status of all eight is visible at a glance.
    lines.append("## Summary")
    lines.append("")
    lines.append("| Template | Replication fixture | Text placement | Ink overlap | RMS |")
    lines.append("| --- | --- | --- | --- | --- |")
    for report in reports:
        scored = [r for r in report["results"] if r["scored"]]
        if scored:
            r = scored[0]
            lines.append(
                f"| {r['meta']['templateName']} | yes | **{pct(r['placement'])}** | "
                f"{pct(r['ink'])} | {r['rms']:.2f}pt |"
            )
        else:
            name = report["results"][0]["meta"]["templateName"] if report["results"] else report["template"]
            lines.append(f"| {name} | not yet transcribed | — | — | — |")
    lines.append("")
    lines.append(
        "A template without a replication fixture is still exercised by the whole stress "
        "matrix below and by the invariant checks in `src/resume/core/engine.test.ts`; what "
        "it lacks is a transcription of its original sample to diff against. Writing one is "
        "a transcription job, not an engineering one — see ADDING-A-TEMPLATE.md."
    )
    lines.append("")

    for report in reports:
        scored = [r for r in report["results"] if r["scored"]]
        lines.append(f"## {report['template']}")
        lines.append("")

        for result in scored:
            meta = result["meta"]
            reg = result["registration"]
            lines.append(f"### {meta['templateName']} — replication")
            lines.append("")
            lines.append(f"**Accuracy: {pct(result['placement'])}** (text placement) · "
                         f"{pct(result['ink'])} (ink overlap) · {pct(result['pixel'])} (raw pixels)")
            lines.append("")
            lines.append(
                f"- Registration: scale {reg['scaleX']}×{reg['scaleY']}, "
                f"offset ({reg['dx']}, {reg['dy']})pt"
            )
            lines.append(f"- Runs: {result['counts']['original']} in the original, "
                         f"{result['counts']['matched']} matched")
            lines.append(f"- RMS placement error: {result['rms']:.2f}pt")
            lines.append("")
            lines.append("Differences:")
            for delta, text, rx, ry in result["worst"]:
                if delta <= 0.5:
                    continue
                label = text if len(text) <= 46 else text[:43] + "..."
                lines.append(f"- `{label}` off by ({rx:+.1f}, {ry:+.1f})pt")
            for sub in meta.get("substitutions", []):
                lines.append(
                    f"- Font substitution: {sub['original']} → {sub['family']} "
                    f"({sub['fidelity']}-compatible)"
                )
            if result["missing"]:
                lines.append(f"- Not found in output: {', '.join(repr(t) for t in result['missing'])}")
            if result["extra"]:
                lines.append(f"- Only in output: {', '.join(repr(t) for t in result['extra'])}")
            lines.append("")

        lines.append("#### Stress fixtures")
        lines.append("")
        lines.append("| Fixture | Pages | Scale | Spacing | Overflow | Warnings |")
        lines.append("| --- | --- | --- | --- | --- | --- |")
        for result in report["results"]:
            meta = result["meta"]
            warnings = "; ".join(w["code"] for w in meta["warnings"]) or "—"
            lines.append(
                f"| {result['fixture']} | {meta['pages']} | {meta['appliedFontScale']:.2f} | "
                f"{meta['appliedSpacing']:.2f} | {meta['overflowBy']:.0f}pt | {warnings} |"
            )
        lines.append("")

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if not VERIFY.is_dir():
        print("No .verify/ directory — run `npx tsx scripts/verify-generate.mts` first.")
        return 1

    ids = [d.name for d in sorted(VERIFY.iterdir()) if d.is_dir()]
    if only:
        ids = [i for i in ids if i == only]

    reports = [r for r in (verify(i) for i in ids) if r]
    write_report(reports)

    failed = False
    for report in reports:
        for result in report["results"]:
            if not result["scored"]:
                continue
            print(
                f"  {report['template']}/{result['fixture']}: "
                f"placement {pct(result['placement'])}, ink {pct(result['ink'])}, "
                f"rms {result['rms']:.2f}pt"
            )
            if result["placement"] < 0.95:
                failed = True

    print(f"\nReport written to {REPORT.relative_to(ROOT)}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
