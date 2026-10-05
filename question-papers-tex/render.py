import fitz, os, sys, json
NOTES=r"C:\Users\vitta\OneDrive\Desktop\IEM Website\IEM-DTL\iem-website\public\notes"
OUT=r"C:\Users\vitta\AppData\Local\Temp\claude\C--Users-vitta-OneDrive-Desktop-IEM-Website\93a5504a-57db-4bd7-b8b0-76fbf6f7e0c7\scratchpad\pages"
files={
 "s3-cie1":"sem3/question-papers/cie-1-question-papers-2024-25.pdf",
 "s3-cie2":"sem3/question-papers/cie-2-question-papers-2024-25.pdf",
 "s3-cie2b":"sem3/question-papers/cie-2.pdf",
 "s3-cie3":"sem3/question-papers/cie-3-question-papers-2024-25.pdf",
 "s3-cie3b":"sem3/question-papers/cie-3.pdf",
 "s3-mat231":"sem3/question-papers/mat231tb-question-paper.pdf",
 "s3-see":"sem3/question-papers/see-question-papers-collection.pdf",
 "s3-math-see":"sem3/mathematics-iii/see-question-paper-april-2024.pdf",
 "s3-math-model":"sem3/mathematics-iii/model-question-paper.pdf",
 "s3-dm-model21":"sem3/digital-metrology/model-question-paper-2021-scheme.pdf",
 "s3-dm-model":"sem3/digital-metrology/model-question-paper-im235ai.pdf",
 "s3-wsd-cie":"sem3/work-systems-design/cie-question-papers-2022-23.pdf",
 "s3-wsd-see":"sem3/work-systems-design/see-question-papers-collection.pdf",
 "s4-cc-2025":"sem4/cad-cam-robotics/see-question-paper-june-july-2025-im343ai.pdf",
 "s4-cc-2023":"sem4/cad-cam-robotics/see-question-paper-october-2023-21im43.pdf",
 "s4-cc-2024":"sem4/cad-cam-robotics/see-question-paper-sep-oct-2024-im343ai.pdf",
 "s4-or":"sem4/operations-research/see-question-papers-2024-and-2025.pdf",
 "s4-cie1":"sem4/question-papers/cie-1.pdf",
 "s4-cie2":"sem4/question-papers/cie-2.pdf",
 "s4-cie3":"sem4/question-papers/cie-3.pdf",
 "s4-see":"sem4/question-papers/see-past-year-question-papers.pdf",
 "s4-supp":"sem4/question-papers/supplementary-examinations.pdf",
 "s5-cie1a":"sem5/question-papers/cie-1-2024-25.pdf",
 "s5-cie1":"sem5/question-papers/cie-1.pdf",
 "s5-cie2a":"sem5/question-papers/cie-2-2024-25.pdf",
 "s5-cie2":"sem5/question-papers/cie-2.pdf",
 "s5-cie3":"sem5/question-papers/cie-3.pdf",
 "s5-jun26":"sem5/question-papers/scanned-paper-jun-2026.pdf",
 "s6-cie1a":"sem6/question-papers/cie-1-2024-25.pdf",
 "s6-cie2a":"sem6/question-papers/cie-2-2024-25.pdf",
 "s6-cie2b":"sem6/question-papers/cie-2-2025-26.pdf",
 "s6-cie2":"sem6/question-papers/cie-2.pdf",
 "s6-cie3a":"sem6/question-papers/cie-3-2024-25.pdf",
 "s6-cie3b":"sem6/question-papers/cie-3-2025-26.pdf",
 "s7-cie1a":"sem7/question-papers/cie-1-2024-25.pdf",
 "s7-cie1b":"sem7/question-papers/cie-1-2025-26.pdf",
 "s7-cie2a":"sem7/question-papers/cie-2-2024-25.pdf",
 "s7-cie2b":"sem7/question-papers/cie-2-2025-26.pdf",
 "s7-cie3a":"sem7/question-papers/cie-3-2024-25.pdf",
 "s7-cie3b":"sem7/question-papers/cie-3-2025-26.pdf",
}
json.dump(files,open(os.path.join(os.path.dirname(OUT),"files.json"),"w"),indent=1)
only=sys.argv[1:] or list(files)
for k in only:
    d=fitz.open(os.path.join(NOTES,files[k]))
    od=os.path.join(OUT,k); os.makedirs(od,exist_ok=True)
    for i,pg in enumerate(d,1):
        # render so that the longer side is ~1500px
        z=1500/max(pg.rect.width,pg.rect.height)
        pg.get_pixmap(matrix=fitz.Matrix(z,z)).save(os.path.join(od,f"p{i:02d}.png"))
    print(k,len(d))
