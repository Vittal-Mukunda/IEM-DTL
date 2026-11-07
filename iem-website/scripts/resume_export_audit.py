"""Check the exports written by `scripts/resume-export-audit.mts`.

    python scripts/resume_export_audit.py

For every template x format: every typed value must appear, and no text from
the built-in example résumé may appear.
"""

import json
import re
import sys
import unicodedata
import zipfile
from pathlib import Path

import pymupdf

OUT = Path(".verify/audit")

# Values typed into the audit résumé. Short, distinctive fragments, so a line
# break or a template's own punctuation between words does not fail the check.
EXPECTED = [
    "Priya Venkatesan",
    "priya.v@nitk.edu.in",
    "github.com/priyav",
    "National Institute of Technology Karnataka",
    "B.Tech Mechanical Engineering",
    "CGPA 8.74",
    "Finite Element Methods",
    "Minor in Computational Mathematics",
    "Delhi Public School",
    "Class XII (CBSE)",
    "Bosch Global Software Technologies",
    "Thermal Analysis Intern",
    "ANSYS Fluent",
    "Solar Dryer Prototype",
    "SAE BAJA",
    "Jul 2021",
]
# Printed only by templates with a slot for it; checked separately.
HEADLINE = "Thermal Systems"
SUMMARY = "heat-exchanger design"

LEAKS = [
    "Industrial",
    "IEM",
    "RVCE",
    "R.V. College",
    "John Doe",
    "johndoe",
    "Operations Research",
    "Toyota",
    "Gurobi",
    "Ananya",
]


def norm(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("­", "").replace("ﬁ", "fi").replace("ﬂ", "fl")
    # LaTeX escapes and line wrapping
    text = text.replace("\\&", "&").replace("\\%", "%").replace("\\#", "#").replace("\\_", "_")
    text = re.sub(r"-\s*\n\s*", "-", text)
    return re.sub(r"\s+", " ", text)


def pdf_text(path: Path) -> str:
    with pymupdf.open(path) as doc:
        return "\n".join(page.get_text() for page in doc)


def docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as z:
        xml = "".join(
            z.read(n).decode("utf8")
            for n in z.namelist()
            if n.startswith("word/") and n.endswith(".xml") and ("document" in n or "header" in n)
        )
    # Paragraph boundaries become spaces; runs within a paragraph join directly.
    xml = re.sub(r"</w:p>", " ", xml)
    xml = re.sub(r"<w:tab/>", " ", xml)
    texts = re.findall(r"<w:t(?: [^>]*)?>([^<]*)</w:t>|(\s(?=<))", xml)
    out = "".join(t[0] if t[0] else " " for t in texts)
    return out.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")


def tex_text(path: Path) -> str:
    return path.read_text(encoding="utf8")


def squash(text: str) -> str:
    """Case- and space-blind form: templates set names in small caps or caps,
    and track letters apart, which PDF extraction reports as spaces."""
    return re.sub(r"\s+", "", text).casefold()


def has(value: str, body: str) -> bool:
    return squash(value) in squash(body)


def main() -> int:
    layout = json.loads((OUT / "layout.json").read_text())
    failures = 0
    for tex in sorted(OUT.glob("*.tex")):
        tid = tex.stem
        texts = {
            "pdf": norm(pdf_text(OUT / f"{tid}.pdf")),
            "docx": norm(docx_text(OUT / f"{tid}.docx")),
            "tex": norm(tex_text(tex)),
        }
        problems = []
        for fmt, body in texts.items():
            missing = [v for v in EXPECTED if not has(v, body)]
            leaked = [v for v in LEAKS if re.search(rf"(?<![A-Za-z]){re.escape(v)}", body)]
            if fmt == "tex":
                # The generator comment names the site; that is not résumé content.
                leaked = [v for v in leaked if not (v in ("IEM", "RVCE") and body.count(v) == body.count(f"IEM RVCE Resume Builder"))]
            if missing:
                problems.append(f"  {fmt}: MISSING {missing}")
            if leaked:
                problems.append(f"  {fmt}: LEAKED {leaked}")
        head = {f: has(HEADLINE, b) for f, b in texts.items()}
        summ = {f: has(SUMMARY, b) for f, b in texts.items()}
        if len(set(head.values())) > 1:
            problems.append(f"  headline printed inconsistently across formats: {head}")
        if len(set(summ.values())) > 1:
            problems.append(f"  summary printed inconsistently across formats: {summ}")
        info = layout[tid]
        status = "FAIL" if problems else "ok"
        print(f"{tid:12s} {status:4s} pages={info['pages']} headline={head['pdf']} summary={summ['pdf']} warnings={info['warnings']}")
        for p in problems:
            print(p)
        failures += bool(problems)
    print(f"\n{failures} template(s) with problems")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
