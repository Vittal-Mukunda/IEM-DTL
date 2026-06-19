import type { MetadataRoute } from "next";

const BASE_URL = "https://iem-rvce.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/faculty",
    "/curriculum",
    "/research",
    "/placements",
    "/events",
    "/faq",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
