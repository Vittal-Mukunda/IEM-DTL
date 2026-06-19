# 00 — GAP REPORT & VERIFICATION
**RVCE IEM Website Project · compiled 2026-06-10**

This is the punch-list of what could not be fully verified from public sources, the safest way to obtain each item, and the QA done on the deliverables.

---

## ✅ RESOLVED on 2026-06-10 (read the live JS site via browser)
The following earlier gaps are now CLOSED — see `00_UPDATED_LIVE_DATA_June2026.md` and `02_Faculty/Faculty_Directory.md`:
- **Current HoD:** Dr. Rajeswara Rao K V S (confirmed). ✔
- **Faculty: all 14 verified** with designations, specialisations, **official emails**, and **photo URLs**; **all 14 photos downloaded** to the user's machine. ✔
- **New faculty member** Dr. Bindu Ashwini C (Psychology); Narahari now Visiting Professor; Gogi & Vikram now Dr. ✔
- **UG intake 60** (was 50); **programmes B.E.+M.Sc(Engg.)+Ph.D.** ✔
- **Year-wise placement table** (2021-22 → 2024-25) with averages & max (current max ₹21.45 LPA). ✔
- **History** refined (1980 → 1985 → 1992); **professional societies** IIIE/ORSI/IIMM/SIVAM/NIQR/QCFI/ISQ. ✔
- **PEOs & PSOs** re-confirmed; **2025 scheme & syllabus** exists. ✔

**Still open:** PO1–PO12 / WK full lists (separate live pages), academic calendar PDF, individual syllabus PDFs per year, facilities lab names, dated events/achievements log. Methods below.

---


---

## 1. Priority gaps to close with the department (before publishing)

| # | Gap | Why it matters | How to obtain |
|---|---|---|---|
| 1 | **Current HOD** (Dr. C K Nagendra Gupta vs Dr. Rajeswara Rao K V S — sources conflict) | Named on multiple pages | Ask department office / live faculty page |
| 2 | **Faculty photos, official emails, phones, qualifications, experience** | Faculty page completeness | Live cards at rvce.edu.in/department/iem/faculty/ (JS-rendered) |
| 3 | **Full syllabus PDFs, credit structure, course outcomes, academic calendar, student handbook, open-electives** | Curriculum page | Department curriculum page; PDFs exist (e.g. IEM-2022-3rd-year.pdf, 11-IM.pdf) |
| 4 | **Program Outcomes (PO1–PO12)** | NBA framework, About page | NBA SAR / program handbook (standardised list) |
| 5 | **Year-wise placement table, average package, #offers** | Placements page credibility | RVCE Placement & Training cell report |
| 6 | **Per-paper research metadata (DOI, abstract, citations), patents, funded/consultancy projects** | Research repository depth | IRINS "View Profile" pages + Google Scholar export |
| 7 | **IEM-specific student achievements** (wins, scholarships, startups, exchange) | Students page | Dept "Student Achievements" PDFs; IDEA socials |
| 8 | **Named IEM alumni** (year, role, company, photo, consent) | Alumni success stories | LinkedIn RVCE alumni filter = "IEM"; alumni association |
| 9 | **Dept Instagram/X handles, faculty YouTube URLs, dated event log + media** | Social/Events richness | Search IG; capture from live events tab + IDEA timeline |
| 10 | **Logos & real photos (labs, campus, events)** | Visual quality | Official site / Wikimedia (CC) — log in media manifest |
| 11 | **NIRF 2025 rank, NBA validity period, NAAC grade** | Rankings/accreditation accuracy | nirfindia.org · nbaind.org · naac.gov.in |
| 12 | **Founding year 1985 / rename 1992** | History precision | Confirm with department (currently aggregator-sourced) |

## 2. Tool/source limitations encountered (transparency)
- The **new** RVCE department site (`/department/iem/...`) is **JavaScript-rendered**; plain fetches return empty. The **older static** pages (`im-about department`, `im-faculties`, `im-placement`, `im-events_seminars`) rendered fully and were the backbone of this research. To capture the JS pages (live faculty cards/photos/events), open them in a browser.
- **LinkedIn, Instagram, Scopus** are not reliably machine-readable; profile *links/methods* are provided instead of scraped data.
- **No copyrighted images** were downloaded/redistributed — the media manifest records source URLs + attribution for the editor to collect with proper rights.
- Community sources (Quora/Careers360/Shiksha) are used **only** for FAQ context and are clearly flagged ⚠ (not presented as official).

## 3. Verification / QA performed
- **Cross-checked** key facts across ≥2 sources where possible: autonomy year (official + Wikipedia), placements (official page), research metrics (IRINS), faculty list (official static page).
- **Separated** official ✅ facts from community ⚠ claims throughout (esp. placements & FAQ).
- **Citations** attached to every claim in the phase files and the master sources log (28 sources, dated, rated).
- **Website QA:** all 10 pages share one stylesheet and a consistent nav/footer; internal links verified against actual filenames; one H1 per page; alt/`aria` on interactive controls; JSON-LD validated structurally; responsive at 900px/680px; no external runtime dependencies (system fonts only).
- **No fabricated data:** where a value was unknown (emails, phone, average package), a placeholder + ⚠ note was used rather than a guess.

## 4. Confidence summary
| Area | Confidence |
|---|---|
| Vision/Mission/PEOs/PSOs | High ✅ (verbatim from official) |
| Faculty names/specialisation/subjects | High ✅ |
| Curriculum schemes/labs/evaluation/pedagogy | High ✅ |
| Research metrics (dept + per-faculty counts) | High ✅ (IRINS) |
| Placements rate & highest package & recruiters | High ✅ (official) |
| Placement averages / year tables | Low ⚠ (not public) |
| Named IEM alumni / student awards | Low ⚠ (compile via LinkedIn + dept) |
| History exact years (1985/1992) | Medium ◐ (confirm) |

## 5. Suggested next session
Open the JS faculty & events pages in-browser to harvest photos/emails/dated events; pull syllabus PDFs into `/03_Curriculum/`; export faculty Scholar/IRINS publication lists into `/04_Research/`; build the IEM alumni roster from LinkedIn. Then drop assets into `/website/images/` and fill the flagged placeholders.
