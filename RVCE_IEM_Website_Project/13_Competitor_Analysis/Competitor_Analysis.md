# PHASE 14 — COMPETITOR ANALYSIS
### Benchmarking IE/IEM department websites
*(Companion to `12_SEO/SEO_Research.md`. Date collected 2026-06-10.)*

Goal: learn what the best Industrial Engineering department sites do, and translate it into recommendations for the RVCE IEM site.

## Benchmarks reviewed (by category)
| Category | Representative departments |
|---|---|
| IITs | IIT Bombay (IEOR/SJMSOM & Mechanical), IIT Kharagpur (Industrial & Systems Engineering), IIT Delhi (Mechanical/Production) |
| IISc / research | IISc — Management Studies, Operations & Systems |
| NITs | NITs offering Industrial/Production Engineering |
| BITS | BITS Pilani — Manufacturing/Management streams |
| International | Georgia Tech (ISyE — global #1 in IE), Purdue IE, University of Michigan IOE, Stanford MS&E |

## What top IE department sites do well
1. **Lead with the value proposition** — "what is Industrial Engineering" + career outcomes up front.
2. **Searchable faculty research portal** — profiles, labs, publications, areas.
3. **Dedicated research/labs pages** — centres, funded projects, themes.
4. **Clear placement/careers page** — statistics, recruiters, role maps, salary context.
5. **News & events feed** + student-chapter highlights.
6. **Prospective-student CTAs** — admissions, brochure download, contact form.
7. **Alumni success stories** — photos + current roles.
8. **Accessibility & mobile-first**, strong information architecture, prominent search.
9. **Structured data & clean URLs** for discoverability.

## Content categories commonly present
About/Overview · Academics/Programs · People/Faculty · Research/Labs · Admissions · Placements/Careers · News & Events · Student Life/Chapters · Alumni · Resources/Downloads · Contact.

## Gaps in the current RVCE IEM web presence (vs benchmarks)
- Thin, mostly static pages; key info (placement detail, careers, FAQ, faculty research) under-surfaced, so **third-party aggregators capture the search traffic**.
- No consolidated **"what can an IEM graduate do"** page, FAQ with structured data, or alumni stories.

## Recommendations (implemented in `/website/`)
- Adopted the full page set: Home, About, Faculty, Curriculum, Research, Placements, Alumni, Events, FAQ, Contact.
- Home leads with the IEM value proposition + headline stats (intake 50, >70% placement, ₹14.95 LPA, 202+ publications).
- Added a dedicated **careers / "what can an IEM graduate do"** section.
- Built a **faculty research grid** linking IRINS/Scholar.
- Added an **FAQ page with `FAQPage` JSON-LD** to reclaim aggregator traffic.
- Mobile-first responsive, JSON-LD, descriptive URLs, internal linking.

## To implement next (beyond this build)
Brochure/syllabus PDF downloads · on-site search · news feed · sitemap.xml & robots.txt · Open Graph image · analytics.
