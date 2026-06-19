# PHASE 12 — WEBSITE CONTENT (publication-ready)

All ten pages of SEO-optimised, publication-ready copy are implemented directly as the live site in **`/website/`**. This index maps each required page to its file and the research folder that backs it.

| Page | File | Backed by | SEO title |
|---|---|---|---|
| Home | `website/index.html` | 01, 06 | Industrial Engineering & Management \| RV College of Engineering (RVCE), Bengaluru |
| About | `website/about.html` | 01 | About the Department \| IEM, RVCE |
| Faculty | `website/faculty.html` | 02 | Faculty \| IEM, RVCE |
| Curriculum | `website/curriculum.html` | 03 | Curriculum & Academics \| IEM, RVCE |
| Research | `website/research.html` | 04 | Research \| IEM, RVCE |
| Placements | `website/placements.html` | 06 | Placements & Careers \| IEM, RVCE |
| Alumni | `website/alumni.html` | 07 | Alumni \| IEM, RVCE |
| Events | `website/events.html` | 08, 09 | Events & Activities \| IEM, RVCE |
| FAQ | `website/faq.html` | 10 | FAQ — Industrial Engineering & Management \| RVCE |
| Contact | `website/contact.html` | — | Contact \| IEM, RVCE |

**SEO implemented:** unique title + meta description per page; one H1 per page; JSON-LD `CollegeOrUniversity` (Home) and `FAQPage` (FAQ); descriptive relative URLs; internal cross-linking; mobile-first responsive; system fonts for speed. Recommended next: `sitemap.xml`, `robots.txt`, Open Graph image, favicon. See `/12_SEO/SEO_Research.md`.

**Editing the copy:** text lives inline in each HTML file — edit directly, or lift any section into a CMS. Every factual claim traces to a source in `/Sources/Master_Sources_Log.md`.
