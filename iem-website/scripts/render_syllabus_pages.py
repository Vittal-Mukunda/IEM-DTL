"""
Render the first syllabus page of every core course to a small WebP.

    pip install pymupdf pillow
    python scripts/render_syllabus_pages.py

The Curriculum page opens a course's syllabus in a pop-out. Embedding the
2-4 MB scheme booklets just to show one page would defeat the transfer budget
(see optimize_pdfs.py), so each course's page (units, lab list, course
outcomes) is rasterised once here into `public/syllabus/courses/<code>.webp`
— a text page on a white ground. Lossy WebP smears small type and costs
~140 KB a page, so the page is cropped to its content, reduced to a 16-colour
palette and saved as lossless WebP instead: crisp text at ~50-60 KB.

`PAGES` maps course code -> (booklet, 1-based page of the booklet). Re-run
this after replacing a booklet; it fails loudly if a page no longer carries
the course's code, so a re-paginated booklet cannot ship the wrong syllabus.
"""

from __future__ import annotations

import io
import sys
from pathlib import Path

try:
    import pymupdf
    from PIL import Image, ImageChops
except ImportError:  # pragma: no cover - dependency hint
    sys.exit("needs pymupdf and pillow: pip install pymupdf pillow")

ROOT = Path(__file__).resolve().parent.parent
BOOKLETS = ROOT / "public" / "syllabus"
OUT = BOOKLETS / "courses"

Y2 = "IEM-2022-2nd-year-III-IV"
Y3 = "IEM-2022-3rd-year-V-VI"
Y4 = "IEM-2022-4th-year-VII-VIII"

PAGES: dict[str, tuple[str, int]] = {
    # Semester 3
    "MA231TB": (Y2, 10),
    "IM233AI": (Y2, 18),
    "IM234AI": (Y2, 20),
    "IM235AI": (Y2, 22),
    # Semester 4
    "IM241AT": (Y2, 35),
    "IM343AI": (Y2, 43),
    "IM244AI": (Y2, 45),
    "IM345AT": (Y2, 47),
    "HS248AT": (Y2, 50),
    # Semester 5
    "HS351TA": (Y3, 10),
    "IM352IA": (Y3, 13),
    "IM353IA": (Y3, 15),
    "IM254TA": (Y3, 17),
    # Semester 6
    "HS261TA": (Y3, 29),
    "IM362IA": (Y3, 31),
    "IM363IA": (Y3, 34),
    "IM364TA": (Y3, 36),
    # Semester 7
    "HS271TA": (Y4, 8),
    "IM372IA": (Y4, 10),
    "IM373TA": (Y4, 13),
}

WIDTH = 900        # px; the pop-out shows it at most ~800 CSS px wide
COLOURS = 16
PAD = 14           # px of white kept around the cropped content


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    docs: dict[str, pymupdf.Document] = {}
    total = 0
    for code, (booklet, page_no) in PAGES.items():
        doc = docs.setdefault(booklet, pymupdf.open(BOOKLETS / f"{booklet}.pdf"))
        page = doc[page_no - 1]
        text = page.get_text()
        if code not in text or "Semester" not in text:
            sys.exit(f"{code}: page {page_no} of {booklet} is not its syllabus page")

        zoom = WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        # Trim the page margins and the empty strip under the content.
        box = ImageChops.difference(image, Image.new("RGB", image.size, "white")).getbbox()
        if box:
            left, top, right, bottom = box
            image = image.crop((
                max(0, left - PAD), max(0, top - PAD),
                min(image.width, right + PAD), min(image.height, bottom + PAD),
            ))
        image = image.quantize(COLOURS, method=Image.MEDIANCUT).convert("RGB")
        buffer = io.BytesIO()
        image.save(buffer, "WEBP", lossless=True, method=6)
        (OUT / f"{code}.webp").write_bytes(buffer.getvalue())
        total += len(buffer.getvalue())
        print(f"{code}  {image.width}x{image.height}  {len(buffer.getvalue()) / 1024:5.1f} KB")

    print(f"\n{len(PAGES)} pages, {total / 1024:.0f} KB total -> {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
