# Résumé Builder

A free, login-free résumé builder for the IEM resource portal. Eight templates
reverse-engineered from real university careers-office samples, edited through
ordinary form fields, exported as PDF, Word or LaTeX — all in the browser, with
nothing uploaded.

Lives at `/resources/resume-builder`.

It opens on a **complete example résumé** rather than a blank form, so a student
can see how a template reads before typing anything, and can overwrite it field
by field. See [`src/resume/exampleResume.ts`](../../src/resume/exampleResume.ts);
a test asserts it fits one page in every template with no warnings.

| Document | What it covers |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Why it is built this way, what the eight templates measure, and what changed during implementation |
| [ADDING-A-TEMPLATE.md](ADDING-A-TEMPLATE.md) | Adding template #9 through #100 without touching the engine |
| [RENDERING.md](RENDERING.md) | Font metrics, layout, the overflow cascade, why the preview is SVG |
| [EXPORTS.md](EXPORTS.md) | How PDF, TEX and DOCX are produced, and why DOCX is produced differently |
| [DEPLOY.md](DEPLOY.md) | Deployment (nothing changes), what ships, maintenance scripts |
| [verification_report.md](verification_report.md) | Generated: accuracy against each original, and the stress matrix |

## Commands

```bash
npm test                   # template x fixture matrix (346 tests)
npm run verify:templates   # regenerate the verification report
npm run resume:thumbs      # regenerate picker thumbnails
npm run fonts:resume       # re-download and re-subset the fonts
```

The last three need Python with `pymupdf pillow numpy fonttools brotli`. None of
them run during a build — the site builds and deploys with Node alone.

## The shape of it

```
ResumeDoc  ─┐
            ├─► layoutResume() ─► BoxTree ─┬─► SVG preview
Template   ─┘         ▲                    ├─► PDF
                      │                    ├─► TEX
                 FontBook                  └─► DOCX
              (real TTFs, via fontkit)
```

One layout pass, one box tree, four transcriptions of it. That is why the
preview matches the download rather than approximating it.
