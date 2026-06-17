import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ASSETS } from '../assets';
import clientSlide1 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.21 (1).jpeg';
import clientSlide2 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22 (1).jpeg';
import clientSlide3 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22 (2).jpeg';
import clientSlide4 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22.jpeg';
import clientSlide5 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.23.jpeg';
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
const TIKTOK_FEATURED_VIDEO_URL = 'https://www.tiktok.com/@bradwearindonesia/video/7633289301333134612';
const TIKTOK_FEATURED_EMBED_ID = '7633289301333134612';
const TIKTOK_DETAIL_VIDEO_URL = 'https://www.tiktok.com/@bradwearindonesia/video/7635951960125869332';
const TIKTOK_DETAIL_EMBED_ID = '7635951960125869332';
const TIKTOK_WORKSHOP_VIDEO_URL = 'https://www.tiktok.com/@bradwearindonesia/video/7650752558176210197';
const TIKTOK_WORKSHOP_EMBED_ID = '7650752558176210197';
const INSTAGRAM_URL = 'https://www.instagram.com/bradwear_indonesia/';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bradwear.app';
const CLIENT_GALLERY_SLIDES = [clientSlide1, clientSlide2, clientSlide3, clientSlide4, clientSlide5].filter(Boolean);
const SLIDESHOW_INTERVAL_MS = 5400;

const TESTIMONIALS = [
  {
    name: 'Rizky Pratama',
    institution: 'Dinas Operasional Lapangan',
    avatar: 'RP',
    comment: 'Bradwear bisa dipercaya untuk order seragam kantor. Kualitas jahitan bagus, bahan nyaman, dan hasilnya sesuai approval desain. Lain kali kami pesan lagi.',
  },
  {
    name: 'Maya Lestari',
    institution: 'Komunitas Kesehatan Indonesia',
    avatar: 'ML',
    comment: 'Timnya responsif, detail logo rapi, dan komunikasi order jelas dari awal. Kami puas dengan kualitas Bradwear dan akan repeat order untuk batch berikutnya.',
  },
  {
    name: 'Andi Setiawan',
    institution: 'PT Karya Mandiri Nusantara',
    avatar: 'AS',
    comment: 'Seragam custom dari Bradwear terlihat profesional. Ukuran, warna, dan finishing sesuai kebutuhan tim. Pelayanan membuat kami yakin untuk pesan lagi.',
  },
  {
    name: 'Nadia Safitri',
    institution: 'Event Organizer Bandung',
    avatar: 'NS',
    comment: 'Order sample dan produksi dibantu sampai jelas. Kualitas bagus, timeline transparan, dan hasil seragam membuat tim kami lebih percaya diri.',
  },
];

type LightboxSlide = {
  alt: string;
  src: string;
};

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

const SocialServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.5-4.35-6.5-10.07A3.93 3.93 0 0 1 9.44 7a4.55 4.55 0 0 1 2.56.87A4.55 4.55 0 0 1 14.56 7a3.93 3.93 0 0 1 3.94 3.93C18.5 16.65 12 21 12 21Z" />
  </svg>
);

const JusticeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M7 8h10M6 8l-2 4h4L6 8Zm12 0-2 4h4l-2-4ZM8 20h8" />
  </svg>
);

const MedicalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </svg>
);

const GovernmentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M6 10v7m4-7v7m4-7v7m4-7v7M3 20h18M12 4l8 4H4l8-4Z" />
  </svg>
);

const CLIENT_GALLERY_META: Record<string, { title: string; subtitle: string; gradient: string; icon: React.ReactNode }> = {
  dinsos: {
    title: 'Dinsos',
    subtitle: 'Dokumentasi seragam untuk kebutuhan layanan sosial dan aktivitas lapangan.',
    gradient: 'linear-gradient(135deg, #0f766e, #22c55e)',
    icon: <SocialServiceIcon />,
  },
  kejagung: {
    title: 'Kejagung',
    subtitle: 'Galeri hasil jadi dengan karakter formal, tegas, dan siap dipresentasikan.',
    gradient: 'linear-gradient(135deg, #7c2d12, #dc2626)',
    icon: <JusticeIcon />,
  },
  medis: {
    title: 'Medis',
    subtitle: 'Referensi visual seragam dengan nuansa bersih, ringan, dan profesional.',
    gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    icon: <MedicalIcon />,
  },
  pemkab: {
    title: 'Pemkab',
    subtitle: 'Portofolio seragam instansi pemerintah daerah untuk kebutuhan dinas dan operasional.',
    gradient: 'linear-gradient(135deg, #4338ca, #22c55e)',
    icon: <GovernmentIcon />,
  },
};

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
  const [activeMiddleSlide, setActiveMiddleSlide] = useState(0);
  const [activeClientSlide, setActiveClientSlide] = useState(0);
  const [lightboxSlide, setLightboxSlide] = useState<LightboxSlide | null>(null);
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
  const middleContentSlides = useMemo(
    () => (ASSETS.CONTENT.MIDDLE_SLIDES?.length ? ASSETS.CONTENT.MIDDLE_SLIDES : safeHeroSlides).filter(Boolean),
    [safeHeroSlides],
  );
  useEffect(() => {
    if (safeHeroSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % safeHeroSlides.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [safeHeroSlides]);

  useEffect(() => {
    if (middleContentSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveMiddleSlide((prev) => (prev + 1) % middleContentSlides.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [middleContentSlides]);

  useEffect(() => {
    if (CLIENT_GALLERY_SLIDES.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveClientSlide((prev) => (prev + 1) % CLIENT_GALLERY_SLIDES.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!lightboxSlide) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxSlide(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxSlide]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const parallaxNodes = Array.from(
      main.querySelectorAll<HTMLElement>('section > div, section > article, .hero-benefits > article'),
    ).filter(
      (node) =>
        node.offsetHeight > 80 &&
        !node.closest('.hero-banner-stage') &&
        !node.closest('.faq-answer') &&
        !node.closest('.parallax-static-zone'),
    );

    if (parallaxNodes.length === 0) return;

    parallaxNodes.forEach((node) => node.classList.add('scroll-parallax'));

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;

      parallaxNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = (center - viewportHeight * 0.52) / viewportHeight;
        const offset = Math.max(-14, Math.min(14, distance * -14));
        node.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);

        if (rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08) {
          node.classList.add('is-visible');
        }
      });
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    main.addEventListener('scroll', requestUpdate, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      main.removeEventListener('scroll', requestUpdate);
      parallaxNodes.forEach((node) => {
        node.classList.remove('scroll-parallax', 'is-visible');
        node.style.removeProperty('--parallax-offset');
      });
    };
  }, [currentRoute]);

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
  const kemejaProducts = useMemo(
    () => visibleProducts.filter((product) => product.category === 'Kemeja'),
    [visibleProducts],
  );
  const topProducts = useMemo(
    () => [...visibleProducts].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4),
    [visibleProducts],
  );
  const shirtSpotlightProduct = kemejaProducts[0] ?? featured.find((product) => product.category === 'Kemeja') ?? null;
  const spotlightProduct = featured[0] ?? visibleProducts[0] ?? null;
  const socialVideoCards = useMemo(
    () => [
      {
        title: 'Video unggulan',
        tag: 'Featured',
        duration: '00:31',
        poster: safeHeroSlides[0] ?? ASSETS.BRAND.HERO,
        href: TIKTOK_FEATURED_VIDEO_URL,
        embedId: TIKTOK_FEATURED_EMBED_ID,
      },
      {
        title: 'Detail bordir',
        tag: 'Detail',
        duration: '00:18',
        poster: safeHeroSlides[1] ?? safeHeroSlides[0] ?? ASSETS.BRAND.HERO,
        href: TIKTOK_DETAIL_VIDEO_URL,
        embedId: TIKTOK_DETAIL_EMBED_ID,
      },
      {
        title: 'Suasana workshop',
        tag: 'Workshop',
        duration: '00:24',
        poster: safeHeroSlides[2] ?? safeHeroSlides[0] ?? ASSETS.BRAND.HERO,
        href: TIKTOK_WORKSHOP_VIDEO_URL,
        embedId: TIKTOK_WORKSHOP_EMBED_ID,
      },
    ],
    [safeHeroSlides],
  );
  const clientGalleryGroups = useMemo(
    () => ASSETS.CLIENT_GALLERY.filter((group) => group.images.length > 0),
    [],
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
      className="group rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:rounded-[28px] sm:p-4"
    >
      <button type="button" onClick={() => handleSelectProduct(product)} className="w-full text-left">
        <div className="mb-3 aspect-[4/4.8] overflow-hidden rounded-[18px] bg-[var(--surface-soft)] sm:mb-4 sm:aspect-[4/5] sm:rounded-[24px]">
          <ProductCardImage product={product} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:text-[11px] sm:tracking-[0.18em]">{product.category}</p>
          {badge ? (
            <span className="rounded-full bg-[var(--brand-accent-soft)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent-strong)] sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
              {badge}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-base font-black tracking-tight text-[var(--text-primary)] sm:text-lg">{product.name}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:mt-2 sm:text-sm">{product.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
          <span className="text-xs font-semibold text-[var(--text-primary)] sm:text-sm">{product.soldCount.toLocaleString('id-ID')}+ order</span>
          <span className="rounded-full border border-[var(--border-soft)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
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
    <div className="grid gap-3 md:grid-cols-2">
      {SITE_FAQS.map((faq) => {
        const isOpen = openFaqSlug === faq.slug;

        return (
          <article key={faq.slug} className="faq-card bg-[var(--surface-subtle)] p-1.5">
            <button
              type="button"
              onClick={() => setOpenFaqSlug(isOpen ? null : faq.slug)}
              className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--surface-base)]"
            >
              <span className="text-sm font-bold leading-snug text-[var(--text-primary)]">{faq.title}</span>
              <span className={`faq-chevron ${isOpen ? 'open' : ''}`}>+</span>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
              <p className="px-4 pb-3 text-sm leading-relaxed text-[var(--text-secondary)]">{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );

  const renderWorkshopHighlight = () => (
    <article className="rounded-[30px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Alamat workshop</p>
      <h3 className="mt-3 text-2xl font-black tracking-tight">Karisma Residence, Mangunreja, Tasikmalaya</h3>
      <p className="mt-4 text-sm leading-relaxed text-white/85">{STORE_ADDRESS}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={STORE_MAP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Google Maps Bradwear Indonesia"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3 sm:text-xs sm:font-bold sm:uppercase sm:tracking-[0.14em]"
        >
          <GoogleMapsIcon />
          <span className="hidden sm:inline">Google Maps</span>
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
              Konveksi <span className="hero-highlight">seragam custom</span> untuk instansi, perusahaan, dan tim
              seragam team yang membutuhkan seragam kustom, rapi, dan cepat.
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
                <strong>Sample</strong>
                <span>Bisa satuan untuk approval model</span>
              </div>
              <div>
                <strong>14-21 hari</strong>
                <span>Estimasi produksi normal</span>
              </div>
              <div>
                <strong>AI + CS</strong>
                <span>Cs berbasis Ai untuk melayani anda 24/7 atau CS staff yang aktif.</span>
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

        <div className="mt-4">{renderWorkshopHighlight()}</div>

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
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[30px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#f7fbee,#ffffff)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--brand-accent-strong)]">Custom Desain Bradwear</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Mulai desain kemeja custom lalu lanjutkan pemesanan tanpa alur yang berputar
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              Pilih model kemeja yang paling dekat dengan kebutuhan instansi Anda, masuk ke editor desain, lalu lanjutkan
              konsultasi atau pemesanan saat konsep sudah siap.
            </p>
            {shirtSpotlightProduct ? (
              <div className="mt-5 rounded-[24px] bg-[var(--surface-base)] p-4 shadow-[inset_0_0_0_1px_var(--border-soft)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Model kemeja unggulan</p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{shirtSpotlightProduct.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{shirtSpotlightProduct.description}</p>
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (shirtSpotlightProduct) {
                    handleSelectProduct(shirtSpotlightProduct);
                    return;
                  }
                  setCurrentRoute(RouteKey.KATALOG);
                }}
                className="brand-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
              >
                Custom Desain
              </button>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage('pesan kemeja custom untuk instansi atau perusahaan'))}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
              >
                Pesan Sekarang
              </a>
            </div>
          </article>

          <article className="middle-showcase-shell border border-[var(--border-soft)] bg-[var(--surface-base)] shadow-[0_26px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between gap-3 px-5 pt-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Our Client</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-[var(--text-primary)]">Galeri hasil jadi client Bradwear</h3>
              </div>
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.CLIENT)}
                className="rounded-full border border-[var(--border-soft)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
              >
                Client
              </button>
            </div>

            <article className="hero-banner middle-showcase-banner mt-4">
              <div className="hero-banner-stage middle-showcase-stage client-gallery-stage client-fullscreen-stage">
                {CLIENT_GALLERY_SLIDES.map((slide, index) => (
                  <img
                    key={`${slide}-${index}`}
                    src={slide}
                    alt={`Our client Bradwear ${index + 1}`}
                    className={`hero-banner-image ${index === activeClientSlide ? 'is-active' : ''}`}
                  />
                ))}
                <div className="hero-banner-overlay middle-showcase-overlay" />
                <button
                  type="button"
                  onClick={() =>
                    setLightboxSlide({
                      src: CLIENT_GALLERY_SLIDES[activeClientSlide],
                      alt: `Our client Bradwear ${activeClientSlide + 1}`,
                    })
                  }
                  className="slideshow-lightbox-trigger"
                  aria-label="Buka gambar client penuh"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveClientSlide((prev) => (prev - 1 + CLIENT_GALLERY_SLIDES.length) % CLIENT_GALLERY_SLIDES.length)}
                className="hero-arrow hero-arrow-left"
                aria-label="Slide client sebelumnya"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => setActiveClientSlide((prev) => (prev + 1) % CLIENT_GALLERY_SLIDES.length)}
                className="hero-arrow hero-arrow-right"
                aria-label="Slide client berikutnya"
              >
                &gt;
              </button>
            </article>
          </article>
        </div>
      </section>

      <section className="px-6 pb-6 md:px-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {topProducts.map((product, index) => renderProductCard(product, index === 0 ? 'Top Pick' : 'Best Seller'))}
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="overflow-hidden rounded-[30px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#09090b,#172554_48%,#111827)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/85">TikTok Bradwear</p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-white">Lihat referensi workshop dan hasil produksi dalam format portrait</h3>
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
              {socialVideoCards.map((video) =>
                video.embedId ? (
                  <article
                    key={video.title}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_18px_42px_rgba(0,0,0,0.25)]"
                  >
                    <iframe
                      src={`https://www.tiktok.com/player/v1/${video.embedId}?controls=1&progress_bar=1&play_button=1&volume_control=1&description=0&music_info=0`}
                      title={`${video.title} TikTok`}
                      allow="fullscreen"
                      className="aspect-[9/16] w-full border-0 bg-slate-950"
                    />
                    <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">{video.tag}</p>
                        <h4 className="mt-1 text-base font-black tracking-tight">{video.title}</h4>
                      </div>
                      <a
                        href={video.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/12 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/78 transition hover:border-emerald-300/40 hover:text-white"
                      >
                        Buka
                      </a>
                    </div>
                  </article>
                ) : (
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
                ),
              )}
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

      <section className="px-6 pb-8 md:px-10">
        <div className="border border-[var(--border-soft)] bg-[var(--surface-base)] p-4 shadow-sm md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">FAQ Ringkas</p>
              <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">Informasi yang paling sering dicari</h3>
            </div>
            <button
              type="button"
              onClick={() => setCurrentRoute(RouteKey.LAYANAN_PELANGGAN)}
              className="border border-[var(--border-soft)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
            >
              Ke layanan pelanggan
            </button>
          </div>
          {renderFaqAccordion()}
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="middle-showcase-shell border border-[var(--border-soft)] bg-[var(--surface-base)] shadow-[0_26px_60px_rgba(15,23,42,0.12)]">
          <article className="hero-banner middle-showcase-banner">
            <div className="hero-banner-stage middle-showcase-stage">
              {middleContentSlides.map((slide, index) => (
                <img
                  key={`${slide}-${index}`}
                  src={slide}
                  alt={`Bradwear middle content ${index + 1}`}
                  className={`hero-banner-image ${index === activeMiddleSlide ? 'is-active' : ''}`}
                />
              ))}
              <div className="hero-banner-overlay middle-showcase-overlay" />
              <button
                type="button"
                onClick={() =>
                  setLightboxSlide({
                    src: middleContentSlides[activeMiddleSlide],
                    alt: `Bradwear middle content ${activeMiddleSlide + 1}`,
                  })
                }
                className="slideshow-lightbox-trigger"
                aria-label="Buka gambar slideshow penuh"
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveMiddleSlide((prev) => (prev - 1 + middleContentSlides.length) % middleContentSlides.length)}
              className="hero-arrow hero-arrow-left"
              aria-label="Slide middle content sebelumnya"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => setActiveMiddleSlide((prev) => (prev + 1) % middleContentSlides.length)}
              className="hero-arrow hero-arrow-right"
              aria-label="Slide middle content berikutnya"
            >
              &gt;
            </button>
          </article>
        </div>
      </section>

      <section className="px-6 pb-12 md:px-10">
        <div className="testimonial-marquee-shell border border-[var(--border-soft)] bg-[var(--surface-base)] py-5 shadow-sm">
          <div className="mb-4 px-4 md:px-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">Testimonial client</p>
            <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">Kepercayaan terhadap kualitas Bradwear</h3>
          </div>
          <div className="testimonial-marquee" aria-label="Testimonial client Bradwear">
            <div className="testimonial-track">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                <article key={`${item.name}-${index}`} className="testimonial-card">
                  <div className="flex items-center gap-3">
                    <div className="testimonial-avatar">{item.avatar}</div>
                    <div>
                      <h4 className="text-sm font-black text-[var(--text-primary)]">{item.name}</h4>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{item.institution}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-black tracking-[0.14em] text-amber-500" aria-label="Rating 5 dari 5">
                    ★★★★★
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightboxSlide ? (
        <div
          className="slideshow-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Preview gambar penuh"
          onClick={() => setLightboxSlide(null)}
        >
          <div className="slideshow-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightboxSlide(null)}
              className="slideshow-lightbox-close"
              aria-label="Close image preview"
            >
              Close
            </button>
            <img src={lightboxSlide.src} alt={lightboxSlide.alt} className="slideshow-lightbox-image" />
          </div>
        </div>
      ) : null}
    </>
  );

  const renderCatalog = (catalogProducts: Product[], title: string, description: string, showCategoryTabs = true) => (
    <div className="px-6 py-8 md:px-10">
      {ASSETS.CONTENT.SIZE_GUIDE ? (
        <section className="mb-6 overflow-hidden rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#ffffff,#eef6ff)] p-4 shadow-sm md:p-5">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">Size Guide</p>
          <div className="mt-3 overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-base)]">
            <img
              src={ASSETS.CONTENT.SIZE_GUIDE}
              alt="Bradwear size guide"
              className="h-auto w-full object-cover"
            />
          </div>
        </section>
      ) : null}

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
        <h1 className="mt-3 text-4xl font-black tracking-tight">Panduan pemesanan yang dibuat agar proses konsultasi dan produksi mudah diikuti</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Halaman ini merangkum alur dari pemilihan model, penyesuaian desain, hingga konfirmasi data pesanan secara
          bertahap agar kebutuhan tim Anda dapat diproses lebih jelas.
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
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Workshop dan titik lokasi Bradwear Indonesia</h1>
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

  const renderClientGallery = () => (
    <div className="px-6 py-8 md:px-10">
      <section className="rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#081006,#102b14_48%,#183153)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Client Gallery</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Dokumentasi visual hasil produksi dari folder client Bradwear</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Halaman ini menampilkan galeri per folder client agar hasil jadi lebih mudah dipresentasikan. Setiap blok memakai identitas visual yang disesuaikan dengan nama folder sumber asetnya.
        </p>
      </section>

      <section className="parallax-static-zone mt-8 grid gap-6">
        {clientGalleryGroups.map((group) => {
          const meta = CLIENT_GALLERY_META[group.slug] ?? {
            title: group.name,
            subtitle: 'Dokumentasi hasil jadi client Bradwear Indonesia.',
            gradient: 'linear-gradient(135deg,#166534,#1d4ed8)',
            icon: <GovernmentIcon />,
          };
          const [featuredImage, ...otherImages] = group.images;

          return (
            <article key={group.slug} className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-[22px] text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]"
                    style={{ background: meta.gradient }}
                  >
                    {meta.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Folder {group.slug}</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-primary)]">{meta.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">{meta.subtitle}</p>
                  </div>
                </div>
                <div className="rounded-full bg-[var(--surface-subtle)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {group.images.length} gambar
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                {featuredImage ? (
                  <div className="overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]">
                    <img
                      src={featuredImage}
                      alt={`${meta.title} featured`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                    />
                  </div>
                ) : null}

                <div className={`grid gap-4 ${otherImages.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {(otherImages.length > 0 ? otherImages : featuredImage ? [featuredImage] : []).map((image, index) => (
                    <div key={`${group.slug}-${index}-${image}`} className="overflow-hidden rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]">
                      <img
                        src={image}
                        alt={`${meta.title} gallery ${index + 1}`}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );

  const renderBradAiPage = () => (
    <div className="brodi-page-shell px-6 py-8 md:px-10">
      <div className="brodi-page-content">
        <section className="brodi-hero-shell mb-6 rounded-[32px] border border-[var(--border-soft)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Brodi</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Asisten AI untuk konsultasi awal seputar layanan Bradwear</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Brodi dirancang agar jawaban tetap natural, informatif, dan fokus pada layanan, produk, bahan, cara order,
            tracking, lokasi toko, serta FAQ yang relevan dengan website ini.
          </p>
        </section>
        <BradAiChat variant="page" />
      </div>
    </div>
  );

  const content = (() => {
    switch (currentRoute) {
      case RouteKey.KATALOG:
        return renderCatalog(
          featured,
          'Katalog seragam custom yang lebih mudah dipilih',
          'Tampilan katalog disusun lebih terarah agar pengunjung mudah membandingkan model, fungsi, dan kesiapan desain sebelum masuk ke editor.',
        );
      case RouteKey.CLIENT:
        return renderClientGallery();
      case RouteKey.PANTS:
        return renderCatalog(
          pantsProducts,
          'Pants dan celana tactical untuk kebutuhan kerja aktif',
          'Halaman ini difokuskan pada kategori celana agar proses pemilihan model lebih ringkas. Cocok untuk tim lapangan, operasional, dan kebutuhan kerja dengan mobilitas tinggi.',
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
