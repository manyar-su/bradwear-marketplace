import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { CATEGORY_PAGES, SITE_URL } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/katalog",
    "/layanan-pelanggan",
    "/cara-order",
    "/faq",
    "/lacak-pesanan",
    "/temukan-toko",
    "/artikel",
    "/brad-ai",
    ...CATEGORY_PAGES.map((item) => item.href),
    ...ARTICLES.map((article) => `/artikel/${article.slug}`),
  ];

  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/artikel/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/kategori/") ? 0.9 : 0.8,
  }));
}
