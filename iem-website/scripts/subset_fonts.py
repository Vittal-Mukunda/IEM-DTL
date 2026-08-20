"""
Cut the downloaded fonts to a Latin charset, in place.

    pip install fonttools brotli
    python scripts/subset_fonts.py

Reads `public/fonts/resume/_source/` (whatever `fetch-resume-fonts.mjs`
downloaded, gitignored) and writes trimmed TTFs to `public/fonts/resume/`,
which *is* committed. So a clone builds and deploys with no network and no
Python — this is a maintenance step, not a build step.

Two reasons it exists.

**Size.** The Google Fonts TTFs carry Greek, Cyrillic, Vietnamese and more;
Tinos alone is 507 kB. A résumé needs Latin. Trimming takes the set from
6.4 MB to a few hundred kilobytes, which the preview fetches on first paint.

**Correctness.** pdf-lib's bundled subsetter silently drops most glyphs from
these fonts — the PDF extracts the right text but renders about a third of the
ink, which is exactly the kind of bug that looks like nothing until someone
prints it. fontkit v2 subsets them correctly but emits no `cmap`, which pdf-lib
then cannot lay out. fontTools produces a complete, self-contained font, so the
exporter can embed it whole and skip subsetting altogether.
"""

from __future__ import annotations

import sys

import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "public" / "fonts" / "resume"
SOURCE_DIR = FONT_DIR / "_source"

# What a résumé can contain. Latin in full (any European name or loanword),
# the punctuation typography actually uses, and currency — ₹ included, since
# this is for students in Bengaluru quoting salaries and project budgets.
UNICODES = [
    "U+0020-007E",  # Basic Latin
    "U+00A0-00FF",  # Latin-1 Supplement — accents
    "U+0100-017F",  # Latin Extended-A — Central/Eastern European
    "U+0180-024F",  # Latin Extended-B
    "U+02B0-02FF",  # Spacing modifiers
    "U+0300-036F",  # Combining diacriticals
    "U+2000-206F",  # General Punctuation — en/em dash, curly quotes, bullet
    "U+20A0-20BF",  # Currency symbols, including U+20B9 rupee
    "U+2100-214F",  # Letterlike — №, ™, ℃
    "U+2190-21BB",  # Arrows
    "U+2200-22FF",  # Mathematical operators — ±, ≥, ×
    "U+25A0-25FF",  # Geometric shapes — bullet variants
    "U+2600-26FF",  # Misc symbols
    "U+FB00-FB06",  # ﬁ ﬂ ligatures
]

# Font Awesome is 400+ kB of icons for the nine we use.
ICON_CODEPOINTS = [
    "U+0020",
    "U+F0E0",  # envelope
    "U+F095",  # phone
    "U+F3C5",  # location-dot
    "U+F0AC",  # globe
    "U+F08C",  # linkedin
    "U+F09B",  # github
    "U+F8D2",  # orcid
    "U+F19D",  # graduation-cap
    "U+F0C1",  # link
]


def options(unicodes: list[str]) -> subset.Options:
    opts = subset.Options()
    opts.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl", "rlig"]
    opts.notdef_outline = True
    opts.recalc_bounds = True
    opts.drop_tables += ["DSIG"]
    opts.name_IDs = ["*"]  # pdf-lib reads the PostScript name off the font
    opts.name_legacy = True
    opts.name_languages = ["*"]
    opts.glyph_names = True
    opts.unicodes = subset.parse_unicodes(",".join(unicodes))
    return opts


def trim(src: Path, dest: Path) -> tuple[int, int]:
    unicodes = ICON_CODEPOINTS if src.name.startswith("fontawesome") else UNICODES
    font = TTFont(src)
    subsetter = subset.Subsetter(options=options(unicodes))
    subsetter.populate(unicodes=options(unicodes).unicodes)
    subsetter.subset(font)
    font.save(dest)
    font.close()
    return src.stat().st_size, dest.stat().st_size


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    if not SOURCE_DIR.is_dir():
        # First run after an older fetch: move the full files aside, then trim.
        full = sorted(FONT_DIR.glob("*.ttf"))
        if not full:
            print("Nothing to subset. Run `node scripts/fetch-resume-fonts.mjs` first.")
            return 1
        SOURCE_DIR.mkdir(parents=True, exist_ok=True)
        for path in full:
            shutil.move(str(path), SOURCE_DIR / path.name)
        print(f"Moved {len(full)} downloaded fonts into _source/")

    sources = sorted(SOURCE_DIR.glob("*.ttf"))
    if not sources:
        print("No fonts in _source/. Run `node scripts/fetch-resume-fonts.mjs` first.")
        return 1

    before = after = 0
    for src in sources:
        was, now = trim(src, FONT_DIR / src.name)
        before += was
        after += now
        print(f"  {src.name:32s} {was / 1024:7.0f} kB → {now / 1024:6.1f} kB")

    print(f"\n{before / 1024 / 1024:.1f} MB → {after / 1024:.0f} kB across {len(sources)} faces")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
