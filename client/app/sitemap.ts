import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-deployed-domain.com",
      lastModified: new Date(),
    },
    {
      url: "https://your-deployed-domain.com/login",
      lastModified: new Date(),
    },
    {
      url: "https://your-deployed-domain.com/signup",
      lastModified: new Date(),
    },
  ];
}
