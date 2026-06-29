import {
  ARTICLES,
  BRAD_AI_CONTEXT,
  HOW_TO_ORDER_STEPS,
  ROUTE_LABELS,
  ROUTE_PATHS,
  SEO_META,
  SITE_NAME,
  SITE_URL,
  SITE_TAGLINE,
  STORE_ADDRESS,
  STORE_MAP_URL,
  WHATSAPP_NUMBER,
  getArticleBySlug,
  getArticlePath,
  getArticleSlugFromPathname,
} from './siteConfig';
import { Article, Category, Product, RouteKey, SeoMeta, SiteFaqItem } from '../types';

const upsertMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value));
};

const upsertLinkTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement('link');
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value));
};

const dedupeKeywords = (keywords: string[]) => Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));

const buildProductKeywords = (products: Product[]) => {
  const keywords = products.flatMap((product) => {
    const category = product.category.toLowerCase();
    return [
      product.name,
      `${product.name} ${category}`,
      `${product.name} custom`,
      `${category} custom`,
      product.category === 'Kemeja' ? `${product.name} kemeja dinas` : '',
      product.category === 'Kemeja' ? `${product.name} kemeja custom` : '',
      product.category === 'Celana' ? `${product.name} celana tactical` : '',
      product.category === 'Rompi' ? `${product.name} rompi lapangan` : '',
      product.category === 'Jaket' ? `${product.name} jaket custom` : '',
      product.category === 'Polo' ? `${product.name} polo shirt custom` : '',
    ];
  });

  return dedupeKeywords(keywords);
};

const buildArticleMeta = (article: Article): SeoMeta => ({
  title: article.seoTitle,
  description: article.seoDescription,
  path: getArticlePath(article.slug),
  keywords: dedupeKeywords([
    ...SEO_META[RouteKey.ARTIKEL].keywords,
    ...article.keywords,
    article.title,
    article.category,
    `artikel ${article.category.toLowerCase()}`,
  ]),
  schema: [],
});

const resolveSeoMeta = (route: RouteKey, pathname: string) => {
  const article = getArticleBySlug(getArticleSlugFromPathname(pathname));
  if (route === RouteKey.ARTIKEL && article) {
    return {
      article,
      meta: buildArticleMeta(article),
    };
  }

  return {
    article: null,
    meta: SEO_META[route],
  };
};

const buildRouteKeywords = (
  route: RouteKey,
  pathname: string,
  products: Product[],
  meta: SeoMeta,
  article: Article | null,
) => {
  const routeTerms: Record<RouteKey, string[]> = {
    [RouteKey.HOME]: [
      'kemeja custom',
      'kemeja dinas',
      'seragam kerja custom',
      'seragam kantor',
      'bordir logo instansi',
      'seragam komunitas custom',
      'vendor kemeja kerja',
    ],
    [RouteKey.THREE_D]: ['desain 3d kemeja custom', 'preview kemeja custom 3d', 'simulasi seragam kerja custom'],
    [RouteKey.KATALOG]: [
      'katalog kemeja custom',
      'katalog kemeja dinas',
      'model seragam kerja',
      'vendor seragam komunitas',
      'katalog seragam dinas instansi',
    ],
    [RouteKey.CLIENT]: ['hasil jadi kemeja custom', 'galeri seragam dinas', 'portofolio seragam komunitas'],
    [RouteKey.ABOUT]: ['tentang bradwear indonesia', 'profil vendor seragam', 'konveksi seragam tasikmalaya'],
    [RouteKey.VISION_MISSION]: ['visi misi bradwear', 'standar kualitas seragam', 'komitmen vendor seragam'],
    [RouteKey.PRODUCTS_SERVICES]: ['produk seragam bradwear', 'jasa kemeja custom', 'jasa seragam dinas'],
    [RouteKey.COMPETITIVE_ADVANTAGE]: ['keunggulan vendor seragam', 'jahitan seragam rapi', 'vendor seragam berkualitas'],
    [RouteKey.CLIENT_REACH]: ['jangkauan pengiriman seragam', 'klien instansi bradwear', 'vendor seragam seluruh indonesia'],
    [RouteKey.LEGAL_LICENSE]: ['legalitas vendor seragam', 'lisensi hukum bradwear', 'pengadaan seragam instansi'],
    [RouteKey.PANTS]: ['celana tactical custom', 'celana kerja custom', 'celana lapangan custom'],
    [RouteKey.ARTIKEL]: ['panduan kemeja dinas', 'panduan bahan seragam', 'artikel seragam komunitas'],
    [RouteKey.CARA_ORDER]: ['cara pesan kemeja custom', 'cara order seragam dinas', 'langkah order seragam komunitas'],
    [RouteKey.LAYANAN_PELANGGAN]: ['konsultasi kemeja custom', 'whatsapp kemeja dinas', 'cs seragam komunitas'],
    [RouteKey.LACAK_PESANAN]: ['lacak order seragam custom', 'tracking kemeja custom', 'cek status seragam dinas'],
    [RouteKey.TEMUKAN_TOKO]: ['workshop kemeja custom tasikmalaya', 'alamat konveksi seragam tasikmalaya'],
    [RouteKey.BRAD_AI]: ['ai kemeja custom', 'asisten seragam bradwear', 'konsultasi ai seragam dinas'],
    [RouteKey.EDITOR]: ['editor kemeja custom', 'simulasi desain seragam', 'desain kemeja kerja custom'],
    [RouteKey.SUMMARY]: ['ringkasan pesanan kemeja custom', 'checkout seragam dinas', 'ringkasan order seragam komunitas'],
  };

  const productKeywords = route === RouteKey.HOME || route === RouteKey.KATALOG || route === RouteKey.PANTS
    ? buildProductKeywords(products).slice(0, 24)
    : [];

  const articleKeywords = route === RouteKey.ARTIKEL && article
    ? [
      article.title,
      article.seoTitle,
      article.category,
      ...article.keywords,
      pathname.includes('/artikel/') ? 'artikel detail seragam' : 'artikel bradwear',
    ]
    : [];

  return dedupeKeywords([...meta.keywords, ...(routeTerms[route] ?? []), ...productKeywords, ...articleKeywords]);
};

const buildBreadcrumbItems = (route: RouteKey, canonical: string, article: Article | null) => {
  if (route === RouteKey.HOME) {
    return [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
    ];
  }

  if (route === RouteKey.ARTIKEL && article) {
    return [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Beranda / Artikel',
        item: `${SITE_URL}${ROUTE_PATHS[RouteKey.ARTIKEL]}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonical,
      },
    ];
  }

  return [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: ROUTE_LABELS[route],
      item: canonical,
    },
  ];
};

const buildBaseSchemas = (
  route: RouteKey,
  meta: SeoMeta,
  keywords: string[],
  canonical: string,
  article: Article | null,
): Record<string, unknown>[] => {
  const breadcrumbItems = buildBreadcrumbItems(route, canonical, article);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
      keywords: keywords.join(', '),
      logo: `${SITE_URL}/assets/logo.png`,
      sameAs: [SITE_URL],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: `+${WHATSAPP_NUMBER}`,
        areaServed: 'ID',
        availableLanguage: ['id'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      telephone: `+${WHATSAPP_NUMBER}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: STORE_ADDRESS,
        addressLocality: 'Tasikmalaya',
        addressRegion: 'Jawa Barat',
        addressCountry: 'ID',
      },
      url: canonical,
      hasMap: STORE_MAP_URL,
      areaServed: 'Indonesia',
      description: meta.description,
      image: `${SITE_URL}/assets/logo.png`,
      keywords: keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
      inLanguage: 'id-ID',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/katalog`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${SITE_NAME} Custom Uniform Service`,
      serviceType: 'Konveksi kemeja custom dan seragam dinas',
      provider: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: 'Indonesia',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${SITE_URL}/layanan-pelanggan`,
      },
      description: meta.description,
      keywords: keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': article ? 'Article' : 'WebPage',
      name: meta.title,
      url: canonical,
      description: meta.description,
      inLanguage: 'id-ID',
      keywords: keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
  ];
};

export const buildPageSchema = (route: RouteKey, pathname: string, products: Product[], faqs: SiteFaqItem[]) => {
  const { article, meta } = resolveSeoMeta(route, pathname);
  const keywords = buildRouteKeywords(route, pathname, products, meta, article);
  const canonical = `${SITE_URL}${meta.path}`;
  const base = buildBaseSchemas(route, meta, keywords, canonical, article);

  if (route === RouteKey.KATALOG || route === RouteKey.PANTS || route === RouteKey.HOME) {
    const filteredProducts = route === RouteKey.PANTS
      ? products.filter((product) => product.category === 'Celana' && !product.isHidden)
      : products.filter((product) => !product.isHidden);

    base.push({
      '@context': 'https://schema.org',
      '@type': route === RouteKey.HOME ? 'CollectionPage' : 'OfferCatalog',
      name: meta.title,
      url: canonical,
      description: meta.description,
      numberOfItems: filteredProducts.length,
    });

    base.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: route === RouteKey.PANTS ? 'Bradwear Pants Catalog' : 'Bradwear Product Catalog',
      itemListElement: filteredProducts.slice(0, 12).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${SITE_URL}/katalog`,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          category: product.category,
          image: product.image,
          brand: {
            '@type': 'Brand',
            name: SITE_NAME,
          },
          keywords: [
            product.name,
            `${product.category.toLowerCase()} custom`,
            product.category === 'Kemeja' ? 'kemeja dinas' : '',
          ].filter(Boolean).join(', '),
        },
      })),
    });
  }

  if (route === RouteKey.LACAK_PESANAN || route === RouteKey.LAYANAN_PELANGGAN || route === RouteKey.HOME) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  if (route === RouteKey.CARA_ORDER || route === RouteKey.HOME) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Cara order kemeja custom dan seragam dinas di Bradwear',
      description: 'Panduan memilih model, mengatur desain, melengkapi ukuran, dan mengirim order ke WhatsApp Bradwear.',
      totalTime: 'P1D',
      step: HOW_TO_ORDER_STEPS.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.title,
        text: `${step.description} ${step.detail}`,
        url: canonical,
      })),
    });
  }

  if (route === RouteKey.ARTIKEL) {
    if (article) {
      base.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.seoDescription,
        articleSection: article.category,
        inLanguage: 'id-ID',
        url: canonical,
        keywords: article.keywords.join(', '),
        articleBody: article.body.join(' '),
        isPartOf: {
          '@type': 'Blog',
          name: 'Artikel Bradwear',
          url: `${SITE_URL}${ROUTE_PATHS[RouteKey.ARTIKEL]}`,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/assets/logo.png`,
          },
        },
        mainEntityOfPage: canonical,
      });
    } else {
      base.push({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Artikel Bradwear',
        url: canonical,
        description: meta.description,
        blogPost: ARTICLES.map((item) => ({
          '@type': 'BlogPosting',
          headline: item.title,
          description: item.seoDescription,
          articleSection: item.category,
          inLanguage: 'id-ID',
          url: `${SITE_URL}${getArticlePath(item.slug)}`,
          keywords: item.keywords.join(', '),
        })),
      });
    }
  }

  if (route === RouteKey.BRAD_AI) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Brodi',
      description: BRAD_AI_CONTEXT.map((section) => `${section.heading}: ${section.body}`).join(' '),
    });
  }

  return base;
};

export const applySeoMeta = (route: RouteKey, pathname: string, products: Product[], faqs: SiteFaqItem[]) => {
  const { article, meta } = resolveSeoMeta(route, pathname);
  const canonical = `${SITE_URL}${meta.path}`;
  const keywords = buildRouteKeywords(route, pathname, products, meta, article);
  const schemas = buildPageSchema(route, pathname, products, faqs);
  const pageLabel = article ? article.category : ROUTE_LABELS[route];

  document.title = meta.title;

  upsertMetaTag('meta[name="description"]', { name: 'description', content: meta.description });
  upsertMetaTag('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
  upsertMetaTag('meta[name="news_keywords"]', { name: 'news_keywords', content: keywords.join(', ') });
  upsertMetaTag('meta[name="classification"]', { name: 'classification', content: pageLabel });
  upsertMetaTag('meta[name="category"]', { name: 'category', content: pageLabel });
  upsertMetaTag('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
  upsertMetaTag('meta[name="author"]', { name: 'author', content: SITE_NAME });
  upsertMetaTag('meta[name="application-name"]', { name: 'application-name', content: SITE_NAME });
  upsertMetaTag('meta[name="apple-mobile-web-app-title"]', { name: 'apple-mobile-web-app-title', content: SITE_NAME });
  upsertMetaTag('meta[name="theme-color"]', { name: 'theme-color', content: '#75f21a' });
  upsertMetaTag('meta[name="color-scheme"]', { name: 'color-scheme', content: 'light dark' });
  upsertMetaTag('meta[name="geo.region"]', { name: 'geo.region', content: 'ID-JB' });
  upsertMetaTag('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Tasikmalaya' });
  upsertMetaTag('meta[name="ICBM"]', { name: 'ICBM', content: '-7.3506, 108.2172' });
  upsertMetaTag('meta[property="og:title"]', { property: 'og:title', content: meta.title });
  upsertMetaTag('meta[property="og:description"]', { property: 'og:description', content: meta.description });
  upsertMetaTag('meta[property="og:type"]', { property: 'og:type', content: article ? 'article' : 'website' });
  upsertMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMetaTag('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
  upsertMetaTag('meta[property="og:locale"]', { property: 'og:locale', content: 'id_ID' });
  upsertMetaTag('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
  upsertMetaTag('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
  upsertMetaTag('meta[property="og:image"]', { property: 'og:image', content: `${SITE_URL}/assets/logo.png` });
  upsertMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${SITE_NAME} logo` });
  upsertMetaTag('meta[property="article:section"]', {
    property: 'article:section',
    content: article?.category ?? ROUTE_LABELS[route],
  });
  upsertMetaTag('meta[property="article:tag"]', {
    property: 'article:tag',
    content: keywords.slice(0, 10).join(', '),
  });
  upsertMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
  upsertMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
  upsertMetaTag('meta[name="twitter:url"]', { name: 'twitter:url', content: canonical });
  upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: `${SITE_URL}/assets/logo.png` });
  upsertMetaTag('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: `${SITE_NAME} logo` });
  upsertMetaTag('meta[name="twitter:site"]', { name: 'twitter:site', content: SITE_NAME });
  upsertMetaTag('meta[name="format-detection"]', { name: 'format-detection', content: 'telephone=no,address=no,email=no' });
  upsertLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonical });
  upsertLinkTag('link[rel="alternate"][hreflang="id-ID"]', { rel: 'alternate', hreflang: 'id-ID', href: canonical });
  upsertLinkTag('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonical });

  let script = document.getElementById('bradwear-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'bradwear-jsonld';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemas);
};

export const buildCategorySummary = (products: Product[], category: Category) => {
  return products
    .filter((product) => product.category === category && !product.isHidden)
    .map((product) => `${product.name}: ${product.description}`)
    .join(' ');
};
