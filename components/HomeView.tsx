import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Category } from '../types';
import { CLIENT_LOGOS, FAQS, TESTIMONIALS } from '../constants';
import { ASSETS } from '../assets';
import { useStore } from '../context/StoreContext';

const CATEGORIES: Category[] = ['Kemeja', 'Jaket', 'Celana', 'Rompi', 'Polo'];

const getHoverImage = (product: { image: string; images?: { back?: string }; gallery?: string[] }) => {
  const candidates = [product.images?.back, ...(product.gallery ?? [])].filter(Boolean) as string[];
  return candidates.find((image) => image !== product.image) ?? product.image;
};

const ProductCardImage: React.FC<{ product: { image: string; name: string; images?: { back?: string }; gallery?: string[] } }> = ({ product }) => {
  const hoverImage = getHoverImage(product);
  const hasHoverImage = hoverImage !== product.image;

  return (
    <div className="product-card-media">
      <img
        src={product.image}
        alt={product.name}
        className={`product-card-image product-card-image-primary ${hasHoverImage ? 'has-hover' : ''}`}
        loading="lazy"
        decoding="async"
      />
      {hasHoverImage ? (
        <img
          src={hoverImage}
          alt={`${product.name} alternate view`}
          className="product-card-image product-card-image-hover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </div>
  );
};

const HomeView: React.FC = () => {
  const { products, handleSelectProduct: onSelectProduct } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category>('Kemeja');
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
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
  const activeHeroImage = safeHeroSlides[activeHeroSlide] ?? safeHeroSlides[0];

  const featured = useMemo(
    () => products.filter((p) => p.category === activeCategory && !p.isHidden),
    [products, activeCategory],
  );

  const topProducts = useMemo(
    () => [...products].filter((p) => !p.isHidden).sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
    [products],
  );

  return (
    <div className="overflow-y-auto pb-16">
      <section className="home-hero">
        <article className="hero-banner">
          <div className="hero-banner-stage">
            <img
              key={activeHeroImage}
              src={activeHeroImage}
              alt={`Bradwear banner ${activeHeroSlide + 1}`}
              className="hero-banner-image is-active"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-banner-overlay" />
            <div className="hero-copy">
              <p className="hero-kicker">Bradwear Indonesia Official</p>
              <h2>Pembuatan Seragam dinas tactical dan formal</h2>
              <p>Pilih model terbaik, kustom desain, lalu lanjutkan ringkasan order.</p>
              <div className="hero-actions">
                <button
                  type="button"
                  onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="hero-primary"
                >
                  Lihat Katalog
                </button>
                <a href="https://wa.me/" target="_blank" rel="noreferrer" className="hero-secondary">
                  Konsultasi CS
                </a>
              </div>
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
          <ul className="hero-dots" aria-label="Slide indicator">
            {safeHeroSlides.map((slide, index) => (
              <li key={`${slide}-dot-${index}`}>
                <button
                  type="button"
                  onClick={() => setActiveHeroSlide(index)}
                  className={`hero-dot ${index === activeHeroSlide ? 'is-active' : ''}`}
                  aria-label={`Tampilkan banner ${index + 1}`}
                />
              </li>
            ))}
          </ul>
        </article>

        <div className="hero-benefits">
          <div>
            <strong>Tidak ada pesanan minimum khusus sampel.</strong>
            <span>Konsultasi desain kemeja sesuai kebutuhan anda.</span>
          </div>
          <div>
            <strong>Desain sekarang, produksi bisa lebih cepat.</strong>
            <span>Semua fitur tersedia untuk memudahkan anda dalam pemesanan.</span>
          </div>
          <div>
            <strong>Pengiriman seluruh Indonesia.</strong>
            <span>Cocok untuk keperluan pembuatan seragam dinas, instansi dan team anda.</span>
          </div>
        </div>
      </section>

      <section className="px-6 pb-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          {topProducts.map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group rounded-3xl border border-[var(--border-soft)] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--surface-soft)]">
                <ProductCardImage product={product} />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Best Seller</p>
              <h3 className="mt-1 text-base font-bold text-[var(--text-primary)]">{product.name}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{product.soldCount.toLocaleString('id-ID')}+ terjual</p>
            </button>
          ))}
        </div>
      </section>

      <section ref={catalogRef} className="px-6 pb-8 md:px-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Katalog Produk</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Pilih Model yang Ingin Dipesan</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  activeCategory === category
                    ? 'bg-[var(--brand-accent)] text-white'
                    : 'bg-white text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <article
              key={product.id}
              className="group rounded-3xl border border-[var(--border-soft)] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <button type="button" onClick={() => onSelectProduct(product)} className="w-full text-left">
                <div className="mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--surface-soft)]">
                  <ProductCardImage product={product} />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{product.category}</p>
                <h4 className="mt-1 text-base font-bold text-[var(--text-primary)]">{product.name}</h4>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{product.soldCount.toLocaleString('id-ID')}+ Order</span>
                  <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Kustom
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <div className="content-wrap">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Dipercaya Instansi</p>
          <div className="marquee-mask">
            <div className="marquee-track">
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, index) => (
                <div key={`${client.name}-${index}`} className="marquee-item">
                  <div className="partner-logo-frame">
                    <img src={client.logo} alt={client.name} loading="lazy" decoding="async" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Lead Time Transparan', desc: 'Estimasi produksi 14-21 hari kerja dengan update tahap berkala.' },
            { title: 'MOQ Fleksibel', desc: 'Tanpa minimal produksi bisa satuan untuk kebutuhan Sample.' },
            { title: 'QC Berlapis', desc: 'Cutting, sewing, dan finishing melewati quality control berstandar industri.' },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-[var(--border-soft)] bg-white p-6 shadow-sm">
              <h4 className="text-lg font-bold text-[var(--text-primary)]">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="rounded-[28px] border border-[var(--border-soft)] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Frequently Asked Questions</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Pertanyaan yang Paling Sering Ditanyakan</h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, index) => {
              const opened = openFaq === index;
              return (
                <article key={item.slug} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-subtle)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq((prev) => (prev === index ? -1 : index))}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{item.category}</p>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] md:text-base">{item.q}</h4>
                    </div>
                    <span className={`faq-chevron ${opened ? 'open' : ''}`}>+</span>
                  </button>
                  <div className={`faq-answer ${opened ? 'open' : ''}`}>
                    <p className="px-5 pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-soft)] bg-white px-5 py-4">
            <p className="text-sm text-[var(--text-secondary)]">Masih ada pertanyaan lain soal kain, revisi desain, atau proses produksi?</p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[var(--brand-accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:brightness-110"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 md:px-10">
        <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-8 text-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-4xl">Siap Masuk Tahap Kustomisasi?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            Pilih model dari katalog, sesuaikan desain seragam, lalu lanjutkan proses ringkasan order langsung dari browser.
          </p>
          {featured[0] && (
            <button
              type="button"
              onClick={() => onSelectProduct(featured[0])}
              className="mt-6 rounded-full bg-[var(--brand-accent)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110"
            >
              Mulai Desain Sekarang
            </button>
          )}
        </div>
      </section>

      <section className="px-6 pb-12 md:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {TESTIMONIALS.slice(0, 5).map((testimonial) => (
            <article key={testimonial.name} className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{testimonial.name}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{testimonial.agency}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">"{testimonial.text}"</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
