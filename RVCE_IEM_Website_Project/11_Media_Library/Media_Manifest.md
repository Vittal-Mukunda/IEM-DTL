# PHASE 11 — MEDIA LIBRARY MANIFEST
### Department of Industrial Engineering and Management, RVCE

| Date collected | 2026-06-10 |
|---|---|
| Note | This is a **manifest with source URLs + attribution**, not a bulk download. RVCE-owned imagery is fine for the official department site; for any other reuse, obtain permission. No copyrighted images were redistributed here. |

## 1. Logos
| Asset | Source | Attribution | Status |
|---|---|---|---|
| RVCE official logo | https://rvce.edu.in/ (site header) | © Rashtreeya Sikshana Samithi Trust / RVCE | ⚠ download from official site |
| Department/IDEA logo | https://www.facebook.com/idearvce/ | © IDEA, RVCE | ⚠ |

## 2. Photograph sets to collect (with method)
| Set | Source | Method | Status |
|---|---|---|---|
| Faculty headshots (13) | https://rvce.edu.in/department/iem/faculty/ | Open live page; save each card image to `/faculty_photos/<name>.jpg`; log URL | ⚠ |
| Lab photos (Machine Shop, Simulation, Ergonomics, Gauging, IE Lab) | live dept "Infrastructure" tab | screenshot/download; log URL | ⚠ |
| Building/campus | https://rvce.edu.in/ media; Wikimedia Commons (RVCE) | prefer CC-licensed campus shots from Wikimedia | ⚠ |
| Event photos | IDEA Facebook; dept events page | with attribution | ⚠ |
| Student activity | IDEA Facebook/Instagram | with attribution | ⚠ |

## 3. Placeholder strategy for the website build
The built site uses lightweight **SVG/CSS placeholders and the RVCE brand palette** where real photos are pending, with clearly named slots (`images/faculty/<name>.jpg`, `images/labs/...`) so real assets drop in without code changes. A `README` in `/website/images/` lists every expected file.

## ⚠ Licensing reminder
Faculty photos and campus imagery are © RVCE. For the official department website this is acceptable (same owner). Maintain this manifest as the attribution/source record for audit.
