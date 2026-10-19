"""
Downsample the page scans inside the course PDFs and repack them, in place.

    pip install pymupdf pillow
    python scripts/optimize_pdfs.py            # notes, syllabus, newsletters
    python scripts/optimize_pdfs.py --dry-run  # report, change nothing
    python scripts/optimize_pdfs.py public/notes/sem5

Run it on anything new dropped into `public/notes/` before committing.
Re-running is safe: a file already at the target resolution is skipped, so
this is idempotent and costs nothing on a second pass.

Why it exists.

Many files under `public/notes/` are phone or flatbed scans — no text layer
at all, just one JPEG per page — and the scanners hand back 240-500 dpi.
That is two to three times what a page needs to read cleanly on a screen or
print on a home printer, and it makes single files as large as 35 MB.

Size is not a cosmetic problem here. The site is on Vercel's Hobby plan, which
caps Deployment Storage at 10 GB per team, and every deployment Vercel keeps
stores its own full copy of `public/` — so a megabyte here is a megabyte times
every retained deployment. Each download also counts against the 100 GB of
Fast Data Transfer a month, and the reader waits through the same bytes.

The digital PDFs (typeset notes, slides, merged question papers) get a second,
lossless pass: embedded fonts are cut down to the glyphs actually used and the
object tables are packed into compressed streams. See `repack()`.

So each embedded scan is resized to `--dpi` with Lanczos and re-encoded as
progressive JPEG. At 150 dpi the result is indistinguishable from a 266 dpi
original on screen and roughly half the bytes. Vector art, diagrams, small
inline figures and anything already at or below the target are left untouched,
and a rewrite is kept only if it actually saved space and the page count
survived — so a file can only get smaller, never worse.
"""

from __future__ import annotations

import argparse
import io
import os
import shutil
import sys
from pathlib import Path

try:
    import pymupdf
    from PIL import Image, ImageChops, ImageStat
except ImportError:  # pragma: no cover - dependency hint
    sys.exit("needs pymupdf and pillow: pip install pymupdf pillow")

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DIRS = ["public/notes", "public/syllabus", "public/newsletters"]

# Below this an image is a logo, an inline figure or a diagram crop — the kind
# of thing a resize would visibly soften without reclaiming anything worth
# having.
MIN_IMAGE_BYTES = 40_000

# Leave a little slack above the target so a scan that is already close is not
# re-encoded for a percent or two.
DPI_SLACK = 1.08

# A rewrite that saves less than this is not worth the generation loss.
MIN_SAVING = 0.10

# "Lean" pass for scans that are already near 150 dpi but stored as dense,
# high-quality JPEGs (a 62-page handwritten notebook can still weigh 20 MB).
# Greyscale pages — the usual case for pen on ruled paper — are fine at 130 dpi
# and JPEG quality 60; colour pages keep their resolution and drop to 72.
# Only JPEGs are touched (lossless diagrams stay lossless), and an image is
# skipped once its estimated quality is at the target, so re-runs do nothing.
LEAN_DPI_GRAY = 130
LEAN_QUALITY_GRAY = 60
LEAN_QUALITY_COLOUR = 72
LEAN_BYTES_PER_PIXEL = 0.09
QUALITY_TOLERANCE = 4
GRAY_CHROMA = 3.0

# Lossless repack (fonts subset, objects packed). Pages are rendered at
# VERIFY_DPI before and after; a page "matches" when at most
# VERIFY_CHANGED_FRACTION of its pixels move by more than
# VERIFY_PIXEL_TOLERANCE grey levels (glyph anti-aliasing can shift a little
# when a font is re-encoded; a lost glyph or image moves far more than that).
# A repack saving under MIN_REPACK_SAVING is dropped, which also makes re-runs
# a no-op.
VERIFY_DPI = 50
VERIFY_PIXEL_TOLERANCE = 24
VERIFY_CHANGED_FRACTION = 0.0005
MIN_REPACK_SAVING = 0.03

# Annex K luminance table: the baseline a JPEG's quality is measured against.
_STD_LUMA_SUM = sum([
    16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99,
])


def estimate_quality(image: Image.Image) -> int:
    """Best guess at the libjpeg quality an image was saved with."""
    table = getattr(image, "quantization", {}).get(0)
    if not table:
        return 100
    scale = 100 * sum(table) / _STD_LUMA_SUM
    quality = (200 - scale) / 2 if scale <= 100 else 5000 / scale
    return max(1, min(100, round(quality)))


def is_greyscale(image: Image.Image) -> bool:
    """True when an RGB scan carries no real colour (pen on white paper)."""
    if image.mode == "L":
        return True
    if image.mode != "RGB":
        return False
    small = image.resize((64, 64))
    r, _, b = small.split()
    diff = ImageChops.difference(r, b)
    return ImageStat.Stat(diff).mean[0] < GRAY_CHROMA


def shrink(path: Path, dpi: float, quality: int, apply: bool,
           lean: bool = True) -> tuple[int, int, str]:
    """Rewrite one PDF's oversized scans. Returns (before, after, note)."""
    before = path.stat().st_size
    doc = pymupdf.open(path)
    pages_before = doc.page_count
    seen: set[int] = set()
    touched = 0

    for pno in range(doc.page_count):
        page = doc[pno]
        for info in page.get_images(full=True):
            xref = info[0]
            if xref in seen:
                continue
            seen.add(xref)

            rects = page.get_image_rects(xref)
            if not rects:
                continue
            width_pt = max(r.width for r in rects)
            height_pt = max(r.height for r in rects)

            try:
                original = doc.extract_image(xref)
            except Exception:
                continue
            if len(original["image"]) < MIN_IMAGE_BYTES:
                continue

            # Effective resolution: pixels across, over inches across.
            effective_dpi = original["width"] / max(width_pt, 1) * 72
            is_jpeg = original["ext"] in ("jpeg", "jpg")

            try:
                image = Image.open(io.BytesIO(original["image"]))
                grey = lean and is_jpeg and is_greyscale(image)
                target_dpi = min(dpi, LEAN_DPI_GRAY) if grey else dpi
                target_quality = quality
                if lean and is_jpeg:
                    target_quality = LEAN_QUALITY_GRAY if grey else LEAN_QUALITY_COLOUR
                    target_quality = min(target_quality, quality)

                oversized = effective_dpi > target_dpi * DPI_SLACK
                dense = (
                    lean
                    and is_jpeg
                    and len(original["image"])
                    / (original["width"] * original["height"])
                    > LEAN_BYTES_PER_PIXEL
                    and estimate_quality(image) > target_quality + QUALITY_TOLERANCE
                )
                if not oversized and not dense:
                    continue

                if oversized:
                    new_w = max(1, round(width_pt * target_dpi / 72))
                    new_h = max(1, round(height_pt * target_dpi / 72))
                    if new_w >= original["width"]:
                        continue
                else:
                    new_w, new_h = original["width"], original["height"]

                if grey:
                    image = image.convert("L")
                elif image.mode not in ("RGB", "L"):
                    image = image.convert("RGB")
                if (new_w, new_h) != image.size:
                    image = image.resize((new_w, new_h), Image.LANCZOS)
                buffer = io.BytesIO()
                image.save(
                    buffer, "JPEG", quality=target_quality, optimize=True,
                    progressive=True,
                )
            except Exception:
                continue

            data = buffer.getvalue()
            if len(data) >= len(original["image"]):
                continue
            try:
                page.replace_image(xref, stream=data)
                touched += 1
            except Exception:
                pass

    if not touched:
        doc.close()
        return before, before, "already lean"

    tmp = path.with_suffix(".pdf.tmp")
    doc.save(tmp, garbage=4, deflate=True, clean=True)
    doc.close()

    # Never trust the rewrite blind: reopen it and count the pages back.
    try:
        check = pymupdf.open(tmp)
        pages_after = check.page_count
        check.close()
    except Exception as exc:
        tmp.unlink(missing_ok=True)
        return before, before, f"output unreadable ({exc}), kept original"

    after = tmp.stat().st_size
    if pages_after != pages_before:
        tmp.unlink(missing_ok=True)
        return before, before, f"page count {pages_before} -> {pages_after}, kept original"
    if after >= before * (1 - MIN_SAVING):
        tmp.unlink(missing_ok=True)
        return before, before, "little to gain, kept original"

    if not apply:
        tmp.unlink(missing_ok=True)
        return before, after, f"would rewrite {touched} scans"

    shutil.move(tmp, path)
    return before, after, f"rewrote {touched} scans"


def render_pages(doc: "pymupdf.Document") -> list[Image.Image]:
    """Every page as a small greyscale raster, for before/after comparison."""
    pages = []
    for page in doc:
        pix = page.get_pixmap(dpi=VERIFY_DPI, colorspace=pymupdf.csGRAY, alpha=False)
        pages.append(Image.frombytes("L", (pix.width, pix.height), pix.samples))
    return pages


def looks_identical(a: Image.Image, b: Image.Image) -> bool:
    """True when two renders differ by no more than anti-aliasing noise."""
    if a.size != b.size:
        return False
    histogram = ImageChops.difference(a, b).histogram()
    changed = sum(histogram[VERIFY_PIXEL_TOLERANCE + 1:])
    return changed <= a.width * a.height * VERIFY_CHANGED_FRACTION


def repack(path: Path, apply: bool) -> tuple[int, int, str]:
    """Losslessly restructure one PDF. Returns (before, after, note).

    Two things bloat the digital (non-scan) PDFs: whole fonts embedded where a
    handful of glyphs are used — merged question papers carry one full copy per
    source paper — and uncompressed object tables. Subsetting the fonts and
    packing objects into compressed object streams changes no pixel on the
    page. That claim is checked, not assumed: every page is rendered before and
    after, and the rewrite is dropped if any page differs.
    """
    before = path.stat().st_size
    doc = pymupdf.open(path)
    if doc.needs_pass or doc.is_encrypted:
        doc.close()
        return before, before, "encrypted, skipped"
    reference = render_pages(doc)

    tmp = path.with_suffix(".pdf.tmp")
    try:
        doc.subset_fonts()
    except Exception:
        pass  # an odd font is left whole; the object packing still applies
    doc.save(tmp, garbage=4, deflate=True, use_objstms=1)
    doc.close()

    after = tmp.stat().st_size
    if after >= before * (1 - MIN_REPACK_SAVING):
        tmp.unlink(missing_ok=True)
        return before, before, "already packed"

    try:
        check = pymupdf.open(tmp)
        rendered = render_pages(check)
        check.close()
    except Exception as exc:
        tmp.unlink(missing_ok=True)
        return before, before, f"repack unreadable ({exc}), kept original"
    if len(rendered) != len(reference):
        tmp.unlink(missing_ok=True)
        return before, before, "repack changed the page count, kept original"
    for number, (old, new) in enumerate(zip(reference, rendered), start=1):
        if not looks_identical(old, new):
            tmp.unlink(missing_ok=True)
            return before, before, f"repack changed page {number}, kept original"

    if not apply:
        tmp.unlink(missing_ok=True)
        return before, after, "would repack fonts and objects"

    shutil.move(tmp, path)
    return before, after, "repacked fonts and objects"


def collect(targets: list[str]) -> list[Path]:
    files: list[Path] = []
    for target in targets:
        path = (ROOT / target) if not os.path.isabs(target) else Path(target)
        if path.is_file():
            files.append(path)
        else:
            files.extend(sorted(path.rglob("*.pdf")))
    return files


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    parser.add_argument("paths", nargs="*", default=DEFAULT_DIRS,
                        help="files or directories (default: notes, syllabus, newsletters)")
    parser.add_argument("--dpi", type=float, default=150,
                        help="target resolution for page scans (default: 150)")
    parser.add_argument("--quality", type=int, default=82,
                        help="JPEG quality for the rewritten scans (default: 82)")
    parser.add_argument("--no-lean", action="store_true",
                        help="skip the dense-JPEG pass (greyscale 130 dpi / q60)")
    parser.add_argument("--no-repack", action="store_true",
                        help="skip the lossless font-subset / object-packing pass")
    parser.add_argument("--dry-run", action="store_true",
                        help="report what would change, write nothing")
    args = parser.parse_args()

    files = collect(args.paths or DEFAULT_DIRS)
    if not files:
        print("no PDFs found")
        return 1

    total_before = total_after = 0
    changed = 0
    for path in files:
        try:
            before, after, note = shrink(path, args.dpi, args.quality, not args.dry_run,
                                       lean=not args.no_lean)
        except Exception as exc:
            before = after = path.stat().st_size
            note = f"failed: {exc}"
        if not args.no_repack:
            # Runs on the scan pass's output (or, in a dry run, the original).
            try:
                packed_before, packed_after, packed_note = repack(path, not args.dry_run)
            except Exception as exc:
                packed_before = packed_after = path.stat().st_size
                packed_note = f"repack failed: {exc}"
            if packed_after < packed_before:
                after -= packed_before - packed_after
                note = packed_note if after + packed_before - packed_after == before \
                    else f"{note}; {packed_note}"
            elif packed_note.startswith(("repack", "encrypted")):
                print(f"  kept as is: {path.relative_to(ROOT)}  [{packed_note}]")
        total_before += before
        total_after += after
        if after < before:
            changed += 1
            rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
            print(f"{before / 1048576:7.1f} -> {after / 1048576:6.1f} MB "
                  f"({100 - 100 * after / before:3.0f}% off)  {rel}  [{note}]")

    saved = total_before - total_after
    print(f"\n{changed}/{len(files)} PDFs shrunk: "
          f"{total_before / 1048576:.0f} MB -> {total_after / 1048576:.0f} MB "
          f"({saved / 1048576:.0f} MB saved)")
    if args.dry_run:
        print("dry run — nothing was written")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
