import { MetadataRoute } from "next";
import { ORIGIN_URL } from "@/utils/helpers";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/summaries/"], // Private routes block kro
    },
    sitemap: `${ORIGIN_URL}/sitemap.xml`,
  };
}
