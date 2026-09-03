import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/admin"],
    },
    sitemap: "https://your-deployed-domain.com/sitemap.xml",
  };
}
