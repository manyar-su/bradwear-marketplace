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

const PublicSiteView: React.FC = () => {
  const { currentRoute, setCurrentRoute, products, handleSelectProduct, productionOrders } = useStore();
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('Kemeja');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>(COURIER_PROVIDERS[0]);
  const [trackingReceipt, setTrackingReceipt] = useState('');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [trackingLookup, setTrackingLookup] = useState('');
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
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
  const featured = useMemo(
    () => visibleProducts.filter((product) => product.category === activeCategory),
    [visibleProducts, activeCategory],
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
            <p className="hero-lead">
              Bradwear Indonesia membantu tim perusahaan, komunitas, dan instansi memilih model, bahan, lalu masuk ke alur
              order yang jelas tanpa membuat tampilan terasa padat di mobile.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                onClick={() => {
                  setCurrentRoute(RouteKey.KATALOG);
                  window.setTimeout(() => {
                    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 120);
                }}
                className="hero-primary"
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
              <div className="hero-slide-caption">
                <p>Editorial Preview</p>
                <strong>Slide visual produk dipisahkan dari judul agar tampilan lebih clean.</strong>
              </div>
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
          <div>
            <strong>Pengiriman ke seluruh Indonesia.</strong>
            <span>Cocok untuk instansi, operasional lapangan, proyek, dan pengadaan tim.</span>
          </div>
          <div>
            <strong>Editor desain, ringkasan order, lalu follow up CS.</strong>
            <span>Alur digital dibuat singkat agar keputusan lebih cepat dan revisi lebih tertata.</span>
          </div>
          <div>
            <strong>Berbasis di Tasikmalaya, Jawa Barat.</strong>
            <span>Workshop Bradwear membantu pengembangan sample, approval, dan kontrol kualitas.</span>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <article className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Siap Untuk AI Search dan GEO</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Bradwear Indonesia hadir untuk kebutuhan seragam custom instansi dan perusahaan
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Kami membantu pelanggan memilih model, bahan, warna, dan detail identitas seragam agar proses approval lebih
              cepat. Kebutuhan umum meliputi kemeja dinas, rompi lapangan, jaket kerja, polo shirt, dan celana tactical.
              Pengiriman meliputi Jakarta, Bandung, Surabaya, Tasikmalaya, dan area lain di seluruh Indonesia.
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
                className="rounded-full bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-900"
              >
                Buka Google Maps
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ARTICLES.map((article) => (
            <button
              type="button"
              key={article.slug}
              onClick={() => setCurrentRoute(RouteKey.ARTIKEL)}
              className="rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">{article.category} · {article.readTime}</p>
              <h3 className="mt-3 text-lg font-black tracking-tight text-[var(--text-primary)]">{article.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
            </button>
          ))}
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
          <div className="grid gap-4 md:grid-cols-2">
            {SITE_FAQS.map((faq) => (
              <article key={faq.slug} className="rounded-[24px] bg-[var(--surface-subtle)] p-5">
                <h4 className="text-base font-bold text-[var(--text-primary)]">{faq.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{faq.answer}</p>
              </article>
            ))}
          </div>
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
              className="rounded-full bg-[var(--brand-accent)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
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
                  if (category === 'Celana') {
                    setCurrentRoute(RouteKey.PANTS);
                  }
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  activeCategory === category
                    ? 'bg-[var(--brand-accent)] text-white'
                    : 'bg-[var(--surface-base)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {category}
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
              className="rounded-full bg-[var(--brand-accent)] px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-white"
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
              className="rounded-full bg-[var(--brand-accent)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
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
              className="rounded-full bg-[var(--brand-accent)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
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
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Brad Ai</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Asisten AI yang menjawab seputar konteks website Bradwear</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Brad Ai dirancang agar jawaban tetap natural, informatif, dan fokus pada layanan, produk, bahan, cara order,
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
          false,
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
    <main className="overflow-y-auto pb-14">
      {content}
      <SiteFooter onNavigate={setCurrentRoute} />
    </main>
  );
};

export default PublicSiteView;



