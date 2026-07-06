import type { MetadataRoute } from "next";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { siteUrl as BASE_URL } from "@/lib/data";

const PUBLIC_DIR = join(process.cwd(), "public");

/** Recursively collect the web paths of every PDF under a public/ subdirectory,
 *  paired with the file's modification time. Missing directories are skipped so
 *  the build never breaks if a folder is renamed or removed. */
function collectPdfs(subdir: string): { path: string; lastModified: Date }[] {
  const out: { path: string; lastModified: Date }[] = [];

  const walk = (absDir: string, webDir: string) => {
    let entries;
    try {
      entries = readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const abs = join(absDir, entry.name);
      const web = `${webDir}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(abs, web);
      } else if (entry.name.toLowerCase().endsWith(".pdf")) {
        out.push({ path: web, lastModified: statSync(abs).mtime });
      }
    }
  };

  walk(join(PUBLIC_DIR, subdir), `/${subdir}`);
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/faculty",
    "/curriculum",
    "/resources",
    "/research",
    "/placements",
    "/events",
    "/faq",
    "/contact",
  ];

  const pages = routes.map(
    (route): MetadataRoute.Sitemap[number] => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8,
    }),
  );

  // Downloadable resources (newsletters, syllabus, semester notes) so search
  // engines can index the PDFs directly.
  const documents = ["newsletters", "syllabus", "notes"]
    .flatMap(collectPdfs)
    .map(
      (file): MetadataRoute.Sitemap[number] => ({
        url: `${BASE_URL}${file.path}`,
        lastModified: file.lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      }),
    );

  return [...pages, ...documents];
}
