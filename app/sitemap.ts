import { MetadataRoute } from "next";
import { ORIGIN_URL } from "@/utils/helpers";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${ORIGIN_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${ORIGIN_URL}/#pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${ORIGIN_URL}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${ORIGIN_URL}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // Agar future mein blogs hue to wo bhi yahan dynamically ayenge
  ];
}
