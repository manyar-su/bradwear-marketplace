import { ARTICLES, BRAD_AI_CONTEXT, HOW_TO_ORDER_STEPS, ROUTE_LABELS, ROUTE_PATHS, SEO_META, SITE_NAME, SITE_URL, SITE_TAGLINE, STORE_ADDRESS, STORE_MAP_URL, WHATSAPP_NUMBER } from './siteConfig';
import { Category, Product, RouteKey, SeoMeta, SiteFaqItem } from '../types';

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

  return Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));
};

const buildRouteKeywords = (route: RouteKey, products: Product[], meta: SeoMeta) => {
  const routeTerms: Record<RouteKey, string[]> = {
    [RouteKey.HOME]: ['kemeja custom', 'kemeja dinas', 'seragam kerja custom', 'seragam kantor', 'bordir logo instansi'],
    [RouteKey.THREE_D]: ['desain 3d kemeja custom', 'preview kemeja custom 3d'],
    [RouteKey.KATALOG]: ['katalog kemeja custom', 'katalog kemeja dinas', 'model seragam kerja'],
    [RouteKey.CLIENT]: ['hasil jadi kemeja custom', 'galeri seragam dinas'],
    [RouteKey.PANTS]: ['celana tactical custom', 'celana kerja custom'],
    [RouteKey.ARTIKEL]: ['panduan kemeja dinas', 'panduan bahan seragam'],
    [RouteKey.CARA_ORDER]: ['cara pesan kemeja custom', 'cara order seragam dinas'],
    [RouteKey.LAYANAN_PELANGGAN]: ['konsultasi kemeja custom', 'whatsapp kemeja dinas'],
    [RouteKey.LACAK_PESANAN]: ['lacak order seragam custom', 'tracking kemeja custom'],
    [RouteKey.TEMUKAN_TOKO]: ['workshop kemeja custom tasikmalaya', 'alamat konveksi seragam tasikmalaya'],
    [RouteKey.BRAD_AI]: ['ai kemeja custom', 'asisten seragam bradwear'],
    [RouteKey.EDITOR]: ['editor kemeja custom', 'simulasi desain seragam'],
    [RouteKey.SUMMARY]: ['ringkasan pesanan kemeja custom', 'checkout seragam dinas'],
  };

  const productKeywords = route === RouteKey.HOME || route === RouteKey.KATALOG || route === RouteKey.PANTS
    ? buildProductKeywords(products).slice(0, 24)
    : [];

  return Array.from(new Set([...meta.keywords, ...(routeTerms[route] ?? []), ...productKeywords]));
};

const buildBaseSchemas = (meta: SeoMeta, keywords: string[]): Record<string, unknown>[] => {
  const canonical = `${SITE_URL}${meta.path}`;
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
      '@type': 'WebPage',
      name: meta.title,
      url: canonical,
      description: meta.description,
      inLanguage: 'id-ID',
      keywords: keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: ROUTE_LABELS[pathToParent(meta.path)],
          item: canonical,
        },
      ],
    },
  ];
};

const pathToParent = (path: string): RouteKey => {
  const match = Object.entries(ROUTE_PATHS).find(([, value]) => value === path);
  return (match?.[0] as RouteKey) ?? RouteKey.HOME;
};

export const buildPageSchema = (route: RouteKey, products: Product[], faqs: SiteFaqItem[]) => {
  const meta = SEO_META[route];
  const keywords = buildRouteKeywords(route, products, meta);
  const base = buildBaseSchemas(meta, keywords);
  const canonical = `${SITE_URL}${meta.path}`;

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
    base.push({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Artikel Bradwear',
      blogPost: ARTICLES.map((article) => ({
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        articleSection: article.category,
        inLanguage: 'id-ID',
        url: `${SITE_URL}/artikel`,
      })),
    });
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

export const applySeoMeta = (route: RouteKey, products: Product[], faqs: SiteFaqItem[]) => {
  const meta = SEO_META[route];
  const canonical = `${SITE_URL}${meta.path}`;
  const keywords = buildRouteKeywords(route, products, meta);
  const schemas = buildPageSchema(route, products, faqs);

  document.title = meta.title;

  upsertMetaTag('meta[name="description"]', { name: 'description', content: meta.description });
  upsertMetaTag('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
  upsertMetaTag('meta[name="news_keywords"]', { name: 'news_keywords', content: keywords.join(', ') });
  upsertMetaTag('meta[name="classification"]', { name: 'classification', content: ROUTE_LABELS[route] });
  upsertMetaTag('meta[name="category"]', { name: 'category', content: ROUTE_LABELS[route] });
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
  upsertMetaTag('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMetaTag('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
  upsertMetaTag('meta[property="og:locale"]', { property: 'og:locale', content: 'id_ID' });
  upsertMetaTag('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
  upsertMetaTag('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
  upsertMetaTag('meta[property="og:image"]', { property: 'og:image', content: `${SITE_URL}/assets/logo.png` });
  upsertMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${SITE_NAME} logo` });
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
