import type { MetadataRoute } from "next";
import { crossing, nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...nav.map((n) => ({
      url: `${site.url}${n.href === "/" ? "" : n.href}`,
      changeFrequency: "monthly" as const,
      priority: n.href === "/" ? 1 : 0.8,
    })),
    { url: `${site.url}${crossing.href}`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}${crossing.passHref}`, changeFrequency: "daily", priority: 0.9 },
  ];
}
