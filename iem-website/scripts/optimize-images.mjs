// One-off image optimizer. Resizes oversized source photos in place so the
// repo stays light and Next/image has less to transform on first request.
// Faculty photos render at most ~340px wide → cap at 900px for retina.
// World photos are full-bleed backgrounds → cap at 1600px.
//
//   node scripts/optimize-images.mjs
//
// Re-running is safe: already-small files are skipped.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const jobs = [
  { dir: "faculty", max: 900, quality: 80 },
  { dir: "worlds", max: 1600, quality: 78 },
];

let before = 0;
let after = 0;

for (const { dir, max, quality } of jobs) {
  const base = join(root, dir);
  const files = await readdir(base);
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    const path = join(base, file);
    const input = await readFile(path);
    before += input.length;

    const img = sharp(input).rotate();
    const meta = await img.metadata();
    const resized = img.resize({
      width: Math.min(meta.width ?? max, max),
      withoutEnlargement: true,
    });

    const out =
      ext === ".png"
        ? await resized.png({ compressionLevel: 9, palette: true }).toBuffer()
        : await resized
            .jpeg({ quality, mozjpeg: true, progressive: true })
            .toBuffer();

    // Only overwrite if we actually saved bytes.
    if (out.length < input.length) {
      await writeFile(path, out);
      after += out.length;
      console.log(
        `${dir}/${file}: ${(input.length / 1024).toFixed(0)}K -> ${(
          out.length / 1024
        ).toFixed(0)}K`,
      );
    } else {
      after += input.length;
      console.log(`${dir}/${file}: kept (no gain)`);
    }
  }
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(
    after /
    1024 /
    1024
  ).toFixed(2)}MB`,
);
