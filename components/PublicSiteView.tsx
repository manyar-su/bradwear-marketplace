import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ASSETS } from '../assets';
import heroTopImage from '../assets/Hero/atas.webp';
import clientSlide1 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.21 (1).jpeg';
import clientSlide2 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22 (1).jpeg';
import clientSlide3 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22.jpeg';
import { useStore } from '../context/StoreContext';
import {
  ARTICLES,
  CONTACT_CHANNELS,
  COURIER_PROVIDERS,
  CUSTOMER_SERVICE_HOURS,
  GOOGLE_PLAY_URL,
  HOW_TO_ORDER_STEPS,
  ROUTE_PATHS,
  SITE_FAQS,
  SITE_NAME,
  STORE_ADDRESS,
  STORE_MAP_URL,
  getArticleBySlug,
  getArticlePath,
  getArticleSlugFromPathname,
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
const CLIENT_GALLERY_SLIDES = [clientSlide1, clientSlide2, clientSlide3].filter(Boolean);
const SLIDESHOW_INTERVAL_MS = 5000;
const INSTAGRAM_URL = 'https://www.instagram.com/bradwear_indonesia/';
const TIKTOK_URL = 'https://www.tiktok.com/@bradwearindonesia';
const CATEGORY_COPY: Record<(typeof CATEGORIES)[number], { useCase: string; focus: string }> = {
  Kemeja: {
    useCase: 'PDH, seragam dinas, komunitas, dan kemeja kerja custom.',
    focus: 'Fokus pada approval visual, identitas bordir, dan kebutuhan formal harian.',
  },
  Jaket: {
    useCase: 'Outer tim, safety ringan, dan kebutuhan branding lapangan.',
    focus: 'Cocok untuk tim operasional yang perlu layering dan perlindungan tambahan.',
  },
  Celana: {
    useCase: 'Celana tactical, kerja aktif, dan mobilitas lapangan.',
    focus: 'Masuk ke halaman pants untuk membandingkan model khusus kategori celana.',
  },
  Rompi: {
    useCase: 'Survey lapangan, dokumentasi, dan identitas tim lapangan.',
    focus: 'Memudahkan pembagian fungsi tim lewat desain ringan dan banyak kompartemen.',
  },
  Polo: {
    useCase: 'Event, promosi, gathering, dan seragam semi-formal.',
    focus: 'Pilihan ringkas ketika tim membutuhkan tampilan santai namun tetap branded.',
  },
};
const DOWNLOAD_HIGHLIGHTS = [
  {
    title: 'Akses cepat katalog',
    body: 'Masuk ke model kemeja, jaket, rompi, polo, dan pants tanpa berpindah alur terlalu jauh.',
  },
  {
    title: 'Lanjut konsultasi lebih cepat',
    body: 'Setelah memilih model, user bisa langsung melanjutkan ke customer service atau Brodi dari perangkat Android.',
  },
  {
    title: 'Ruang untuk update Play Store',
    body: 'Halaman ini disiapkan sebagai landing page download saat listing Play Store Bradwear diperbarui.',
  },
];

// Sumber copy untuk seluruh halaman profil publik.
const BRAND_PROFILE_ITEMS = [
  {
    route: RouteKey.ABOUT,
    kicker: 'Tentang Kami',
    title: 'CV. ASTHAJAYA BRADERINDO adalah konveksi resmi penyedia seragam dinas di Indonesia.',
    body:
      'CV. ASTHAJAYA BRADERINDO adalah konveksi resmi penyedia seragam dinas di Indonesia, beroperasi di bawah merek Bradwear yang terdaftar di DJKI KEMENKUMHAM. Perusahaan ini berkomitmen kuat dalam menyajikan produk berkualitas tinggi dan melayani berbagai kebutuhan seragam dinas untuk instansi pemerintah, perusahaan swasta, sekolah, dan organisasi lainnya.',
    points: ['Beroperasi di bawah merek Bradwear yang terdaftar di DJKI KEMENKUMHAM', 'Fokus pada kualitas tinggi untuk seragam dinas dan kerja custom', 'Melayani instansi pemerintah, perusahaan, sekolah, dan organisasi'],
    emphasis: 'Bradwear hadir sebagai wajah layanan seragam dinas yang rapi, jelas, dan siap dipresentasikan sejak tahap konsultasi awal.',
  },
  {
    route: RouteKey.VISION_MISSION,
    kicker: 'Visi & Misi',
    title: 'Membangun proses order yang rapi, hasil yang presisi, dan hubungan kerja jangka panjang.',
    body:
      'Arah kerja Bradwear adalah menjaga kualitas jahit, ketepatan produksi, dan komunikasi yang mudah dipahami agar keputusan internal klien lebih cepat.',
    points: ['Menjaga kualitas bahan dan finishing', 'Memberi layanan profesional dan tepat waktu', 'Terus menyempurnakan desain, produksi, dan kontrol detail'],
    emphasis: 'Halaman ini menekankan standar kerja dan orientasi layanan, bukan sekadar profil perusahaan.',
  },
  {
    route: RouteKey.PRODUCTS_SERVICES,
    kicker: 'Produk & Jasa',
    title: 'Kategori dibuat untuk memudahkan pemilihan model sesuai fungsi lapangan atau kebutuhan formal.',
    body:
      'Pilihan utama meliputi kemeja dinas, jaket, rompi, polo, celana tactical, serta layanan custom desain dengan penyesuaian bordir dan identitas personel.',
    points: ['Seragam dinas pemerintahan dan operasional', 'Seragam perusahaan, komunitas, dan sekolah', 'Bordir logo, nama personel, dan detail custom'],
    emphasis: 'Fokus utama halaman ini adalah memperjelas cakupan produk serta layanan custom yang benar-benar dikerjakan Bradwear.',
  },
  {
    route: RouteKey.COMPETITIVE_ADVANTAGE,
    kicker: 'Keunggulan',
    title: 'Nilai utama Bradwear ada pada bahan yang tepat, jahitan rapi, dan tindak lanjut order yang tidak berputar-putar.',
    body:
      'Halaman ini disusun supaya klien bisa memilih model, melihat referensi hasil jadi, lalu masuk ke diskusi produksi dengan data yang lebih siap.',
    points: ['Bahan dipilih sesuai fungsi seragam', 'Presisi jahit dan kontrol visual sebelum produksi', 'Konsultasi langsung dilanjutkan ke WhatsApp tim'],
    emphasis: 'Keunggulan Bradwear ditempatkan pada keputusan bahan yang tepat, produksi yang rapi, dan alur order yang tidak berputar-putar.',
  },
  {
    route: RouteKey.CLIENT_REACH,
    kicker: 'Klien & Jangkauan',
    title: 'Bradwear melayani pengiriman seluruh Indonesia dengan basis workshop di Tasikmalaya.',
    body:
      'Portofolio dan layanan disiapkan untuk instansi daerah, perusahaan nasional, organisasi, sekolah, serta kebutuhan tim yang memerlukan approval visual lebih dulu.',
    points: ['Workshop dan sample development di Tasikmalaya', 'Pengiriman ke seluruh Indonesia', 'Referensi hasil jadi tersedia untuk kebutuhan approval'],
    emphasis: 'Konten halaman ini menyorot jangkauan pengiriman dan kesiapan Bradwear melayani kebutuhan order dari berbagai wilayah Indonesia.',
  },
  {
    route: RouteKey.LEGAL_LICENSE,
    kicker: 'Legal & Lisensi',
    title: 'Identitas usaha dan kebutuhan administrasi pengadaan dapat ditindaklanjuti saat konsultasi resmi.',
    body:
      'Bradwear berjalan di bawah entitas usaha resmi dan menyiapkan tindak lanjut dokumen, kebutuhan legal, serta syarat kerja sama sesuai konteks instansi atau perusahaan.',
    points: ['Informasi legal dibuka saat proses konsultasi resmi', 'Kebutuhan administrasi pengadaan dapat dibahas lanjut', 'Syarat dan alur kerja dibuat menyesuaikan tipe order'],
    emphasis: 'Informasi legal diposisikan sebagai penegas kredibilitas dan kesiapan administrasi kerja sama, bukan pengulangan profil perusahaan.',
  },
] as const;

type LightboxSlide = {
  alt: string;
  description?: string;
  src: string;
  title?: string;
  variant?: 'default' | 'size-guide';
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

// Sumber copy panduan bahan pada halaman katalog.
const MATERIAL_GUIDE_ITEMS = [
  {
    name: 'Japan Drill',
    note: 'Best seller kemeja dinas',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.JAPAN_DRILL,
    specification: 'Tekstur drill rapat, handfeel padat, jatuh rapi, dan stabil untuk kemeja dinas maupun lapangan ringan.',
    usage: 'Kemeja, celana, jaket, parka, dan seragam operasional.',
    description:
      'Japan Drill terasa kuat dan cenderung lebih tebal dibanding bahan kemeja ringan. Karakternya stabil, jatuhnya rapi, dan nyaman dipakai untuk kebutuhan dinas harian maupun aktivitas lapangan ringan.',
    advantages: ['Tampilan rapi dan profesional', 'Lebih kokoh untuk pemakaian rutin', 'Nyaman untuk seragam dinas harian'],
    disadvantages: ['Terasa lebih padat dibanding bahan ringan', 'Kurang ideal bila targetnya seragam super ringan'],
  },
  {
    name: 'Ripstop',
    note: 'Tahan aktivitas berat',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.RIPSTOP,
    specification: 'Anyaman kotak-kotak penguat, ringan, tahan sobek, dan cocok untuk kebutuhan mobilitas tinggi.',
    usage: 'Outdoor shirt, cargo, rompi, dan kebutuhan lapangan.',
    description:
      'Ripstop dikenal dari tekstur kotak-kotaknya yang rapat dan fungsional. Bahan ini ringan tetapi punya ketahanan tinggi, sehingga sering dipilih untuk seragam lapangan yang membutuhkan durabilitas lebih baik.',
    advantages: ['Ringan namun kuat', 'Tahan untuk aktivitas lapangan', 'Cepat memberi kesan tactical dan fungsional'],
    disadvantages: ['Permukaan lebih teknis daripada formal', 'Kurang cocok untuk kebutuhan visual yang sangat halus'],
  },
  {
    name: 'Tropical',
    note: 'Nyaman untuk harian',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.TROPICAL,
    specification: 'Bobot ringan, adem, serat halus, dan relatif nyaman untuk pemakaian panjang di iklim panas.',
    usage: 'Kemeja harian, seragam kantor, komunitas, dan kebutuhan mobilitas tinggi.',
    description:
      'Bahan tropical berada di jalur kain yang lebih ringan dan adem. Permukaannya tetap rapi untuk kebutuhan formal, tetapi terasa lebih nyaman saat dipakai lama sepanjang hari.',
    advantages: ['Ringan dan adem', 'Cocok untuk iklim panas', 'Tetap terlihat bersih untuk kebutuhan kantor'],
    disadvantages: ['Kurang pas bila dibutuhkan struktur kain yang sangat tegas', 'Tidak sekuat bahan lapangan yang lebih padat'],
  },
  {
    name: 'Twill',
    note: 'Struktur tegas',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.TWILL,
    specification: 'Tenunan diagonal yang tampak jelas, karakter medium hingga padat, dan cocok untuk tampilan seragam yang lebih berisi.',
    usage: 'Seragam kerja formal, workshop, dan kebutuhan visual yang ingin lebih tegas.',
    description:
      'Twill memberi struktur kain yang lebih terbaca secara visual. Kesan akhirnya lebih kokoh dan berisi, sehingga sering dipilih ketika seragam perlu terlihat solid dan profesional.',
    advantages: ['Tampilan lebih tegas', 'Lebih berisi secara visual', 'Cocok untuk citra profesional yang kuat'],
    disadvantages: ['Bisa terasa lebih hangat dari kain ringan', 'Kurang ringan untuk pemakaian luar ruang yang sangat panas'],
  },
  {
    name: 'Nagata Drill',
    note: 'Padat dan rapi',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.NAGATA_DRILL,
    specification: 'Serat drill yang padat, visual rapi, dan cocok untuk seragam dinas maupun lapangan menengah.',
    usage: 'Kemeja dinas, celana kerja, jaket ringan, dan kebutuhan instansi.',
    description:
      'Nagata Drill dikenal sebagai pilihan yang cukup aman saat dibutuhkan keseimbangan antara tampilan formal, ketahanan pakai, dan kesan premium untuk seragam institusi.',
    advantages: ['Rapi untuk tampilan instansi', 'Lebih stabil untuk dipakai rutin', 'Sering dipilih untuk kebutuhan dinas'],
    disadvantages: ['Lebih berat dari bahan ringan', 'Kurang cocok bila target utama adalah flow kain yang lembut'],
  },
  {
    name: 'Stanford',
    note: 'Premium formal',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.STANFORD,
    specification: 'Permukaan lebih halus, tampilan lebih bersih, dan cocok untuk kebutuhan seragam formal yang ingin terlihat eksklusif.',
    usage: 'Seragam kantor premium, presentasi instansi, dan kebutuhan formal elegan.',
    description:
      'Stanford mengarah ke tampilan yang lebih refined dan bersih. Pilihan ini cocok ketika seragam tidak hanya harus fungsional, tetapi juga membawa citra profesional yang lebih premium.',
    advantages: ['Kesan premium dan bersih', 'Cocok untuk tampilan formal', 'Meningkatkan citra visual seragam'],
    disadvantages: ['Biasanya perlu perawatan lebih rapi', 'Kurang cocok untuk medan kerja yang sangat berat'],
  },
] as const;

const PublicSiteView: React.FC = () => {
  const {
    currentRoute,
    currentPathname,
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
  const [activeClientSlide, setActiveClientSlide] = useState(0);
  const [lightboxSlide, setLightboxSlide] = useState<LightboxSlide | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>(COURIER_PROVIDERS[0]);
  const [trackingReceipt, setTrackingReceipt] = useState('');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [trackingLookup, setTrackingLookup] = useState('');
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [openFaqSlug, setOpenFaqSlug] = useState<string | null>(SITE_FAQS[0]?.slug ?? null);
  const [activeHowToOrderStepIndex, setActiveHowToOrderStepIndex] = useState(0);
  const [activeHomeCarouselSlide, setActiveHomeCarouselSlide] = useState(0);
  const [articleCommentName, setArticleCommentName] = useState('');
  const [articleCommentBody, setArticleCommentBody] = useState('');
  const [articleCommentStatus, setArticleCommentStatus] = useState('');
  const catalogRef = useRef<HTMLElement | null>(null);
  const homeCarouselTouchStartX = useRef<number | null>(null);
  const homeCarouselTouchDeltaX = useRef(0);
  const activeArticleSlug = getArticleSlugFromPathname(currentPathname);
  const activeArticle = getArticleBySlug(activeArticleSlug);

  const heroSlides = useMemo(
    () => (ASSETS.BRAND.SLIDES?.length ? ASSETS.BRAND.SLIDES : [ASSETS.BRAND.HERO]).filter(Boolean),
    [],
  );
  const safeHeroSlides = heroSlides.length > 0 ? heroSlides : [ASSETS.KEMEJA.BRAD_V3.FRONT];
  useEffect(() => {
    if (safeHeroSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % safeHeroSlides.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [safeHeroSlides]);

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

    const parallaxNodes = Array.from(main.querySelectorAll<HTMLElement>('.elegant-parallax-block')).filter(
      (node) => node.offsetHeight > 80 && !node.closest('.parallax-static-zone'),
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
        const offset = Math.max(-6, Math.min(6, distance * -6));
        node.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);

        if (rect.top < viewportHeight * 0.94 && rect.bottom > viewportHeight * 0.12) {
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

  useEffect(() => {
    if (currentRoute === RouteKey.ARTIKEL && activeArticleSlug && !activeArticle) {
      setCurrentRoute(RouteKey.ARTIKEL, { path: ROUTE_PATHS[RouteKey.ARTIKEL], replace: true });
    }
  }, [activeArticle, activeArticleSlug, currentRoute, setCurrentRoute]);

  useEffect(() => {
    setArticleCommentName('');
    setArticleCommentBody('');
    setArticleCommentStatus('');
  }, [activeArticleSlug]);

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
  const spotlightProduct = featured[0] ?? visibleProducts[0] ?? null;
  const homeCarouselProducts = useMemo(() => {
    const shirtModels = [...visibleProducts]
      .filter((product) => product.category === 'Kemeja')
      .sort((left, right) => right.soldCount - left.soldCount);
    const otherCategoryRepresentatives = CATEGORIES.filter((category) => category !== 'Kemeja')
      .map((category) =>
        [...visibleProducts]
          .filter((product) => product.category === category)
          .sort((left, right) => right.soldCount - left.soldCount)[0] ?? null,
      )
      .filter(Boolean) as Product[];

    return [...shirtModels, ...otherCategoryRepresentatives];
  }, [visibleProducts]);
  const clientGalleryGroups = useMemo(
    () => ASSETS.CLIENT_GALLERY.filter((group) => group.images.length > 0),
    [],
  );
  const activeHowToOrderStep = HOW_TO_ORDER_STEPS[activeHowToOrderStepIndex] ?? HOW_TO_ORDER_STEPS[0];
  const activeBrandProfilePage = useMemo(
    () => BRAND_PROFILE_ITEMS.find((item) => item.route === currentRoute) ?? null,
    [currentRoute],
  );
  const articleFeed = useMemo(
    () =>
      [...ARTICLES].sort(
        (left, right) => new Date(right.updatedAt ?? right.publishedAt).getTime() - new Date(left.updatedAt ?? left.publishedAt).getTime(),
      ),
    [],
  );
  const articleSpotlight = articleFeed[0] ?? null;
  const articleLatest = articleFeed.slice(1, 4);
  const categorySummaryRows = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        modelCount: visibleProducts.filter((product) => product.category === category).length,
        useCase: CATEGORY_COPY[category].useCase,
        focus: CATEGORY_COPY[category].focus,
      })),
    [visibleProducts],
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

  const handleCatalogCategorySelect = (category: typeof CATEGORIES[number]) => {
    setActiveCategory(category);
    setPreferredCatalogCategory(category);
    setActiveModelFilter(ALL_MODELS);

    if (category === 'Celana') {
      setCurrentRoute(RouteKey.PANTS);
      return;
    }

    setCurrentRoute(RouteKey.KATALOG);
  };

  const handleArticleCommentSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!articleCommentName.trim() || !articleCommentBody.trim()) {
      setArticleCommentStatus('Isi nama dan komentar terlebih dahulu.');
      return;
    }

    setArticleCommentStatus(`Komentar dari ${articleCommentName.trim()} sudah ditampung untuk moderasi editorial Bradwear.`);
    setArticleCommentName('');
    setArticleCommentBody('');
  };
  const formatArticleDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  const hasGooglePlayLink = GOOGLE_PLAY_URL.trim().length > 0;

  useEffect(() => {
    if (homeCarouselProducts.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHomeCarouselSlide((prev) => (prev + 1) % homeCarouselProducts.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [homeCarouselProducts]);

  useEffect(() => {
    if (!homeCarouselProducts.length) {
      setActiveHomeCarouselSlide(0);
      return;
    }

    setActiveHomeCarouselSlide((prev) => Math.min(prev, homeCarouselProducts.length - 1));
  }, [homeCarouselProducts]);

  const showPreviousHomeCarouselSlide = () => {
    if (homeCarouselProducts.length < 2) return;
    setActiveHomeCarouselSlide((prev) => (prev - 1 + homeCarouselProducts.length) % homeCarouselProducts.length);
  };

  const showNextHomeCarouselSlide = () => {
    if (homeCarouselProducts.length < 2) return;
    setActiveHomeCarouselSlide((prev) => (prev + 1) % homeCarouselProducts.length);
  };

  const handleHomeCarouselTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    homeCarouselTouchStartX.current = event.touches[0]?.clientX ?? null;
    homeCarouselTouchDeltaX.current = 0;
  };

  const handleHomeCarouselTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    const touchStartX = homeCarouselTouchStartX.current;
    if (touchStartX === null) return;
    homeCarouselTouchDeltaX.current = (event.touches[0]?.clientX ?? touchStartX) - touchStartX;
  };

  const handleHomeCarouselTouchEnd = () => {
    const deltaX = homeCarouselTouchDeltaX.current;

    if (deltaX <= -42) {
      showNextHomeCarouselSlide();
    } else if (deltaX >= 42) {
      showPreviousHomeCarouselSlide();
    }

    homeCarouselTouchStartX.current = null;
    homeCarouselTouchDeltaX.current = 0;
  };

  const navigateToArticle = (slug: string) => {
    setCurrentRoute(RouteKey.ARTIKEL, { path: getArticlePath(slug) });
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
      </button>
      <div className="mt-3 grid gap-3 sm:mt-4">
        <span className="text-xs font-semibold text-[var(--text-primary)] sm:text-sm">{product.soldCount.toLocaleString('id-ID')}+ pesanan</span>
        <button
          type="button"
          onClick={() => handleSelectProduct(product)}
          className="product-card-cta"
        >
          Pesan sekarang
        </button>
      </div>
    </article>
  );

  const heroBenefits = [
    {
      title: 'Pengiriman ke seluruh Indonesia',
      copy: 'Cocok untuk instansi, operasional lapangan, proyek, dan pengadaan tim dengan alur kirim yang rapi.',
      icon: <ShippingIcon />,
    },
    {
      title: 'Editor desain dan tindak lanjut yang jelas',
      copy: 'Ringkasan order dibuat lebih mudah dipahami agar revisi, persetujuan desain, dan konsultasi tidak berulang.',
      icon: <WorkflowIcon />,
    },
    {
      title: 'Workshop aktif di Tasikmalaya',
      copy: 'Tim Bradwear menangani pengembangan sampel, pengecekan detail, dan kontrol kualitas sebelum produksi dimulai.',
      icon: <WorkshopIcon />,
    },
  ];

  const renderFaqAccordion = () => (
    <div className="faq-list">
      {/* FAQ publik yang tampil di home dan layanan pelanggan. */}
      {SITE_FAQS.map((faq) => {
        const isOpen = openFaqSlug === faq.slug;

        return (
          <article key={faq.slug} className="faq-card faq-card-clean">
            <button
              type="button"
              onClick={() => setOpenFaqSlug(isOpen ? null : faq.slug)}
              className="faq-trigger"
            >
              <span className="faq-question">{faq.title}</span>
              <span className={`faq-chevron ${isOpen ? 'open' : ''}`}>+</span>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
              <p className="faq-answer-copy">{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );

  const renderWorkshopHighlight = () => (
    <article className="elegant-parallax-block rounded-[30px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Alamat workshop</p>
      <h3 className="mt-3 text-2xl font-black tracking-tight">Karisma Residence, Mangunreja, Tasikmalaya</h3>
      <p className="mt-4 text-sm leading-relaxed text-white/85">{STORE_ADDRESS}</p>
      <div className="section-action-stack mt-6">
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
          Lihat Lokasi
        </button>
      </div>
    </article>
  );

  const renderHome = () => {
    return (
      <>
        {/* Utility strip home: lokasi, sosial media, marquee, dan CTA katalog. */}
        <section className="home-utility-strip" data-home-section="hero-utility">
          <a href={STORE_MAP_URL} target="_blank" rel="noreferrer" className="home-utility-link home-utility-link-maps">
            <GoogleMapsIcon />
            <span>Tasikmalaya</span>
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="home-utility-link" aria-label="Instagram Bradwear">
            <InstagramIcon />
          </a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="home-utility-link" aria-label="TikTok Bradwear">
            <TikTokIcon />
          </a>
          <div className="home-utility-marquee" aria-label="Pesan sekarang">
            <span>Pesan Sekarang</span>
            <span>Pesan Sekarang</span>
            <span>Pesan Sekarang</span>
          </div>
          <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="home-utility-cta">
            Menuju katalog
          </button>
        </section>

        {/* Intro hero gambar pertama home. */}
        <section className="hero-display-strip hero-display-strip-top" data-home-section="hero-intro">
          <img src={heroTopImage} alt="Seragam Bradwear sebagai identitas perusahaan" className="hero-display-strip-image" />
          <div className="hero-display-strip-overlay">
            <h2 className="hero-display-strip-title hero-display-strip-title-intro">Seragam merupakan identitas perusahaan</h2>
          </div>
        </section>

        {/* Headline utama home beserta CTA utama. */}
        <section className="home-hero editorial-home-hero" data-home-section="hero">
          <article className="hero-panel hero-panel-editorial hero-panel-clean">
            <p className="hero-kicker">Bradwear Indonesia</p>
            <h1>Seragam Dinas Berkualitas untuk Citra Profesional Perusahaan Anda.</h1>
            <p className="hero-lead">
              Diproduksi dengan standar jahitan rapi, bahan premium, dan desain yang dapat disesuaikan dengan identitas
              instansi maupun perusahaan.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                onClick={() => {
                  if (spotlightProduct) {
                    handleSelectProduct(spotlightProduct);
                    return;
                  }
                  setCurrentRoute(RouteKey.KATALOG);
                }}
                className="hero-primary brand-cta"
              >
                Mulai desain
              </button>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage('konsultasi order seragam custom untuk tim atau instansi'))}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary"
              >
                Tanya via whatspp
              </a>
            </div>
          </article>
        </section>

        {/* Slideshow hero home dan label tombol navigasinya. */}
        <section className="hero-image-runway" data-home-section="hero-slider">
          <article className="hero-banner hero-banner-editorial hero-banner-edge">
            <div className="hero-banner-stage hero-banner-stage-editorial hero-banner-stage-landscape">
              {safeHeroSlides.map((slide, index) => (
                <img
                  key={`${slide}-${index}`}
                  src={slide}
                  alt={`Hero Bradwear ${index + 1}`}
                  className={`hero-banner-image ${index === activeHeroSlide ? 'is-active' : ''}`}
                />
              ))}
              <div className="hero-banner-overlay hero-banner-overlay-soft" />
            </div>

            {safeHeroSlides.length > 1 ? (
              <>
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
              </>
            ) : null}
          </article>
        </section>

        {/* Preview Galeri Klien di home. */}
        <section className="home-section" data-home-section="client-gallery">
          <div className="home-section-shell home-section-shell-bleed home-section-grid">
            <div className="home-section-heading">
              <p className="home-section-kicker">Galeri Klien</p>
              <h2 className="home-section-title">Dipilih oleh Berbagai Instansi &amp; Perusahaan</h2>
              <p className="home-section-copy">
                Bukti nyata kualitas produksi dan kepercayaan yang telah kami bangun bersama klien.
              </p>
            </div>

            <div className="client-gallery-grid">
              <article className="elegant-parallax-block middle-showcase-shell client-proof-shell client-proof-shell-open">
                <article className="hero-banner middle-showcase-banner">
                  <div className="hero-banner-stage middle-showcase-stage client-gallery-stage client-fullscreen-stage">
                    {CLIENT_GALLERY_SLIDES.map((slide, index) => (
                      <img
                        key={`${slide}-${index}`}
                        src={slide}
                        alt={`Galeri klien Bradwear ${index + 1}`}
                        className={`hero-banner-image ${index === activeClientSlide ? 'is-active' : ''}`}
                      />
                    ))}
                    <div className="hero-banner-overlay middle-showcase-overlay" />
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxSlide({
                          src: CLIENT_GALLERY_SLIDES[activeClientSlide],
                          alt: `Galeri klien Bradwear ${activeClientSlide + 1}`,
                          title: `Galeri klien Bradwear ${activeClientSlide + 1}`,
                        })
                      }
                      className="slideshow-lightbox-trigger"
                      aria-label="Buka gambar klien penuh"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveClientSlide((prev) => (prev - 1 + CLIENT_GALLERY_SLIDES.length) % CLIENT_GALLERY_SLIDES.length)}
                    className="hero-arrow hero-arrow-left"
                    aria-label="Slide klien sebelumnya"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveClientSlide((prev) => (prev + 1) % CLIENT_GALLERY_SLIDES.length)}
                    className="hero-arrow hero-arrow-right"
                    aria-label="Slide klien berikutnya"
                  >
                    &gt;
                  </button>
                </article>
              </article>
            </div>

            <div className="section-action-stack">
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.CLIENT)}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
              >
                Menuju Galeri Klien
              </button>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage('minta referensi hasil jadi seragam custom Bradwear'))}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary"
              >
                Minta referensi via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Preview Cara Order di home. */}
        <section className="home-section" data-home-section="order-flow">
          <div className="home-section-shell home-section-shell-bleed order-flow-preview">
            <div className="home-section-heading">
              <p className="home-section-kicker">Cara Order</p>
              <h2 className="home-section-title">Proses Pemesanan yang Mudah dan Terstruktur</h2>
              <p className="home-section-copy">
                Mulai dari konsultasi, pemilihan model, hingga produksi dan pengiriman dalam satu alur yang jelas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentRoute(RouteKey.CARA_ORDER)}
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
            >
              Lihat Alur Pemesanan
            </button>
          </div>
        </section>

        {/* Slider kategori/model pada home. */}
        <section className="home-section" data-home-section="category-showcase">
          <div className="home-section-shell home-section-shell-bleed home-carousel-only">
          <div
            className="home-image-carousel-shell"
            onTouchStart={handleHomeCarouselTouchStart}
            onTouchMove={handleHomeCarouselTouchMove}
            onTouchEnd={handleHomeCarouselTouchEnd}
          >
            <div className="home-image-carousel-stage">
              {homeCarouselProducts.map((product, index) => {
                const offset = index - activeHomeCarouselSlide;
                const distance = Math.abs(offset);
                const positionClass =
                  offset === 0
                    ? 'is-active'
                    : offset === -1
                      ? 'is-left'
                      : offset === 1
                        ? 'is-right'
                        : distance > 2
                          ? 'is-hidden'
                          : offset < 0
                            ? 'is-far-left'
                            : 'is-far-right';

                return (
                  <button
                    key={product.id}
                    type="button"
                    className={`home-image-carousel-card ${positionClass}`}
                    style={{ ['--carousel-offset' as string]: String(offset) }}
                    onClick={() => (offset === 0 ? handleSelectProduct(product) : setActiveHomeCarouselSlide(index))}
                    aria-label={offset === 0 ? `Buka desain ${product.name}` : `Tampilkan ${product.name}`}
                  >
                    <img src={product.image} alt={product.name} className="home-image-carousel-image" />
                    <div className="home-image-carousel-card-copy">
                      <span className="home-image-carousel-category">{product.category}</span>
                      <strong className="home-image-carousel-name">{product.name}</strong>
                      <span className="home-image-carousel-hint">
                        {offset === 0 ? 'Buka model ini' : 'Tampilkan kategori'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {homeCarouselProducts.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPreviousHomeCarouselSlide}
                  className="hero-arrow hero-arrow-left home-image-carousel-arrow"
                  aria-label="Slide model sebelumnya"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onClick={showNextHomeCarouselSlide}
                  className="hero-arrow hero-arrow-right home-image-carousel-arrow"
                  aria-label="Slide model berikutnya"
                >
                  &gt;
                </button>
              </>
            ) : null}

            <div className="home-image-carousel-dots" aria-hidden="true">
              {homeCarouselProducts.map((product, index) => (
                <span
                  key={product.id}
                  className={`home-image-carousel-dot ${index === activeHomeCarouselSlide ? 'is-active' : ''}`}
                />
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* FAQ ringkas home. */}
        <section className="home-section home-section-tight" data-home-section="faq">
          <div className="home-section-shell faq-panel">
            <div className="faq-heading-shell">
              <div className="home-section-heading">
                <p className="home-section-kicker">FAQ Ringkas</p>
                <h2 className="home-section-title">Jawaban yang paling sering dicari sebelum order berjalan</h2>
                <p className="home-section-copy">
                  Ringkasan ini dibuat agar user langsung menemukan jawaban utama tentang minimum order, kustom logo,
                  estimasi produksi, dan pelacakan pesanan tanpa membuka terlalu banyak halaman.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.LAYANAN_PELANGGAN)}
                className="faq-heading-cta"
              >
                Hubungi layanan pelanggan
              </button>
            </div>
            {renderFaqAccordion()}
          </div>
        </section>

        {/* CTA penutup home. */}
        <section className="home-section home-section-full">
          <article className="footer-cta-panel">
            <div>
              <h2 className="home-section-title">Siap lanjut konsultasi atau mulai desain dari model yang sudah dipilih?</h2>
              <p className="home-section-copy">
                Jika kebutuhan sudah cukup jelas, lanjutkan ke editor atau kirim pesan WhatsApp agar tim Bradwear bisa
                membantu langkah order berikutnya.
              </p>
            </div>
            <div className="section-action-stack">
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.KATALOG)}
                className="hero-primary brand-cta"
              >
                Order sekarang
              </button>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage('lanjut konsultasi order seragam custom Bradwear'))}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary"
              >
                Kirim pesan WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.THREE_D)}
                className="hero-secondary"
              >
                Buka Studio 3D
              </button>
            </div>
          </article>
        </section>

      </>
    );
  };

  const renderCatalog = (catalogProducts: Product[], title: string, description: string, showCategoryTabs = true) => (
    <div className="catalog-page-shell px-0 py-8">
      {/* Hero katalog: judul dan deskripsi dikirim dari argumen renderCatalog. */}
      <section className="catalog-page-hero">
        <p className="home-section-kicker">Katalog Bradwear</p>
        <h1 className="home-section-title">{title}</h1>
        <p className="home-section-copy">{description}</p>
      </section>

      {/* Filter kategori dan model katalog. */}
      {showCategoryTabs ? (
        <section ref={catalogRef} className="catalog-filter-band">
          <p className="catalog-filter-band-title">Pilih kategori utama</p>
          <div className="catalog-category-table-shell">
            <table className="catalog-category-table">
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Model</th>
                  <th>Cocok untuk</th>
                  <th>Fokus</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categorySummaryRows.map((row) => {
                  const isActive = activeCategory === row.category;

                  return (
                    <tr key={row.category} className={isActive ? 'is-active' : ''}>
                      <td data-label="Kategori">
                        <strong>{row.category}</strong>
                      </td>
                      <td data-label="Model">{row.modelCount} model</td>
                      <td data-label="Cocok untuk">{row.useCase}</td>
                      <td data-label="Fokus">{row.focus}</td>
                      <td data-label="Aksi">
                        <button
                          type="button"
                          onClick={() => handleCatalogCategorySelect(row.category)}
                          className={`catalog-category-table-action ${isActive ? 'is-active' : ''}`}
                        >
                          {isActive ? 'Terpilih' : 'Pilih'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="catalog-filter-band-subtitle">Pilih model</p>
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

      <section className="catalog-product-grid mt-8 grid grid-cols-2 gap-4 xl:grid-cols-3">
        {catalogProducts.map((product, index) => renderProductCard(product, index < 2 ? 'Favorit' : undefined))}
      </section>

      {/* Copy size guide dan tombol pembuka popup gambar penuh. */}
      {ASSETS.CONTENT.SIZE_GUIDE ? (
        <section className="catalog-size-guide-shell mt-12 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <article className="catalog-copy-band">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Size Guide</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[var(--text-primary)]">Panduan ukuran dibuat lebih ringkas sebelum lanjut order</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Gunakan panduan ini untuk membaca ukuran dasar sebelum masuk ke editor atau saat menyiapkan data tim. Jika ada kebutuhan ukuran khusus, detailnya tetap bisa dilanjutkan saat konsultasi.
            </p>
          </article>

          <article className="catalog-size-guide-stage">
            <button
              type="button"
              onClick={() =>
                setLightboxSlide({
                  src: ASSETS.CONTENT.SIZE_GUIDE,
                  alt: 'Bradwear size guide',
                  title: 'Panduan Ukuran Bradwear',
                  description: 'Tampilan size guide penuh untuk membaca detail ukuran dengan lebih jelas.',
                  variant: 'size-guide',
                })
              }
              className="block w-full cursor-zoom-in"
              aria-label="Buka size guide penuh"
            >
              <img
                src={ASSETS.CONTENT.SIZE_GUIDE}
                alt="Bradwear size guide"
                className="catalog-size-guide-image"
              />
            </button>
          </article>
        </section>
      ) : null}

      {/* Copy panduan bahan; isi bahan per item ada di MATERIAL_GUIDE_ITEMS. */}
      <section className="mt-12 material-guide-shell">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">Panduan Bahan</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">Keterangan jenis bahan</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Setiap bahan punya karakter yang berbeda. Bagian ini dibuat supaya user lebih cepat membedakan bahan yang cocok untuk tampilan formal, mobilitas lapangan, atau kebutuhan harian yang lebih ringan.
          </p>
        </div>

        <div className="material-guide-list mt-6">
          {MATERIAL_GUIDE_ITEMS.map((material) => (
            <article key={material.name} className="material-guide-card">
              <div className="material-guide-visual">
                {material.image ? (
                  <img src={material.image} alt={`Contoh kain ${material.name}`} className="material-guide-image" />
                ) : (
                  <div className="material-guide-image material-guide-image-fallback" aria-hidden="true" />
                )}
              </div>
              <div className="material-guide-body">
                <span className="material-guide-note">{material.note}</span>
                <h3 className="material-guide-title">{material.name}</h3>
                <p className="material-guide-copy">{material.description}</p>
                <div className="material-guide-meta-grid">
                  <div className="material-guide-meta-block">
                    <p className="material-guide-usage-label">Spesifikasi</p>
                    <p className="material-guide-usage-copy">{material.specification}</p>
                  </div>
                  <div className="material-guide-meta-block">
                    <p className="material-guide-usage-label">Cocok untuk</p>
                    <p className="material-guide-usage-copy">{material.usage}</p>
                  </div>
                  <div className="material-guide-meta-block">
                    <p className="material-guide-usage-label">Kelebihan</p>
                    <ul className="material-guide-list-points">
                      {material.advantages.map((point) => (
                        <li key={`${material.name}-adv-${point}`}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="material-guide-meta-block">
                    <p className="material-guide-usage-label">Kekurangan</p>
                    <ul className="material-guide-list-points">
                      {material.disadvantages.map((point) => (
                        <li key={`${material.name}-dis-${point}`}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

  const renderArticles = () => {
    if (activeArticle) {
      const relatedArticles = articleFeed.filter((article) => article.slug !== activeArticle.slug).slice(0, 3);

      return (
        <div className="article-page-shell px-6 py-8 md:px-10">
          <section className="article-detail-hero rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-6 shadow-sm">
            <button
              type="button"
              onClick={() => setCurrentRoute(RouteKey.ARTIKEL)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--text-primary)] shadow-sm"
            >
              Kembali ke Artikel
            </button>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                {activeArticle.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatArticleDate(activeArticle.publishedAt)}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{activeArticle.readTime}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{activeArticle.comments.length} komentar</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-[var(--text-primary)]">{activeArticle.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{activeArticle.seoDescription}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
              <span className="rounded-full bg-white px-3 py-2 font-semibold">Oleh {activeArticle.author}</span>
              <span>{activeArticle.authorRole}</span>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-6">
              <article className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{activeArticle.excerpt}</p>
                <div className="mt-6 grid gap-5">
                  {activeArticle.body.map((paragraph, index) => (
                    <p key={`${activeArticle.slug}-${index}`} className="text-base leading-8 text-[var(--text-secondary)]">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentRoute(RouteKey.KATALOG)}
                    className="rounded-full bg-[linear-gradient(135deg,#75f21a,#2c7a12)] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#071106] shadow-sm transition hover:-translate-y-0.5"
                  >
                    Lihat katalog model
                  </button>
                  <a
                    href={buildWhatsAppUrl(buildConsultationMessage(`artikel ${activeArticle.title.toLowerCase()}`))}
                    target="_blank"
                    rel="noreferrer"
                    className="hero-secondary"
                  >
                    Diskusikan artikel ini
                  </a>
                </div>
              </article>

              <section className="rounded-[32px] border border-[var(--border-soft)] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Komentar pembaca</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">Tanggapan pada artikel ini</h2>
                  </div>
                  <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)]">
                    Moderasi editorial aktif
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  {activeArticle.comments.map((comment) => (
                    <article key={comment.id} className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">{comment.author}</p>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">{comment.role}</span>
                        <span className="text-[11px] text-[var(--text-muted)]">{formatArticleDate(comment.publishedAt)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{comment.body}</p>
                    </article>
                  ))}
                </div>

                <form onSubmit={handleArticleCommentSubmit} className="article-comment-form mt-6 grid gap-3">
                  <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
                    <input
                      type="text"
                      value={articleCommentName}
                      onChange={(event) => setArticleCommentName(event.target.value)}
                      placeholder="Nama Anda"
                      className="article-comment-input"
                    />
                    <textarea
                      value={articleCommentBody}
                      onChange={(event) => setArticleCommentBody(event.target.value)}
                      placeholder="Tulis tanggapan atau pertanyaan singkat seputar artikel ini."
                      rows={3}
                      className="article-comment-input article-comment-textarea"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="rounded-full bg-[linear-gradient(135deg,#75f21a,#2c7a12)] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#071106] shadow-sm transition hover:-translate-y-0.5"
                    >
                      Kirim komentar
                    </button>
                    <p className="text-sm text-[var(--text-secondary)]">{articleCommentStatus || 'Komentar baru akan ditinjau dulu sebelum ditampilkan publik.'}</p>
                  </div>
                </form>
              </section>
            </div>

            <aside className="grid gap-5 self-start">
              <section className="rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Tentang penulis</p>
                <h3 className="mt-3 text-lg font-black tracking-tight text-[var(--text-primary)]">{activeArticle.author}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{activeArticle.authorRole}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Tim editorial Bradwear menulis artikel berbasis kebutuhan order seragam custom, approval desain, bahan, dan alur produksi yang sering ditanyakan customer.
                </p>
              </section>

              <section className="rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Topik SEO</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeArticle.keywords.map((keyword) => (
                    <span
                      key={`${activeArticle.slug}-${keyword}`}
                      className="rounded-full bg-[var(--surface-subtle)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Artikel terbaru</p>
                <div className="mt-4 grid gap-3">
                  {relatedArticles.map((article) => (
                    <button
                      key={article.slug}
                      type="button"
                      onClick={() => navigateToArticle(article.slug)}
                      className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-4 text-left transition hover:-translate-y-0.5"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent-strong)]">{article.category}</p>
                      <p className="mt-2 text-sm font-black tracking-tight text-[var(--text-primary)]">{article.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </div>
      );
    }

    return (
      <div className="article-page-shell px-6 py-8 md:px-10">
        <section className="article-news-grid">
          <div className="rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--brand-accent-strong)]">Artikel Bradwear</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-[var(--text-primary)]">Halaman artikel bergaya news untuk keyword seragam, kemeja custom, dan pengadaan</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Setiap artikel dibuat sebagai landing page yang bisa dibaca user, diindeks Google, dan dipahami mesin AI untuk konteks kemeja custom, seragam dinas, komunitas, serta proses order Bradwear Indonesia.
            </p>
          </div>

          {articleSpotlight ? (
            <article className="article-spotlight-card rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#0f172a,#1f4d17)] p-6 text-white shadow-[0_22px_48px_rgba(15,23,42,0.24)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d4f9af]">Sorotan utama</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight">{articleSpotlight.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/78">{articleSpotlight.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-white/74">
                <span>{articleSpotlight.category}</span>
                <span>{formatArticleDate(articleSpotlight.publishedAt)}</span>
                <span>{articleSpotlight.readTime}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigateToArticle(articleSpotlight.slug)}
                  className="rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#0f172a] shadow-sm transition hover:-translate-y-0.5"
                >
                  Baca artikel utama
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentRoute(RouteKey.KATALOG)}
                  className="rounded-full border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5"
                >
                  Lihat katalog
                </button>
              </div>
            </article>
          ) : null}

          <aside className="article-latest-stack rounded-[30px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Terbaru</p>
            <div className="mt-4 grid gap-3">
              {articleLatest.map((article) => (
                <button
                  key={article.slug}
                  type="button"
                  onClick={() => navigateToArticle(article.slug)}
                  className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-4 text-left transition hover:-translate-y-0.5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent-strong)]">{article.category}</p>
                  <p className="mt-2 text-sm font-black tracking-tight text-[var(--text-primary)]">{article.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8 article-card-grid">
          {articleFeed.map((article) => (
            <article key={article.slug} className="article-feed-card rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                  {article.category}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatArticleDate(article.publishedAt)}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{article.readTime}</span>
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)]">{article.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {article.body.slice(0, 2).map((paragraph, index) => (
                  <p key={`${article.slug}-${index}`} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[var(--text-muted)]">{article.comments.length} komentar · {article.author}</p>
                <button
                  type="button"
                  onClick={() => navigateToArticle(article.slug)}
                  className="rounded-full bg-[linear-gradient(135deg,#75f21a,#2c7a12)] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#071106] shadow-sm transition hover:-translate-y-0.5"
                >
                  Baca Artikel
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    );
  };

  const renderDownloadPage = () => (
    <div className="download-page-shell px-6 py-8 md:px-10">
      <section className="rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(140deg,#0f172a,#14380c)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d4f9af]">Download Bradwear</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight">Halaman download aplikasi Bradwear Indonesia untuk Android</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Halaman ini memulihkan akses download yang sebelumnya hilang. Pengunjung desktop tetap bisa melihat menu <strong>Download</strong> di navbar, sementara user mobile mendapat jalur cepat ke katalog, artikel, dan konsultasi Bradwear.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {hasGooglePlayLink ? (
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black tracking-tight text-[#0f172a] shadow-sm transition hover:-translate-y-0.5"
            >
              <GooglePlayIcon />
              Buka di Google Play
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-black tracking-tight text-white/92">
              <GooglePlayIcon />
              Listing Google Play sedang disiapkan
            </span>
          )}
          <a
            href={buildWhatsAppUrl(buildConsultationMessage('download aplikasi android bradwear dan akses mobile katalog'))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/18 px-5 py-3 text-sm font-black tracking-tight text-white transition hover:-translate-y-0.5"
          >
            Hubungi admin untuk link mobile
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-5 md:grid-cols-3">
          {DOWNLOAD_HIGHLIGHTS.map((item) => (
            <article key={item.title} className="rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
            </article>
          ))}
        </div>

        <aside className="rounded-[28px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#ffffff,#f5faef)] p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Akses cepat</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[var(--text-primary)]">{SITE_NAME}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Halaman download ini juga berfungsi sebagai landing page SEO untuk intent seperti download aplikasi Bradwear, Android Bradwear, dan akses Play Store Bradwear Indonesia.
          </p>
          <div className="mt-5 grid gap-3">
            <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="rounded-[20px] border border-[var(--border-soft)] bg-white px-4 py-4 text-left transition hover:-translate-y-0.5">
              <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">Masuk ke katalog</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">Bandingkan kategori kemeja, jaket, celana, rompi, dan polo.</p>
            </button>
            <button type="button" onClick={() => setCurrentRoute(RouteKey.ARTIKEL)} className="rounded-[20px] border border-[var(--border-soft)] bg-white px-4 py-4 text-left transition hover:-translate-y-0.5">
              <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">Baca artikel</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">Akses panduan bahan, tips order, dan artikel seragam yang sudah dioptimalkan untuk index.</p>
            </button>
          </div>
        </aside>
      </section>
    </div>
  );

  const renderHowToOrder = () => (
    <div className="px-6 py-8 md:px-10">
      {/* Hero halaman Cara Order. */}
      <section className="rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#ffffff,#f5faef)] p-6 shadow-sm md:p-8">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">Cara Order</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)]">Proses Pemesanan yang Mudah dan Terstruktur</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Mulai dari konsultasi, pemilihan model, hingga produksi dan pengiriman dalam satu alur yang jelas.
          </p>
        </div>

        {/* Tahapan order mengambil title, description, dan detail dari HOW_TO_ORDER_STEPS. */}
        <div className="order-step-selector mt-6">
          {HOW_TO_ORDER_STEPS.map((step, index) => {
            const isActive = index === activeHowToOrderStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveHowToOrderStepIndex(index)}
                className={`order-step-pill ${isActive ? 'is-active' : ''}`}
                aria-pressed={isActive}
              >
                <span className="order-step-pill-number">{index + 1}</span>
                <span className="order-step-pill-label">Tahap {index + 1}</span>
              </button>
            );
          })}
        </div>

        <article key={activeHowToOrderStep.id} className="order-step-panel mt-6">
          <div className="order-step-panel-head">
            <div className="order-step-panel-index">Tahap {activeHowToOrderStepIndex + 1}</div>
            <div className="order-step-panel-progress">
              {HOW_TO_ORDER_STEPS.map((step, index) => (
                <span
                  key={step.id}
                  className={`order-step-progress-dot ${index <= activeHowToOrderStepIndex ? 'is-done' : ''}`}
                />
              ))}
            </div>
          </div>
          <h2 className="order-step-panel-title">{activeHowToOrderStep.title}</h2>
          <p className="order-step-panel-copy">{activeHowToOrderStep.description}</p>
          <p className="order-step-panel-detail">{activeHowToOrderStep.detail}</p>

          <div className="order-step-panel-actions">
            {activeHowToOrderStep.id === 'discover' ? (
              <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="hero-primary brand-cta">
                Buka katalog
              </button>
            ) : null}
            {activeHowToOrderStep.id === 'customize' ? (
              <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="hero-primary brand-cta">
                Pilih model lalu desain
              </button>
            ) : null}
            {activeHowToOrderStep.id === 'summary' ? (
              <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="hero-primary brand-cta">
                Lanjut siapkan data order
              </button>
            ) : null}
            {activeHowToOrderStep.id === 'consult' ? (
              <a
                href={buildWhatsAppUrl(buildConsultationMessage('kirim detail order seragam custom untuk ditindaklanjuti'))}
                target="_blank"
                rel="noreferrer"
                className="hero-primary brand-cta"
              >
                Kirim ke WhatsApp
              </a>
            ) : null}
            {activeHowToOrderStep.id === 'track' ? (
              <button type="button" onClick={() => setCurrentRoute(RouteKey.LACAK_PESANAN)} className="hero-primary brand-cta">
                Cek status order
              </button>
            ) : null}

            {activeHowToOrderStepIndex < HOW_TO_ORDER_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveHowToOrderStepIndex((prev) => Math.min(prev + 1, HOW_TO_ORDER_STEPS.length - 1))}
                className="hero-secondary"
              >
                Lanjut ke tahap {activeHowToOrderStepIndex + 2}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveHowToOrderStepIndex(0)}
                className="hero-secondary"
              >
                Ulang dari tahap 1
              </button>
            )}
          </div>
        </article>
      </section>
    </div>
  );

  const renderCustomerService = () => (
    <div className="service-page-shell px-0 py-8">
      {/* Hero halaman layanan pelanggan. */}
      <section className="service-page-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Layanan Pelanggan</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Bantuan cepat untuk konsultasi, revisi, dan tindak lanjut order</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          Tim layanan pelanggan Bradwear membantu penjelasan model, bahan, estimasi, pengumpulan data ukuran,
          konfirmasi revisi, hingga pembaruan pengiriman.
        </p>
      </section>

      {/* Kontak layanan pelanggan dan jam operasional. */}
      <section className="service-page-grid mt-8">
        <article className="service-page-column">
          <div className="mt-1 space-y-3">
            {CONTACT_CHANNELS.map((channel) => (
              <div key={channel.label} className="service-page-item">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{channel.label}</p>
                <p className="mt-1 text-base font-bold text-[var(--text-primary)]">{channel.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{channel.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="service-page-column service-page-column-alt">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Jam Operasional</p>
          <div className="mt-4 space-y-3">
            {CUSTOMER_SERVICE_HOURS.map((hour) => (
              <div key={hour} className="service-page-item text-sm font-semibold text-[var(--text-secondary)]">
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

      {/* FAQ layanan menggunakan sumber data SITE_FAQS. */}
      <section className="service-page-faq mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">FAQ Layanan</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {SITE_FAQS.map((faq) => (
            <article key={faq.slug} className="service-page-item">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{faq.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

  const renderTracking = () => (
    <div className="tracking-page-shell px-0 py-8">
      {/* Hero halaman tracking pesanan. */}
      <section className="tracking-page-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Lacak Pesanan</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Cek status produksi internal dengan order code atau nomor resi</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Halaman ini memisahkan tracking internal Bradwear dan tracking resmi ekspedisi agar pelanggan bisa langsung memilih jalur pengecekan yang paling relevan.
        </p>
      </section>

      {/* Teks panel tracking internal dan tracking kurir resmi. */}
      <section className="tracking-page-grid">
        <article className="tracking-page-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Status produksi internal</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">Cari order aktif atau order selesai dari kode Bradwear</h2>
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
                <div className="tracking-page-card">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Order aktif #{currentProductionOrder.orderCode}</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{currentProductionOrder.productName}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Pelanggan: {currentProductionOrder.customerName} · Qty {currentProductionOrder.totalQty} pcs</p>
                  <div className="mt-5 space-y-3">
                    {currentProductionOrder.stages.map((stage) => (
                      <div key={stage.id} className="tracking-page-status-card">
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
                <div className="tracking-page-card">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Order selesai #{completedProductionOrder.code}</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)]">{completedProductionOrder.productName}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Selesai pada {completedProductionOrder.completedAt}</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">Resi: {completedProductionOrder.resi}</p>
                  {completedProductionOrder.courier ? (
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Kurir: {completedProductionOrder.courier}</p>
                  ) : null}
                </div>
              ) : (
                <div className="tracking-page-card text-sm leading-relaxed text-[var(--text-secondary)]">
                  Data order belum ditemukan di penyimpanan lokal ini. Jika Anda sudah menerima resi, lanjutkan cek di kurir resmi di panel sebelah.
                </div>
              )}
            </div>
          ) : null}
        </article>

        <article className="tracking-page-panel tracking-page-panel-alt">
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

          <div className="tracking-provider-grid mt-6 grid gap-3">
            {COURIER_PROVIDERS.map((provider) => (
              <a
                key={provider.id}
                href={provider.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="tracking-provider-link"
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
    <div className="store-page-shell px-0 py-8">
      {/* Hero halaman Temukan Toko. */}
      <section className="store-page-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Temukan Toko</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Workshop dan titik lokasi Bradwear Indonesia</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Lokasi ini menjadi titik konsultasi, pengembangan sampel, dan koordinasi order Bradwear Indonesia untuk
          kebutuhan seragam custom di Tasikmalaya dan sekitarnya.
        </p>
      </section>

      {/* Copy alamat workshop, CTA map, dan CTA WhatsApp. */}
      <section className="store-page-grid">
        <article className="store-page-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">Alamat workshop</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">Titik konsultasi, sample, dan koordinasi produksi</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            Lokasi ini menjadi titik konsultasi, pengembangan sampel, dan koordinasi order Bradwear Indonesia untuk
            kebutuhan seragam custom di Tasikmalaya dan sekitarnya.
          </p>
          <div className="store-address-band mt-6">
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

        <article className="store-map-shell">
          <div className="store-map-stage">
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

  const renderBrandProfilePage = () => {
    if (!activeBrandProfilePage) return null;

    return (
      <div className="brand-profile-page px-0 py-8">
        {/* Hero halaman profil mengambil teks dari BRAND_PROFILE_ITEMS sesuai route aktif. */}
        <section className="brand-profile-hero brand-profile-hero-flat px-6 py-8 text-white md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">{activeBrandProfilePage.kicker}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight">{activeBrandProfilePage.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">{activeBrandProfilePage.body}</p>
        </section>

        {/* Fokus halaman dan poin utama profil. */}
        <section className="brand-profile-grid mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="brand-profile-card brand-profile-card-flat p-0 shadow-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">
              Fokus halaman
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">{activeBrandProfilePage.kicker}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{activeBrandProfilePage.emphasis}</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{activeBrandProfilePage.body}</p>

            <div className="section-action-stack mt-6">
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.HOME)}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
              >
                Kembali ke beranda
              </button>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage(`informasi ${activeBrandProfilePage.kicker.toLowerCase()} Bradwear`))}
                target="_blank"
                rel="noreferrer"
                className="hero-secondary"
              >
                Tanya via WhatsApp
              </a>
            </div>
          </article>

          <article className="brand-profile-card brand-profile-card-flat p-0 shadow-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Poin Utama</p>
            <div className="mt-5 grid gap-3">
              {activeBrandProfilePage.points.map((point, index) => (
                <article key={point} className="brand-profile-point brand-profile-point-flat px-0 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--text-primary)]">{point}</p>
                </article>
              ))}
            </div>
          </article>
        </section>
      </div>
    );
  };

  const renderClientGallery = () => (
    <div className="client-gallery-page-shell px-0 py-8">
      {/* Hero halaman Galeri Klien. */}
      <section className="client-gallery-page-hero px-6 py-8 text-white md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Galeri Klien</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Dipercaya Berbagai Perusahaan di Indonesia</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Setiap proyek mencerminkan komitmen Bradwear dalam menghadirkan seragam berkualitas dengan detail yang presisi dan hasil yang profesional.
        </p>
      </section>

      {/* Judul per folder dan subtitle gallery band mengambil data dari CLIENT_GALLERY_META. */}
      <section className="parallax-static-zone mt-8 grid gap-0">
        {clientGalleryGroups.map((group) => {
          const meta = CLIENT_GALLERY_META[group.slug] ?? {
            title: group.name,
            subtitle: 'Dokumentasi hasil jadi klien Bradwear Indonesia.',
            gradient: 'linear-gradient(135deg,#166534,#1d4ed8)',
            icon: <GovernmentIcon />,
          };
          const [featuredImage, ...otherImages] = group.images;
          const gallerySlides = [...(featuredImage ? [featuredImage] : []), ...otherImages];

          return (
            <article key={group.slug} className="client-gallery-band">
              <div className="client-gallery-band-copy px-6 py-7 md:px-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Folder {group.slug}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div
                    className="client-gallery-band-icon"
                    style={{ background: meta.gradient }}
                  >
                    {meta.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">{meta.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{meta.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="hero-banner client-gallery-band-slider">
                <div className="hero-banner-stage client-gallery-band-stage">
                  {gallerySlides.map((image, index) => (
                    <img
                      key={`${group.slug}-${index}-${image}`}
                      src={image}
                      alt={`${meta.title} gallery ${index + 1}`}
                      className={`hero-banner-image hero-banner-image-ambient ${index === 0 ? 'is-active' : ''}`}
                      style={{
                        animationDelay: `${index * 5}s`,
                        animationDuration: `${Math.max(gallerySlides.length, 1) * 5}s`,
                      }}
                    />
                  ))}
                  <div className="hero-banner-overlay hero-banner-overlay-soft" />
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
        {/* Hero halaman Brodi / AI assistant. */}
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

  const renderThreeDPage = () => (
    <div className="three-d-page-shell">
      <div className="three-d-frame-shell">
        <iframe
          src="/three-d/index.html"
          title="Bradwear Studio 3D"
          className="three-d-frame"
          loading="eager"
          allow="camera; microphone; fullscreen"
        />
      </div>
    </div>
  );

  const content = (() => {
    // Routing render halaman publik dan sumber copy utamanya.
    switch (currentRoute) {
      case RouteKey.THREE_D:
        return renderThreeDPage();
      case RouteKey.KATALOG:
        return renderCatalog(
          featured,
          'Katalog seragam custom yang lebih mudah dipilih',
          'Tampilan katalog disusun lebih terarah agar pengunjung mudah membandingkan model, fungsi, dan kesiapan desain sebelum masuk ke editor.',
        );
      case RouteKey.DOWNLOAD:
        return renderDownloadPage();
      case RouteKey.CLIENT:
        return renderClientGallery();
      case RouteKey.ABOUT:
      case RouteKey.VISION_MISSION:
      case RouteKey.PRODUCTS_SERVICES:
      case RouteKey.COMPETITIVE_ADVANTAGE:
      case RouteKey.CLIENT_REACH:
      case RouteKey.LEGAL_LICENSE:
        return renderBrandProfilePage();
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

  const isThreeDRoute = currentRoute === RouteKey.THREE_D;

  return (
    <main className={isThreeDRoute ? 'three-d-page-main' : 'overflow-y-auto pb-0'}>
      {content}
      {lightboxSlide ? (
        <div
          className="slideshow-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Preview gambar penuh"
          onClick={() => setLightboxSlide(null)}
        >
          <div
            className={`slideshow-lightbox-panel ${lightboxSlide.variant === 'size-guide' ? 'is-size-guide' : ''}`}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header popup preview gambar penuh. */}
            <div className="slideshow-lightbox-header">
              <div className="slideshow-lightbox-copy">
                <p className="slideshow-lightbox-kicker">
                  {lightboxSlide.variant === 'size-guide' ? 'Size Guide' : 'Preview Gambar'}
                </p>
                <h2 className="slideshow-lightbox-title">{lightboxSlide.title ?? lightboxSlide.alt}</h2>
                <p className="slideshow-lightbox-description">
                  {lightboxSlide.description ?? 'Klik area luar popup atau tombol close untuk menutup preview.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxSlide(null)}
                className="slideshow-lightbox-close"
                aria-label="Close image preview"
              >
                Close
              </button>
            </div>
            <div className="slideshow-lightbox-body">
              <img
                src={lightboxSlide.src}
                alt={lightboxSlide.alt}
                className={`slideshow-lightbox-image ${lightboxSlide.variant === 'size-guide' ? 'is-size-guide' : ''}`}
              />
            </div>
          </div>
        </div>
      ) : null}
      {!isThreeDRoute ? <SiteFooter onNavigate={setCurrentRoute} /> : null}
    </main>
  );
};

export default PublicSiteView;
