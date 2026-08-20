"""
Template forensics: dump a PDF page as baselines, x positions, fonts and sizes.

    python scripts/forensics.py <pdf> [page] [--scale N]

Prints one row per text line — baseline y, the gap to the previous baseline, and
each run's font, size and x. That is the shape a template definition is written
from, so calibrating a new template is a matter of reading two columns side by
side rather than guessing.

`--scale` divides every measurement, for samples printed at reduced size inside
a careers-guide chapter (Columbia's is about 71%).
"""

from __future__ import annotations

import sys
from pathlib import Path

import pymupdf


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    path = Path(sys.argv[1])
    page_no = int(sys.argv[2]) - 1 if len(sys.argv) > 2 and not sys.argv[2].startswith("-") else 0
    scale = 1.0
    if "--scale" in sys.argv:
        scale = float(sys.argv[sys.argv.index("--scale") + 1])

    doc = pymupdf.open(path)
    page = doc[page_no]
    rect = page.rect
    print(f"== {path.name} p{page_no + 1}  {rect.width:.2f} x {rect.height:.2f}pt  scale /{scale}")

    lines: dict[float, list[dict]] = {}
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                if not span["text"].strip():
                    continue
                baseline = round(span["origin"][1] / scale, 2)
                lines.setdefault(baseline, []).append(
                    {
                        "x": round(span["origin"][0] / scale, 2),
                        "x1": round(span["bbox"][2] / scale, 2),
                        "font": span["font"].split("+")[-1],
                        "size": round(span["size"] / scale, 2),
                        "colour": f"#{span['color']:06x}",
                        "text": span["text"],
                    }
                )

    previous = None
    for y in sorted(lines):
        gap = "" if previous is None else f"+{y - previous:6.2f}"
        previous = y
        runs = sorted(lines[y], key=lambda s: s["x"])
        body = "  ".join(
            f"[{r['font']}/{r['size']}/{r['colour']}@{r['x']:.1f}-{r['x1']:.1f}]{r['text']}" for r in runs
        )
        print(f"y={y:7.2f} {gap:>7s}  {body[:210]}")

    rules = [
        d
        for d in page.get_drawings()
        if (d["rect"].height < 4 or d["rect"].width < 4) and d["rect"].width + d["rect"].height > 12
    ]
    if rules:
        print(f"\n-- {len(rules)} rule-like strokes")
        for d in rules[:24]:
            r = d["rect"]
            colour = d.get("color") or d.get("fill")
            hexed = (
                "#" + "".join(f"{int(c * 255):02x}" for c in colour) if colour else "none"
            )
            print(
                f"   x {r.x0 / scale:7.2f} → {r.x1 / scale:7.2f}   y {r.y0 / scale:7.2f}"
                f"   w {(d.get('width') or 0) / scale:.3f}  {hexed}"
            )

    fills = [d for d in page.get_drawings() if d["rect"].height >= 4 and d["rect"].width >= 4]
    if fills:
        print(f"\n-- {len(fills)} filled shapes (first 10)")
        for d in fills[:10]:
            r = d["rect"]
            colour = d.get("fill")
            hexed = "#" + "".join(f"{int(c * 255):02x}" for c in colour) if colour else "none"
            print(
                f"   {r.x0 / scale:7.2f},{r.y0 / scale:7.2f} → {r.x1 / scale:7.2f},{r.y1 / scale:7.2f}  {hexed}"
            )

    doc.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
