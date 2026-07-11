import {
  ARTICLES,
  BRAD_AI_CONTEXT,
  CATEGORY_ROUTE_PATHS,
  CATALOG_GUIDE_PATHS,
  INFO_ROUTE_PATHS,
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
  buildCatalogProductSlug,
  getCatalogGuideFromPathname,
  getCatalogProductPath,
  getCatalogProductSlugFromPathname,
  getArticleBySlug,
  getArticlePath,
  getArticleSlugFromPathname,
  normalizePathname,
} from './siteConfig';
import { Article, Category, Product, RouteKey, SeoMeta, SiteFaqItem } from '../types';

const SEO_ICON_URL = `${SITE_URL}/favicon-bradwear.png`;
const SEO_PREVIEW_IMAGE_URL = `${SITE_URL}/thumbnail-bradwear.jpeg`;
const SEO_PREVIEW_IMAGE_ALT = 'Preview seragam custom Bradwear Indonesia';
const BRADWEAR_FOUNDER_NAME = 'Gilang';
const BRADWEAR_WEBSITE_MANAGER = 'Maris Ibrahim';
const ARTICLE_BLOG_URL = `${SITE_URL}${ROUTE_PATHS[RouteKey.ARTIKEL]}`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const LOCAL_BUSINESS_ID = `${SITE_URL}/#local-business`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#custom-uniform-service`;
const BUSINESS_LATITUDE = '-7.3506';
const BUSINESS_LONGITUDE = '108.2172';
const BUSINESS_SERVICE_AREAS = ['Tasikmalaya', 'Jawa Barat', 'Indonesia'];
const BUSINESS_OPENING_HOURS = [
  { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  { dayOfWeek: ['Saturday'], opens: '08:00', closes: '14:00' },
];
const SOCIAL_PROFILE_URLS = [
  'https://www.instagram.com/bradwear_indonesia/',
  'https://www.tiktok.com/@bradwearindonesia',
];
const CORE_SERVICE_TERMS = [
  'kemeja custom',
  'kemeja dinas',
  'seragam kerja',
  'seragam kantor',
  'PDH',
  'PDL',
  'rompi custom',
  'jaket custom',
  'celana tactical',
  'bordir logo instansi',
];

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

const removeHeadElement = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const dedupeKeywords = (keywords: string[]) => Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));
const toIsoDateTime = (value?: string) => (value ? `${value}T00:00:00+07:00` : '');

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
    article.excerpt,
    article.category,
    article.authorRole,
    `artikel ${article.category.toLowerCase()}`,
  ]),
  schema: [],
});

const buildCatalogSubpageMeta = (pathname: string, products: Product[]): SeoMeta | null => {
  const guide = getCatalogGuideFromPathname(pathname);
  if (guide === 'size') {
    return {
      title: 'Panduan Ukuran Seragam Bradwear Indonesia',
      description: 'Panduan ukuran seragam Bradwear Indonesia untuk mempermudah briefing size tim sebelum masuk ke editor atau konsultasi order.',
      path: CATALOG_GUIDE_PATHS.size,
      keywords: dedupeKeywords([
        ...SEO_META[RouteKey.KATALOG].keywords,
        'panduan ukuran seragam',
        'size guide kemeja custom',
        'ukuran seragam dinas',
      ]),
      schema: [],
    };
  }

  if (guide === 'material') {
    return {
      title: 'Panduan Jenis Bahan Seragam Bradwear Indonesia',
      description: 'Pelajari karakter American Drill, Ripstop, Tropical, Twill, Drill, Nagata Drill, dan Stanford untuk kebutuhan seragam custom Bradwear.',
      path: CATALOG_GUIDE_PATHS.material,
      keywords: dedupeKeywords([
        ...SEO_META[RouteKey.KATALOG].keywords,
        'panduan jenis bahan seragam',
        'bahan kemeja custom',
        'material seragam dinas',
      ]),
      schema: [],
    };
  }

  const productSlug = getCatalogProductSlugFromPathname(pathname);
  if (!productSlug) return null;

  const product = products.find((item) => buildCatalogProductSlug(item) === productSlug);
  if (!product) return null;

  return {
    title: `${product.name} | Detail Model ${product.category} Bradwear Indonesia`,
    description: `Detail model ${product.name} kategori ${product.category} dari Bradwear Indonesia, lengkap dengan informasi material, detail saku, bordir 3D, dan CTA ke editor desain.`,
    path: getCatalogProductPath(product),
    keywords: dedupeKeywords([
      ...SEO_META[RouteKey.KATALOG].keywords,
      product.name,
      `${product.name} ${product.category.toLowerCase()}`,
      `${product.category.toLowerCase()} premium`,
      'bordir 3d seragam',
      'detail model seragam custom',
    ]),
    schema: [],
  };
};

const buildStaticLandingMeta = (pathname: string): SeoMeta | null => {
  const normalized = normalizePathname(pathname.toLowerCase());

  const pageMap: Record<string, SeoMeta> = {
    [CATEGORY_ROUTE_PATHS.KEMEJA_DINAS]: {
      title: 'Kemeja Dinas Custom Profesional | Bradwear Indonesia',
      description: 'Pesan kemeja dinas custom dengan pilihan bahan, warna, bordir, dan desain sesuai kebutuhan perusahaan atau instansi bersama Bradwear Indonesia.',
      path: CATEGORY_ROUTE_PATHS.KEMEJA_DINAS,
      keywords: dedupeKeywords(['kemeja dinas custom', 'kemeja dinas profesional', 'bordir logo kemeja dinas', 'seragam kerja kantor', SITE_NAME]),
      schema: [],
    },
    [CATEGORY_ROUTE_PATHS.PDH_PDL]: {
      title: 'Jasa Pembuatan PDH dan PDL Custom | Bradwear Indonesia',
      description: 'Bradwear Indonesia menyediakan jasa pembuatan PDH dan PDL custom profesional untuk perusahaan, organisasi, komunitas, sekolah, dan instansi.',
      path: CATEGORY_ROUTE_PATHS.PDH_PDL,
      keywords: dedupeKeywords(['pdh custom', 'pdl custom', 'seragam lapangan', 'pdh pdl instansi', SITE_NAME]),
      schema: [],
    },
    [CATEGORY_ROUTE_PATHS.WEARPACK]: {
      title: 'Wearpack Custom Perusahaan dan Industri | Bradwear Indonesia',
      description: 'Pesan wearpack custom untuk kebutuhan perusahaan, industri, mekanik, teknisi, dan lapangan dengan desain profesional dari Bradwear Indonesia.',
      path: CATEGORY_ROUTE_PATHS.WEARPACK,
      keywords: dedupeKeywords(['wearpack custom', 'wearpack perusahaan', 'seragam teknisi', 'wearpack industri', SITE_NAME]),
      schema: [],
    },
    [CATEGORY_ROUTE_PATHS.POLO_JAKET]: {
      title: 'Polo dan Jaket Custom Bordir | Bradwear Indonesia',
      description: 'Pembuatan polo shirt dan jaket custom dengan pilihan bordir, sablon, warna, dan bahan untuk perusahaan, komunitas, dan organisasi.',
      path: CATEGORY_ROUTE_PATHS.POLO_JAKET,
      keywords: dedupeKeywords(['polo custom', 'jaket custom', 'polo bordir', 'jaket bordir komunitas', SITE_NAME]),
      schema: [],
    },
    [ROUTE_PATHS[RouteKey.PANTS]]: {
      title: 'Celana Tactical Custom Profesional | Bradwear Indonesia',
      description: 'Temukan celana tactical custom untuk kebutuhan kerja, lapangan, komunitas, dan instansi dengan material berkualitas dari Bradwear Indonesia.',
      path: ROUTE_PATHS[RouteKey.PANTS],
      keywords: dedupeKeywords(['celana tactical custom', 'celana kerja lapangan', 'celana operasional instansi', SITE_NAME]),
      schema: [],
    },
    [ROUTE_PATHS[RouteKey.HOME]]: {
      title: 'Bradwear Indonesia | Jasa Pembuatan Seragam Custom',
      description: 'Bradwear Indonesia melayani pembuatan kemeja dinas, PDH, PDL, wearpack, polo, jaket, dan celana tactical custom untuk perusahaan, instansi, komunitas, dan UMKM.',
      path: ROUTE_PATHS[RouteKey.HOME],
      keywords: dedupeKeywords(['seragam custom', 'kemeja dinas', 'pdh pdl', 'wearpack', 'polo custom', 'jaket custom', 'celana tactical', SITE_NAME]),
      schema: [],
    },
    [ROUTE_PATHS[RouteKey.CLIENT]]: {
      title: 'Galeri Client Bradwear Indonesia | Dokumentasi Seragam Custom',
      description: 'Lihat dokumentasi hasil produksi dan galeri client Bradwear Indonesia untuk kebutuhan instansi, perusahaan, komunitas, dan operasional lapangan.',
      path: ROUTE_PATHS[RouteKey.CLIENT],
      keywords: dedupeKeywords(['galeri client bradwear', 'portofolio seragam custom', 'dokumentasi produksi seragam', SITE_NAME]),
      schema: [],
    },
    [ROUTE_PATHS[RouteKey.ABOUT]]: {
      title: 'Tentang Kami | Bradwear Indonesia',
      description: 'Pelajari profil Bradwear Indonesia sebagai brand konveksi seragam custom untuk perusahaan, instansi, komunitas, dan UMKM.',
      path: ROUTE_PATHS[RouteKey.ABOUT],
      keywords: dedupeKeywords(['tentang bradwear indonesia', 'profil bradwear', 'konveksi seragam tasikmalaya', SITE_NAME]),
      schema: [],
    },
    [ROUTE_PATHS[RouteKey.LAYANAN_PELANGGAN]]: {
      title: 'FAQ Bradwear Indonesia | Pertanyaan Umum Seragam Custom',
      description: 'Temukan pertanyaan umum seputar desain custom, bordir logo, proses produksi, jumlah pemesanan, dan pengiriman Bradwear Indonesia.',
      path: ROUTE_PATHS[RouteKey.LAYANAN_PELANGGAN],
      keywords: dedupeKeywords(['faq bradwear', 'pertanyaan umum seragam custom', 'faq kemeja dinas', SITE_NAME]),
      schema: [],
    },
    [ROUTE_PATHS[RouteKey.TEMUKAN_TOKO]]: {
      title: 'Kontak dan Konsultasi | Bradwear Indonesia',
      description: 'Hubungi Bradwear Indonesia untuk konsultasi model, bahan, bordir, estimasi produksi, dan pengiriman seragam custom.',
      path: ROUTE_PATHS[RouteKey.TEMUKAN_TOKO],
      keywords: dedupeKeywords(['kontak bradwear indonesia', 'konsultasi seragam custom', 'whatsapp bradwear', SITE_NAME]),
      schema: [],
    },
    [INFO_ROUTE_PATHS.KEBIJAKAN_PRIVASI]: {
      title: 'Kebijakan Privasi | Bradwear Indonesia',
      description: 'Pelajari kebijakan privasi Bradwear Indonesia terkait penggunaan data konsultasi, file desain, dan informasi pemesanan.',
      path: INFO_ROUTE_PATHS.KEBIJAKAN_PRIVASI,
      keywords: dedupeKeywords(['kebijakan privasi bradwear', 'privacy policy bradwear indonesia', SITE_NAME]),
      schema: [],
    },
    [INFO_ROUTE_PATHS.SYARAT_KETENTUAN]: {
      title: 'Syarat dan Ketentuan | Bradwear Indonesia',
      description: 'Baca syarat dan ketentuan Bradwear Indonesia terkait approval order, hasil produksi, pembatalan, dan penyesuaian visual produk custom.',
      path: INFO_ROUTE_PATHS.SYARAT_KETENTUAN,
      keywords: dedupeKeywords(['syarat ketentuan bradwear', 'terms and conditions bradwear indonesia', SITE_NAME]),
      schema: [],
    },
  };

  return pageMap[normalized] ?? null;
};

const resolveSeoMeta = (route: RouteKey, pathname: string, products: Product[]) => {
  const staticLandingMeta = buildStaticLandingMeta(pathname);
  if (staticLandingMeta) {
    return {
      article: null,
      meta: staticLandingMeta,
    };
  }

  const article = getArticleBySlug(getArticleSlugFromPathname(pathname));
  if (route === RouteKey.ARTIKEL && article) {
    return {
      article,
      meta: buildArticleMeta(article),
    };
  }

  if (route === RouteKey.KATALOG || route === RouteKey.PANTS) {
    const catalogSubpageMeta = buildCatalogSubpageMeta(pathname, products);
    if (catalogSubpageMeta) {
      return {
        article: null,
        meta: catalogSubpageMeta,
      };
    }
  }

  return {
    article: null,
    meta: {
      ...SEO_META[route],
      path: normalizePathname(pathname) === ROUTE_PATHS[route] ? SEO_META[route].path : normalizePathname(pathname),
    },
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
    [RouteKey.DOWNLOAD]: ['akses web bradwear', 'katalog web bradwear', 'seragam custom online', 'studio 3d seragam'],
    [RouteKey.CLIENT]: ['hasil jadi kemeja custom', 'galeri seragam dinas', 'portofolio seragam komunitas'],
    [RouteKey.TESTIMONI]: ['testimoni seragam custom', 'review vendor seragam', 'kepuasan klien bradwear'],
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
  const normalized = normalizePathname(canonical.replace(SITE_URL, '').toLowerCase());

  const staticBreadcrumbMap: Record<string, Array<{ '@type': 'ListItem'; position: number; name: string; item: string }>> = {
    [CATEGORY_ROUTE_PATHS.KEMEJA_DINAS]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${SITE_URL}${ROUTE_PATHS[RouteKey.KATALOG]}` },
      { '@type': 'ListItem', position: 3, name: 'Kemeja Dinas', item: canonical },
    ],
    [CATEGORY_ROUTE_PATHS.PDH_PDL]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${SITE_URL}${ROUTE_PATHS[RouteKey.KATALOG]}` },
      { '@type': 'ListItem', position: 3, name: 'PDH & PDL', item: canonical },
    ],
    [CATEGORY_ROUTE_PATHS.WEARPACK]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${SITE_URL}${ROUTE_PATHS[RouteKey.KATALOG]}` },
      { '@type': 'ListItem', position: 3, name: 'Wearpack', item: canonical },
    ],
    [CATEGORY_ROUTE_PATHS.POLO_JAKET]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${SITE_URL}${ROUTE_PATHS[RouteKey.KATALOG]}` },
      { '@type': 'ListItem', position: 3, name: 'Polo & Jaket', item: canonical },
    ],
    [ROUTE_PATHS[RouteKey.PANTS]]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produk', item: `${SITE_URL}${ROUTE_PATHS[RouteKey.KATALOG]}` },
      { '@type': 'ListItem', position: 3, name: 'Celana Tactical', item: canonical },
    ],
    [ROUTE_PATHS[RouteKey.CLIENT]]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Galeri Client', item: canonical },
    ],
    [ROUTE_PATHS[RouteKey.ABOUT]]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tentang Kami', item: canonical },
    ],
    [ROUTE_PATHS[RouteKey.LAYANAN_PELANGGAN]]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: canonical },
    ],
    [ROUTE_PATHS[RouteKey.TEMUKAN_TOKO]]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Kontak', item: canonical },
    ],
    [INFO_ROUTE_PATHS.KEBIJAKAN_PRIVASI]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Kebijakan Privasi', item: canonical },
    ],
    [INFO_ROUTE_PATHS.SYARAT_KETENTUAN]: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Syarat dan Ketentuan', item: canonical },
    ],
  };

  if (staticBreadcrumbMap[normalized]) {
    return staticBreadcrumbMap[normalized];
  }

  if (route === RouteKey.HOME) {
    return [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: SITE_URL,
      },
    ];
  }

  if (route === RouteKey.ARTIKEL && article) {
    return [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Artikel',
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
      name: 'Beranda',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: ROUTE_LABELS[route].replace('Beranda / ', ''),
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
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: ['Bradwear', 'Bradwear Indonesia Tasikmalaya'],
      url: SITE_URL,
      description: SITE_TAGLINE,
      keywords: keywords.join(', '),
      logo: SEO_ICON_URL,
      image: SEO_PREVIEW_IMAGE_URL,
      slogan: 'Stay Bold. Stay Bradwear.',
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
        logo: SEO_ICON_URL,
      },
      knowsAbout: CORE_SERVICE_TERMS.map((name) => ({
        '@type': 'Thing',
        name,
      })),
      founder: {
        '@type': 'Person',
        name: BRADWEAR_FOUNDER_NAME,
      },
      owner: {
        '@type': 'Person',
        name: BRADWEAR_FOUNDER_NAME,
      },
      sameAs: [SITE_URL, ...SOCIAL_PROFILE_URLS],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: `+${WHATSAPP_NUMBER}`,
        areaServed: BUSINESS_SERVICE_AREAS,
        availableLanguage: ['id-ID', 'id'],
        url: `${SITE_URL}${ROUTE_PATHS[RouteKey.LAYANAN_PELANGGAN]}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': LOCAL_BUSINESS_ID,
      name: SITE_NAME,
      telephone: `+${WHATSAPP_NUMBER}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: STORE_ADDRESS,
        addressLocality: 'Tasikmalaya',
        addressRegion: 'Jawa Barat',
        addressCountry: 'ID',
      },
      url: SITE_URL,
      hasMap: STORE_MAP_URL,
      areaServed: BUSINESS_SERVICE_AREAS,
      description: meta.description,
      image: SEO_PREVIEW_IMAGE_URL,
      keywords: keywords.join(', '),
      priceRange: '$$',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS_LATITUDE,
        longitude: BUSINESS_LONGITUDE,
      },
      openingHoursSpecification: BUSINESS_OPENING_HOURS.map((item) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: item.dayOfWeek,
        opens: item.opens,
        closes: item.closes,
      })),
      knowsLanguage: ['id-ID', 'id'],
      parentOrganization: {
        '@id': ORGANIZATION_ID,
      },
      sameAs: SOCIAL_PROFILE_URLS,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
      keywords: keywords.join(', '),
      inLanguage: 'id-ID',
      maintainer: {
        '@type': 'Person',
        name: BRADWEAR_WEBSITE_MANAGER,
      },
      creator: {
        '@type': 'Person',
        name: BRADWEAR_FOUNDER_NAME,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/katalog?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@id': ORGANIZATION_ID,
      },
      about: CORE_SERVICE_TERMS.map((term) => ({
        '@type': 'Thing',
        name: term,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': SERVICE_ID,
      name: `${SITE_NAME} Custom Uniform Service`,
      serviceType: 'Konveksi kemeja custom dan seragam dinas',
      provider: {
        '@id': ORGANIZATION_ID,
      },
      areaServed: BUSINESS_SERVICE_AREAS,
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${SITE_URL}/layanan-pelanggan`,
      },
      description: meta.description,
      keywords: keywords.join(', '),
      audience: {
        '@type': 'Audience',
        audienceType: 'Instansi, perusahaan, komunitas, dan tim operasional',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Katalog seragam custom Bradwear',
        url: `${SITE_URL}${ROUTE_PATHS[RouteKey.KATALOG]}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': article ? 'Article' : 'WebPage',
      '@id': `${canonical}#webpage`,
      name: meta.title,
      url: canonical,
      description: meta.description,
      inLanguage: 'id-ID',
      keywords: keywords.join(', '),
      image: article?.coverImage || SEO_PREVIEW_IMAGE_URL,
      isPartOf: {
        '@id': WEBSITE_ID,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: article?.coverImage || SEO_PREVIEW_IMAGE_URL,
        caption: article?.coverAlt || SEO_PREVIEW_IMAGE_ALT,
      },
      about: keywords.slice(0, 10).map((keyword) => ({
        '@type': 'Thing',
        name: keyword,
      })),
      publisher: {
        '@id': ORGANIZATION_ID,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
  ];
};

export const buildPageSchema = (route: RouteKey, pathname: string, products: Product[], faqs: SiteFaqItem[]) => {
  const { article, meta } = resolveSeoMeta(route, pathname, products);
  const keywords = buildRouteKeywords(route, pathname, products, meta, article);
  const canonical = `${SITE_URL}${meta.path}`;
  const base = buildBaseSchemas(route, meta, keywords, canonical, article);
  const catalogGuide = getCatalogGuideFromPathname(pathname);
  const catalogProductSlug = getCatalogProductSlugFromPathname(pathname);
  const catalogProduct = catalogProductSlug
    ? products.find((product) => buildCatalogProductSlug(product) === catalogProductSlug) ?? null
    : null;

  if (route === RouteKey.KATALOG && catalogGuide) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      url: canonical,
      description: meta.description,
      about: keywords.slice(0, 8).map((keyword) => ({
        '@type': 'Thing',
        name: keyword,
      })),
    });
    return base;
  }

  if (route === RouteKey.TESTIMONI) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: meta.title,
      url: canonical,
      description: meta.description,
      about: [
        { '@type': 'Thing', name: 'testimoni klien seragam custom' },
        { '@type': 'Thing', name: 'review vendor seragam kerja' },
      ],
    });
  }

  if (route === RouteKey.ABOUT) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: meta.title,
      url: canonical,
      description: meta.description,
      about: { '@id': ORGANIZATION_ID },
    });
  }

  if (route === RouteKey.LAYANAN_PELANGGAN || route === RouteKey.TEMUKAN_TOKO) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: meta.title,
      url: canonical,
      description: meta.description,
      mainEntity: { '@id': LOCAL_BUSINESS_ID },
    });
  }

  if (route === RouteKey.KATALOG && catalogProduct) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: catalogProduct.name,
      description: catalogProduct.description,
      image: catalogProduct.image,
      category: catalogProduct.category,
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      url: canonical,
      keywords: keywords.join(', '),
    });
    return base;
  }

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
        url: `${SITE_URL}${getCatalogProductPath(product)}`,
        item: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          category: product.category,
          image: product.image,
          url: `${SITE_URL}${getCatalogProductPath(product)}`,
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
        datePublished: article.publishedAt,
        dateModified: article.updatedAt ?? article.publishedAt,
        keywords: article.keywords.join(', '),
        articleBody: article.body.join(' '),
        image: {
          '@type': 'ImageObject',
          url: article.coverImage,
          caption: article.coverAlt,
        },
        wordCount: article.body.join(' ').split(/\s+/).filter(Boolean).length,
        about: article.keywords.slice(0, 8).map((keyword) => ({
          '@type': 'Thing',
          name: keyword,
        })),
        author: {
          '@type': 'Person',
          name: article.author,
          description: article.authorRole,
        },
        commentCount: article.comments.length,
        comment: article.comments.map((comment) => ({
          '@type': 'Comment',
          author: {
            '@type': 'Person',
            name: comment.author,
          },
          datePublished: comment.publishedAt,
          text: comment.body,
        })),
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
            url: SEO_ICON_URL,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical,
        },
      });
    } else {
      base.push({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Artikel Bradwear',
        url: ARTICLE_BLOG_URL,
        description: meta.description,
        inLanguage: 'id-ID',
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: SEO_ICON_URL,
          },
        },
        blogPost: ARTICLES.map((item) => ({
          '@type': 'BlogPosting',
          headline: item.title,
          description: item.seoDescription,
          articleSection: item.category,
          inLanguage: 'id-ID',
          url: `${SITE_URL}${getArticlePath(item.slug)}`,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt ?? item.publishedAt,
          keywords: item.keywords.join(', '),
          author: {
            '@type': 'Person',
            name: item.author,
          },
        })),
      });

      base.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Daftar artikel Bradwear Indonesia',
        itemListElement: ARTICLES.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}${getArticlePath(item.slug)}`,
          name: item.title,
        })),
      });
    }
  }

  if (route === RouteKey.DOWNLOAD) {
    base.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Akses Web Bradwear Indonesia',
      description: 'Halaman akses web Bradwear Indonesia untuk membuka katalog, artikel, studio 3D, dan konsultasi seragam custom.',
      url: canonical,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
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

export const applySeoMeta = (route: RouteKey, pathname: string, products: Product[], faqs: SiteFaqItem[]) => {
  const { article, meta } = resolveSeoMeta(route, pathname, products);
  const canonical = `${SITE_URL}${meta.path}`;
  const keywords = buildRouteKeywords(route, pathname, products, meta, article);
  const schemas = buildPageSchema(route, pathname, products, faqs);
  const pageLabel = article ? article.category : ROUTE_LABELS[route];
  const previewImage = article?.coverImage || SEO_PREVIEW_IMAGE_URL;
  const previewImageAlt = article?.coverAlt || SEO_PREVIEW_IMAGE_ALT;
  const articlePublishedAt = article ? toIsoDateTime(article.publishedAt) : '';
  const articleModifiedAt = article ? toIsoDateTime(article.updatedAt ?? article.publishedAt) : '';

  document.title = meta.title;

  upsertMetaTag('meta[name="description"]', { name: 'description', content: meta.description });
  upsertMetaTag('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
  upsertMetaTag('meta[name="news_keywords"]', { name: 'news_keywords', content: keywords.join(', ') });
  upsertMetaTag('meta[name="classification"]', { name: 'classification', content: pageLabel });
  upsertMetaTag('meta[name="category"]', { name: 'category', content: pageLabel });
  upsertMetaTag('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
  upsertMetaTag('meta[name="author"]', { name: 'author', content: SITE_NAME });
  upsertMetaTag('meta[name="application-name"]', { name: 'application-name', content: SITE_NAME });
  upsertMetaTag('meta[name="apple-mobile-web-app-title"]', { name: 'apple-mobile-web-app-title', content: SITE_NAME });
  upsertMetaTag('meta[name="theme-color"]', { name: 'theme-color', content: '#75f21a' });
  upsertMetaTag('meta[name="color-scheme"]', { name: 'color-scheme', content: 'light dark' });
  upsertMetaTag('meta[name="geo.region"]', { name: 'geo.region', content: 'ID-JB' });
  upsertMetaTag('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Tasikmalaya' });
  upsertMetaTag('meta[name="geo.position"]', { name: 'geo.position', content: `${BUSINESS_LATITUDE};${BUSINESS_LONGITUDE}` });
  upsertMetaTag('meta[name="ICBM"]', { name: 'ICBM', content: `${BUSINESS_LATITUDE}, ${BUSINESS_LONGITUDE}` });
  upsertMetaTag('meta[name="googlebot"]', { name: 'googlebot', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
  upsertMetaTag('meta[name="referrer"]', { name: 'referrer', content: 'strict-origin-when-cross-origin' });
  upsertMetaTag('meta[name="mobile-web-app-capable"]', { name: 'mobile-web-app-capable', content: 'yes' });
  upsertMetaTag('meta[property="og:title"]', { property: 'og:title', content: meta.title });
  upsertMetaTag('meta[property="og:description"]', { property: 'og:description', content: meta.description });
  upsertMetaTag('meta[property="og:type"]', { property: 'og:type', content: article ? 'article' : 'website' });
  upsertMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMetaTag('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
  upsertMetaTag('meta[property="og:locale"]', { property: 'og:locale', content: 'id_ID' });
  upsertMetaTag('meta[property="og:image:type"]', { property: 'og:image:type', content: 'image/jpeg' });
  upsertMetaTag('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
  upsertMetaTag('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
  upsertMetaTag('meta[property="og:image"]', { property: 'og:image', content: previewImage });
  upsertMetaTag('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: previewImage });
  upsertMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt', content: previewImageAlt });
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
  upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: previewImage });
  upsertMetaTag('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: previewImageAlt });
  upsertMetaTag('meta[name="twitter:site"]', { name: 'twitter:site', content: SITE_NAME });
  upsertMetaTag('meta[name="twitter:domain"]', { name: 'twitter:domain', content: 'bradwearindonesia.com' });
  upsertMetaTag('meta[name="format-detection"]', { name: 'format-detection', content: 'telephone=no,address=no,email=no' });
  upsertLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonical });
  upsertLinkTag('link[rel="alternate"][hreflang="id-ID"]', { rel: 'alternate', hreflang: 'id-ID', href: canonical });
  upsertLinkTag('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonical });
  upsertLinkTag('link[rel="sitemap"][type="application/xml"]', { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' });
  upsertLinkTag('link[rel="icon"][sizes="any"]', { rel: 'icon', href: '/favicon.ico', sizes: 'any' });
  upsertLinkTag('link[rel="icon"][sizes="48x48"]', { rel: 'icon', type: 'image/png', href: '/favicon-48x48.png', sizes: '48x48' });
  upsertLinkTag('link[rel="shortcut icon"]', { rel: 'shortcut icon', href: '/favicon-48x48.png' });
  upsertLinkTag('link[rel="apple-touch-icon"]', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' });

  if (article) {
    upsertMetaTag('meta[name="publish_date"]', { name: 'publish_date', content: articlePublishedAt });
    upsertMetaTag('meta[name="last-modified"]', { name: 'last-modified', content: articleModifiedAt });
    upsertMetaTag('meta[property="article:published_time"]', {
      property: 'article:published_time',
      content: articlePublishedAt,
    });
    upsertMetaTag('meta[property="article:modified_time"]', {
      property: 'article:modified_time',
      content: articleModifiedAt,
    });
    upsertMetaTag('meta[property="article:author"]', {
      property: 'article:author',
      content: article.author,
    });
  } else {
    removeHeadElement('meta[name="publish_date"]');
    removeHeadElement('meta[name="last-modified"]');
    removeHeadElement('meta[property="article:published_time"]');
    removeHeadElement('meta[property="article:modified_time"]');
    removeHeadElement('meta[property="article:author"]');
  }

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
