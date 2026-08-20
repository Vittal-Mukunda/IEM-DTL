/**
 * Downloads every font the résumé templates need into `public/fonts/resume/`.
 *
 * Fonts are NOT committed as binaries by hand — this script is the record of
 * where each one came from and under which licence, so the set is reproducible
 * and auditable. Re-running it is safe; files that already exist are skipped
 * unless `--force` is passed.
 *
 *   node scripts/fetch-resume-fonts.mjs [--force]
 *
 * Everything here is OFL 1.1, Apache 2.0, or GUST Font Licence — all of which
 * permit redistribution alongside the site. See `licences` below.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "fonts", "resume", "_source");
const FORCE = process.argv.includes("--force");

/**
 * Google Fonts serves plain TTF when asked over the v1 CSS API with a modern
 * UA. TTF (not woff2) is required: fontkit reads metrics from it and pdf-lib
 * embeds it, neither of which decompresses woff2.
 */
const googleFonts = [
  // Times New Roman substitute — metric-compatible (Harvard, Yale, Stanford, MIT)
  { family: "Tinos", styles: { "400": "tinos-regular", "700": "tinos-bold", "400i": "tinos-italic", "700i": "tinos-bolditalic" } },
  // Columbia — headings
  { family: "Libre Franklin", styles: { "400": "librefranklin-regular", "700": "librefranklin-bold", "400i": "librefranklin-italic" } },
  // Columbia — body (stands in for Avenir; visual match only, not metric)
  { family: "Nunito Sans", styles: { "400": "nunitosans-regular", "700": "nunitosans-bold", "400i": "nunitosans-italic" } },
  // Awesome-CV — body
  { family: "Source Sans 3", styles: { "300": "sourcesans3-light", "400": "sourcesans3-regular", "700": "sourcesans3-bold", "300i": "sourcesans3-lightitalic", "400i": "sourcesans3-italic" } },
  // Awesome-CV — name
  { family: "Roboto", styles: { "100": "roboto-thin", "400": "roboto-regular", "700": "roboto-bold", "400i": "roboto-italic" } },
  // AltaCV — body; Deedy also needs Thin (name) and Light (body)
  { family: "Lato", styles: {
    "100": "lato-thin",
    "300": "lato-light",
    "400": "lato-regular",
    "700": "lato-bold",
    "300i": "lato-lightitalic",
    "400i": "lato-italic",
  } },
  // AltaCV — headings
  { family: "Roboto Slab", styles: { "400": "robotoslab-regular", "700": "robotoslab-bold" } },
  // Deedy — contact, dates, location labels (Raleway ExtraLight / Medium)
  { family: "Raleway", styles: { "200": "raleway-extralight", "500": "raleway-medium" } },
  // Princeton (native) and UChicago (stands in for Adobe Garamond)
  { family: "EB Garamond", styles: {
    "400": "ebgaramond-regular",
    "500": "ebgaramond-medium",
    "700": "ebgaramond-bold",
    "400i": "ebgaramond-italic",
  } },
];

/** Direct downloads: family → [{ url, file, licence }] */
const directFonts = [
  // Computer Modern Unicode — the OpenType Computer Modern, for Jake's Resume.
  // GUST Font Licence (a LaTeX Project Public Licence variant); redistribution
  // is explicitly permitted.
  { url: "https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font/Serif/cmunrm.ttf", file: "cmuserif-regular.ttf" },
  { url: "https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font/Serif/cmunbx.ttf", file: "cmuserif-bold.ttf" },
  { url: "https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font/Serif/cmunti.ttf", file: "cmuserif-italic.ttf" },
  { url: "https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font/Serif/cmunbi.ttf", file: "cmuserif-bolditalic.ttf" },
  // Font Awesome Free 6 — icon glyphs for Awesome-CV and AltaCV contact lines.
  // Icons are OFL 1.1.
  { url: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/webfonts/fa-solid-900.ttf", file: "fontawesome-solid.ttf" },
  { url: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/webfonts/fa-brands-400.ttf", file: "fontawesome-brands.ttf" },
  // Carlito — metric-compatible Calibri substitute (OFL 1.1). Google Fonts CSS
  // API does not always offer the static TTFs, so these come from the upstream
  // googlefonts/carlito repo via jsDelivr.
  { url: "https://cdn.jsdelivr.net/gh/googlefonts/carlito@main/fonts/ttf/Carlito-Regular.ttf", file: "carlito-regular.ttf" },
  { url: "https://cdn.jsdelivr.net/gh/googlefonts/carlito@main/fonts/ttf/Carlito-Bold.ttf", file: "carlito-bold.ttf" },
  { url: "https://cdn.jsdelivr.net/gh/googlefonts/carlito@main/fonts/ttf/Carlito-Italic.ttf", file: "carlito-italic.ttf" },
  { url: "https://cdn.jsdelivr.net/gh/googlefonts/carlito@main/fonts/ttf/Carlito-BoldItalic.ttf", file: "carlito-bolditalic.ttf" },
];

const licences = {
  "tinos-*": "Apache-2.0 — Steve Matteson / Google",
  "librefranklin-*": "OFL-1.1 — Impallari Type",
  "nunitosans-*": "OFL-1.1 — Vernon Adams et al.",
  "sourcesans3-*": "OFL-1.1 — Adobe",
  "roboto-*": "Apache-2.0 — Christian Robertson / Google",
  "lato-*": "OFL-1.1 — Łukasz Dziedzic",
  "raleway-*": "OFL-1.1 — Matt McInerney / Impallari Type / Pablo Impallari",
  "ebgaramond-*": "OFL-1.1 — Georg Duffner / Octavio Pardo",
  "carlito-*": "OFL-1.1 — Łukasz Dziedzic / Google (metric-compatible with Calibri)",
  "robotoslab-*": "Apache-2.0 — Christian Robertson / Google",
  "cmuserif-*": "GUST Font Licence — Computer Modern Unicode project",
  "fontawesome-*": "OFL-1.1 — Fonticons, Inc. (icons only)",
};

/**
 * Deliberately bare. Google Fonts content-negotiates on the User-Agent: a
 * modern Chrome string gets woff2 (which fontkit and pdf-lib cannot read),
 * while a UA with no declared woff2 support gets plain TTF.
 */
const UA = "Mozilla/5.0";

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchBinary(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Ask the Google Fonts CSS API for every requested weight/style of a family and
 * pull the TTF URL out of each `@font-face` block. The API keys faces by
 * `font-style` + `font-weight`, which is exactly how the styles map is keyed.
 */
async function resolveGoogleFamily(family, styles) {
  const wanted = Object.keys(styles);
  const spec = wanted
    .map((k) => {
      const italic = k.endsWith("i");
      return `${italic ? 1 : 0},${parseInt(k, 10)}`;
    })
    .sort((a, b) => (a < b ? -1 : 1))
    .join(";");

  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}` +
    `:ital,wght@${spec}`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();

  const faces = [];
  for (const block of css.split("@font-face").slice(1)) {
    const style = /font-style:\s*(\w+)/.exec(block)?.[1] ?? "normal";
    const weight = /font-weight:\s*(\d+)/.exec(block)?.[1] ?? "400";
    const src = /url\((https:\/\/[^)]+\.ttf)\)/.exec(block)?.[1];
    if (src) faces.push({ key: `${weight}${style === "italic" ? "i" : ""}`, src });
  }
  return faces;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = [];
  let downloaded = 0;
  let skipped = 0;

  for (const { family, styles } of googleFonts) {
    const faces = await resolveGoogleFamily(family, styles);
    for (const [key, name] of Object.entries(styles)) {
      const file = `${name}.ttf`;
      const dest = join(OUT, file);
      const face = faces.find((f) => f.key === key);
      if (!face) {
        console.warn(`  ! ${family} ${key} not offered by Google Fonts — skipped`);
        continue;
      }
      if (!FORCE && (await exists(dest))) {
        skipped++;
      } else {
        const buf = await fetchBinary(face.src);
        await writeFile(dest, buf);
        downloaded++;
        console.log(`  + ${file}  ${(buf.length / 1024).toFixed(0)} kB`);
      }
      manifest.push({ file, family, style: key, source: face.src });
    }
  }

  for (const { url, file } of directFonts) {
    const dest = join(OUT, file);
    if (!FORCE && (await exists(dest))) {
      skipped++;
    } else {
      const buf = await fetchBinary(url);
      await writeFile(dest, buf);
      downloaded++;
      console.log(`  + ${file}  ${(buf.length / 1024).toFixed(0)} kB`);
    }
    manifest.push({ file, source: url });
  }

  const licenceFor = (file) =>
    Object.entries(licences).find(([pat]) =>
      file.startsWith(pat.replace("*", "")),
    )?.[1] ?? "unknown";

  await writeFile(
    join(OUT, "MANIFEST.json"),
    JSON.stringify(
      {
        generatedBy: "scripts/fetch-resume-fonts.mjs",
        note: "Regenerate with `npm run fonts:resume`. Do not edit by hand.",
        fonts: manifest.map((m) => ({ ...m, licence: licenceFor(m.file) })),
      },
      null,
      2,
    ) + "\n",
  );

  console.log(
    `\n${downloaded} downloaded, ${skipped} already present → public/fonts/resume/_source/ (run subset_fonts.py next)`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
