"""
Downsample the page scans inside the course PDFs, in place.

    pip install pymupdf pillow
    python scripts/optimize_pdfs.py            # notes, syllabus, newsletters
    python scripts/optimize_pdfs.py --dry-run  # report, change nothing
    python scripts/optimize_pdfs.py public/notes/sem5

Run it on anything new dropped into `public/notes/` before committing.
Re-running is safe: a file already at the target resolution is skipped, so
this is idempotent and costs nothing on a second pass.

Why it exists.

Almost every file under `public/notes/` is a phone or flatbed scan — no text
layer at all, just one JPEG per page — and the scanners hand back 240-500 dpi.
That is two to three times what a page needs to read cleanly on a screen or
print on a home printer, and it makes single files as large as 35 MB.

Size is not a cosmetic problem here. The site is on Vercel's Hobby plan, which
includes 10 GB of Fast Origin Transfer a month: every time the CDN has to pull
a file from the deployment, the whole file is billed. A folder of 30 MB scans
exhausts that allowance in a few hundred cache misses, and the reader waits
through the same bytes.

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
    from PIL import Image
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


def shrink(path: Path, dpi: float, quality: int, apply: bool) -> tuple[int, int, str]:
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
            if effective_dpi <= dpi * DPI_SLACK:
                continue

            new_w = max(1, round(width_pt * dpi / 72))
            new_h = max(1, round(height_pt * dpi / 72))
            if new_w >= original["width"]:
                continue

            try:
                image = Image.open(io.BytesIO(original["image"]))
                if image.mode not in ("RGB", "L"):
                    image = image.convert("RGB")
                buffer = io.BytesIO()
                image.resize((new_w, new_h), Image.LANCZOS).save(
                    buffer, "JPEG", quality=quality, optimize=True, progressive=True
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
            before, after, note = shrink(path, args.dpi, args.quality, not args.dry_run)
        except Exception as exc:
            before = after = path.stat().st_size
            note = f"failed: {exc}"
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
