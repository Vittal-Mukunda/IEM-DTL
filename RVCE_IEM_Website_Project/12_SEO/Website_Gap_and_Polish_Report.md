# WEBSITE GAP & POLISH REPORT
### How to make your IEM site better, more updated & more polished than the official one
**Compiled 2026-06-10** · Based on a full live review of https://rvce.edu.in/department/iem/ (June 2026)

---

## A. Gaps / weak spots in the OFFICIAL current website
1. **Thin / empty pages.** "Happenings" (events) is a shell with no dated events; "Facilities" lists only "Laboratories" + "Industry-Sponsored Lab" with no names or photos; several Research sub-pages sit behind "Read More" with little content.
2. **Stale placement summary.** The headline still reads "highest ₹14.95 LPA" while the year-wise table shows **₹21.45 LPA (2024–25)** — a credibility gap.
3. **No prospective-student content.** No FAQ, no "What can an IEM graduate do?", no myth-vs-reality, no "Why choose IEM" — exactly the questions students search for.
4. **No on-site publications/research output.** Research themes are listed, but there's no publication list, citation metrics, or faculty research-profile links on the page itself.
5. **No alumni success stories.**
6. **No student-achievement showcase** (awards, competitions, startups).
7. **JavaScript-rendered → weak SEO.** The pages don't render for crawlers, so third-party aggregators (Shiksha, Careers360, Quora) outrank the official site for "IEM RVCE" queries.
8. **No structured data / limited meta** → no rich results.
9. **No newsfeed / events archive** that's dated and browsable.
10. **Accessibility:** key info baked into card images; lazy-loaded content; limited alt text.

## B. What YOUR built site already does better
- Static & fast → **indexable**, with per-page `<title>`/meta + **JSON-LD** (CollegeOrUniversity + FAQPage).
- Dedicated **FAQ**, **Myth vs Reality**, **"What can an IEM graduate do?"**, **Why-IEM** sections.
- Consolidated, **source-cited** content; mobile-first responsive; one stylesheet, no dependencies.
- Faculty grid with **real photos + emails**; alumni success-story template.

## C. Add these to clearly SURPASS the official site (content now verified & in the dossier)
1. **Programmes:** show **B.E. + M.Sc (Engg.) + Ph.D.**, intake **60**, NBA + VTU-autonomous.
2. **Year-wise placements table** (2021-22 → 2024-25) with avg & max (max **₹21.45 LPA**) — see `06_Placements`.
3. **Updated recruiters:** Airbus, Cisco, Flipkart, Genpact, GlobalFoundries, HP, Intel, Micron, Titan.
4. **14 faculty** with photos, emails, **research IDs** (ORCID/Scopus/Scholar) — link each card to their live profile (`04_Research/Faculty_Research_IDs_and_Socials.md`).
5. **Research page upgrade:** 8 research themes, dept metrics (202 journal articles, h-index 8), CoE/CoC, and a **Publications** section linking each faculty's Scholar/Scopus (full lists in `04_Research/`).
6. **News & Events page:** CSITSS 2026 (20–22 Nov), EduAIthon 2025, MSME workshop, ISQ symposium; HoD-since-2025; new 2025 scheme.
7. **Professional societies** strip: IIIE, ORSI, IIMM, SIVAM, NIQR, QCFI, ISQ.
8. **Curriculum page:** 2022 + new **2025 scheme**, downloadable syllabus PDFs (now in `03_Curriculum/2022_Scheme_Syllabus/`), and the **subject→faculty mapping** (`15_Subject_Faculty_Mapping/`).
9. **HoD message** (Dr. Rajeswara Rao) + his bio/credentials.
10. **Student achievements** + IDEA association highlights.

## D. Polish checklist (design & technical)
- [ ] Drop in **real assets**: faculty photos (downloaded), **department logo** (`Logo-2.png`), lab/campus photos.
- [ ] Add **favicon**, **Open Graph/Twitter image**, `sitemap.xml`, `robots.txt`.
- [ ] Add a lightweight **client-side search** and a **news feed** block on Home.
- [ ] Hero polish: real campus image, animated stat counters, recruiter logo wall.
- [ ] **Accessibility pass**: alt text on every image, AA contrast, keyboard nav, skip-link.
- [ ] **Performance**: compress images (the originals are 0.4–0.8 MB each → serve ~150 KB web versions), lazy-load below the fold.
- [ ] Add **breadcrumbs + structured data** (BreadcrumbList, Person for faculty, Event for CSITSS).
- [ ] Footer: real department phone, current HoD, social links (LinkedIn, IDEA Facebook).
- [ ] Wire the **contact form** to a real endpoint (Formspree/Google Forms).
- [ ] Optional: a **live "Publications" feed** pulling from faculty Scholar profiles.

## E. SEO priorities (to outrank aggregators)
Target queries: "industrial engineering and management RVCE", "IEM RVCE placements", "IEM RVCE syllabus/scheme", "what can an industrial engineering graduate do", "IEM RVCE cutoff". Ensure each has a dedicated, server-rendered, structured-data page (your static site already wins here vs the JS official site).

> **Want me to apply Section C + D directly to your built site?** Say the word and I'll update the pages (you'd earlier asked me to pause website edits, so I've kept this as a plan).
