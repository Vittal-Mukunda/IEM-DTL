"""Back up the Sem 7 scanned CIE papers and replace them with the typeset ones,
merged per CIE with the newest year first (same layout as Sem 6).
usage: python merge_sem7.py   (run from question-papers-tex after build.sh s7-cie1a ... s7-cie3b)"""
import os, shutil, fitz

NOTES = os.path.join("..", "iem-website", "public", "notes", "sem7", "question-papers")
BACKUP = os.path.join("originals", "sem7", "question-papers")
PLAN = {
    "cie-1-all-years.pdf": ["s7-cie1b", "s7-cie1a"],   # 2025-26, 2024-25
    "cie-2-all-years.pdf": ["s7-cie2b", "s7-cie2a"],
    "cie-3-all-years.pdf": ["s7-cie3b", "s7-cie3a"],
}
OLD = ["cie-1-2024-25.pdf", "cie-1-2025-26.pdf", "cie-2-2024-25.pdf",
       "cie-2-2025-26.pdf", "cie-3-2024-25.pdf", "cie-3-2025-26.pdf"]

os.makedirs(BACKUP, exist_ok=True)
for f in OLD:
    src, bk = os.path.join(NOTES, f), os.path.join(BACKUP, f)
    if os.path.exists(src) and not os.path.exists(bk):  # cie-1-2025-26 scan is already backed up
        shutil.copy2(src, bk)
        print("backed up", f)

for out, texs in PLAN.items():
    m = fitz.open()
    for t in texs:
        with fitz.open(os.path.join("out", t + ".pdf")) as src:
            m.insert_pdf(src)
    m.save(os.path.join(NOTES, out), garbage=4, deflate=True)
    print(out, len(m), "pages", os.path.getsize(os.path.join(NOTES, out)) // 1024, "KB")

for f in OLD:
    p = os.path.join(NOTES, f)
    if os.path.exists(p):
        os.remove(p)
