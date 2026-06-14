import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ASSETS } from '../assets';
import { useStore } from '../context/StoreContext';
import {
  ARTICLES,
  CONTACT_CHANNELS,
  COURIER_PROVIDERS,
  CUSTOMER_SERVICE_HOURS,
  HOW_TO_ORDER_STEPS,
  SITE_FAQS,
  STORE_ADDRESS,
  STORE_MAP_URL,
  buildConsultationMessage,
  buildTrackingUrl,
  buildWhatsAppUrl,
  getTrackingProviderById,
} from '../lib/siteConfig';
import { CompletedOrder, CourierProvider, Product, RouteKey } from '../types';
import BradAiChat from './BradAiChat';
import SiteFooter from './SiteFooter';

const CATEGORIES = ['Kemeja', 'Jaket', 'Celana', 'Rompi', 'Polo'] as const;
const ALL_MODELS = 'Semua Model';
const TIKTOK_URL = 'https://www.tiktok.com/@bradwearindonesia';
const TIKTOK_FEATURED_VIDEO_URL = 'https://www.tiktok.com/@bradwearindonesia/video/7635951960125869332';
const INSTAGRAM_URL = 'https://www.instagram.com/bradwear_indonesia/';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bradwear.app';

const getHoverImage = (product: { image: string; images?: { back?: string }; gallery?: string[] }) => {
  const candidates = [product.images?.back, ...(product.gallery ?? [])].filter(Boolean) as string[];
  return candidates.find((image) => image !== product.image) ?? product.image;
};

const ProductCardImage: React.FC<{ product: Product }> = ({ product }) => {
  const hoverImage = getHoverImage(product);
  const hasHoverImage = hoverImage !== product.image;

  return (
    <div className="product-card-media">
      <img
        src={product.image}
        alt={product.name}
        className={`product-card-image product-card-image-primary ${hasHoverImage ? 'has-hover' : ''}`}
      />
      {hasHoverImage ? (
        <img
          src={hoverImage}
          alt={`${product.name} alternate view`}
          className="product-card-image product-card-image-hover"
        />
      ) : null}
    </div>
  );
};

const ShippingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h3l3 3v2h-6z" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="17.5" cy="17.5" r="1.5" />
  </svg>
);

const WorkflowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h4v4H6zM14 14h4v4h-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 8h4m-2 0v4m0 0h4m-4 0H8" />
  </svg>
);

const WorkshopIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V9l8-5 8 5v11" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-5h6v5" />
  </svg>
);

const GoogleMapsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
    <path fill="#34A853" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" />
    <path fill="#FBBC04" d="M5.72 5.94A6.97 6.97 0 0 0 5 9c0 2.13 1.15 4.77 2.54 7.08L12 11.62 5.72 5.94Z" />
    <path fill="#EA4335" d="M12 2a7 7 0 0 0-6.28 3.94L12 11.62l3.71-3.71L18 5.6A6.98 6.98 0 0 0 12 2Z" />
    <path fill="#4285F4" d="M18 5.6 12 11.62l4.43 4.43C17.84 13.72 19 11.1 19 9c0-1.22-.31-2.38-1-3.4Z" />
    <circle cx="12" cy="9" r="2.4" fill="#fff" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="currentColor">
    <path d="M16.4 2c.34 1.88 1.46 3.38 3.38 4.08v3.15a7.2 7.2 0 0 1-3.44-.86v6.11c0 3.93-3.18 7.12-7.12 7.12S2.1 18.41 2.1 14.48 5.29 7.36 9.22 7.36c.43 0 .87.04 1.3.13v3.52a3.72 3.72 0 1 0 2.31 3.47V2h3.57Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.3" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
    <path fill="#34A853" d="M3.6 2.5c-.26.27-.42.67-.42 1.18v16.63c0 .51.16.91.42 1.18l9.42-9.49L3.6 2.5Z" />
    <path fill="#4285F4" d="M16.2 15.15 13 12l3.2-3.15 4.14 2.35c1 .57 1 .96 0 1.53l-4.14 2.42Z" />
    <path fill="#FBBC04" d="m16.2 15.15-3.18-3.15-9.42 9.49c.41.42 1.05.47 1.82.06l10.78-6.4Z" />
    <path fill="#EA4335" d="M16.2 8.85 5.42 2.46c-.77-.42-1.41-.36-1.82.06L13 12l3.2-3.15Z" />
  </svg>
);

const PublicSiteView: React.FC = () => {
  const {
    currentRoute,
    setCurrentRoute,
    products,
    handleSelectProduct,
    productionOrders,
    preferredCatalogCategory,
    setPreferredCatalogCategory,
  } = useStore();
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('Kemeja');
  const [activeModelFilter, setActiveModelFilter] = useState<string>(ALL_MODELS);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>(COURIER_PROVIDERS[0]);
  const [trackingReceipt, setTrackingReceipt] = useState('');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [trackingLookup, setTrackingLookup] = useState('');
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [openFaqSlug, setOpenFaqSlug] = useState<string | null>(SITE_FAQS[0]?.slug ?? null);
  const catalogRef = useRef<HTMLElement | null>(null);

  const heroSlides = useMemo(
    () => (ASSETS.BRAND.SLIDES?.length ? ASSETS.BRAND.SLIDES : [ASSETS.BRAND.HERO]).filter(Boolean),
    [],
  );
  const safeHeroSlides = heroSlides.length > 0 ? heroSlides : [ASSETS.KEMEJA.BRAD_V3.FRONT];

  useEffect(() => {
    if (safeHeroSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % safeHeroSlides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [safeHeroSlides]);

  useEffect(() => {
    if (currentRoute === RouteKey.PANTS) {
      setActiveCategory('Celana');
      setActiveModelFilter(ALL_MODELS);
      return;
    }

    setActiveCategory(preferredCatalogCategory);
    setActiveModelFilter(ALL_MODELS);
  }, [currentRoute, preferredCatalogCategory]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bradwear_order_history');
      if (saved) {
        setCompletedOrders(JSON.parse(saved));
      }
    } catch {
      setCompletedOrders([]);
    }
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => !product.isHidden), [products]);
  const categoryModelOptions = useMemo(() => {
    const names = visibleProducts.filter((product) => product.category === activeCategory).map((product) => product.name);
    return [ALL_MODELS, ...Array.from(new Set(names))];
  }, [visibleProducts, activeCategory]);
  const featured = useMemo(
    () =>
      visibleProducts.filter(
        (product) => product.category === activeCategory && (activeModelFilter === ALL_MODELS || product.name === activeModelFilter),
      ),
    [visibleProducts, activeCategory, activeModelFilter],
  );
  const pantsProducts = useMemo(
    () => visibleProducts.filter((product) => product.category === 'Celana'),
    [visibleProducts],
  );
  const topProducts = useMemo(
    () => [...visibleProducts].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
    [visibleProducts],
  );
  const spotlightProduct = featured[0] ?? visibleProducts[0] ?? null;
  const socialVideoCards = useMemo(
    () => [
      {
        title: 'Video unggulan',
        tag: 'Featured',
        duration: '00:31',
        poster: safeHeroSlides[0] ?? ASSETS.BRAND.HERO,
        href: TIKTOK_FEATURED_VIDEO_URL,
      },
      {
        title: 'Detail bordir',
        tag: 'Detail',
        duration: '00:18',
        poster: safeHeroSlides[1] ?? safeHeroSlides[0] ?? ASSETS.BRAND.HERO,
        href: TIKTOK_URL,
      },
      {
        title: 'Suasana workshop',
        tag: 'Workshop',
        duration: '00:24',
        poster: safeHeroSlides[2] ?? safeHeroSlides[0] ?? ASSETS.BRAND.HERO,
        href: TIKTOK_URL,
      },
    ],
    [safeHeroSlides],
  );

  const currentProductionOrder = useMemo(
    () =>
      productionOrders.find(
        (order) =>
          order.orderCode.toLowerCase() === trackingLookup.toLowerCase() ||
          order.resi?.toLowerCase() === trackingLookup.toLowerCase(),
      ) ?? null,
    [productionOrders, trackingLookup],
  );

  const completedProductionOrder = useMemo(
    () =>
      completedOrders.find(
        (order) =>
          order.code.toLowerCase() === trackingLookup.toLowerCase() ||
          order.resi.toLowerCase() === trackingLookup.toLowerCase(),
      ) ?? null,
    [completedOrders, trackingLookup],
  );

  const openCourierTracking = (event: FormEvent) => {
    event.preventDefault();
    const targetUrl = buildTrackingUrl(selectedCourier, trackingReceipt);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const lookupTracking = (event: FormEvent) => {
    event.preventDefault();
    setTrackingLookup(trackingCodeInput.trim());
  };

  const renderProductCard = (product: Product, badge?: string) => (
    <article
      key={product.id}
      className="group rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
    >
      <button type="button" onClick={() => handleSelectProduct(product)} className="w-full text-left">
        <div className="mb-4 aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--surface-soft)]">
          <ProductCardImage product={product} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{product.category}</p>
          {badge ? (
            <span className="rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
              {badge}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-lg font-black tracking-tight text-[var(--text-primary)]">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{product.soldCount.toLocaleString('id-ID')}+ order</span>
          <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Kustom
          </span>
        </div>
      </button>
    </article>
  );

  const heroBenefits = [
    {
      title: 'Pengiriman ke seluruh Indonesia',
      copy: 'Cocok untuk instansi, operasional lapangan, proyek, dan pengadaan tim dengan alur kirim yang rapi.',
      icon: <ShippingIcon />,
    },
    {
      title: 'Editor desain dan follow up yang singkat',
      copy: 'Ringkasan order dibuat lebih cepat dipahami supaya revisi, approval, dan konsultasi tidak berputar-putar.',
      icon: <WorkflowIcon />,
    },
    {
      title: 'Workshop aktif di Tasikmalaya',
      copy: 'Tim Bradwear menangani pengembangan sample, pengecekan detail, dan kontrol kualitas sebelum produksi jalan.',
      icon: <WorkshopIcon />,
    },
  ];

  const renderFaqAccordion = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {SITE_FAQS.map((faq) => {
        const isOpen = openFaqSlug === faq.slug;

        return (
          <article key={faq.slug} className="rounded-[24px] bg-[var(--surface-subtle)] p-2">
            <button
              type="button"
              onClick={() => setOpenFaqSlug(isOpen ? null : faq.slug)}
              className="flex w-full items-start justify-between gap-3 rounded-[18px] px-4 py-4 text-left transition hover:bg-[var(--surface-base)]"
            >
              <span className="text-base font-bold leading-relaxed text-[var(--text-primary)]">{faq.title}</span>
              <span className={`faq-chevron ${isOpen ? 'open' : ''}`}>+</span>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
              <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );

  const renderHome = () => (
    <>
      <section className="home-hero">
        <div className="hero-split">
          <article className="hero-panel">
            <p className="hero-kicker">Bradwear Indonesia · Tasikmalaya</p>
            <div className="hero-badge-row">
              <span className="hero-badge">Konveksi Seragam Custom</span>
              <span className="hero-badge">Mobile Friendly</span>
              <span className="hero-badge">Kirim Seluruh Indonesia</span>
            </div>
            <h1>
              Konveksi <span className="hero-highlight">seragam custom</span> untuk instansi yang butuh proses lebih cepat,
              lebih rapi, dan lebih mudah dipahami.
            </h1>
            <div className="hero-actions">
              <button
                type="button"
                onClick={() => {
                  setCurrentRoute(RouteKey.KATALOG);
                  window.setTimeout(() => {
                    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 120);
                }}
                className="hero-primary brand-cta"
              >
                Jelajahi Katalog
              </button>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage('seragam custom untuk instansi atau perusahaan'))}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary"
              >
                Konsultasi ke WhatsApp
              </a>
            </div>
            <div className="hero-micro-stats">
              <div>
                <strong>12 pcs</strong>
                <span>Minimal order per model</span>
              </div>
              <div>
                <strong>14-21 hari</strong>
                <span>Estimasi produksi normal</span>
              </div>
              <div>
                <strong>AI + CS</strong>
                <span>Jawaban cepat lalu follow up manusia</span>
              </div>
            </div>
          </article>

          <article className="hero-banner">
            <div className="hero-banner-stage">
              {safeHeroSlides.map((slide, index) => (
                <img
                  key={`${slide}-${index}`}
                  src={slide}
                  alt={`Bradwear banner ${index + 1}`}
                  className={`hero-banner-image ${index === activeHeroSlide ? 'is-active' : ''}`}
                />
              ))}
              <div className="hero-banner-overlay" />
            </div>

            <button
              type="button"
              onClick={() => setActiveHeroSlide((prev) => (prev - 1 + safeHeroSlides.length) % safeHeroSlides.length)}
              className="hero-arrow hero-arrow-left"
              aria-label="Banner sebelumnya"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => setActiveHeroSlide((prev) => (prev + 1) % safeHeroSlides.length)}
              className="hero-arrow hero-arrow-right"
              aria-label="Banner berikutnya"
            >
              &gt;
            </button>
          </article>
        </div>

        <div className="hero-benefits">
          {heroBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="group rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 animate-floating items-center justify-center rounded-2xl bg-[var(--brand-accent-soft)] text-[var(--brand-accent-strong)]">
                {benefit.icon}
              </div>
              <strong className="block text-base font-black text-[var(--text-primary)]">{benefit.title}</strong>
              <span className="mt-2 block text-sm leading-relaxed text-[var(--text-secondary)]">{benefit.copy}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <article className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Ringkas Tentang Bradwear</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Seragam custom yang dirancang supaya proses order lebih jelas dari pemilihan model sampai pengiriman
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Bradwear membantu instansi, perusahaan, dan komunitas memilih model, bahan, warna, dan detail identitas
              tanpa membuat alur approval terasa rumit. Fokusnya tetap pada hasil visual yang rapi, keputusan yang cepat,
              dan tindak lanjut yang mudah dipahami oleh tim Anda.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[RouteKey.CARA_ORDER, RouteKey.LAYANAN_PELANGGAN, RouteKey.LACAK_PESANAN].map((route) => (
                <button
                  key={route}
                  type="button"
                  onClick={() => setCurrentRoute(route)}
                  className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
                >
                  {route === RouteKey.CARA_ORDER ? 'Cara Order' : route === RouteKey.LAYANAN_PELANGGAN ? 'Layanan Pelanggan' : 'Lacak Pesanan'}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Alamat workshop</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight">Karisma Residence, Mangunreja, Tasikmalaya</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/85">{STORE_ADDRESS}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={STORE_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5"
              >
                <GoogleMapsIcon />
                Google Maps
              </a>
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.TEMUKAN_TOKO)}
                className="rounded-full border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
              >
                Detail Toko
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 pb-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          {topProducts.map((product, index) => renderProductCard(product, index === 0 ? 'Top Pick' : 'Best Seller'))}
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="overflow-hidden rounded-[30px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#09090b,#172554_48%,#111827)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/85">TikTok Bradwear</p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-white">Video workshop dan hasil jadi dalam format portrait</h3>
              </div>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="brand-cta inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white"
              >
                <TikTokIcon />
                Buka TikTok
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {socialVideoCards.map((video) => (
                <a
                  key={video.title}
                  href={video.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative isolate aspect-[9/16] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 p-4 text-left transition hover:-translate-y-1 hover:border-emerald-300/35"
                >
                  <img
                    src={video.poster}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.08),rgba(8,8,12,0.52)_42%,rgba(8,8,12,0.92))]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                        <TikTokIcon />
                        {video.tag}
                      </span>
                      <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                        {video.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-center py-6">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/14 shadow-[0_16px_36px_rgba(0,0,0,0.25)] backdrop-blur">
                        <span className="ml-0.5 h-0 w-0 border-y-[10px] border-y-transparent border-l-[15px] border-l-white" />
                      </span>
                    </div>

                    <div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                        <div className="h-full w-[56%] rounded-full bg-[linear-gradient(90deg,#7cff2b,#166534)]" />
                      </div>
                      <h4 className="mt-4 text-xl font-black tracking-tight text-white">{video.title}</h4>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/78">Bradwear Indonesia</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="rounded-[28px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff7fb,#ffffff)] p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f97316,#ec4899,#8b5cf6)] text-white shadow-[0_16px_32px_rgba(236,72,153,0.22)]">
                <InstagramIcon />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Instagram Bradwear</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-[var(--text-primary)]">Ikuti highlight produk, workshop, dan hasil jadi di Instagram</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Cocok untuk melihat update feed, detail hasil produksi, dan referensi visual seragam custom Bradwear Indonesia secara cepat.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[var(--brand-accent)]"
              >
                <InstagramIcon />
                Kunjungi Instagram
              </a>
            </article>

            <article className="rounded-[28px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#ecfccb,#ffffff_55%,#dcfce7)] p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_16px_32px_rgba(15,23,42,0.2)]">
                <GooglePlayIcon />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Aplikasi resmi Bradwear</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-[var(--text-primary)]">Download aplikasi Bradwear lewat Google Play</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Buka aplikasi resmi Bradwear untuk akses yang lebih cepat ke katalog, konsultasi, dan kebutuhan order seragam custom langsung dari perangkat Anda.
              </p>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noreferrer"
                className="brand-cta mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
              >
                <GooglePlayIcon />
                Download di Google Play
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 md:px-10">
        <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">FAQ Ringkas</p>
              <h3 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Informasi yang paling sering dicari</h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentRoute(RouteKey.LAYANAN_PELANGGAN)}
              className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]"
            >
              Ke layanan pelanggan
            </button>
          </div>
          {renderFaqAccordion()}
        </div>
      </section>
    </>
  );

  const renderCatalog = (catalogProducts: Product[], title: string, description: string, showCategoryTabs = true) => (
    <div className="px-6 py-8 md:px-10">
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="overflow-hidden rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff,#fee2e2)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--brand-accent-strong)]">Katalog Editorial</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="brand-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Lihat Semua Model
            </button>
            <a
              href={buildWhatsAppUrl(buildConsultationMessage('model seragam yang paling cocok untuk kebutuhan saya'))}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]"
            >
              Konsultasi model
            </a>
          </div>
        </article>

        {spotlightProduct ? (
          <article className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Spotlight Model</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-[0.8fr_1fr]">
              <div className="aspect-[4/5] overflow-hidden rounded-[26px] bg-[var(--surface-soft)]">
                <ProductCardImage product={spotlightProduct} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">{spotlightProduct.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{spotlightProduct.description}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{spotlightProduct.soldCount.toLocaleString('id-ID')}+ order</p>
                <button
                  type="button"
                  onClick={() => handleSelectProduct(spotlightProduct)}
                  className="mt-5 rounded-full bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
                >
                  Mulai desain model ini
                </button>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      {showCategoryTabs ? (
        <section ref={catalogRef} className="mt-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setPreferredCatalogCategory(category);
                  setActiveModelFilter(ALL_MODELS);
                  if (category === 'Celana') {
                    setCurrentRoute(RouteKey.PANTS);
                    return;
                  }
                  setCurrentRoute(RouteKey.KATALOG);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  activeCategory === category
                    ? 'brand-cta text-white'
                    : 'bg-[var(--surface-base)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryModelOptions.map((modelName) => (
              <button
                key={modelName}
                type="button"
                onClick={() => setActiveModelFilter(modelName)}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                  activeModelFilter === modelName
                    ? 'border-[var(--brand-accent)] bg-[var(--brand-accent-soft)] text-[var(--brand-accent-strong)]'
                    : 'border-[var(--border-soft)] bg-[var(--surface-base)] text-[var(--text-muted)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]'
                }`}
              >
                {modelName}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {catalogProducts.map((product, index) => renderProductCard(product, index < 2 ? 'Favorit' : undefined))}
      </section>
    </div>
  );

  const renderArticles = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--brand-accent-strong)]">Artikel Bradwear</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Panduan memilih bahan, model, dan proses order seragam</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Halaman artikel ini dibuat untuk membantu user dan mesin pencari memahami konteks layanan Bradwear Indonesia,
          mulai dari bahan seragam, tipe model, alur approval, sampai checklist sebelum produksi.
        </p>
      </section>

      <section className="mt-8 grid gap-6">
        {ARTICLES.map((article) => (
          <article key={article.slug} className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                {article.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{article.readTime}</span>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)]">{article.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {article.body.map((paragraph, index) => (
                <p key={`${article.slug}-${index}`} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );

  const renderHowToOrder = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#111827,#1e293b)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Cara Order</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Panduan visual yang dibuat agar user cepat paham sebelum order</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Halaman ini memakai komposisi sticky visual dan alur bertahap agar pengguna dapat mengikuti proses dari memilih
          model sampai follow up ke layanan pelanggan tanpa bingung.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <div className="overflow-hidden rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[ASSETS.KEMEJA.BRAD_V3.FRONT, ASSETS.CELANA.WARRIOR, ASSETS.JAKET.BOMBER].map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`overflow-hidden rounded-[24px] ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                >
                  <img
                    src={image}
                    alt={`Tutorial order Bradwear ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {HOW_TO_ORDER_STEPS.map((step, index) => (
            <article key={step.id} className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-accent)] text-sm font-black text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Tahap {index + 1}</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">{step.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{step.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCustomerService = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Layanan Pelanggan</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Bantuan cepat untuk konsultasi, revisi, dan follow up order</h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            Tim layanan pelanggan Bradwear membantu penjelasan model, bahan, estimasi, pengumpulan data ukuran,
            konfirmasi revisi, hingga update pengiriman.
          </p>
          <div className="mt-6 space-y-3">
            {CONTACT_CHANNELS.map((channel) => (
              <div key={channel.label} className="rounded-[22px] bg-[var(--surface-subtle)] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{channel.label}</p>
                <p className="mt-1 text-base font-bold text-[var(--text-primary)]">{channel.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{channel.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#eff6ff,#ffffff)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Jam Operasional</p>
          <div className="mt-4 space-y-3">
            {CUSTOMER_SERVICE_HOURS.map((hour) => (
              <div key={hour} className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                {hour}
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <a
              href={buildWhatsAppUrl(buildConsultationMessage('estimasi biaya, bahan, dan timeline produksi'))}
              target="_blank"
              rel="noreferrer"
                className="brand-cta rounded-full px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Konsultasi via WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setCurrentRoute(RouteKey.LACAK_PESANAN)}
              className="rounded-full border border-[var(--border-soft)] px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]"
            >
              Cek status order
            </button>
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">FAQ Layanan</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {SITE_FAQS.map((faq) => (
            <article key={faq.slug} className="rounded-[24px] bg-[var(--surface-subtle)] p-5">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{faq.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

  const renderTracking = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Lacak pesanan Bradwear</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Cek status produksi internal dengan order code atau nomor resi</h1>
          <form onSubmit={lookupTracking} className="mt-6 space-y-4">
            <input
              type="text"
              value={trackingCodeInput}
              onChange={(event) => setTrackingCodeInput(event.target.value)}
              placeholder="Masukkan order code atau nomor resi"
              className="w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-4 text-sm font-semibold text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:bg-[var(--surface-base)]"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Lihat status
            </button>
          </form>

          {trackingLookup ? (
            <div className="mt-6">
              {currentProductionOrder ? (
                <div className="rounded-[26px] bg-[var(--surface-subtle)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Order aktif #{currentProductionOrder.orderCode}</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{currentProductionOrder.productName}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Pelanggan: {currentProductionOrder.customerName} · Qty {currentProductionOrder.totalQty} pcs</p>
                  <div className="mt-5 space-y-3">
                    {currentProductionOrder.stages.map((stage) => (
                      <div key={stage.id} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-[var(--text-primary)]">{stage.label}</p>
                          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            stage.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : stage.status === 'current'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-500'
                          }`}>
                            {stage.status === 'completed' ? 'Selesai' : stage.status === 'current' ? 'Sedang dikerjakan' : 'Menunggu'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : completedProductionOrder ? (
                <div className="rounded-[26px] bg-[var(--surface-subtle)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Order selesai #{completedProductionOrder.code}</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{completedProductionOrder.productName}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Selesai pada {completedProductionOrder.completedAt}</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">Resi: {completedProductionOrder.resi}</p>
                  {completedProductionOrder.courier ? (
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Kurir: {completedProductionOrder.courier}</p>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-[26px] bg-[var(--surface-subtle)] p-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Data order belum ditemukan di penyimpanan lokal ini. Jika Anda sudah menerima resi, lanjutkan cek di kurir resmi di panel sebelah.
                </div>
              )}
            </div>
          ) : null}
        </article>

        <article className="rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#f8fafc,#ffffff)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Kurir resmi Indonesia</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">Lanjutkan tracking ke situs resmi ekspedisi</h2>
          <form onSubmit={openCourierTracking} className="mt-6 space-y-4">
            <select
              value={selectedCourier.id}
              onChange={(event) => setSelectedCourier(getTrackingProviderById(event.target.value))}
              className="w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-4 text-sm font-semibold text-[var(--text-primary)] outline-none"
            >
              {COURIER_PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={trackingReceipt}
              onChange={(event) => setTrackingReceipt(event.target.value)}
              placeholder="Masukkan nomor resi ekspedisi"
              className="w-full rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-4 text-sm font-semibold text-[var(--text-primary)] outline-none"
            />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{selectedCourier.helperText}</p>
            <button
              type="submit"
              className="brand-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Buka tracking resmi
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            {COURIER_PROVIDERS.map((provider) => (
              <a
                key={provider.id}
                href={provider.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
              >
                {provider.name}
              </a>
            ))}
          </div>
        </article>
      </section>
    </div>
  );

  const renderStoreLocator = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Temukan Toko</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Workshop dan titik konsultasi Bradwear Indonesia</h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            Lokasi ini menjadi titik konsultasi, pengembangan sample, dan koordinasi order Bradwear Indonesia untuk
            kebutuhan seragam custom di Tasikmalaya dan sekitarnya.
          </p>
          <div className="mt-6 rounded-[24px] bg-[var(--surface-subtle)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Alamat lengkap</p>
            <p className="mt-3 text-base font-bold leading-relaxed text-[var(--text-primary)]">{STORE_ADDRESS}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={STORE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="brand-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Buka di Google Maps
            </a>
            <a
              href={buildWhatsAppUrl(buildConsultationMessage('kunjungan atau konsultasi ke workshop Tasikmalaya'))}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]"
            >
              Konfirmasi via WhatsApp
            </a>
          </div>
        </article>

        <article className="rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#ecfeff,#ffffff)] p-6 shadow-sm">
          <div className="aspect-[4/4.4] overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface-base)]">
            <iframe
              title="Google Maps Bradwear Indonesia"
              src={`https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&z=15&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </article>
      </section>
    </div>
  );

  const renderBradAiPage = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="mb-6 rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#eef2ff,#ffffff)] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Brodi</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Asisten AI untuk pertanyaan seputar Bradwear</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Brodi dirancang agar jawaban tetap natural, informatif, dan fokus pada layanan, produk, bahan, cara order,
          tracking, lokasi toko, serta FAQ yang relevan dengan website ini.
        </p>
      </section>
      <BradAiChat variant="page" />
    </div>
  );

  const content = (() => {
    switch (currentRoute) {
      case RouteKey.KATALOG:
        return renderCatalog(
          featured,
          'Katalog seragam custom yang lebih mudah dipilih',
          'Tampilan katalog dibuat lebih editorial agar pengguna bisa fokus membandingkan model, fungsi, dan kesiapan untuk masuk ke editor desain.',
        );
      case RouteKey.PANTS:
        return renderCatalog(
          pantsProducts,
          'Pants dan celana tactical untuk kebutuhan kerja aktif',
          'Halaman ini fokus pada kategori celana agar user yang mencari pants tidak perlu bercampur dengan produk lain. Cocok untuk tim lapangan, operasional, dan kebutuhan kerja yang membutuhkan mobilitas tinggi.',
        );
      case RouteKey.ARTIKEL:
        return renderArticles();
      case RouteKey.CARA_ORDER:
        return renderHowToOrder();
      case RouteKey.LAYANAN_PELANGGAN:
        return renderCustomerService();
      case RouteKey.LACAK_PESANAN:
        return renderTracking();
      case RouteKey.TEMUKAN_TOKO:
        return renderStoreLocator();
      case RouteKey.BRAD_AI:
        return renderBradAiPage();
      case RouteKey.HOME:
      default:
        return renderHome();
    }
  })();

  return (
    <main className="overflow-y-auto pb-0">
      {content}
      <SiteFooter onNavigate={setCurrentRoute} />
    </main>
  );
};

export default PublicSiteView;



