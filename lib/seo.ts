import type { Metadata } from "next";
import { CATEGORY_PAGES, CONTACT, SITE_NAME, SITE_TAGLINE, SITE_URL, STORE } from "@/lib/site-content";
import type { Article } from "@/lib/articles";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/assets/katalog/factory_hero.jpg",
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "id_ID",
      type: "website",
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    alternateName: "Bradwear Marketplace",
    description: SITE_TAGLINE,
    url: SITE_URL,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.address,
      addressLocality: STORE.city,
      addressRegion: STORE.province,
      addressCountry: "ID",
    },
    sameAs: [STORE.googleMapsUrl, absoluteUrl("/temukan-toko")],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/katalog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: absoluteUrl(article.heroImage),
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: absoluteUrl(`/artikel/${article.slug}`),
    keywords: article.keywords.join(", "),
  };
}

export function articleListSchema(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Artikel Bradflow",
    description: "Kumpulan artikel tentang pemesanan kemeja, seragam kantor, seragam dinas, dan seragam komunitas.",
    hasPart: articles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      url: absoluteUrl(`/artikel/${article.slug}`),
    })),
  };
}

export function serviceKeywords() {
  return [
    "pemesanan kemeja",
    "kemeja custom",
    "seragam kantor",
    "seragam dinas",
    "seragam komunitas",
    "konveksi seragam",
    "polo custom",
    "jaket custom",
    "celana seragam",
    ...CATEGORY_PAGES.flatMap((item) => item.keywords),
  ];
}
