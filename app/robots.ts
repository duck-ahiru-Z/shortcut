import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/", "/exams", "/share/"] , disallow: ["/debug", "/exam", "/admin", "/api"] },
    sitemap: "https://shortcutkeyexam.vercel.app/sitemap.xml",
  };
}
