"""
Render a preview thumbnail for each template.

    npx tsx scripts/verify-generate.mts && python scripts/resume_thumbnails.py

Uses each template's `typical` fixture — the same résumé for every one, so the
picker shows a genuine comparison of layouts rather than of made-up content.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
VERIFY = ROOT / ".verify"
OUT = ROOT / "public" / "templates"
WIDTH = 620  # 2x the ~310px the picker paints, for retina screens


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if not VERIFY.is_dir():
        print("Run `npx tsx scripts/verify-generate.mts` first.")
        return 1

    made = 0
    for template_dir in sorted(VERIFY.iterdir()):
        pdf = template_dir / "typical" / "generated.pdf"
        if not pdf.exists():
            continue
        doc = pymupdf.open(pdf)
        page = doc[0]
        zoom = WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), colorspace=pymupdf.csRGB)
        dest = OUT / template_dir.name
        dest.mkdir(parents=True, exist_ok=True)
        pix.save(dest / "thumb.png")
        doc.close()
        made += 1
        print(f"  {template_dir.name}/thumb.png  {pix.width}x{pix.height}")

    print(f"\n{made} thumbnails written to public/templates/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
