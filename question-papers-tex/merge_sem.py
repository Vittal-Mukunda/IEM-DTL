"""Merge the per-year CIE PDFs of Sem 5/6 into three files (newest year first).
usage: python merge_sem.py   (run from IEM-DTL; reads and rewrites iem-website/public/notes/sem{5,6}/question-papers)"""
import os, fitz
ROOT = os.path.join("iem-website", "public", "notes")
PLAN = {
 "sem5": {"cie-1.pdf": ["cie-1.pdf", "scanned-paper-jun-2026.pdf"],
          "cie-2.pdf": ["cie-2.pdf", "cie-2-2024-25.pdf"],
          "cie-3.pdf": ["cie-3.pdf", "cie-1-2024-25.pdf"]},
 "sem6": {"cie-1.pdf": ["cie-2.pdf", "cie-1-2024-25.pdf"],
          "cie-2.pdf": ["cie-2-2025-26.pdf", "cie-2-2024-25.pdf"],
          "cie-3.pdf": ["cie-3-2025-26.pdf", "cie-3-2024-25.pdf"]},
}
for sem, plan in PLAN.items():
    d = os.path.join(ROOT, sem, "question-papers")
    merged = {}
    for out, srcs in plan.items():
        m = fitz.open()
        for s in srcs:
            with fitz.open(os.path.join(d, s)) as src:
                m.insert_pdf(src)
        merged[out] = m
    for f in os.listdir(d):
        if f.endswith(".pdf"):
            os.remove(os.path.join(d, f))
    for out, m in merged.items():
        m.save(os.path.join(d, out.replace(".pdf", "-all-years.pdf")), garbage=4, deflate=True)
        print(sem, out, len(m), "pages", os.path.getsize(os.path.join(d, out)) // 1024, "KB")
