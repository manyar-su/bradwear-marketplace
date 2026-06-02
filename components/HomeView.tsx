import React, { useMemo, useRef, useState } from 'react';
import { Category } from '../types';
import { CLIENT_LOGOS, FAQS, TESTIMONIALS } from '../constants';
import { ASSETS } from '../assets';
import { useStore } from '../context/StoreContext';

const CATEGORIES: Category[] = ['Kemeja', 'Jaket', 'Celana', 'Rompi', 'Polo'];

const HomeView: React.FC = () => {
  const { products, handleSelectProduct: onSelectProduct } = useStore();
  const [activeCategory, setActiveCategory] = useState<Category>('Kemeja');
  const [openFaq, setOpenFaq] = useState<number>(0);
  const catalogRef = useRef<HTMLElement | null>(null);

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
      <section className="px-6 pb-8 pt-8 md:px-10">
        <div className="grid gap-6 rounded-[28px] border border-[var(--border-soft)] bg-gradient-to-br from-white to-[var(--surface-subtle)] p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Bradwear Official Studio</p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl">
              Bangun Seragam Instansi dengan Workflow Web yang Lebih Cepat
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              Katalog, kustomisasi, dan ringkasan pesanan sekarang disajikan dalam pengalaman web-first yang ringan,
              responsif, dan mudah dipakai dari desktop maupun mobile browser.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="rounded-full bg-[var(--brand-accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:brightness-110"
              >
                Lihat Katalog
              </button>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--border-soft)] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)]"
              >
                Konsultasi CS
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-white shadow-sm">
            <img src={ASSETS.BRAND.HERO} alt="Bradwear Hero" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
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
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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
            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Pilih Model yang Ingin Dikustom</h3>
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
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
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

      <section className="px-6 pb-8 md:px-10">
        <div className="rounded-[28px] border border-[var(--border-soft)] bg-white p-6 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Dipercaya Instansi</p>
          <div className="marquee-track">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, index) => (
              <div key={`${client.name}-${index}`} className="marquee-item">
                <img src={client.logo} alt={client.name} className="h-8 w-8 object-contain" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Lead Time Transparan', desc: 'Estimasi produksi 14-21 hari kerja dengan update tahap berkala.' },
            { title: 'MOQ Fleksibel', desc: 'Mulai dari 12 pcs per model untuk produksi kustom instansi.' },
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
            Pilih model dari katalog, atur spesifikasi seragam, lalu lanjutkan proses ringkasan order langsung dari browser.
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
                <img src={testimonial.avatar} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" />
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
