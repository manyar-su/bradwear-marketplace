import { BRAD_AI_CONTEXT, ROUTE_LABELS, ROUTE_PATHS, SEO_META, SITE_NAME, SITE_URL, SITE_TAGLINE, STORE_ADDRESS, STORE_MAP_URL, WHATSAPP_NUMBER } from './siteConfig';
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

const buildBaseSchemas = (meta: SeoMeta): Record<string, unknown>[] => {
  const canonical = `${SITE_URL}${meta.path}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
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
      serviceType: 'Konveksi seragam custom',
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
  const base = buildBaseSchemas(meta);

  if (route === RouteKey.KATALOG || route === RouteKey.PANTS || route === RouteKey.HOME) {
    const filteredProducts = route === RouteKey.PANTS
      ? products.filter((product) => product.category === 'Celana' && !product.isHidden)
      : products.filter((product) => !product.isHidden);

    base.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: route === RouteKey.PANTS ? 'Bradwear Pants Catalog' : 'Bradwear Product Catalog',
      itemListElement: filteredProducts.slice(0, 12).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        description: product.description,
        category: product.category,
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
  const schemas = buildPageSchema(route, products, faqs);

  document.title = meta.title;

  upsertMetaTag('meta[name="description"]', { name: 'description', content: meta.description });
  upsertMetaTag('meta[name="keywords"]', { name: 'keywords', content: meta.keywords.join(', ') });
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
  upsertMetaTag('meta[property="og:image"]', { property: 'og:image', content: `${SITE_URL}/assets/logo.png` });
  upsertMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${SITE_NAME} logo` });
  upsertMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
  upsertMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
  upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: `${SITE_URL}/assets/logo.png` });
  upsertMetaTag('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: `${SITE_NAME} logo` });
  upsertMetaTag('meta[name="twitter:site"]', { name: 'twitter:site', content: SITE_NAME });
  upsertMetaTag('meta[name="format-detection"]', { name: 'format-detection', content: 'telephone=no,address=no,email=no' });
  upsertLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonical });

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
