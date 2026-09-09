import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shortcutkeyexam.vercel.app";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/exams`, changeFrequency: "weekly", priority: 0.9 },
  ];
}
