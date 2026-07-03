import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ASSETS, findAssetBySimilarName } from '../assets';
import bottomFastRespondImage from '../assets/Fast Respond.png';
import homeCustomVestpinkImage from '../assets/main hero/model/vestpink.png';
import howToOrderDetailImageA from '../assets/cara order/1.webp.png';
import howToOrderDetailImageB from '../assets/cara order/22.webp';
import howToOrderHeroImage from '../assets/cara order/hero cara orderr.webp';
import clientSlide1 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.21 (1).jpeg';
import clientSlide2 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22 (1).jpeg';
import clientSlide3 from '../assets/SlideShow Client/WhatsApp Image 2026-06-17 at 18.08.22.jpeg';
import { useStore } from '../context/StoreContext';
import { CLIENT_LOGOS } from '../constants';
import {
  ARTICLES,
  buildCatalogProductSlug,
  CONTACT_CHANNELS,
  COURIER_PROVIDERS,
  CATALOG_GUIDE_PATHS,
  CUSTOMER_SERVICE_HOURS,
  HOW_TO_ORDER_STEPS,
  ROUTE_PATHS,
  SITE_FAQS,
  GOOGLE_PLAY_URL,
  SITE_NAME,
  STORE_ADDRESS,
  STORE_MAP_URL,
  getArticleBySlug,
  getArticlePath,
  getArticleSlugFromPathname,
  getCatalogGuideFromPathname,
  getCatalogProductPath,
  getCatalogProductSlugFromPathname,
  buildConsultationMessage,
  buildCustomerServiceMessage,
  buildTrackingUrl,
  buildWhatsAppUrl,
  getTrackingProviderById,
} from '../lib/siteConfig';
import { CompletedOrder, CourierProvider, Product, RouteKey } from '../types';
import BradAiChat from './BradAiChat';
import SiteFooter from './SiteFooter';
import { openCustomerServiceDialog } from '../lib/customerServiceDialog';

const MAIN_HERO_SLIDES = Object.entries(
  import.meta.glob('../assets/main hero/model/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' }),
)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, source]) => source as string);
const HOME_CUSTOM_SLIDES = [homeCustomVestpinkImage];

const CATEGORIES = ['Kemeja', 'Celana', 'Jaket', 'Rompi', 'Polo'] as const;
type CatalogSectionFilter = 'Semua' | (typeof CATEGORIES)[number];
const ALL_MODELS = 'Semua Model';
const CLIENT_GALLERY_SLIDES = [clientSlide1, clientSlide2, clientSlide3].filter(Boolean);
const HOW_TO_ORDER_VISUALS = [howToOrderDetailImageA, howToOrderDetailImageB, howToOrderHeroImage, howToOrderDetailImageA, howToOrderDetailImageB];
const heroTopImage = findAssetBySimilarName(['atas hero', 'hero atas', 'atas'], ['hero']) || ASSETS.BRAND.HERO;
const portfolioHeroImage = findAssetBySimilarName(['portfolio hero', 'portfolio'], ['hero']) || heroTopImage;
const SLIDESHOW_INTERVAL_MS = 5000;
const PORTRAIT_SLIDESHOW_INTERVAL_MS = 10000;
const PROCESS_SLIDE_TRANSITION_MS = 420;
const INSTAGRAM_URL = 'https://www.instagram.com/bradwear_indonesia/';
const TIKTOK_URL = 'https://www.tiktok.com/@bradwearindonesia';
type TestimonialCategoryFilter = 'Semua Testimoni' | 'Instansi Pemerintah' | 'Perusahaan' | 'Pendidikan' | 'Kesehatan';
const DOWNLOAD_HIGHLIGHTS = [
  {
    title: 'Masuk cepat ke katalog web',
    body: 'Arahkan user ke model kemeja, jaket, rompi, polo, dan celana tanpa bergantung pada app store.',
  },
  {
    title: 'Jalur konsultasi langsung',
    body: 'Setelah melihat model, user bisa lanjut ke customer service melalui WhatsApp dari browser biasa di desktop maupun mobile.',
  },
  {
    title: 'Landing page akses web',
    body: 'Halaman ini tetap menjaga route download aktif, tetapi fungsinya diarahkan ke pusat akses website Bradwear.',
  },
];

const TIKTOK_VIDEO_ITEMS = [
  {
    title: 'Seragam kemeja, celana tactical, rompi, polo, dan jaket custom Bradwear',
    note: 'Video TikTok resmi Bradwear',
    url: 'https://www.tiktok.com/@bradwearindonesia/video/7523038151565217029',
    image: clientSlide1,
  },
  {
    title: 'Custom bordir seragam kerja Bradwear sesuai kebutuhan tim',
    note: 'Video TikTok resmi Bradwear',
    url: 'https://www.tiktok.com/@bradwearindonesia/video/7649596708904586517',
    image: clientSlide2,
  },
  {
    title: 'Rekomendasi seragam dokter dan kebutuhan medis dari Bradwear',
    note: 'Video TikTok resmi Bradwear',
    url: 'https://www.tiktok.com/@bradwearindonesia/video/7649676561225977108',
    image: clientSlide3,
  },
] as const;

const INSTAGRAM_ARTICLE_ITEMS = [
  {
    title: 'Testimoni 2026 dari akun Instagram Bradwear',
    note: 'Sorotan Instagram resmi',
    url: 'https://www.instagram.com/bradwear_indonesia/',
    image: clientSlide1,
  },
  {
    title: 'Detail bahan seragam dan panduan visual di Instagram',
    note: 'Sorotan Instagram resmi',
    url: 'https://www.instagram.com/bradwear_indonesia/',
    image: heroTopImage,
  },
  {
    title: 'Celana tactical, vest, dan mockup desain terbaru Bradwear',
    note: 'Sorotan Instagram resmi',
    url: 'https://www.instagram.com/bradwear_indonesia/',
    image: clientSlide2,
  },
  {
    title: 'Update produksi dan konten seragam dinas dari Instagram Bradwear',
    note: 'Sorotan Instagram resmi',
    url: 'https://www.instagram.com/bradwear_indonesia/',
    image: clientSlide3,
  },
] as const;

type BrandProfileItem = {
  route: RouteKey;
  kicker: string;
  title: string;
  intro: string;
  paragraphs: string[];
  points: string[];
  facts?: Array<{ label: string; value: string }>;
  note?: string;
};

type BrandProfileIconKey =
  | 'shield'
  | 'team'
  | 'clock'
  | 'handshake'
  | 'building'
  | 'shirt'
  | 'gauge'
  | 'badge'
  | 'comment'
  | 'pen'
  | 'sample'
  | 'sewing'
  | 'truck';

type BrandProfileValueCard = {
  icon: BrandProfileIconKey;
  title: string;
  copy: string;
};

type BrandProfileStatCard = {
  icon: BrandProfileIconKey;
  value: string;
  label: string;
  copy: string;
};

type BrandProfileStory = {
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  buttonLabel: string;
  articleSlug?: string;
};

type BrandProfileProcessStep = {
  icon: BrandProfileIconKey;
  number: string;
  title: string;
  copy: string;
  detail: string;
};

type BrandProfileCta = {
  title: string;
  copy: string;
  primaryLabel: string;
  primaryMessage: string;
  secondaryLabel: string;
};

type SupportDirectoryItem = {
  question: string;
  answer: string;
};

type SupportDirectorySection = {
  slug: string;
  title: string;
  subtitle: string;
  icon: 'faq' | 'order' | 'shipping' | 'privacy' | 'terms' | 'return' | 'contact';
  items: SupportDirectoryItem[];
};

type BrandProfileVisualItem = {
  route: RouteKey;
  kicker: string;
  title: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  values: BrandProfileValueCard[];
  stats: BrandProfileStatCard[];
  story: BrandProfileStory;
  processTitle: string;
  processSteps: BrandProfileProcessStep[];
  cta: BrandProfileCta;
};

const SUPPORT_DIRECTORY_SECTIONS: SupportDirectorySection[] = [
  {
    slug: 'faq',
    title: 'FAQ',
    subtitle: 'Pertanyaan yang sering ditanyakan',
    icon: 'faq',
    items: SITE_FAQS.map((faq) => ({
      question: faq.title,
      answer: faq.answer,
    })),
  },
  {
    slug: 'cara-order',
    title: 'Cara Order',
    subtitle: 'Panduan pemesanan seragam',
    icon: 'order',
    items: HOW_TO_ORDER_STEPS.map((step, index) => ({
      question: `Tahap ${index + 1}: ${step.title}`,
      answer: `${step.description} ${step.detail}`,
    })),
  },
  {
    slug: 'shipping-production',
    title: 'Pengiriman & Produksi',
    subtitle: 'Informasi waktu produksi & pengiriman',
    icon: 'shipping',
    items: [
      {
        question: 'Berapa estimasi produksi normal Bradwear?',
        answer:
          'Estimasi produksi normal berada di kisaran 14 sampai 21 hari kerja, tergantung jumlah order, kompleksitas desain, bahan, dan antrean produksi saat approval masuk.',
      },
      {
        question: 'Kapan order mulai diproses ke produksi?',
        answer:
          'Produksi dimulai setelah model, bahan, identitas, ukuran, dan ringkasan order sudah disetujui agar tim dapat bekerja lebih rapi tanpa revisi besar di tengah jalan.',
      },
      {
        question: 'Apakah pengiriman bisa dilacak?',
        answer:
          'Ya. Pelanggan bisa memantau status internal melalui order code Bradwear, lalu melanjutkan tracking ke situs resmi kurir saat nomor resi sudah diterbitkan.',
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'Kebijakan privasi',
    icon: 'privacy',
    items: [
      {
        question: 'Data apa yang digunakan saat konsultasi atau order?',
        answer:
          'Bradwear menggunakan data yang Anda kirimkan seperti nama, instansi, nomor WhatsApp, detail model, file logo, dan catatan order hanya untuk kebutuhan konsultasi, approval, produksi, dan tindak lanjut layanan.',
      },
      {
        question: 'Apakah file desain dan identitas instansi dibagikan ke pihak lain?',
        answer:
          'File hanya dipakai secara internal oleh tim yang menangani desain, admin order, dan produksi agar pesanan dapat diselesaikan dengan benar. Publikasi portofolio akan tetap menyesuaikan konteks dan izin yang relevan.',
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    subtitle: 'Syarat dan ketentuan penggunaan',
    icon: 'terms',
    items: [
      {
        question: 'Kapan harga dan timeline dianggap final?',
        answer:
          'Harga dan estimasi waktu dianggap final setelah detail model, bahan, jumlah, ukuran, dan identitas produksi sudah jelas serta disepakati bersama dengan tim Bradwear.',
      },
      {
        question: 'Apakah warna hasil akhir bisa berbeda dari tampilan layar?',
        answer:
          'Sedikit perbedaan visual dapat terjadi karena tampilan layar, pencahayaan foto, dan karakter bahan. Karena itu, pemilihan bahan dan warna selalu lebih aman jika disejajarkan dengan referensi produksi yang jelas.',
      },
    ],
  },
  {
    slug: 'return-policy',
    title: 'Kebijakan Pengembalian',
    subtitle: 'Kebijakan retur & revisi',
    icon: 'return',
    items: [
      {
        question: 'Bagaimana jika hasil tidak sesuai detail yang sudah disetujui?',
        answer:
          'Jika ada ketidaksesuaian terhadap detail approved order, tim Bradwear akan meninjau kasus tersebut dan menyiapkan tindak lanjut revisi yang relevan berdasarkan temuan produksi dan dokumen approval.',
      },
      {
        question: 'Apakah order bisa dibatalkan setelah produksi berjalan?',
        answer:
          'Order yang sudah masuk tahap produksi umumnya tidak dapat dibatalkan sepihak karena bahan, pola, bordir, dan alokasi kerja sudah diproses sesuai brief yang disetujui sebelumnya.',
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Hubungi Kami',
    subtitle: 'Chat, telepon atau email kami',
    icon: 'contact',
    items: [
      {
        question: 'Ke mana saya harus konsultasi paling cepat?',
        answer: `${CONTACT_CHANNELS[0]?.label ?? 'WhatsApp Konsultasi'} tersedia di ${CONTACT_CHANNELS[0]?.value ?? '+62 877-3683-4454'} untuk konsultasi model, bahan, estimasi, dan tindak lanjut order.`,
      },
      {
        question: 'Kapan layanan pelanggan aktif?',
        answer: `Jam operasional utama: ${CUSTOMER_SERVICE_HOURS.join(' • ')}.`,
      },
      {
        question: 'Apakah Bradwear melayani luar kota?',
        answer: `${CONTACT_CHANNELS[1]?.value ?? 'Seluruh Indonesia'}. Titik workshop utama berada di ${CONTACT_CHANNELS[2]?.value ?? 'Tasikmalaya, Jawa Barat'} untuk pengembangan sampel dan kontrol kualitas.`,
      },
    ],
  },
];

// Sumber copy untuk seluruh halaman profil publik berdasarkan company profile resmi.
const BRAND_PROFILE_ITEMS: BrandProfileItem[] = [
  {
    route: RouteKey.ABOUT,
    kicker: 'Tentang Kami',
    title: 'CV. ASTHAJAYA BRADERINDO adalah perusahaan konveksi seragam dinas berizin resmi dengan brand BRADWEAR.',
    intro:
      'CV. ASTHAJAYA BRADERINDO bergerak di bidang konveksi seragam dinas berizin resmi dan menggunakan brand BRADWEAR yang telah terdaftar di DJKI KEMENKUMHAM.',
    paragraphs: [
      'Perusahaan ini memiliki komitmen tinggi dalam menyediakan produk berkualitas terbaik untuk berbagai kebutuhan seragam dinas. Layanan utamanya mencakup pembuatan seragam bagi instansi pemerintahan, perusahaan swasta, sekolah, dan berbagai organisasi lainnya.',
      'Berdasarkan company profile resmi, Bradwear terus berkembang dengan bertumpu pada pengalaman bertahun-tahun di industri konveksi agar dapat memberikan hasil produksi yang rapi, layanan yang jelas, dan tindak lanjut yang profesional kepada pelanggan.',
    ],
    points: [
      'Nama usaha resmi: CV. ASTHAJAYA BRADERINDO',
      'Brand operasional: BRADWEAR',
      'Status brand: terdaftar di DJKI KEMENKUMHAM',
      'Melayani instansi pemerintah, perusahaan swasta, sekolah, dan organisasi',
    ],
    facts: [
      { label: 'Bentuk usaha', value: 'CV. ASTHAJAYA BRADERINDO' },
      { label: 'Brand', value: 'BRADWEAR' },
      { label: 'Bidang', value: 'Konveksi seragam dinas' },
    ],
    note: 'Profil ini disusun dari company profile resmi Bradwear agar informasi yang tampil di website konsisten dengan identitas perusahaan.',
  },
  {
    route: RouteKey.VISION_MISSION,
    kicker: 'Visi & Misi',
    title: 'Menjadi perusahaan konveksi seragam dinas terdepan di Indonesia dengan kualitas, inovasi, dan ketepatan waktu.',
    intro:
      'Visi resmi Bradwear adalah menjadi perusahaan konveksi seragam dinas terdepan di Indonesia dengan mengedepankan kualitas, inovasi, ketepatan waktu, dan kepuasan pelanggan.',
    paragraphs: [
      'Arah kerja ini menempatkan kualitas hasil dan kepuasan pelanggan sebagai standar utama, bukan sekadar target produksi. Karena itu, ritme kerja Bradwear dibangun di atas kontrol detail, disiplin timeline, dan komunikasi yang profesional.',
      'Misi perusahaan menegaskan bahwa setiap pesanan harus ditangani dengan bahan baku terbaik, layanan yang tepat waktu, inovasi desain dan teknologi produksi, serta hubungan jangka panjang yang dibangun dari kepercayaan pelanggan.',
    ],
    points: [
      'Menyediakan seragam dinas dengan standar kualitas tinggi',
      'Menggunakan bahan baku terbaik yang nyaman dan tahan lama',
      'Memberikan pelayanan yang profesional dan tepat waktu',
      'Terus berinovasi dalam desain dan teknologi produksi',
      'Menjalin hubungan jangka panjang dengan klien berdasarkan kepercayaan dan kepuasan',
    ],
    note: 'Visi dan misi ini mengikuti naskah resmi yang tercantum pada dokumen company profile Bradwear.',
  },
  {
    route: RouteKey.PRODUCTS_SERVICES,
    kicker: 'Produk & Layanan',
    title: 'Bradwear menyediakan berbagai jenis seragam dinas sesuai kebutuhan klien dan layanan custom desain.',
    intro:
      'Menurut company profile resmi, Bradwear melayani pembuatan berbagai jenis seragam dinas sesuai kebutuhan instansi, perusahaan, sekolah, fasilitas medis, hingga organisasi dan komunitas.',
    paragraphs: [
      'Cakupan produk utamanya mencakup seragam dinas pemerintah seperti PNS, TNI, POLRI, dan Satpol PP; seragam kerja perusahaan untuk BUMN, swasta, dan startup; seragam medis; seragam sekolah kedinasan; seragam organisasi dan komunitas; serta wearpack.',
      'Selain produk jadi, Bradwear juga menawarkan layanan custom desain berikut bordir logo sesuai permintaan pelanggan. Ini membuat proses pengadaan dan penyesuaian identitas visual bisa dikerjakan dalam satu jalur yang lebih terstruktur.',
    ],
    points: [
      'Seragam dinas pemerintah',
      'Seragam kerja perusahaan',
      'Seragam medis',
      'Seragam sekolah kedinasan',
      'Seragam organisasi dan komunitas',
      'Wearpack',
      'Custom desain dan bordir logo sesuai permintaan',
    ],
    facts: [
      { label: 'Layanan tambahan', value: 'Custom desain' },
      { label: 'Identitas visual', value: 'Bordir logo sesuai permintaan' },
    ],
  },
  {
    route: RouteKey.COMPETITIVE_ADVANTAGE,
    kicker: 'Keunggulan Kami',
    title: 'Keunggulan utama Bradwear ada pada kualitas bahan, jahitan presisi, harga kompetitif, dan desain custom.',
    intro:
      'Company profile resmi Bradwear menempatkan empat keunggulan utama sebagai pembeda layanan: kualitas bahan terbaik, jahitan rapi dan presisi, harga kompetitif, serta kemampuan custom desain.',
    paragraphs: [
      'Kualitas bahan dipilih untuk menghasilkan seragam yang nyaman dan tahan lama, sementara proses jahit dikerjakan oleh tenaga profesional dengan standar kerja yang tinggi agar hasil akhir lebih presisi.',
      'Di sisi penawaran, Bradwear menjaga harga tetap kompetitif tanpa mengorbankan mutu. Pelanggan juga dapat menyesuaikan model, warna, dan logo sesuai kebutuhan instansi atau perusahaan.',
    ],
    points: [
      'Menggunakan bahan berkualitas tinggi yang nyaman dan tahan lama',
      'Dikerjakan oleh tenaga profesional dengan standar jahitan yang tinggi',
      'Menawarkan harga terbaik dengan kualitas maksimal',
      'Bisa custom model, warna, dan logo sesuai permintaan klien',
    ],
  },
  {
    route: RouteKey.CLIENT_REACH,
    kicker: 'Klien & Jangkauan',
    title: 'Bradwear telah dipercaya berbagai instansi, perusahaan, rumah sakit, dan organisasi di seluruh Indonesia.',
    intro:
      'Dokumen company profile menyebut bahwa Bradwear telah dipercaya oleh berbagai instansi pemerintahan, perusahaan swasta, rumah sakit, dan organisasi lainnya di seluruh Indonesia.',
    paragraphs: [
      'Ragam klien ini menunjukkan bahwa kapasitas layanan Bradwear tidak terbatas pada satu sektor saja. Kebutuhan seragam formal, operasional, medis, pendidikan, hingga organisasi masyarakat sudah menjadi bagian dari cakupan kerja perusahaan.',
      'Daftar kategori klien yang ditampilkan dalam dokumen resmi meliputi instansi pemerintah daerah, perusahaan swasta nasional, rumah sakit dan klinik kesehatan, sekolah dan universitas, serta organisasi kemasyarakatan.',
    ],
    points: [
      'Instansi pemerintah daerah',
      'Perusahaan swasta nasional',
      'Rumah sakit dan klinik kesehatan',
      'Sekolah dan universitas',
      'Organisasi kemasyarakatan',
    ],
    facts: [
      { label: 'Cakupan layanan', value: 'Seluruh Indonesia' },
      { label: 'Basis operasional', value: 'Tasikmalaya, Jawa Barat' },
    ],
  },
  {
    route: RouteKey.LEGAL_LICENSE,
    kicker: 'Legal & Lisensi',
    title: 'Identitas usaha, brand, dan kontak resmi Bradwear ditampilkan berdasarkan company profile perusahaan.',
    intro:
      'Halaman ini merangkum identitas resmi yang tercantum pada company profile Bradwear, termasuk nama usaha, status brand, alamat, dan kanal kontak perusahaan.',
    paragraphs: [
      'Dalam dokumen company profile, CV. ASTHAJAYA BRADERINDO dinyatakan sebagai perusahaan konveksi seragam dinas berizin resmi yang menggunakan brand BRADWEAR dan telah terdaftar di DJKI KEMENKUMHAM.',
      'Dokumen juga menampilkan alamat operasional di Karisma Residence, Blok C.46, RT.008/RW.003, Margajaya, Kecamatan Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462, beserta nomor kontak, email perusahaan, dan akun media sosial yang digunakan.',
    ],
    points: [
      'Nama usaha resmi: CV. ASTHAJAYA BRADERINDO',
      'Brand: BRADWEAR',
      'Status brand: terdaftar di DJKI KEMENKUMHAM',
      'Alamat operasional resmi tercantum pada company profile',
      'Kontak perusahaan meliputi telepon, email, dan akun media sosial',
    ],
    facts: [
      { label: 'Nomor telepon', value: '0823-1922-6530' },
      { label: 'Email', value: 'asthajayabraderindo@gmail.com' },
      { label: 'Instagram', value: '@gilangsetianugraha_bradwear' },
      { label: 'Alamat', value: 'Karisma Residence Blok C.46, Margajaya, Mangunreja, Tasikmalaya, Jawa Barat 46462' },
    ],
    note: 'Isi halaman ini mengikuti data yang tercetak pada company profile PDF yang Anda lampirkan.',
  },
];

const BRAND_PROFILE_PROCESS_STEPS: BrandProfileProcessStep[] = [
  {
    icon: 'comment',
    number: '01',
    title: 'Konsultasi',
    copy: 'Diskusi kebutuhan dan arah seragam yang ingin dibangun untuk tim Anda.',
    detail:
      'Tahap ini dipakai untuk memetakan fungsi seragam, konteks pemakaian, target tampilan, referensi visual, serta kebutuhan bahan dan bordir. Dari sini tim Bradwear menyusun arah kerja agar desain dan produksi bergerak di jalur yang sama sejak awal.',
  },
  {
    icon: 'pen',
    number: '02',
    title: 'Desain',
    copy: 'Pembuatan arahan desain dan penyesuaian identitas sesuai kebutuhan kerja.',
    detail:
      'Setelah kebutuhan terkunci, tim menyiapkan arahan desain yang lebih presisi: komposisi warna, penempatan logo, identitas personel, dan bentuk model. Revisi dikendalikan supaya hasil visual tetap jelas dan siap dilanjutkan ke tahap approval.',
  },
  {
    icon: 'sample',
    number: '03',
    title: 'Sampel',
    copy: 'Review sample dan penyamaan ekspektasi sebelum produksi berjalan massal.',
    detail:
      'Sampel membantu menyamakan ekspektasi terhadap bahan, warna, ukuran, dan detail finishing sebelum produksi massal dimulai. Tahap ini penting untuk menekan perubahan mendadak ketika order sudah masuk proses jahit dan kontrol kualitas.',
  },
  {
    icon: 'sewing',
    number: '04',
    title: 'Produksi',
    copy: 'Produksi dijalankan dengan kontrol kualitas, bahan terpilih, dan jahitan presisi.',
    detail:
      'Saat produksi berjalan, setiap item dikerjakan dengan kontrol pada pemotongan bahan, bordir, jahitan, dan kerapian hasil akhir. Fokus utamanya adalah menjaga konsistensi antara approval yang sudah disepakati dengan barang jadi yang diterima klien.',
  },
  {
    icon: 'truck',
    number: '05',
    title: 'Pengiriman',
    copy: 'Pesanan dikirim tepat waktu dengan koordinasi yang jelas sampai barang diterima.',
    detail:
      'Setelah proses akhir selesai, pesanan disiapkan untuk pengiriman dengan koordinasi penerima, alamat, dan jalur distribusi yang lebih rapi. Tim tetap menjaga komunikasi agar status kirim, penerimaan barang, dan tindak lanjut berjalan jelas.',
  },
];

const ABOUT_HERO_IMAGE = ASSETS.BRAND.HERO || heroTopImage;
const ABOUT_SUPPORT_IMAGE = ASSETS.CONTENT.FAST_RESPONSE_HERO || clientSlide1;
const ABOUT_ALT_IMAGE = heroTopImage;
const ABOUT_CLIENT_IMAGE = clientSlide2;
const ABOUT_DELIVERY_IMAGE = clientSlide3;

const BRAND_PROFILE_VISUAL_ITEMS: BrandProfileVisualItem[] = [
  {
    route: RouteKey.CLIENT,
    kicker: 'Portofolio',
    title: 'Portofolio Bradwear Indonesia',
    intro: 'Rangkaian proyek seragam custom untuk instansi, perusahaan, sektor medis, dan tim operasional yang membutuhkan hasil rapi, presisi, dan siap dipresentasikan.',
    heroImage: portfolioHeroImage,
    heroImageAlt: 'Dokumentasi proses produksi seragam custom Bradwear Indonesia',
    values: [
      { icon: 'shield', title: 'Hasil Nyata', copy: 'Setiap visual di halaman ini berasal dari proyek produksi dan dokumentasi yang benar-benar dikerjakan tim Bradwear.' },
      { icon: 'team', title: 'Multi-Sektor', copy: 'Portofolio mencakup kebutuhan pemerintahan, kejaksaan, medis, hingga seragam operasional lapangan.' },
      { icon: 'clock', title: 'Detail Presisi', copy: 'Model, bordir, warna, dan finishing ditampilkan agar tim Anda lebih mudah menilai referensi yang paling cocok.' },
      { icon: 'handshake', title: 'Siap Dikustom', copy: 'Setiap referensi portofolio tetap bisa dikembangkan lagi sesuai identitas instansi atau perusahaan Anda.' },
    ],
    stats: [
      { icon: 'building', value: '1.250+', label: 'Instansi', copy: 'Berbagai institusi dan tim operasional telah mempercayakan kebutuhan seragamnya kepada Bradwear.' },
      { icon: 'shirt', value: '60.000+', label: 'Produk', copy: 'Hasil produksi mencakup kemeja, rompi, jaket, celana, dan kombinasi kebutuhan lapangan.' },
      { icon: 'badge', value: '4 Kategori', label: 'Portofolio Aktif', copy: 'Dokumentasi saat ini diringkas ke dalam kategori utama agar referensi lebih mudah dipilih.' },
      { icon: 'truck', value: 'Nasional', label: 'Jangkauan', copy: 'Proyek datang dari berbagai sektor dan wilayah dengan alur produksi yang tetap terukur.' },
    ],
    story: {
      title: 'Cerita di Balik Portofolio Kami',
      paragraphs: [
        'Portofolio Bradwear dibangun dari kebutuhan nyata klien yang datang dengan standar, identitas visual, dan konteks kerja yang berbeda-beda. Karena itu, setiap hasil jadi yang ditampilkan bukan sekadar foto produk, tetapi bukti bagaimana desain, bahan, dan pengerjaan diterjemahkan menjadi seragam yang siap dipakai.',
        'Halaman ini disusun agar Anda lebih cepat menemukan referensi yang mendekati kebutuhan tim sendiri, lalu melanjutkan diskusi ke model, bahan, dan penyesuaian yang paling relevan.',
      ],
      image: ABOUT_CLIENT_IMAGE,
      imageAlt: 'Dokumentasi hasil proyek klien Bradwear Indonesia',
      buttonLabel: 'Lihat kategori',
    },
    processTitle: 'Alur Proyek Kami',
    processSteps: BRAND_PROFILE_PROCESS_STEPS,
    cta: {
      title: 'Siap Menjadi Proyek Berikutnya?',
      copy: 'Konsultasikan kebutuhan seragam Anda, lalu kami bantu arahkan dari referensi portofolio ke model yang paling tepat untuk produksi.',
      primaryLabel: 'Konsultasi Gratis',
      primaryMessage: 'konsultasi kebutuhan seragam custom dari halaman portofolio',
      secondaryLabel: 'Lihat Katalog',
    },
  },
  {
    route: RouteKey.ABOUT,
    kicker: 'Tentang Kami',
    title: 'Bradwear Indonesia',
    intro: 'Solusi pengadaan seragam custom yang menggabungkan kualitas terbaik, desain profesional, dan pelayanan yang berorientasi pada kepuasan pelanggan.',
    heroImage: ABOUT_HERO_IMAGE,
    heroImageAlt: 'Suasana produksi Bradwear Indonesia',
    values: [
      { icon: 'shield', title: 'Kualitas Terjamin', copy: 'Kami selalu memilih bahan terbaik dan proses produksi berstandar tinggi.' },
      { icon: 'team', title: 'Profesional', copy: 'Didukung tim berpengalaman dan peralatan modern untuk hasil yang konsisten.' },
      { icon: 'clock', title: 'Tepat Waktu', copy: 'Komitmen kami adalah menyelesaikan setiap pesanan sesuai jadwal yang disepakati.' },
      { icon: 'handshake', title: 'Bersama Tumbuh', copy: 'Kami membangun kolaborasi jangka panjang lewat layanan yang jelas dan responsif.' },
    ],
    stats: [
      { icon: 'building', value: '1.250+', label: 'Instansi', copy: 'Telah mempercayakan pengadaan seragamnya kepada Bradwear.' },
      { icon: 'shirt', value: '60.000+', label: 'Produk', copy: 'Diproduksi dengan kontrol kualitas dan pengerjaan yang konsisten.' },
      { icon: 'clock', value: '98%', label: 'Tepat Waktu', copy: 'Komitmen kami dalam setiap proses produksi dan pengiriman.' },
      { icon: 'badge', value: '5+', label: 'Tahun Pengalaman', copy: 'Melayani berbagai kebutuhan seragam di seluruh Indonesia.' },
    ],
    story: {
      title: 'Cerita Bradwear',
      paragraphs: [
        'Bradwear Indonesia berawal dari semangat untuk memberikan solusi seragam berkualitas bagi instansi, perusahaan, dan komunitas di Indonesia.',
        'Kami memahami bahwa seragam bukan hanya pakaian, tetapi juga identitas, kesatuan, dan kebanggaan. Karena itu, setiap produk yang kami hasilkan dibuat dengan ketelitian, tanggung jawab, dan hati. Bradwear dibangun oleh Gilang sebagai owner sekaligus founder, sementara pengelolaan website ditangani Maris Ibrahim agar pengalaman katalog dan konsultasi digital tetap terarah.',
      ],
      image: ABOUT_SUPPORT_IMAGE,
      imageAlt: 'Tim customer service Bradwear Indonesia',
      buttonLabel: 'Selengkapnya',
      articleSlug: 'tentang-bradwear-indonesia-dan-standar-produksi',
    },
    processTitle: 'Proses Kami',
    processSteps: BRAND_PROFILE_PROCESS_STEPS,
    cta: {
      title: 'Siap Mengadakan Seragam Berkualitas untuk Instansi Anda?',
      copy: 'Konsultasikan kebutuhan Anda sekarang juga, tim kami siap membantu dari pemilihan model sampai produksi.',
      primaryLabel: 'Konsultasi Gratis',
      primaryMessage: 'konsultasi kebutuhan seragam custom dari halaman tentang kami',
      secondaryLabel: 'Lihat Katalog',
    },
  },
  {
    route: RouteKey.VISION_MISSION,
    kicker: 'Visi & Misi',
    title: 'Arah kerja yang kami pegang untuk membangun seragam yang layak dipakai dengan bangga.',
    intro: 'Bradwear bergerak dengan visi menjadi perusahaan konveksi seragam dinas terdepan di Indonesia melalui kualitas, inovasi, ketepatan waktu, dan kepuasan pelanggan.',
    heroImage: ABOUT_SUPPORT_IMAGE,
    heroImageAlt: 'Tim Bradwear Indonesia siap melayani konsultasi',
    values: [
      { icon: 'shield', title: 'Mutu Konsisten', copy: 'Setiap misi kami diarahkan pada hasil seragam yang rapi, nyaman, dan tahan digunakan.' },
      { icon: 'team', title: 'Tim Bertanggung Jawab', copy: 'Kami membangun kultur kerja yang fokus pada detail, komunikasi, dan penyelesaian yang jelas.' },
      { icon: 'clock', title: 'Disiplin Timeline', copy: 'Ketepatan waktu menjadi bagian inti dari standar kerja Bradwear.' },
      { icon: 'handshake', title: 'Hubungan Jangka Panjang', copy: 'Kami menempatkan kepercayaan klien sebagai hasil akhir yang paling penting.' },
    ],
    stats: [
      { icon: 'gauge', value: '100%', label: 'Fokus Mutu', copy: 'Kualitas dan kenyamanan selalu menjadi dasar pengambilan keputusan produksi.' },
      { icon: 'clock', value: '24/7', label: 'Koordinasi Cepat', copy: 'Tim responsif untuk kebutuhan follow up, revisi, dan konsultasi order.' },
      { icon: 'building', value: 'Nasional', label: 'Cakupan Layanan', copy: 'Bradwear melayani instansi, perusahaan, dan komunitas di berbagai kota.' },
      { icon: 'badge', value: 'Jangka Panjang', label: 'Orientasi Klien', copy: 'Kami membangun relasi kerja yang berulang dan berkelanjutan.' },
    ],
    story: {
      title: 'Nilai yang Menjadi Dasar Kerja',
      paragraphs: [
        'Visi dan misi Bradwear tidak berhenti sebagai slogan. Keduanya diterjemahkan menjadi standar kualitas bahan, disiplin timeline, inovasi desain, dan layanan yang lebih jelas untuk pelanggan.',
        'Karena itu, setiap proyek dikerjakan dengan fokus pada mutu hasil, kesiapan komunikasi, dan kemampuan memberi solusi yang realistis sejak tahap konsultasi.',
      ],
      image: ABOUT_HERO_IMAGE,
      imageAlt: 'Area produksi Bradwear Indonesia',
      buttonLabel: 'Lihat proses',
    },
    processTitle: 'Bagaimana Visi Itu Dijalankan',
    processSteps: BRAND_PROFILE_PROCESS_STEPS,
    cta: {
      title: 'Perlu Partner Produksi yang Punya Standar Kerja Jelas?',
      copy: 'Diskusikan kebutuhan seragam Anda dan lihat bagaimana tim kami menerjemahkan kebutuhan itu menjadi produksi yang terukur.',
      primaryLabel: 'Konsultasi Gratis',
      primaryMessage: 'diskusi visi produksi dan kebutuhan seragam dari halaman visi misi',
      secondaryLabel: 'Lihat Katalog',
    },
  },
  {
    route: RouteKey.PRODUCTS_SERVICES,
    kicker: 'Produk & Jasa',
    title: 'Layanan seragam custom yang lengkap, dari pemilihan model sampai penyesuaian identitas visual.',
    intro: 'Bradwear melayani berbagai kebutuhan seragam dinas, seragam kerja, wearpack, seragam medis, dan custom desain dengan alur yang lebih terstruktur.',
    heroImage: heroTopImage,
    heroImageAlt: 'Model seragam Bradwear Indonesia',
    values: [
      { icon: 'shirt', title: 'Produk Beragam', copy: 'Kemeja, jaket, rompi, polo, celana, hingga kebutuhan seragam teknis dan lapangan.' },
      { icon: 'pen', title: 'Custom Desain', copy: 'Model, warna, bordir logo, dan identitas dapat disesuaikan sesuai kebutuhan klien.' },
      { icon: 'sample', title: 'Preview Lebih Jelas', copy: 'Arahan desain dibahas lebih awal agar proses produksi lebih terkontrol.' },
      { icon: 'handshake', title: 'Layanan Terintegrasi', copy: 'Konsultasi, desain, produksi, dan pengiriman berjalan dalam satu alur kerja.' },
    ],
    stats: [
      { icon: 'shirt', value: '5 Kategori', label: 'Produk Utama', copy: 'Kemeja, celana, jaket, rompi, dan polo tersedia untuk basis custom.' },
      { icon: 'pen', value: 'Custom', label: 'Desain Fleksibel', copy: 'Bisa disesuaikan untuk instansi, perusahaan, komunitas, dan kebutuhan event.' },
      { icon: 'building', value: 'Multi-Sektor', label: 'Klien', copy: 'Melayani pemerintah, perusahaan, medis, pendidikan, dan organisasi.' },
      { icon: 'clock', value: 'Terstruktur', label: 'Alur Kerja', copy: 'Kebutuhan order diringkas sejak awal agar tindak lanjut lebih cepat.' },
    ],
    story: {
      title: 'Dibuat untuk Kebutuhan yang Berbeda',
      paragraphs: [
        'Setiap klien datang dengan kebutuhan yang tidak sama. Karena itu Bradwear menyediakan pilihan model dasar yang kuat, lalu membuka ruang untuk penyesuaian material, warna, identitas, dan fungsi lapangan.',
        'Pendekatan ini membuat proses pengadaan lebih efisien tanpa mengorbankan identitas visual dan kenyamanan pemakaian.',
      ],
      image: ABOUT_ALT_IMAGE,
      imageAlt: 'Produk kemeja Bradwear Indonesia',
      buttonLabel: 'Selengkapnya',
      articleSlug: 'produk-dan-jasa-seragam-custom-bradwear',
    },
    processTitle: 'Dari Kebutuhan Menjadi Produk Jadi',
    processSteps: BRAND_PROFILE_PROCESS_STEPS,
    cta: {
      title: 'Butuh Rekomendasi Model dan Bahan yang Tepat?',
      copy: 'Kami bisa bantu memilih model yang paling dekat dengan karakter kerja tim Anda sebelum masuk ke tahap desain.',
      primaryLabel: 'Konsultasi Gratis',
      primaryMessage: 'diskusi produk dan jasa seragam custom dari halaman produk jasa',
      secondaryLabel: 'Lihat Katalog',
    },
  },
  {
    route: RouteKey.COMPETITIVE_ADVANTAGE,
    kicker: 'Keunggulan Kami',
    title: 'Bradwear mengutamakan kualitas bahan, jahitan presisi, harga kompetitif, dan layanan custom yang tetap realistis.',
    intro: 'Keunggulan kami dibangun dari kombinasi bahan yang tepat, proses kerja yang disiplin, dan komunikasi yang memudahkan pelanggan mengambil keputusan.',
    heroImage: ABOUT_HERO_IMAGE,
    heroImageAlt: 'Pemandangan area produksi Bradwear',
    values: [
      { icon: 'shield', title: 'Bahan Berkualitas', copy: 'Pemilihan bahan diarahkan pada kenyamanan, daya tahan, dan fungsi pemakaian.' },
      { icon: 'badge', title: 'Jahitan Presisi', copy: 'Standar pengerjaan dibuat agar hasil akhir lebih rapi dan profesional.' },
      { icon: 'gauge', title: 'Harga Kompetitif', copy: 'Kami menjaga nilai terbaik antara kualitas hasil dan biaya pengadaan.' },
      { icon: 'pen', title: 'Custom Relevan', copy: 'Penyesuaian desain dibuka seluas mungkin, tetapi tetap dijaga agar produksi efisien.' },
    ],
    stats: [
      { icon: 'shield', value: 'Premium', label: 'Standar Bahan', copy: 'Material dipilih menyesuaikan kebutuhan formal, lapangan, atau operasional harian.' },
      { icon: 'badge', value: 'Rapi', label: 'Standar Jahit', copy: 'Detail pengerjaan dijaga untuk menciptakan hasil yang lebih presisi.' },
      { icon: 'gauge', value: 'Efisien', label: 'Nilai Pengadaan', copy: 'Solusi biaya dibuat seimbang tanpa menurunkan mutu inti produk.' },
      { icon: 'team', value: 'Responsif', label: 'Layanan', copy: 'Tim kami membantu memperjelas pilihan model, bahan, dan spesifikasi order.' },
    ],
    story: {
      title: 'Keunggulan yang Bisa Dirasakan Langsung',
      paragraphs: [
        'Keunggulan Bradwear bukan hanya terlihat dari tampilan jadi, tetapi juga terasa pada proses komunikasi yang lebih jelas, tindak lanjut yang lebih cepat, dan pilihan produksi yang lebih relevan dengan kebutuhan lapangan.',
        'Tujuannya sederhana: membantu klien mendapat hasil yang pantas dipakai, tepat fungsi, dan mudah dipertanggungjawabkan sebagai pengadaan.',
      ],
      image: ABOUT_SUPPORT_IMAGE,
      imageAlt: 'Customer service dan tim Bradwear Indonesia',
      buttonLabel: 'Selengkapnya',
      articleSlug: 'keunggulan-bradwear-dalam-produksi-seragam-custom',
    },
    processTitle: 'Standar Keunggulan Kami',
    processSteps: BRAND_PROFILE_PROCESS_STEPS,
    cta: {
      title: 'Butuh Seragam dengan Hasil yang Lebih Meyakinkan?',
      copy: 'Sampaikan kebutuhan kerja tim Anda, lalu kami bantu arahkan model, bahan, dan standar pengerjaan yang paling masuk akal.',
      primaryLabel: 'Konsultasi Gratis',
      primaryMessage: 'diskusi keunggulan dan kualitas produksi dari halaman keunggulan',
      secondaryLabel: 'Lihat Katalog',
    },
  },
  {
    route: RouteKey.CLIENT_REACH,
    kicker: 'Klien & Jangkauan',
    title: 'Dipercaya berbagai instansi dan tim operasional dengan cakupan layanan ke seluruh Indonesia.',
    intro: 'Bradwear melayani kebutuhan seragam dari instansi pemerintahan, perusahaan swasta, rumah sakit, sekolah, organisasi, hingga komunitas dengan jalur koordinasi yang tetap sederhana.',
    heroImage: ABOUT_CLIENT_IMAGE,
    heroImageAlt: 'Dokumentasi hasil proyek klien Bradwear',
    values: [
      { icon: 'building', title: 'Lintas Instansi', copy: 'Klien datang dari sektor publik, swasta, medis, pendidikan, dan organisasi.' },
      { icon: 'team', title: 'Komunikasi Mudah', copy: 'Koordinasi kebutuhan tim dilakukan dengan jalur yang lebih cepat dan terarah.' },
      { icon: 'truck', title: 'Jangkauan Luas', copy: 'Pengiriman dan tindak lanjut produksi dirancang untuk kebutuhan klien lintas daerah.' },
      { icon: 'handshake', title: 'Hubungan Berulang', copy: 'Banyak pengadaan berjalan berulang karena hasil dan komunikasi dinilai memuaskan.' },
    ],
    stats: [
      { icon: 'building', value: 'Seluruh Indonesia', label: 'Area Layanan', copy: 'Melayani kebutuhan seragam custom dari berbagai kota dan sektor.' },
      { icon: 'truck', value: 'Tasikmalaya', label: 'Basis Operasional', copy: 'Workshop dan koordinasi utama berada di Tasikmalaya, Jawa Barat.' },
      { icon: 'team', value: 'Multi-Sektor', label: 'Jenis Klien', copy: 'Pemerintah, perusahaan, medis, sekolah, organisasi, dan komunitas.' },
      { icon: 'clock', value: 'Berulang', label: 'Pola Kerja', copy: 'Hubungan pengadaan dibangun untuk jangka panjang, bukan transaksi sesaat.' },
    ],
    story: {
      title: 'Jangkauan yang Dibangun dari Kepercayaan',
      paragraphs: [
        'Cakupan layanan Bradwear tumbuh karena kebutuhan tiap klien dilayani dengan pendekatan yang rapi dan tidak bertele-tele. Ini penting terutama untuk pengadaan yang butuh kejelasan spesifikasi dan timeline.',
        'Dari Tasikmalaya, kami melayani kebutuhan seragam untuk berbagai institusi dengan fokus pada ketepatan, komunikasi, dan hasil yang konsisten.',
      ],
      image: ABOUT_DELIVERY_IMAGE,
      imageAlt: 'Dokumentasi hasil jadi klien Bradwear',
      buttonLabel: 'Selengkapnya',
      articleSlug: 'klien-dan-jangkauan-layanan-seragam-bradwear',
    },
    processTitle: 'Cara Kami Menjangkau Klien',
    processSteps: BRAND_PROFILE_PROCESS_STEPS,
    cta: {
      title: 'Butuh Partner Produksi yang Siap Melayani dari Jarak Jauh?',
      copy: 'Tim kami siap membantu kebutuhan pengadaan seragam custom dengan alur konsultasi, produksi, dan pengiriman yang lebih terukur.',
      primaryLabel: 'Konsultasi Gratis',
      primaryMessage: 'konsultasi pengadaan seragam dari halaman klien dan jangkauan',
      secondaryLabel: 'Lihat Katalog',
    },
  },
];

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

const FaqCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <circle cx="12" cy="12" r="8.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.4a2.47 2.47 0 0 1 4.6 1.27c0 1.35-.88 1.95-1.63 2.47-.7.49-1.22.93-1.22 1.86" />
    <circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

const CartOutlineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h1.6l1.9 9.2h8.8l2-6.3H7.2" />
    <circle cx="10.2" cy="18.2" r="1.45" />
    <circle cx="16.8" cy="18.2" r="1.45" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.6 6 6v5.55c0 4.08 2.53 7.82 6 8.85 3.47-1.03 6-4.77 6-8.85V6l-6-2.4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.55 12.4 1.73 1.72 3.25-3.4" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3.8h6.2L18 7.6V20H8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.8v3.8h4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.1 11.2h5.7M10.1 14.3h5.7M10.1 17.4h4.1" />
  </svg>
);

const ReturnPolicyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.4 8.2H5.2v3.2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.4 11.2A6.9 6.9 0 1 0 7 7.4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.2 12h3.7" />
  </svg>
);

const HeadsetSupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12a7 7 0 0 1 14 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.2 11.8h1.3a1.5 1.5 0 0 1 1.5 1.5v2.4a1.5 1.5 0 0 1-1.5 1.5H6.7A1.7 1.7 0 0 1 5 15.5V13a1.2 1.2 0 0 1 1.2-1.2Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 11.8h1.3A1.2 1.2 0 0 1 19 13v2.5a1.7 1.7 0 0 1-1.7 1.7h-.8a1.5 1.5 0 0 1-1.5-1.5v-2.4a1.5 1.5 0 0 1 1.5-1.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.5c.72.43 1.92.7 3 .7s2.28-.27 3-.7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m7.2 4.8 5 5-5 5" />
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

const InlineWhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
    <path d="M20.52 11.84a8.52 8.52 0 0 1-12.57 7.48l-4.07 1.04 1.09-3.95A8.52 8.52 0 1 1 20.52 11.84Zm-8.5-7.1a7.08 7.08 0 0 0-6.13 10.63l.23.37-.64 2.33 2.4-.63.35.21a7.08 7.08 0 1 0 3.79-12.91Zm4 8.95c-.23-.11-1.31-.64-1.52-.72-.2-.07-.34-.1-.49.11-.14.23-.56.72-.69.87-.13.14-.26.17-.49.05-.23-.1-.93-.34-1.77-1.08-.65-.58-1.1-1.3-1.23-1.52-.12-.21-.01-.33.1-.44.1-.1.23-.26.34-.39.11-.13.14-.22.22-.37.08-.14.04-.28-.02-.39-.06-.11-.48-1.16-.66-1.58-.17-.42-.35-.36-.48-.37h-.41c-.14 0-.37.06-.57.27-.2.21-.75.73-.75 1.77 0 1.03.77 2.04.88 2.17.11.15 1.5 2.3 3.64 3.22.5.22.9.36 1.2.45.5.16.96.14 1.32.09.41-.06 1.31-.53 1.5-1.04.18-.51.18-.94.12-1.04-.05-.09-.2-.15-.42-.26Z" />
  </svg>
);

const BrandProfileIcon: React.FC<{ icon: BrandProfileIconKey; className?: string }> = ({ icon, className }) => {
  const sharedProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    className,
    'aria-hidden': true,
  } as const;

  switch (icon) {
    case 'shield':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.6 18.4 6v5.2c0 4.27-2.66 7.3-6.4 9.2-3.74-1.9-6.4-4.93-6.4-9.2V6L12 3.6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.9 11.95 2.1 2.1 4.1-4.3" />
        </svg>
      );
    case 'team':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.6 9.7a2.6 2.6 0 1 0 0-5.2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.6 19.2c.55-2.8 2.57-4.4 5.4-4.4s4.85 1.6 5.4 4.4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.8 15.3c1.57.2 2.78 1.06 3.58 2.65" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="7.9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.8v4.5l3 1.8" />
        </svg>
      );
    case 'handshake':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.4 12.8 6 15.2a2.1 2.1 0 1 1-2.95-2.97l3.14-3.1a3.9 3.9 0 0 1 5.52 0l.9.9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.6 11.2 2.4-2.4a2.1 2.1 0 1 1 2.95 2.97l-3.14 3.1a3.9 3.9 0 0 1-5.52 0l-.9-.9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 14.1 1.85 1.85a2 2 0 0 0 2.83 0l2.34-2.33" />
        </svg>
      );
    case 'building':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20V7.2L12 4l6 3.2V20" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-3.4h6V20M9 9.4h1.8m3.4 0H15m-6 3.3h1.8m3.4 0H15" />
        </svg>
      );
    case 'shirt':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.2 4.7 12 7l3.8-2.3 3.1 2.8-2 3.6-1.4-.7V20H8.5v-9.6l-1.4.7-2-3.6 3.1-2.8Z" />
        </svg>
      );
    case 'gauge':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.2 16.4a7.7 7.7 0 1 1 13.6 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m12 12 3.7-3.7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.1h.01" />
        </svg>
      );
    case 'badge':
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="10.3" r="4.8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.4 14.4-1.1 5 3.7-2.3 3.7 2.3-1.1-5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m10.55 10.4.95.95 1.95-2.15" />
        </svg>
      );
    case 'comment':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.2 17.9 6.8 15a6.7 6.7 0 1 1 2.1 1.02Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.1h6M9 13.1h4.1" />
        </svg>
      );
    case 'pen':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m5.3 18.7 3.2-.72 8-8a2 2 0 1 0-2.82-2.82l-8 8L5.3 18.7Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 6.7 17.3 11" />
        </svg>
      );
    case 'sample':
      return (
        <svg {...sharedProps}>
          <rect x="6.3" y="5" width="11.4" height="14.3" rx="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.2 5.1h5.6v2H9.2zM9.1 11.2h5.8M9.1 14.2h3.7" />
        </svg>
      );
    case 'sewing':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.1 15.7h13.8v2.2H5.1z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.2 15.7V10a2.3 2.3 0 0 1 2.3-2.3h3.4a2.3 2.3 0 0 1 2.3 2.3v5.7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.4 7.7V5.5h5.2v2.2" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...sharedProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.8 7.4h10.4v7.1H3.8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.2 9.7h3.3l2.4 2.6v2.2h-5.7z" />
          <circle cx="8.1" cy="17.2" r="1.6" />
          <circle cx="17.2" cy="17.2" r="1.6" />
        </svg>
      );
    default:
      return null;
  }
};

const CatalogTrustIcon: React.FC<{ path: React.ReactNode }> = ({ path }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-trust-icon" aria-hidden="true">
    {path}
  </svg>
);

const CatalogGridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-filter-icon" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

const CatalogShirtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-filter-icon" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4.5 12 7l4-2.5 3 2.8-2.2 3.7-1.3-.7V20H8.5v-9.2l-1.3.7L5 7.3l3-2.8Z" />
  </svg>
);

const CatalogPantsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-filter-icon" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l-1 7 1.8 9h-4l-.8-5h-.2l-.8 5H7.2L9 11 8 4Z" />
  </svg>
);

const CatalogJacketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-filter-icon" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.4 4.5 12 7l3.6-2.5 3.1 3.2-1.8 2.8-1.4-.7V20H8.5V9.8l-1.4.7-1.8-2.8 3.1-3.2Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v13" />
  </svg>
);

const CatalogVestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-filter-icon" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 4h7l3 4.6-2.2 1.9V20H7.7v-9.5L5.5 8.6 8.5 4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16" />
  </svg>
);

const ArrowRightTinyIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="catalog-arrow-icon" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h12m-4-4 4 4-4 4" />
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

const clientLogoMap = Object.fromEntries(CLIENT_LOGOS.map((client) => [client.name, client.logo])) as Record<string, string>;
const medisGalleryCover = ASSETS.CLIENT_GALLERY.find((group) => group.slug === 'medis')?.images[0] ?? null;

const TESTIMONIAL_FILTERS: TestimonialCategoryFilter[] = [
  'Semua Testimoni',
  'Instansi Pemerintah',
  'Perusahaan',
  'Pendidikan',
  'Kesehatan',
];

const TESTIMONIAL_STATS = [
  {
    label: 'Instansi',
    value: '1.250+',
    caption: 'Telah dilayani',
    icon: 'building' as const,
  },
  {
    label: 'Produk',
    value: '60.000+',
    caption: 'Telah diproduksi',
    icon: 'team' as const,
  },
  {
    label: 'Kepuasan Klien',
    value: '98%',
    caption: 'Berdasarkan survei',
    icon: 'gauge' as const,
  },
  {
    label: 'Tahun Pengalaman',
    value: '5+',
    caption: 'Berpengalaman',
    icon: 'badge' as const,
  },
];

const TESTIMONIAL_ITEMS = [
  {
    organization: 'Kementerian Dalam Negeri',
    division: 'Biro Umum dan Pengadaan',
    role: 'Tim administrasi pusat',
    category: 'Instansi Pemerintah' as TestimonialCategoryFilter,
    logo: clientLogoMap['KEMENDAGRI'],
    quote:
      'Kualitas bahan sangat baik, jahitan rapi, dan proses koordinasi dengan tim Bradwear terasa jelas dari awal sampai akhir produksi.',
  },
  {
    organization: 'Kementerian Perhubungan',
    division: 'Unit Operasional Lapangan',
    role: 'Koordinator seragam kerja',
    category: 'Instansi Pemerintah' as TestimonialCategoryFilter,
    logo: clientLogoMap['KEMENHUB'],
    quote:
      'Seragam yang dibuat sesuai kebutuhan tim kami. Finishing bordir terlihat rapi dan pengiriman datang sesuai timeline yang dijanjikan.',
  },
  {
    organization: 'Kementerian BUMN',
    division: 'Divisi Pengadaan Regional',
    role: 'Supervisor administrasi',
    category: 'Perusahaan' as TestimonialCategoryFilter,
    logo: clientLogoMap.BUMN,
    quote:
      'Tim Bradwear responsif saat revisi desain dan hasil akhirnya terasa premium. Vendor ini enak diajak kerja untuk kebutuhan seragam skala besar.',
  },
  {
    organization: 'BAPPENAS',
    division: 'Sekretariat Program',
    role: 'Manajer dukungan operasional',
    category: 'Perusahaan' as TestimonialCategoryFilter,
    logo: clientLogoMap.BAPPENAS,
    quote:
      'Produksi berjalan rapi dari approval sampai pengiriman. Kami terbantu karena update progresnya jelas dan tidak membingungkan tim internal.',
  },
  {
    organization: 'Tut Wuri Handayani',
    division: 'Kemitraan Pendidikan',
    role: 'Wakil kepala unit',
    category: 'Pendidikan' as TestimonialCategoryFilter,
    logo: clientLogoMap['TUT WURI'],
    quote:
      'Seragam untuk kebutuhan pendidikan terlihat bersih, nyaman dipakai, dan warnanya konsisten. Siswa dan tenaga pendamping merasa puas dengan hasilnya.',
  },
  {
    organization: 'Unit Medis Bradwear Client',
    division: 'Layanan umum rumah sakit',
    role: 'Kepala bagian umum',
    category: 'Kesehatan' as TestimonialCategoryFilter,
    logo: medisGalleryCover,
    quote:
      'Bahan terasa nyaman untuk dipakai seharian dan kualitas jahitannya kuat. Pesanan untuk tim medis datang tepat waktu tanpa kendala berarti.',
  },
];

const CLIENT_GALLERY_META: Record<string, { title: string; subtitle: string; logo?: string | null }> = {
  dinsos: {
    title: 'Dinsos',
    subtitle: 'Dokumentasi seragam untuk kebutuhan layanan sosial dan aktivitas lapangan.',
    logo: clientLogoMap.KEMENDAGRI,
  },
  kejagung: {
    title: 'Kejagung',
    subtitle: 'Galeri hasil jadi dengan karakter formal, tegas, dan siap dipresentasikan.',
    logo: clientLogoMap['DPR RI'],
  },
  medis: {
    title: 'Medis',
    subtitle: 'Referensi visual seragam dengan nuansa bersih, ringan, dan profesional.',
    logo: medisGalleryCover,
  },
  pemkab: {
    title: 'Pemkab',
    subtitle: 'Portofolio seragam instansi pemerintah daerah untuk kebutuhan dinas dan operasional.',
    logo: clientLogoMap.BAPPENAS,
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
    name: 'Drill',
    note: 'Serbaguna dan stabil',
    image: ASSETS.CONTENT.MATERIAL_GUIDE_IMAGES.DRILL,
    specification: 'Karakter kain stabil, cukup padat, dan aman dipakai untuk seragam kerja yang butuh struktur rapi namun tetap nyaman.',
    usage: 'Kemeja kerja, celana operasional, jaket ringan, dan seragam harian instansi.',
    description:
      'Drill berada di jalur bahan yang mudah dipakai untuk banyak kebutuhan seragam. Kesan visualnya tetap rapi, cukup kokoh untuk pemakaian rutin, dan relatif aman untuk kebutuhan kantor maupun operasional lapangan menengah.',
    advantages: ['Fleksibel untuk banyak model seragam', 'Tampilan tetap rapi saat dipakai rutin', 'Cocok untuk kebutuhan kerja harian'],
    disadvantages: ['Tidak seringan tropical untuk cuaca sangat panas', 'Tidak se-teknis ripstop untuk medan berat'],
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

type ProductDetailContent = {
  material: string;
  pocketLayout: string;
  silhouette: string;
  embroidery: string;
  bestFor: string;
  intro: string;
  badges: string[];
  features: Array<{ title: string; copy: string }>;
  craftsmanship: string[];
};

const SIZE_GUIDE_DETAIL_POINTS = [
  {
    title: 'Baca ukuran dasar lebih cepat',
    copy: 'Gunakan tabel ini untuk menyiapkan panjang badan, lebar dada, bahu, dan panjang lengan sebelum diskusi order masuk ke tahap final.',
  },
  {
    title: 'Validasi per divisi atau gender',
    copy: 'Jika tim Anda memiliki kombinasi ukuran pria, wanita, atau kebutuhan custom, panduan ini membantu menyamakan acuan awal sebelum detail dibahas lebih lanjut.',
  },
  {
    title: 'Tetap bisa lanjut ukuran khusus',
    copy: 'Untuk kebutuhan yang lebih presisi, CTA desain dan konsultasi tetap membuka jalur custom size agar tim Bradwear bisa menyesuaikan pola dengan kebutuhan lapangan.',
  },
] as const;

const PRODUCT_CATEGORY_DETAIL_DEFAULTS: Record<Product['category'], ProductDetailContent> = {
  Kemeja: {
    material: 'Japan Drill, Tropical, atau Oxford premium sesuai kebutuhan visual dan ritme kerja.',
    pocketLayout: 'Dua area saku depan yang bisa disesuaikan menjadi flap formal, utility pocket, atau kompartemen alat tulis.',
    silhouette: 'Potongan semi formal tactical yang tetap rapi untuk dinas, operasional, dan aktivitas presentasi tim.',
    embroidery: 'Bordir timbul 3D dan identitas personel ditempatkan agar tetap terbaca jelas saat dipakai harian.',
    bestFor: 'Seragam dinas, operasional kantor, pengadaan instansi, dan tim lapangan ringan.',
    intro: 'Model kemeja Bradwear dirancang agar tampilan tetap profesional, namun masih fleksibel untuk fungsi kerja harian dan kebutuhan custom identitas tim.',
    badges: ['Premium Stitching', 'Bordir 3D', 'Custom Pocket'],
    features: [
      { title: 'Saku depan lebih tegas', copy: 'Layout saku dibangun agar area utilitas terlihat rapi sekaligus fungsional untuk kebutuhan kerja harian.' },
      { title: 'Bahan premium sesuai ritme kerja', copy: 'Pemilihan kain diarahkan ke target visual, kenyamanan, dan tingkat mobilitas tim agar hasil akhir tidak sekadar bagus di foto.' },
      { title: 'Kerah, manset, dan panel bordir lebih presisi', copy: 'Detail kecil seperti posisi emblem, piping, dan panel nama dipersiapkan agar tetap konsisten saat masuk produksi massal.' },
    ],
    craftsmanship: [
      'Jahitan rapat untuk menjaga struktur kemeja tetap stabil.',
      'Bordir timbul 3D bisa ditempatkan di dada, lengan, atau punggung.',
      'Pilihan saku dapat dibuat lebih formal atau lebih tactical sesuai kebutuhan.',
    ],
  },
  Celana: {
    material: 'Drill, Ripstop, atau Japan Drill untuk struktur celana kerja dan tactical yang tetap nyaman dipakai seharian.',
    pocketLayout: 'Kompartemen samping dan belakang bisa diatur untuk fungsi cargo ringan, tactical, atau kerja lapangan yang lebih formal.',
    silhouette: 'Cutting lurus-tegas dengan ruang gerak yang aman untuk aktivitas mobile, inspeksi, dan operasional teknis.',
    embroidery: 'Identitas 3D dapat ditempatkan pada flap, panel belakang, atau detail aksen yang tetap proporsional.',
    bestFor: 'Celana kerja, tactical, lapangan, dan seragam operasional dengan mobilitas tinggi.',
    intro: 'Detail celana Bradwear dibuat agar tidak hanya terlihat kokoh, tetapi juga nyaman dipakai untuk ritme kerja yang aktif dari pagi sampai sore.',
    badges: ['Tactical Utility', 'Reinforced Stitch', '3D Accent Ready'],
    features: [
      { title: 'Kantong utilitas lebih fungsional', copy: 'Posisi saku disiapkan agar tetap mudah dijangkau tanpa membuat siluet celana terlalu berat.' },
      { title: 'Potongan lebih aman untuk bergerak', copy: 'Ruang paha, lutut, dan bukaan bawah dibuat lebih stabil agar nyaman dipakai saat banyak perpindahan titik kerja.' },
      { title: 'Material kokoh namun tetap terukur', copy: 'Pilihan kain diarahkan pada kebutuhan kerja lapangan, bukan sekadar kesan tactical yang berlebihan.' },
    ],
    craftsmanship: [
      'Jahitan penguat pada area rawan tarik dan gesekan.',
      'Panel saku bisa disesuaikan untuk kebutuhan cargo, formal, atau semi tactical.',
      'Aksen identitas dibuat tetap rapi tanpa mengganggu fungsi utama celana.',
    ],
  },
  Jaket: {
    material: 'Taslan, drill, atau kombinasi bahan luar dan lining yang disesuaikan dengan target visual dan pemakaian lapangan.',
    pocketLayout: 'Saku samping, saku dada, dan kompartemen dalam bisa diatur agar jaket tetap rapi namun fungsional.',
    silhouette: 'Struktur jaket dibuat solid, lebih tegas di bahu, dan nyaman untuk layer seragam kerja harian.',
    embroidery: 'Bordir timbul 3D dan patch logo tetap bisa diangkat tanpa membuat panel jaket terasa berat.',
    bestFor: 'Jaket tim, safety, operasional luar ruang, dan seragam kerja dengan kebutuhan proteksi tambahan.',
    intro: 'Jaket Bradwear dibuat untuk kebutuhan seragam yang membutuhkan kesan kuat, pelindung, dan tetap pantas dipakai sebagai identitas tim di lapangan.',
    badges: ['Layered Comfort', 'Bold Utility', '3D Patch Ready'],
    features: [
      { title: 'Panel luar lebih rapi', copy: 'Bidang depan jaket disusun agar logo, nama tim, dan garis aksen tetap terlihat bersih dari jarak dekat maupun jauh.' },
      { title: 'Saku kerja dan kompartemen tambahan', copy: 'Posisi saku dibuat lebih praktis untuk aktivitas lapangan, briefing, dan mobilitas luar ruang.' },
      { title: 'Struktur tegas untuk branding tim', copy: 'Jaket memberi bidang visual yang kuat untuk membangun kesan profesional pada tim operasional.' },
    ],
    craftsmanship: [
      'Area saku dan resleting dijahit lebih rapat untuk pemakaian rutin.',
      'Bordir timbul 3D dan patch bisa dipasang pada area dada atau lengan.',
      'Finishing dirapikan agar jatuh jaket tetap presisi saat dipakai berlapis.',
    ],
  },
  Rompi: {
    material: 'Drill, canvas ringan, atau bahan teknis lapangan yang memberi struktur kuat namun tetap mudah dipakai bergerak.',
    pocketLayout: 'Multi pocket depan dan panel samping dapat diatur untuk membawa alat kerja ringan, identitas, atau kebutuhan tim lapangan.',
    silhouette: 'Rompi dibuat lebih ringkas di badan agar area saku tetap fungsional tanpa terlihat penuh berlebihan.',
    embroidery: 'Logo tim, patch identitas, dan bordir 3D dapat diposisikan agar tetap terbaca di area dada dan punggung.',
    bestFor: 'Rompi lapangan, rompi safety, tim proyek, dan kebutuhan operasional yang memerlukan utilitas ekstra.',
    intro: 'Rompi Bradwear cocok dipakai ketika tim membutuhkan identitas visual yang kuat sekaligus area utilitas tambahan untuk pekerjaan lapangan.',
    badges: ['Multi Pocket', 'Lapangan Ready', 'Identity Focused'],
    features: [
      { title: 'Panel saku lebih banyak', copy: 'Konfigurasi saku disusun agar rompi tetap rapat ke badan tetapi masih praktis untuk alat kerja ringan.' },
      { title: 'Area dada dan punggung lebih mudah dibaca', copy: 'Logo, nama tim, dan label keselamatan bisa diangkat lebih jelas berkat bidang rompi yang tegas.' },
      { title: 'Tetap nyaman untuk mobilitas tinggi', copy: 'Bobot dan struktur rompi dijaga agar tidak terasa terlalu berat saat dipakai berjam-jam.' },
    ],
    craftsmanship: [
      'Kombinasi saku dapat dibuat lebih teknis atau lebih formal tergantung sektor kerja.',
      'Bordir timbul 3D tetap aman dipasang pada panel yang lebih tebal.',
      'Finishing sisi rompi dirapikan agar area utilitas tidak tampak berantakan.',
    ],
  },
  Polo: {
    material: 'Lacoste premium, cotton combed, atau dry fit yang diarahkan ke kenyamanan harian dan tampilan lebih santai tetapi tetap rapi.',
    pocketLayout: 'Opsional saku kecil atau panel dada bersih untuk menonjolkan bordir logo dan identitas tim.',
    silhouette: 'Polo dibuat lebih ringkas, mudah dipakai harian, namun tetap membawa citra profesional saat dipakai bersama tim.',
    embroidery: 'Bordir timbul 3D dan logo dada bisa ditonjolkan lebih clean pada area front panel polo.',
    bestFor: 'Seragam casual formal, event, komunitas, dan kebutuhan kantor dengan nuansa santai premium.',
    intro: 'Polo Bradwear diarahkan untuk kebutuhan seragam yang lebih santai namun tetap menjaga kesan rapi dan identitas visual yang kuat.',
    badges: ['Casual Premium', 'Clean Embroidery', 'Daily Comfort'],
    features: [
      { title: 'Panel dada lebih bersih', copy: 'Area depan polo memberi ruang logo dan bordir lebih tegas tanpa banyak gangguan detail tambahan.' },
      { title: 'Nyaman dipakai harian', copy: 'Bahan diarahkan ke kenyamanan kulit dan flow yang lebih ringan untuk pemakaian panjang.' },
      { title: 'Mudah dipadukan dengan banyak divisi', copy: 'Polo cocok untuk tim event, frontliner, komunitas, atau staf internal yang butuh visual santai tetapi tetap seragam.' },
    ],
    craftsmanship: [
      'Kerah dan placket dijaga agar tetap rapi setelah pemakaian rutin.',
      'Bordir 3D bisa tampil clean pada area dada kiri atau kanan.',
      'Aksen warna dan lis dapat disesuaikan untuk memperkuat identitas tim.',
    ],
  },
};

const PRODUCT_DETAIL_OVERRIDES: Record<string, Partial<ProductDetailContent>> = {
  k2: {
    material: 'Japan Drill premium dengan struktur rapi untuk kebutuhan semi formal tactical.',
    pocketLayout: 'Dua saku flap depan dengan kompartemen alat tulis dan panel dada yang tetap seimbang secara visual.',
    silhouette: 'Semi formal tactical dengan badan lebih bersih dan garis jahit tegas.',
    embroidery: 'Bordir timbul 3D menonjol di area dada tanpa mengganggu keseimbangan layout kemeja.',
  },
  k3: {
    material: 'Oxford atau Tropical premium untuk tampilan modern yang lebih clean.',
    pocketLayout: 'Saku depan dibuat lebih ramping agar tetap fungsional tetapi visualnya lebih ringan.',
    silhouette: 'Modern fit yang lebih halus untuk kebutuhan kantor, event, dan tim representatif.',
  },
  k1: {
    material: 'Ripstop Tornado premium untuk kebutuhan aktif dengan struktur kain lebih kuat.',
    pocketLayout: 'Dual pocket depan dan ventilasi punggung membuat model ini cocok untuk ritme kerja yang lebih dinamis.',
    embroidery: 'Logo 3D dan panel nama tetap aman saat digabung dengan detail ventilasi.',
  },
  k11: {
    material: 'Japan Drill atau Ripstop dengan karakter tactical yang lebih tangguh.',
    pocketLayout: 'Beberapa saku utilitas depan cocok untuk tim lapangan dan kebutuhan akses cepat.',
    silhouette: 'Tactical penuh dengan bidang dada yang tegas dan panel kerja yang kuat.',
  },
  k5: {
    material: 'Drill premium dengan struktur padat untuk kebutuhan dinas dan operasional.',
    pocketLayout: 'Desain kantong terbaru memberi bidang saku yang lebih kuat dan mudah dibaca.',
    embroidery: 'Bordir 3D lebih menonjol karena bidang depan model ini cenderung solid.',
  },
  k6: {
    material: 'Tropical premium untuk flow kain yang lebih ringan dan bersih.',
    pocketLayout: 'Saku lebih minimal sehingga fokus utama ada di logo dan garis potongan model.',
  },
  k8: {
    material: 'Katun drill untuk kebutuhan PDH yang rapi, aman, dan nyaman dipakai harian.',
    pocketLayout: 'Dua saku depan formal dengan penataan yang lebih klasik untuk instansi.',
  },
  k10: {
    material: 'Stanford atau Oxford premium untuk karakter formal ekspor yang lebih refined.',
    pocketLayout: 'Bidang saku tetap hadir namun dibuat lebih bersih untuk kesan premium.',
  },
  k12: {
    material: 'Material premium formal tactical dengan jatuh kain lebih elegan.',
    silhouette: 'Lebih formal, presisi, dan cocok untuk tim yang ingin citra eksklusif.',
    embroidery: 'Bordir timbul 3D tampil lebih clean pada panel depan yang minim distraksi.',
  },
  j1: {
    material: 'Taslan dan lining ringan untuk jaket bomber industri yang tetap nyaman dipakai bergerak.',
    pocketLayout: 'Saku samping dan kompartemen internal menjaga fungsi tanpa mengorbankan bentuk bomber yang bersih.',
  },
  r1: {
    material: 'Drill premium dengan struktur rompi yang kuat untuk lapangan aktif.',
    pocketLayout: 'Multi pocket depan siap untuk kebutuhan alat kerja ringan dan identitas tim.',
  },
  r2: {
    material: 'Parasute ringan dengan handling lebih fleksibel untuk mobilitas tinggi.',
    pocketLayout: 'Saku depan disusun agar rompi tetap ringan dan cepat dipakai untuk aktivitas luar ruang.',
  },
  c1: {
    material: 'Ripstop tactical untuk kebutuhan outdoor berat dan mobilitas tinggi.',
    pocketLayout: 'Cargo pocket samping dan belakang membantu tim membawa alat kerja lapangan secara lebih praktis.',
  },
  c2: {
    material: 'Drill atau Japan Drill dengan durabilitas tinggi untuk aktivitas teknis.',
    silhouette: 'Cutting lebih kokoh dan terasa aman untuk pemakaian kerja intens.',
  },
  c3: {
    material: 'Bahan kerja fungsional yang tetap nyaman untuk ritme operasional harian.',
    pocketLayout: 'Panel saku dibuat lebih bersih untuk menyeimbangkan fungsi dan tampilan.',
  },
  c4: {
    material: 'Drill tactical dengan opsi warna lebih luas untuk tim operasional.',
    pocketLayout: 'Utility pocket dan flap belakang membuat model ini lebih siap untuk kebutuhan semi tactical.',
  },
  p1: {
    material: 'Lacoste premium dengan handfeel rapi untuk seragam santai profesional.',
    pocketLayout: 'Area dada clean lebih cocok untuk bordir logo dan identitas yang ingin tampil sederhana.',
  },
};

const PublicSiteView: React.FC = () => {
  const {
    currentRoute,
    currentPathname,
    setCurrentRoute,
    products,
    handleSelectProduct,
    setSelectedProduct,
    updateDesignData,
    productionOrders,
    preferredCatalogCategory,
    setPreferredCatalogCategory,
  } = useStore();
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('Kemeja');
  const [activeCatalogSection, setActiveCatalogSection] = useState<CatalogSectionFilter>(() =>
    currentRoute === RouteKey.PANTS ? 'Celana' : 'Semua',
  );
  const [activeModelFilter, setActiveModelFilter] = useState<string>(ALL_MODELS);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeCatalogHeroSlide, setActiveCatalogHeroSlide] = useState(0);
  const [activeHomeCustomSlide, setActiveHomeCustomSlide] = useState(0);
  const [activeClientSlide, setActiveClientSlide] = useState(0);
  const [lightboxSlide, setLightboxSlide] = useState<LightboxSlide | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>(COURIER_PROVIDERS[0]);
  const [trackingReceipt, setTrackingReceipt] = useState('');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [trackingLookup, setTrackingLookup] = useState('');
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [openFaqSlug, setOpenFaqSlug] = useState<string | null>(SITE_FAQS[0]?.slug ?? null);
  const [openSupportSectionSlug, setOpenSupportSectionSlug] = useState<string | null>(SUPPORT_DIRECTORY_SECTIONS[0]?.slug ?? null);
  const [activeHowToOrderStepIndex, setActiveHowToOrderStepIndex] = useState(0);
  const [activeProfileProcessStepIndex, setActiveProfileProcessStepIndex] = useState(0);
  const [leavingProfileProcessStepIndex, setLeavingProfileProcessStepIndex] = useState<number | null>(null);
  const [profileProcessMotionDirection, setProfileProcessMotionDirection] = useState<'forward' | 'backward'>('forward');
  const [activeHomeCarouselSlide, setActiveHomeCarouselSlide] = useState(0);
  const [articleHighlightIndex, setArticleHighlightIndex] = useState(0);
  const [articleCommentName, setArticleCommentName] = useState('');
  const [articleCommentBody, setArticleCommentBody] = useState('');
  const [articleCommentStatus, setArticleCommentStatus] = useState('');
  const [activeTestimonialFilter, setActiveTestimonialFilter] = useState<TestimonialCategoryFilter>('Semua Testimoni');
  const catalogRef = useRef<HTMLElement | null>(null);
  const homeCarouselTouchStartX = useRef<number | null>(null);
  const homeCarouselTouchDeltaX = useRef(0);
  const profileProcessTransitionTimeoutRef = useRef<number | null>(null);
  const activeArticleSlug = getArticleSlugFromPathname(currentPathname);
  const activeArticle = getArticleBySlug(activeArticleSlug);
  const activeCatalogGuide = getCatalogGuideFromPathname(currentPathname);
  const visibleTestimonials = useMemo(
    () =>
      activeTestimonialFilter === 'Semua Testimoni'
        ? TESTIMONIAL_ITEMS
        : TESTIMONIAL_ITEMS.filter((item) => item.category === activeTestimonialFilter),
    [activeTestimonialFilter],
  );
  const downloadPreviewHero = ASSETS.CONTENT.GOOGLE_PLAY_GALLERY[0] ?? null;
  const downloadPreviewSlides = ASSETS.CONTENT.GOOGLE_PLAY_GALLERY.slice(1, 4);

  const heroSlides = useMemo(
    () => (MAIN_HERO_SLIDES.length ? MAIN_HERO_SLIDES : (ASSETS.BRAND.SLIDES?.length ? ASSETS.BRAND.SLIDES : [ASSETS.BRAND.HERO]).filter(Boolean)),
    [],
  );
  const safeHeroSlides = heroSlides.length > 0 ? heroSlides : [ASSETS.KEMEJA.BRAD_V3.FRONT];
  const safeHomeCustomSlides = HOME_CUSTOM_SLIDES.length > 0 ? HOME_CUSTOM_SLIDES : safeHeroSlides;
  const catalogHeroSlides = MAIN_HERO_SLIDES.length > 0 ? MAIN_HERO_SLIDES : safeHeroSlides;
  useEffect(() => {
    setActiveHeroSlide(0);
  }, [safeHeroSlides]);

  useEffect(() => {
    if (safeHeroSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % safeHeroSlides.length);
    }, PORTRAIT_SLIDESHOW_INTERVAL_MS);
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
    setActiveCatalogHeroSlide(0);
  }, [safeHeroSlides]);

  useEffect(() => {
    if (currentRoute !== RouteKey.KATALOG || catalogHeroSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveCatalogHeroSlide((prev) => (prev + 1) % catalogHeroSlides.length);
    }, PORTRAIT_SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [catalogHeroSlides, currentRoute]);

  useEffect(() => {
    setActiveHomeCustomSlide(0);
  }, [safeHomeCustomSlides]);

  useEffect(() => {
    if (safeHomeCustomSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveHomeCustomSlide((prev) => (prev + 1) % safeHomeCustomSlides.length);
    }, PORTRAIT_SLIDESHOW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [safeHomeCustomSlides]);


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
    const revealNodes = Array.from(main.querySelectorAll<HTMLElement>('.scroll-reveal-block')).filter((node) => node.offsetHeight > 32);

    if (parallaxNodes.length === 0 && revealNodes.length === 0) return;

    parallaxNodes.forEach((node) => node.classList.add('scroll-parallax'));
    revealNodes.forEach((node) => node.classList.remove('is-visible'));

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

      revealNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
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
      revealNodes.forEach((node) => node.classList.remove('is-visible'));
    };
  }, [currentPathname, currentRoute]);

  useEffect(() => {
    if (currentRoute === RouteKey.PANTS) {
      setActiveCategory('Celana');
      setActiveCatalogSection('Celana');
      setActiveModelFilter(ALL_MODELS);
      return;
    }

    if (currentRoute === RouteKey.KATALOG) {
      setActiveCatalogSection((previous) => (previous === 'Celana' ? 'Semua' : previous));
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

  const visibleProducts = useMemo(() => products.filter((product) => !product.isHidden), [products]);
  const activeCatalogProduct = useMemo(() => {
    const productSlug = getCatalogProductSlugFromPathname(currentPathname);
    if (!productSlug) return null;
    return visibleProducts.find((product) => buildCatalogProductSlug(product) === productSlug) ?? null;
  }, [currentPathname, visibleProducts]);

  useEffect(() => {
    const productSlug = getCatalogProductSlugFromPathname(currentPathname);
    if (currentRoute === RouteKey.KATALOG && productSlug && !activeCatalogProduct) {
      setCurrentRoute(RouteKey.KATALOG, { path: ROUTE_PATHS[RouteKey.KATALOG], replace: true });
    }
  }, [activeCatalogProduct, currentPathname, currentRoute, setCurrentRoute]);

  useEffect(() => {
    if (!activeCatalogProduct) return;
    setSelectedProduct(activeCatalogProduct);
    updateDesignData({ productId: activeCatalogProduct.id });
  }, [activeCatalogProduct, setSelectedProduct, updateDesignData]);

  useEffect(() => {
    setArticleCommentName('');
    setArticleCommentBody('');
    setArticleCommentStatus('');
  }, [activeArticleSlug]);
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
  const activeBrandProfileVisualPage = useMemo(
    () => BRAND_PROFILE_VISUAL_ITEMS.find((item) => item.route === currentRoute) ?? null,
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
  const articleHeadlineItems = articleFeed.slice(0, 5);
  const activeArticleHeadline = articleHeadlineItems[articleHighlightIndex % Math.max(articleHeadlineItems.length, 1)] ?? articleSpotlight;
  const activeProcessVisualPage = activeBrandProfileVisualPage ?? (currentRoute === RouteKey.CLIENT ? BRAND_PROFILE_VISUAL_ITEMS.find((item) => item.route === RouteKey.CLIENT) ?? null : null);
  const categorySummaryRows = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        modelCount: visibleProducts.filter((product) => product.category === category).length,
      })),
    [visibleProducts],
  );
  const catalogSections = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        products: visibleProducts.filter((product) => product.category === category),
      })).filter((section) => section.products.length > 0),
    [visibleProducts],
  );
  const visibleCatalogSections = useMemo(
    () =>
      activeCatalogSection === 'Semua'
        ? catalogSections
        : catalogSections.filter((section) => section.category === activeCatalogSection),
    [activeCatalogSection, catalogSections],
  );

  useEffect(() => {
    setArticleHighlightIndex(0);
  }, [currentRoute, activeArticleSlug]);

  useEffect(() => {
    setActiveProfileProcessStepIndex(0);
    setLeavingProfileProcessStepIndex(null);
    setProfileProcessMotionDirection('forward');
  }, [currentRoute]);

  useEffect(() => {
    return () => {
      if (profileProcessTransitionTimeoutRef.current) {
        window.clearTimeout(profileProcessTransitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentRoute !== RouteKey.ARTIKEL || activeArticle || articleHeadlineItems.length < 2) return;

    const timer = window.setInterval(() => {
      setArticleHighlightIndex((prev) => (prev + 1) % articleHeadlineItems.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [activeArticle, articleHeadlineItems.length, currentRoute]);

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

  const handleCatalogCategorySelect = (category: CatalogSectionFilter) => {
    if (category === 'Semua') {
      setActiveCatalogSection('Semua');
      setActiveModelFilter(ALL_MODELS);
      setCurrentRoute(RouteKey.KATALOG);
      return;
    }

    setActiveCatalogSection(category);
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

  const showPreviousHeroSlide = () => {
    if (safeHeroSlides.length < 2) return;
    setActiveHeroSlide((prev) => (prev - 1 + safeHeroSlides.length) % safeHeroSlides.length);
  };

  const showNextHeroSlide = () => {
    if (safeHeroSlides.length < 2) return;
    setActiveHeroSlide((prev) => (prev + 1) % safeHeroSlides.length);
  };

  const showPreviousCatalogHeroSlide = () => {
    if (catalogHeroSlides.length < 2) return;
    setActiveCatalogHeroSlide((prev) => (prev - 1 + catalogHeroSlides.length) % catalogHeroSlides.length);
  };

  const showNextCatalogHeroSlide = () => {
    if (catalogHeroSlides.length < 2) return;
    setActiveCatalogHeroSlide((prev) => (prev + 1) % catalogHeroSlides.length);
  };

  const showPreviousHomeCustomSlide = () => {
    if (safeHomeCustomSlides.length < 2) return;
    setActiveHomeCustomSlide((prev) => (prev - 1 + safeHomeCustomSlides.length) % safeHomeCustomSlides.length);
  };

  const showNextHomeCustomSlide = () => {
    if (safeHomeCustomSlides.length < 2) return;
    setActiveHomeCustomSlide((prev) => (prev + 1) % safeHomeCustomSlides.length);
  };

  const renderFullBleedSliderControls = ({
    slides,
    activeSlide,
    onPrevious,
    onNext,
    themeClass,
    slideLabel,
  }: {
    slides: string[];
    activeSlide: number;
    onPrevious: () => void;
    onNext: () => void;
    themeClass: string;
    slideLabel: string;
  }) => {
    if (slides.length < 2) return null;

    return (
      <nav className={`full-bleed-slider-controls ${themeClass}`} aria-label={`Kontrol slider ${slideLabel}`}>
        <button type="button" onClick={onPrevious} className="full-bleed-slider-arrow" aria-label={`Slide ${slideLabel} sebelumnya`}>
          <span aria-hidden="true">&#8592;</span>
        </button>
        <div className="full-bleed-slider-status">
          <p className="full-bleed-slider-count">
            {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </p>
          <div className="full-bleed-slider-dots" aria-hidden="true">
            {slides.map((slide, index) => (
              <span key={`${slideLabel}-${slide}-${index}`} className={`full-bleed-slider-dot ${index === activeSlide ? 'is-active' : ''}`} />
            ))}
          </div>
        </div>
        <button type="button" onClick={onNext} className="full-bleed-slider-arrow" aria-label={`Slide ${slideLabel} berikutnya`}>
          <span aria-hidden="true">&#8594;</span>
        </button>
      </nav>
    );
  };

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

  const openCatalogGuide = (guide: keyof typeof CATALOG_GUIDE_PATHS) => {
    setCurrentRoute(RouteKey.KATALOG, { path: CATALOG_GUIDE_PATHS[guide] });
  };

  const openCatalogProductDetail = (product: Product) => {
    setSelectedProduct(product);
    updateDesignData({ productId: product.id });
    setCurrentRoute(RouteKey.KATALOG, { path: getCatalogProductPath(product) });
  };

  const openCatalogProductDesign = (product: Product) => {
    setSelectedProduct(product);
    updateDesignData({ productId: product.id });
    setCurrentRoute(RouteKey.EDITOR);
  };

  const openCatalogProductCustomerService = (product: Product) => {
    openCustomerServiceDialog({
      title: `Pilih customer service untuk ${product.name}`,
      description: 'Pilih admin yang ingin Anda hubungi. Pesan akan otomatis membawa konteks model yang sedang Anda buka.',
      message: buildCustomerServiceMessage(`pemesanan model ${product.name} kategori ${product.category} dari halaman detail katalog`),
    });
  };

  const getProductDetailContent = (product: Product): ProductDetailContent => {
    const categoryDefaults = PRODUCT_CATEGORY_DETAIL_DEFAULTS[product.category];
    const overrides = PRODUCT_DETAIL_OVERRIDES[product.id] ?? {};
    return {
      ...categoryDefaults,
      ...overrides,
      badges: overrides.badges ?? categoryDefaults.badges,
      features: overrides.features ?? categoryDefaults.features,
      craftsmanship: overrides.craftsmanship ?? categoryDefaults.craftsmanship,
    };
  };

  const getProductDetailVisuals = (product: Product) => {
    const visuals = [
      product.images?.front,
      product.images?.back,
      product.images?.leftSleeve,
      product.images?.rightSleeve,
      ...(product.gallery ?? []),
      product.image,
    ].filter(Boolean) as string[];

    return Array.from(new Set(visuals)).slice(0, 5);
  };

  const showProfileProcessStep = (nextIndex: number, stepCount: number) => {
    if (!activeProcessVisualPage || stepCount < 1) return;

    const normalizedNextIndex = ((nextIndex % stepCount) + stepCount) % stepCount;
    if (normalizedNextIndex === activeProfileProcessStepIndex) return;

    if (profileProcessTransitionTimeoutRef.current) {
      window.clearTimeout(profileProcessTransitionTimeoutRef.current);
    }

    setProfileProcessMotionDirection(normalizedNextIndex > activeProfileProcessStepIndex ? 'forward' : 'backward');
    setLeavingProfileProcessStepIndex(activeProfileProcessStepIndex);
    setActiveProfileProcessStepIndex(normalizedNextIndex);
    profileProcessTransitionTimeoutRef.current = window.setTimeout(() => {
      setLeavingProfileProcessStepIndex(null);
    }, PROCESS_SLIDE_TRANSITION_MS);
  };

  const showNextProfileProcessStep = (steps: BrandProfileProcessStep[]) => {
    if (!steps.length) return;
    showProfileProcessStep(activeProfileProcessStepIndex + 1, steps.length);
  };

  const renderProfileProcessSection = (route: RouteKey, title: string, steps: BrandProfileProcessStep[]) => {
    const activeStep =
      steps[activeProfileProcessStepIndex % Math.max(steps.length, 1)] ??
      steps[0] ??
      null;
    const leavingStep = leavingProfileProcessStepIndex === null ? null : steps[leavingProfileProcessStepIndex] ?? null;

    if (!activeStep) return null;

    const directionClass = profileProcessMotionDirection === 'forward' ? 'is-forward' : 'is-backward';

    return (
      <section id={`profile-process-${route}`} className="profile-showcase-process scroll-reveal-block">
        <div className="profile-showcase-process-head">
          <div className="profile-showcase-section-head profile-showcase-section-head-left">
            <h2>{title}</h2>
          </div>
          <button
            type="button"
            onClick={() => showNextProfileProcessStep(steps)}
            className="profile-showcase-process-next"
            aria-label={`Lihat tahap setelah ${activeStep.title}`}
          >
            <span>Langkah berikutnya</span>
            <ChevronRightIcon />
          </button>
        </div>

        <div className="profile-showcase-process-slider">
          <div className="profile-showcase-process-stage">
            {leavingStep ? (
              <article className={`profile-showcase-process-slide profile-showcase-process-slide-leaving ${directionClass}`} aria-hidden="true">
                <div className="profile-showcase-process-badge">
                  <BrandProfileIcon icon={leavingStep.icon} className="profile-showcase-icon-svg" />
                </div>
                <p className="profile-showcase-process-number">{leavingStep.number}</p>
                <h3>{leavingStep.title}</h3>
                <p className="profile-showcase-process-copy">{leavingStep.copy}</p>
                <p className="profile-showcase-process-detail">{leavingStep.detail}</p>
              </article>
            ) : null}

            <article
              key={`${route}-${activeStep.number}-${activeProfileProcessStepIndex}`}
              className={`profile-showcase-process-slide profile-showcase-process-slide-active ${directionClass}`}
            >
              <div className="profile-showcase-process-badge">
                <BrandProfileIcon icon={activeStep.icon} className="profile-showcase-icon-svg" />
              </div>
              <p className="profile-showcase-process-number">{activeStep.number}</p>
              <h3>{activeStep.title}</h3>
              <p className="profile-showcase-process-copy">{activeStep.copy}</p>
              <p className="profile-showcase-process-detail">{activeStep.detail}</p>
            </article>
          </div>

          <div className="profile-showcase-process-nav" role="tablist" aria-label={`${title} steps`}>
            {steps.map((step, index) => {
              const isActive = index === activeProfileProcessStepIndex;
              return (
                <button
                  key={`${route}-process-nav-${step.number}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => showProfileProcessStep(index, steps.length)}
                  className={`profile-showcase-process-nav-item ${isActive ? 'is-active' : ''}`}
                >
                  <span className="profile-showcase-process-nav-number">{step.number}</span>
                  <span className="profile-showcase-process-nav-title">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
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

  const catalogTrustItems = [
    {
      title: 'Kualitas Terjamin',
      copy: 'Material pilihan dan jahitan rapi untuk hasil seragam yang lebih presisi.',
      icon: (
        <CatalogTrustIcon
          path={
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 18 6.5v4.8c0 3.6-2.4 6.9-6 8.2-3.6-1.3-6-4.6-6-8.2V6.5L12 4Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.3 11.8 1.7 1.7 3.8-4.1" />
            </>
          }
        />
      ),
    },
    {
      title: 'Custom Desain',
      copy: 'Bebas desain, warna, dan bordir logo sesuai kebutuhan tim atau instansi.',
      icon: (
        <CatalogTrustIcon
          path={
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12M6 12h12M6 16.5h8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 5.5 3 3" />
            </>
          }
        />
      ),
    },
    {
      title: 'Produksi Tepat Waktu',
      copy: 'Proses cepat dengan alur approval yang lebih jelas agar hasil tetap maksimal.',
      icon: (
        <CatalogTrustIcon
          path={
            <>
              <circle cx="12" cy="12" r="7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.8 2" />
            </>
          }
        />
      ),
    },
    {
      title: 'Konsultasi Gratis',
      copy: 'Tim kami siap membantu kebutuhan Anda mulai dari model, bahan, hingga jalur order.',
      icon: (
        <CatalogTrustIcon
          path={
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 16.5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3" />
              <circle cx="8.2" cy="10" r="2.1" />
              <circle cx="15.8" cy="10" r="2.1" />
            </>
          }
        />
      ),
    },
  ];

  const catalogFilterIcons: Record<CatalogSectionFilter, React.ReactNode> = {
    Semua: <CatalogGridIcon />,
    Kemeja: <CatalogShirtIcon />,
    Celana: <CatalogPantsIcon />,
    Jaket: <CatalogJacketIcon />,
    Rompi: <CatalogVestIcon />,
    Polo: <CatalogShirtIcon />,
  };

  const getCatalogProductDetail = (product: Product) => {
    const materialMatch = product.description.match(/material\s+([^.]+)/i);
    if (materialMatch?.[1]) {
      return `Material ${materialMatch[1].trim()}`;
    }

    const descriptionHead = product.description.split('.').shift()?.trim() ?? product.description;
    return descriptionHead.replace(/^Seri\s+[^:]+:\s*/i, '').replace(/^Seri\s+/i, '');
  };

  const renderCatalogProductCard = (product: Product) => (
    <article key={product.id} className="catalog-product-card">
      <button type="button" onClick={() => openCatalogProductDetail(product)} className="catalog-product-card-button">
        <div className="catalog-product-card-media">
          <ProductCardImage product={product} />
        </div>
        <div className="catalog-product-card-body">
          <h3 className="catalog-product-card-title">{product.name}</h3>
          <p className="catalog-product-card-copy">{getCatalogProductDetail(product)}</p>
          <span className="catalog-product-card-cta">
            <span>Lihat Detail</span>
            <ArrowRightTinyIcon />
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

  const renderSupportDirectoryIcon = (icon: SupportDirectorySection['icon']) => {
    switch (icon) {
      case 'faq':
        return <FaqCircleIcon />;
      case 'order':
        return <CartOutlineIcon />;
      case 'shipping':
        return <ShippingIcon />;
      case 'privacy':
        return <ShieldCheckIcon />;
      case 'terms':
        return <DocumentTextIcon />;
      case 'return':
        return <ReturnPolicyIcon />;
      case 'contact':
        return <HeadsetSupportIcon />;
      default:
        return <FaqCircleIcon />;
    }
  };

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

        {/* Hero foto customer service tetap dipakai sebagai strip terpisah di bawah slider utama. */}
        <section className="hero-display-strip hero-display-strip-top home-fast-response-strip home-fast-response-strip-clean" data-home-section="hero-intro">
          <img
            src={ASSETS.CONTENT.FAST_RESPONSE_HERO || heroTopImage}
            alt="Customer service Bradwear Indonesia"
            className="hero-display-strip-image"
          />
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

        {/* Slider hero utama home diposisikan tepat sebelum slider client. */}
        <section className="home-main-hero-slider" data-home-section="main-hero-slider" aria-label="Slider hero utama Bradwear">
          <div className="home-main-hero-slider-track">
            {safeHeroSlides.map((slide, index) => (
              <div
                key={`${slide}-${index}`}
                className={`home-main-hero-slide ${index === activeHeroSlide ? 'is-active' : ''}`}
                aria-hidden={index === activeHeroSlide ? 'false' : 'true'}
              >
                <img src={slide} alt="" className="home-main-hero-backdrop" />
                <img
                  src={slide}
                  alt={`Hero utama Bradwear ${index + 1}`}
                  className="home-main-hero-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Preview portofolio klien di home. */}
        <section className="home-section" data-home-section="client-gallery">
          <div className="home-section-shell home-section-shell-bleed home-section-grid">
            <div className="home-section-heading">
              <p className="home-section-kicker">Portofolio</p>
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
                Menuju Portofolio
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

        {/* Slideshow runway home diposisikan tepat sebelum slider kategori. */}
        <section className="hero-image-runway" data-home-section="hero-slider">
          <article className="hero-banner hero-banner-editorial hero-banner-edge">
            <div className="hero-banner-stage hero-banner-stage-editorial hero-banner-stage-landscape">
              {safeHeroSlides.map((slide, index) => (
                <div
                  key={`${slide}-${index}`}
                  className={`hero-banner-runway-slide ${index === activeHeroSlide ? 'is-active' : ''}`}
                  aria-hidden={index === activeHeroSlide ? 'false' : 'true'}
                >
                  <img src={slide} alt="" className="hero-banner-runway-backdrop" />
                  <img
                    src={slide}
                    alt={`Hero Bradwear ${index + 1}`}
                    className="hero-banner-runway-image"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                </div>
              ))}
              <div className="hero-banner-overlay hero-banner-overlay-soft" />
            </div>
          </article>
          {renderFullBleedSliderControls({
            slides: safeHeroSlides,
            activeSlide: activeHeroSlide,
            onPrevious: showPreviousHeroSlide,
            onNext: showNextHeroSlide,
            themeClass: 'is-light',
            slideLabel: 'hero model Bradwear',
          })}
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

        <section className="home-faq-slider-band scroll-reveal-block" aria-label="Slideshow seragam custom Bradwear">
          <div className="home-faq-slider-stage">
            {safeHomeCustomSlides.map((slide, index) => (
              <div
                key={`${slide}-${index}`}
                className={`home-faq-slider-slide ${index === activeHomeCustomSlide ? 'is-active' : ''}`}
                aria-hidden={index === activeHomeCustomSlide ? 'false' : 'true'}
              >
                <img src={slide} alt="" className="home-faq-slider-backdrop" />
                <img
                  src={slide}
                  alt={`Seragam custom Bradwear ${index + 1}`}
                  className="home-faq-slider-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </div>
            ))}
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

        {/* Foto full-width fast response dipasang tepat sebelum CTA penutup home. */}
        <section className="hero-display-strip hero-display-strip-bottom home-fast-response-cta-strip" data-home-section="cta-fast-response">
          <img
            src={bottomFastRespondImage}
            alt="Fast response konsultasi Bradwear Indonesia"
            className="hero-display-strip-image"
          />
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

  const renderCatalog = (_catalogProducts: Product[]) => {
    if (activeCatalogProduct) {
      const detail = getProductDetailContent(activeCatalogProduct);
      const visuals = getProductDetailVisuals(activeCatalogProduct);
      const heroVisual = visuals[0] ?? activeCatalogProduct.image;
      const supportingVisuals = visuals.slice(1, 5);
      const detailRows = [
        { label: 'Material rekomendasi', value: detail.material },
        { label: 'Detail saku', value: detail.pocketLayout },
        { label: 'Siluet model', value: detail.silhouette },
        { label: 'Cocok untuk', value: detail.bestFor },
      ];

      return (
        <div className="guide-story-page-shell catalog-detail-story-page-shell">
          <section className="guide-story-topbar scroll-reveal-block">
            <button type="button" onClick={() => setCurrentRoute(activeCatalogProduct.category === 'Celana' ? RouteKey.PANTS : RouteKey.KATALOG)} className="guide-story-back">
              <span>&lt;</span>
              Kembali ke katalog
            </button>
          </section>

          <section className="guide-story-hero catalog-detail-hero scroll-reveal-block">
            <article className="guide-story-copy">
              <p className="guide-story-kicker">{activeCatalogProduct.category} Bradwear</p>
              <h1>{activeCatalogProduct.name}</h1>
              <p className="guide-story-intro">{detail.intro}</p>
              <div className="catalog-detail-badge-row">
                {detail.badges.map((badge) => (
                  <span key={`${activeCatalogProduct.id}-${badge}`} className="catalog-detail-badge">
                    {badge}
                  </span>
                ))}
              </div>
              <div className="guide-story-actions">
                <button type="button" onClick={() => openCatalogProductDesign(activeCatalogProduct)} className="guide-story-primary">
                  Desain Sekarang
                </button>
                <button type="button" onClick={() => openCatalogProductCustomerService(activeCatalogProduct)} className="guide-story-secondary">
                  Pesan Sekarang
                </button>
              </div>
            </article>

            <article className="guide-story-media elegant-parallax-block">
              <button
                type="button"
                onClick={() => setLightboxSlide({ src: heroVisual, alt: activeCatalogProduct.name, title: activeCatalogProduct.name })}
                className="guide-story-media-button"
              >
                <img src={heroVisual} alt={activeCatalogProduct.name} className="guide-story-image" />
              </button>
            </article>
          </section>

          <section className="catalog-detail-meta-grid scroll-reveal-block">
            {detailRows.map((row) => (
              <article key={`${activeCatalogProduct.id}-${row.label}`} className="catalog-detail-meta-card">
                <p className="catalog-detail-meta-label">{row.label}</p>
                <p className="catalog-detail-meta-value">{row.value}</p>
              </article>
            ))}
          </section>

          {supportingVisuals.length ? (
            <section className="catalog-detail-gallery-grid scroll-reveal-block">
              {supportingVisuals.map((visual, index) => (
                <button
                  key={`${activeCatalogProduct.id}-visual-${index}`}
                  type="button"
                  onClick={() =>
                    setLightboxSlide({
                      src: visual,
                      alt: `${activeCatalogProduct.name} detail ${index + 1}`,
                      title: `${activeCatalogProduct.name} detail ${index + 1}`,
                    })
                  }
                  className="catalog-detail-gallery-card elegant-parallax-block"
                >
                  <img src={visual} alt={`${activeCatalogProduct.name} detail ${index + 1}`} className="catalog-detail-gallery-image" />
                </button>
              ))}
            </section>
          ) : null}

          <section className="catalog-detail-content-grid scroll-reveal-block">
            <article className="catalog-detail-copy-card">
              <p className="catalog-detail-copy-kicker">Keterangan model</p>
              <h2>Bagian saku, jahitan premium, dan bordir timbul 3D disiapkan lebih presisi</h2>
              <p>{activeCatalogProduct.description}</p>
              <div className="catalog-detail-feature-list">
                {detail.features.map((feature) => (
                  <article key={`${activeCatalogProduct.id}-${feature.title}`} className="catalog-detail-feature-card">
                    <h3>{feature.title}</h3>
                    <p>{feature.copy}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="catalog-detail-copy-card catalog-detail-copy-card-dark">
              <p className="catalog-detail-copy-kicker">Craftsmanship</p>
              <h2>Finishing dibuat untuk tampilan lebih premium saat dipakai tim</h2>
              <div className="catalog-detail-embroidery-note">
                <span>Bordir timbul 3D</span>
                <p>{detail.embroidery}</p>
              </div>
              <ul className="catalog-detail-craft-list">
                {detail.craftsmanship.map((point) => (
                  <li key={`${activeCatalogProduct.id}-${point}`}>{point}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="catalog-detail-bottom-cta scroll-reveal-block">
            <div>
              <p className="guide-story-kicker">Lanjutkan model ini</p>
              <h2>Model sudah dipilih, lanjut ke editor atau hubungi customer service</h2>
              <p>Anda bisa langsung membuka halaman desain dengan model ini, atau memilih CS agar pesan WhatsApp otomatis membawa konteks model yang sedang dibuka.</p>
            </div>
            <div className="guide-story-actions">
              <button type="button" onClick={() => openCatalogProductDesign(activeCatalogProduct)} className="guide-story-primary">
                Desain Sekarang
              </button>
              <button type="button" onClick={() => openCatalogProductCustomerService(activeCatalogProduct)} className="guide-story-secondary">
                Pilih CS
              </button>
            </div>
          </section>
        </div>
      );
    }

    if (activeCatalogGuide === 'size') {
      return (
        <div className="guide-story-page-shell">
          <section className="guide-story-topbar scroll-reveal-block">
            <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="guide-story-back">
              <span>&lt;</span>
              Kembali ke katalog
            </button>
          </section>

          <section className="guide-story-hero scroll-reveal-block">
            <article className="guide-story-copy">
              <p className="guide-story-kicker">Panduan Ukuran</p>
              <h1>Panduan ukuran seragam Bradwear dibuat terpisah agar tim lebih mudah membaca acuan sebelum order.</h1>
              <p className="guide-story-intro">
                Halaman ini merangkum acuan ukuran dasar sebelum user masuk ke editor. Gunakan panduan ini untuk briefing tim, pengumpulan size, atau validasi awal sebelum ukuran detail dikirim ke customer service.
              </p>
              <div className="guide-story-actions">
                <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="guide-story-primary">
                  Kembali ke Katalog
                </button>
                <button type="button" onClick={() => openCustomerServiceDialog({ message: buildCustomerServiceMessage('panduan ukuran seragam custom'), title: 'Pilih customer service untuk panduan ukuran' })} className="guide-story-secondary">
                  Tanya Ukuran
                </button>
              </div>
            </article>

            <article className="guide-story-media elegant-parallax-block">
              <button
                type="button"
                onClick={() =>
                  ASSETS.CONTENT.SIZE_GUIDE
                    ? setLightboxSlide({
                        src: ASSETS.CONTENT.SIZE_GUIDE,
                        alt: 'Panduan ukuran Bradwear',
                        title: 'Panduan ukuran Bradwear',
                        description: 'Tampilan size guide penuh untuk membaca detail ukuran dengan lebih jelas.',
                        variant: 'size-guide',
                      })
                    : undefined
                }
                className="guide-story-media-button"
              >
                <img src={ASSETS.CONTENT.SIZE_GUIDE || heroTopImage} alt="Panduan ukuran Bradwear" className="guide-story-image" />
              </button>
            </article>
          </section>

          <section className="guide-story-info-grid scroll-reveal-block">
            {SIZE_GUIDE_DETAIL_POINTS.map((item) => (
              <article key={item.title} className="guide-story-info-card">
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </article>
            ))}
          </section>
        </div>
      );
    }

    if (activeCatalogGuide === 'material') {
      return (
        <div className="guide-story-page-shell">
          <section className="guide-story-topbar scroll-reveal-block">
            <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="guide-story-back">
              <span>&lt;</span>
              Kembali ke katalog
            </button>
          </section>

          <section className="guide-story-hero scroll-reveal-block">
            <article className="guide-story-copy">
              <p className="guide-story-kicker">Panduan Jenis Bahan</p>
              <h1>Panduan bahan dibuat terpisah agar user bisa membaca karakter kain dengan lebih fokus.</h1>
              <p className="guide-story-intro">
                Setiap material di bawah punya fungsi yang berbeda. Halaman ini menampilkan foto kain secara lebih luas, lalu diikuti keterangan pemakaian, kelebihan, dan konteks seragam yang paling cocok.
              </p>
              <div className="guide-story-actions">
                <button type="button" onClick={() => setCurrentRoute(RouteKey.KATALOG)} className="guide-story-primary">
                  Kembali ke Katalog
                </button>
                <button type="button" onClick={() => openCustomerServiceDialog({ message: buildCustomerServiceMessage('panduan jenis bahan seragam custom'), title: 'Pilih customer service untuk konsultasi bahan' })} className="guide-story-secondary">
                  Tanya Bahan
                </button>
              </div>
            </article>

            <article className="guide-story-media elegant-parallax-block">
              <img src={MATERIAL_GUIDE_ITEMS[0]?.image || heroTopImage} alt="Panduan jenis bahan Bradwear" className="guide-story-image" />
            </article>
          </section>

          <section className="guide-material-stack">
            {MATERIAL_GUIDE_ITEMS.map((material) => (
              <article key={material.name} className="guide-material-section scroll-reveal-block">
                <div className="guide-material-image-shell elegant-parallax-block">
                  {material.image ? (
                    <button
                      type="button"
                      onClick={() => setLightboxSlide({ src: material.image, alt: material.name, title: material.name })}
                      className="guide-story-media-button"
                    >
                      <img src={material.image} alt={`Contoh kain ${material.name}`} className="guide-material-image" />
                    </button>
                  ) : (
                    <div className="guide-material-image guide-material-image-fallback" aria-hidden="true" />
                  )}
                </div>
                <div className="guide-material-copy">
                  <p className="guide-story-kicker">{material.note}</p>
                  <h2>{material.name}</h2>
                  <p className="guide-story-intro">{material.description}</p>
                  <div className="guide-material-meta-grid">
                    <article className="guide-material-meta-card">
                      <h3>Spesifikasi</h3>
                      <p>{material.specification}</p>
                    </article>
                    <article className="guide-material-meta-card">
                      <h3>Cocok untuk</h3>
                      <p>{material.usage}</p>
                    </article>
                    <article className="guide-material-meta-card">
                      <h3>Kelebihan</h3>
                      <ul>
                        {material.advantages.map((point) => (
                          <li key={`${material.name}-adv-${point}`}>{point}</li>
                        ))}
                      </ul>
                    </article>
                    <article className="guide-material-meta-card">
                      <h3>Catatan</h3>
                      <ul>
                        {material.disadvantages.map((point) => (
                          <li key={`${material.name}-dis-${point}`}>{point}</li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      );
    }

    return (
      <div className="catalog-page-shell">
        <section className="catalog-top-hero scroll-reveal-block" aria-label="Slideshow katalog Bradwear">
          <div className="catalog-top-hero-stage">
            {catalogHeroSlides.map((slide, index) => (
              <div
                key={`${slide}-${index}`}
                className={`catalog-top-hero-slide ${index === activeCatalogHeroSlide ? 'is-active' : ''}`}
                aria-hidden={index === activeCatalogHeroSlide ? 'false' : 'true'}
              >
                <img src={slide} alt="" className="catalog-top-hero-backdrop" />
                <img
                  src={slide}
                  alt={`Katalog Bradwear ${index + 1}`}
                  className="catalog-top-hero-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </div>
            ))}
          </div>
        </section>

        <section ref={catalogRef} data-catalog-filter-band="true" className="catalog-filter-band scroll-reveal-block">
          <div className="catalog-filter-pill-row">
            {(['Semua', ...CATEGORIES] as CatalogSectionFilter[]).map((category) => {
              const isActive = activeCatalogSection === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCatalogCategorySelect(category)}
                  className={`catalog-filter-pill ${isActive ? 'is-active' : ''}`}
                >
                  {catalogFilterIcons[category]}
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="catalog-section-stack">
          {visibleCatalogSections.map((section) => (
            <article key={section.category} className="catalog-category-section scroll-reveal-block">
              <div className="catalog-category-section-header">
                <div>
                  <h2 className="catalog-category-section-title">{section.category}</h2>
                  <p className="catalog-category-section-caption">{section.products.length} model siap dikustom untuk kebutuhan tim Anda.</p>
                </div>
                {activeCatalogSection === 'Semua' ? (
                  <button
                    type="button"
                    onClick={() => handleCatalogCategorySelect(section.category)}
                    className="catalog-section-link"
                  >
                    <span>Fokus kategori</span>
                    <ArrowRightTinyIcon />
                  </button>
                ) : null}
              </div>

              <div className="catalog-product-grid">
                {section.products.map((product) => renderCatalogProductCard(product))}
              </div>
            </article>
          ))}
        </section>

        <section className="catalog-guide-link-grid scroll-reveal-block">
          <button type="button" onClick={() => openCatalogGuide('size')} className="catalog-guide-link-card">
            <div className="catalog-guide-link-thumb">
              <img src={ASSETS.CONTENT.SIZE_GUIDE || heroTopImage} alt="Panduan ukuran Bradwear" className="catalog-guide-link-image" />
            </div>
            <div className="catalog-guide-link-copy">
              <p>Panduan ukuran</p>
              <h2>Buka halaman size guide terpisah</h2>
              <span>
                Lihat panduan
                <ArrowRightTinyIcon />
              </span>
            </div>
          </button>

          <button type="button" onClick={() => openCatalogGuide('material')} className="catalog-guide-link-card">
            <div className="catalog-guide-link-thumb">
              <img src={MATERIAL_GUIDE_ITEMS[0]?.image || heroTopImage} alt="Panduan bahan Bradwear" className="catalog-guide-link-image" />
            </div>
            <div className="catalog-guide-link-copy">
              <p>Panduan jenis bahan</p>
              <h2>Buka halaman bahan secara terpisah</h2>
              <span>
                Lihat panduan
                <ArrowRightTinyIcon />
              </span>
            </div>
          </button>
        </section>

        <section className="catalog-bottom-cta scroll-reveal-block">
          <div className="catalog-bottom-cta-copy">
            <h2>Butuh Model Custom Sesuai Kebutuhan Anda?</h2>
            <p>Tim kami siap membantu mulai dari desain, pemilihan bahan, hingga produksi seragam Anda.</p>
          </div>
          <div className="catalog-bottom-cta-actions">
            <a
              href={buildWhatsAppUrl(buildConsultationMessage('konsultasi model seragam custom dari halaman katalog web'))}
              target="_blank"
              rel="noreferrer"
              className="catalog-bottom-cta-primary"
            >
              Konsultasi Sekarang
            </a>
            <button type="button" onClick={() => setCurrentRoute(RouteKey.CLIENT)} className="catalog-bottom-cta-secondary">
              <span>Lihat Portofolio</span>
              <ArrowRightTinyIcon />
            </button>
          </div>
        </section>

        {ASSETS.CONTENT.FAST_RESPONSE_HERO ? (
          <section className="catalog-full-bleed-media scroll-reveal-block" aria-label="Fast respon customer service Bradwear">
            <img
              src={ASSETS.CONTENT.FAST_RESPONSE_HERO}
              alt="Fast respon customer service Bradwear"
              className="catalog-full-bleed-image"
            />
          </section>
        ) : null}
      </div>
    );
  };

  const renderTestimonialsPage = () => (
    <div className="testimonial-page-shell px-6 py-8 md:px-10">
      <section className="testimonial-page-hero scroll-reveal-block">
        <div className="testimonial-page-copy">
          <p className="testimonial-page-kicker">Testimoni Klien Kami</p>
          <h1 className="testimonial-page-title">Kepercayaan klien menjadi alasan kami menjaga kualitas produk dan layanan tetap rapi.</h1>
          <p className="testimonial-page-intro">
            Ringkasan ini menampilkan kesan dari instansi, perusahaan, pendidikan, dan layanan operasional yang sudah mempercayakan produksi seragam custom kepada Bradwear Indonesia.
          </p>
        </div>

        <div className="testimonial-stats-grid">
          {TESTIMONIAL_STATS.map((item) => (
            <article key={item.label} className="testimonial-stat-card">
              <div className="testimonial-stat-icon-shell">
                <BrandProfileIcon icon={item.icon} className="testimonial-stat-icon" />
              </div>
              <p className="testimonial-stat-value">{item.value}</p>
              <p className="testimonial-stat-label">{item.label}</p>
              <p className="testimonial-stat-caption">{item.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonial-filter-band scroll-reveal-block">
        <div className="testimonial-filter-row">
          {TESTIMONIAL_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveTestimonialFilter(filter)}
              className={`testimonial-filter-pill ${activeTestimonialFilter === filter ? 'is-active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="testimonial-card-grid scroll-reveal-block">
        {visibleTestimonials.map((item) => (
          <article key={`${item.organization}-${item.division}`} className="testimonial-card-panel">
            <div className="testimonial-card-quote-mark" aria-hidden="true">
              "
            </div>
            <p className="testimonial-card-body">{item.quote}</p>
            <div className="testimonial-card-stars" aria-label="Rating 5 dari 5">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={`${item.organization}-star-${index}`}>★</span>
              ))}
            </div>
            <div className="testimonial-card-company">
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.organization}
                  className="testimonial-card-company-logo"
                />
              ) : null}
              <div className="testimonial-card-company-copy">
                <h2>{item.organization}</h2>
                <p>{item.division}</p>
                <span>{item.role}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="testimonial-page-cta scroll-reveal-block">
        <div className="testimonial-page-cta-copy">
          <div className="testimonial-page-cta-icon-shell">
            <BrandProfileIcon icon="comment" className="testimonial-page-cta-icon" />
          </div>
          <div>
            <h2>Jadilah klien berikutnya</h2>
            <p>Ribuan instansi dan perusahaan telah mempercayakan produksi seragam custom kepada tim Bradwear Indonesia.</p>
          </div>
        </div>
        <div className="testimonial-page-cta-actions">
          <a
            href={buildWhatsAppUrl(buildConsultationMessage('konsultasi setelah membaca testimoni klien Bradwear'))}
            target="_blank"
            rel="noreferrer"
            className="catalog-bottom-cta-primary"
          >
            <span>Konsultasi Sekarang</span>
            <InlineWhatsAppIcon />
          </a>
          <button type="button" onClick={() => setCurrentRoute(RouteKey.CLIENT)} className="catalog-bottom-cta-secondary">
            <span>Lihat Portofolio</span>
            <ArrowRightTinyIcon />
          </button>
        </div>
      </section>
    </div>
  );

  const renderArticles = () => {
    if (activeArticle) {
      const relatedArticles = articleFeed.filter((article) => article.slug !== activeArticle.slug).slice(0, 3);

      return (
        <div className="article-page-shell px-6 py-8 md:px-10">
          <section className="article-detail-hero article-detail-hero-grid scroll-reveal-block rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-6 shadow-sm md:p-8">
            <div className="grid content-start gap-5">
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.ARTIKEL)}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--text-primary)] shadow-sm"
              >
                Kembali ke Artikel
              </button>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                  {activeArticle.category}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatArticleDate(activeArticle.publishedAt)}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{activeArticle.readTime}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{activeArticle.comments.length} komentar</span>
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-[var(--text-primary)]">{activeArticle.title}</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">{activeArticle.seoDescription}</p>
              <div className="article-title-highlight">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Sorotan artikel</p>
                <p className="mt-3 text-base font-semibold leading-7 text-[var(--text-primary)]">{activeArticle.highlight}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="rounded-full bg-white px-3 py-2 font-semibold">Oleh {activeArticle.author}</span>
                <span>{activeArticle.authorRole}</span>
              </div>
            </div>

            <div className="article-cover-stage">
              <img src={activeArticle.coverImage} alt={activeArticle.coverAlt} className="article-cover-image" />
            </div>
          </section>

          <section className="article-detail-layout mt-8">
            <article className="article-detail-story scroll-reveal-block rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface-base)] p-6 shadow-sm">
              <p className="text-base leading-8 text-[var(--text-secondary)]">{activeArticle.excerpt}</p>
              <div className="article-detail-highlight-list mt-6">
                {activeArticle.highlights.map((point) => (
                  <div key={`${activeArticle.slug}-${point}`} className="article-detail-highlight-item">
                    <span />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
              <div className="article-detail-body-copy mt-8 grid gap-5">
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

            <aside className="article-detail-aside">
              <section className="scroll-reveal-block rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Tentang penulis</p>
                <h3 className="mt-3 text-lg font-black tracking-tight text-[var(--text-primary)]">{activeArticle.author}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{activeArticle.authorRole}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Tim editorial Bradwear menulis artikel berbasis kebutuhan order seragam custom, approval desain, bahan, dan alur produksi yang sering ditanyakan customer.
                </p>
              </section>

              <section className="scroll-reveal-block rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
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

              <section className="scroll-reveal-block rounded-[28px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Baca juga artikel lain</p>
                <div className="mt-4 grid gap-3">
                  {relatedArticles.map((article) => (
                    <button
                      key={article.slug}
                      type="button"
                      onClick={() => navigateToArticle(article.slug)}
                      className="article-related-card"
                    >
                      <img src={article.coverImage} alt={article.coverAlt} className="article-related-thumb" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent-strong)]">{article.category}</p>
                        <p className="mt-2 text-sm font-black tracking-tight text-[var(--text-primary)] underline decoration-[rgba(117,242,26,0.4)] underline-offset-4">{article.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </section>

          <section className="article-comment-panel scroll-reveal-block mt-8 rounded-[32px] border border-[var(--border-soft)] bg-white p-6 shadow-sm">
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
      );
    }

    const articleMagazineFeed = articleFeed;

    return (
      <div className="article-page-shell px-6 py-8 md:px-10">
        <section className="article-masthead-grid scroll-reveal-block">
          <div className="article-masthead-copy rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--brand-accent-strong)]">Artikel Bradwear</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-[var(--text-primary)]">Halaman artikel bergaya news untuk keyword seragam, kemeja custom, dan pengadaan</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
              Setiap artikel dibuat sebagai landing page yang bisa dibaca user, diindeks Google, dan dipahami mesin AI untuk konteks kemeja custom, seragam dinas, komunitas, serta proses order Bradwear Indonesia.
            </p>
            {activeArticleHeadline ? (
              <div className="article-title-highlight mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Headline bergerak</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-[var(--text-primary)]">{activeArticleHeadline.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{activeArticleHeadline.highlight}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  <span>{activeArticleHeadline.category}</span>
                  <span>{formatArticleDate(activeArticleHeadline.publishedAt)}</span>
                  <span>{activeArticleHeadline.readTime}</span>
                </div>
              </div>
            ) : null}
          </div>

          {activeArticleHeadline ? (
            <article className="article-spotlight-stage rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#0f172a,#1f4d17)] p-4 text-white shadow-[0_22px_48px_rgba(15,23,42,0.24)]">
              <div className="article-spotlight-stage-image-shell">
                <img src={activeArticleHeadline.coverImage} alt={activeArticleHeadline.coverAlt} className="article-cover-image" />
              </div>
              <div className="p-2 sm:p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d4f9af]">Visual utama</p>
                <p className="mt-3 text-sm leading-relaxed text-white/78">{activeArticleHeadline.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigateToArticle(activeArticleHeadline.slug)}
                    className="rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#0f172a] shadow-sm transition hover:-translate-y-0.5"
                  >
                    Baca artikel
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentRoute(RouteKey.KATALOG)}
                    className="rounded-full border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5"
                  >
                    Lihat katalog
                  </button>
                </div>
              </div>
            </article>
          ) : null}

          <aside className="article-headline-rail rounded-[30px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Headline</p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Auto update</span>
            </div>
            <div className="mt-4 grid gap-3">
              {articleHeadlineItems.map((article, index) => (
                <button
                  key={article.slug}
                  type="button"
                  onClick={() => setArticleHighlightIndex(index)}
                  className={`article-headline-rail-item ${activeArticleHeadline?.slug === article.slug ? 'is-active' : ''}`}
                >
                  <span className="article-headline-rail-index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent-strong)]">{article.category}</p>
                    <div className="article-title-highlight mt-2">
                      <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">{article.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>

        {articleSpotlight ? (
          <section className="article-editorial-grid mt-8 scroll-reveal-block">
            <article className="article-feature-band rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#0f172a,#1f4d17)] text-white shadow-[0_22px_48px_rgba(15,23,42,0.24)]">
              <div className="article-feature-band-visual">
                <img src={articleSpotlight.coverImage} alt={articleSpotlight.coverAlt} className="article-cover-image" />
              </div>
              <div className="article-feature-band-copy">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d4f9af]">Sorotan utama</p>
                <div className="article-title-highlight article-title-highlight-dark mt-4">
                  <h2 className="text-3xl font-black tracking-tight">{articleSpotlight.title}</h2>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/78">{articleSpotlight.excerpt}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-white/74">
                  <span>{articleSpotlight.category}</span>
                  <span>{formatArticleDate(articleSpotlight.publishedAt)}</span>
                  <span>{articleSpotlight.readTime}</span>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {articleSpotlight.highlights.map((point) => (
                    <div key={`${articleSpotlight.slug}-${point}`} className="rounded-[22px] border border-white/12 bg-white/6 px-4 py-4 text-sm leading-6 text-white/82">
                      {point}
                    </div>
                  ))}
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
              </div>
            </article>

            <aside className="article-latest-stack rounded-[30px] border border-[var(--border-soft)] bg-white p-5 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Terbaru</p>
              <div className="mt-4 grid gap-3">
                {articleLatest.map((article) => (
                  <button
                    key={article.slug}
                    type="button"
                    onClick={() => navigateToArticle(article.slug)}
                    className="article-related-card"
                  >
                    <img src={article.coverImage} alt={article.coverAlt} className="article-related-thumb" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent-strong)]">{article.category}</p>
                      <p className="mt-2 text-sm font-black tracking-tight text-[var(--text-primary)]">{article.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

        <section className="article-social-shell mt-8 scroll-reveal-block">
          <div className="article-social-band">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Video TikTok Bradwear</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">Video singkat dari akun TikTok resmi Bradwear Indonesia</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Bagian ini menampilkan jalur cepat ke video resmi TikTok Bradwear untuk referensi produk, custom bordir, dan kebutuhan seragam medis atau operasional.
              </p>
            </div>
            <div className="article-social-grid mt-6">
              {TIKTOK_VIDEO_ITEMS.map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="article-social-card">
                  <img src={item.image} alt={item.title} className="article-social-image" />
                  <div className="article-social-copy">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">{item.note}</p>
                    <div className="article-title-highlight mt-3">
                      <p className="text-base font-black tracking-tight text-[var(--text-primary)]">{item.title}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="article-social-band">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Instagram Bradwear</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">Sorotan konten dari akun Instagram resmi Bradwear</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Sorotan ini mengarahkan pengunjung ke akun Instagram resmi Bradwear untuk melihat testimoni, detail bahan, mockup desain, dan update visual produksi lainnya.
              </p>
            </div>
            <div className="article-social-grid mt-6">
              {INSTAGRAM_ARTICLE_ITEMS.map((item) => (
                <a key={`${item.url}-${item.title}`} href={item.url} target="_blank" rel="noreferrer" className="article-social-card">
                  <img src={item.image} alt={item.title} className="article-social-image" />
                  <div className="article-social-copy">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">{item.note}</p>
                    <div className="article-title-highlight mt-3">
                      <p className="text-base font-black tracking-tight text-[var(--text-primary)]">{item.title}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 article-card-grid">
          {articleMagazineFeed.map((article) => (
            <article key={article.slug} className="article-story-card article-story-card-two-column scroll-reveal-block">
              <div className="article-story-visual">
                <img src={article.coverImage} alt={article.coverAlt} className="article-cover-image" />
              </div>
              <div className="article-story-body">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[var(--brand-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                    {article.category}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{formatArticleDate(article.publishedAt)}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{article.readTime}</span>
                </div>
                <div className="article-title-highlight mt-4">
                  <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">{article.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{article.excerpt}</p>
                <div className="article-story-keywords mt-4">
                  {article.keywords.slice(0, 3).map((keyword) => (
                    <span key={`${article.slug}-keyword-${keyword}`} className="article-story-keyword-chip">
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3">
                  {article.highlights.slice(0, 2).map((point) => (
                    <div key={`${article.slug}-highlight-${point}`} className="article-inline-point">
                      <span />
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
                <div className="article-story-snippet-grid mt-5">
                  {article.body.slice(0, 2).map((paragraph, index) => (
                    <p key={`${article.slug}-snippet-${index}`} className="article-story-snippet">
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
                    Baca artikel
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    );
  };

  const renderDownloadPage = () => (
    <div className="download-page-shell px-6 py-8 md:px-10">
      <section className="scroll-reveal-block rounded-[34px] border border-[var(--border-soft)] bg-[linear-gradient(140deg,#0f172a,#14380c)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d4f9af]">Download Route</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight">Pusat akses web Bradwear Indonesia</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
          Route <strong>/download</strong> tetap dipertahankan untuk kompatibilitas navigasi lama, tetapi sekarang diarahkan sebagai hub akses ke katalog, artikel, konsultasi, dan editor web Bradwear.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setCurrentRoute(RouteKey.KATALOG)}
            className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black tracking-tight text-[#0f172a] shadow-sm transition hover:-translate-y-0.5"
          >
            <CatalogGridIcon />
            Buka katalog web
          </button>
          <a
            href={buildWhatsAppUrl(buildConsultationMessage('butuh bantuan akses web Bradwear dan konsultasi model seragam'))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/18 px-5 py-3 text-sm font-black tracking-tight text-white transition hover:-translate-y-0.5"
          >
            Hubungi tim Bradwear
          </a>
        </div>
      </section>

      {ASSETS.CONTENT.GOOGLE_PLAY_GALLERY.length ? (
        <section className="download-gallery-shell scroll-reveal-block mt-8">
          <div className="download-gallery-copy">
            <p className="catalog-copy-band-kicker">Preview Mobile</p>
            <h2 className="catalog-copy-band-title">Preview aplikasi Bradwear dari Google Play</h2>
            <p className="catalog-copy-band-copy">
              Satu tampilan hero dipakai untuk preview utama, lalu tiga layar lain ditampilkan sebagai slider ringkas agar pengunjung langsung melihat konteks aplikasi sebelum download.
            </p>
          </div>

          {downloadPreviewHero ? (
            <article className="download-gallery-hero">
              <img src={downloadPreviewHero} alt="Preview hero aplikasi Bradwear di Google Play" className="download-gallery-hero-image" />
            </article>
          ) : null}

          {downloadPreviewSlides.length ? (
            <div className="download-gallery-grid">
              {downloadPreviewSlides.map((image, index) => (
                <article key={`${image}-${index}`} className="download-gallery-card">
                  <img src={image} alt={`Preview slider aplikasi Bradwear ${index + 1}`} className="download-gallery-image" />
                </article>
              ))}
            </div>
          ) : null}

          <div className="download-gallery-actions">
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="download-gallery-primary-link"
            >
              Download di Google Play
            </a>
          </div>
        </section>
      ) : null}

      <section className="scroll-reveal-block mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
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
            Halaman ini dipakai sebagai landing page akses web Bradwear untuk user yang sebelumnya mencari jalur download, akses katalog, atau butuh titik masuk cepat ke konsultasi.
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
            <button type="button" onClick={() => setCurrentRoute(RouteKey.THREE_D)} className="rounded-[20px] border border-[var(--border-soft)] bg-white px-4 py-4 text-left transition hover:-translate-y-0.5">
              <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">Buka studio 3D</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">Lanjutkan eksplorasi model 3D tanpa perlu instalasi aplikasi tambahan.</p>
            </button>
          </div>
        </aside>
      </section>
    </div>
  );

  const renderHowToOrder = () => {
    const activeHowToOrderVisual = HOW_TO_ORDER_VISUALS[activeHowToOrderStepIndex] ?? howToOrderHeroImage;

    return (
      <div className="how-to-order-page-shell px-6 py-8 md:px-10">
        <section className="how-to-order-hero-media scroll-reveal-block">
          <img
            src={howToOrderHeroImage}
            alt="Proses pemesanan Bradwear dari konsultasi hingga produksi"
            className="how-to-order-hero-image"
            loading="eager"
          />
        </section>

        <section className="how-to-order-shell scroll-reveal-block">
          <div className="how-to-order-intro-shell">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">Tahapan Order</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-[2.55rem]">
              Ikuti langkah yang sesuai sampai order siap diproses tim Bradwear.
            </h2>
          </div>

          <div className="how-to-order-layout mt-6">
            <aside className="how-to-order-selector-shell">
              <div className="order-step-selector">
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
                      <span className="order-step-pill-title">{step.title}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <article key={activeHowToOrderStep.id} className="order-step-panel how-to-order-panel-shell">
              <div className="how-to-order-panel-visual-shell">
                <img
                  src={activeHowToOrderVisual}
                  alt={activeHowToOrderStep.title}
                  className="how-to-order-panel-visual"
                  loading="lazy"
                />
              </div>

              <div className="how-to-order-panel-content">
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
                <h3 className="order-step-panel-title">{activeHowToOrderStep.title}</h3>
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
              </div>
            </article>
          </div>
        </section>
      </div>
    );
  };

  const renderCustomerService = () => (
    <div className="support-directory-page-shell px-6 py-8 md:px-10">
      <section className="support-directory-heading scroll-reveal-block">
        <p className="support-directory-kicker">Bantuan & Informasi</p>
        <h1 className="support-directory-title">Pilih topik bantuan yang ingin Anda buka.</h1>
        <p className="support-directory-copy">
          Halaman ini merangkum pertanyaan umum, panduan order, pengiriman, legal dasar, serta jalur kontak Bradwear
          dalam format ringkas yang lebih mudah dipakai dari mobile.
        </p>
      </section>

      <section className="support-directory-list-shell scroll-reveal-block">
        {SUPPORT_DIRECTORY_SECTIONS.map((section) => {
          const isOpen = openSupportSectionSlug === section.slug;

          return (
            <article key={section.slug} className={`support-directory-item ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                onClick={() => setOpenSupportSectionSlug(isOpen ? null : section.slug)}
                className="support-directory-trigger"
                aria-expanded={isOpen}
              >
                <span className="support-directory-trigger-main">
                  <span className="support-directory-icon-shell">{renderSupportDirectoryIcon(section.icon)}</span>
                  <span className="support-directory-trigger-copy">
                    <span className="support-directory-trigger-title">{section.title}</span>
                    <span className="support-directory-trigger-subtitle">{section.subtitle}</span>
                  </span>
                </span>
                <span className={`support-directory-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">
                  <ChevronRightIcon />
                </span>
              </button>

              <div className={`support-directory-answer ${isOpen ? 'open' : ''}`}>
                <div className="support-directory-answer-inner">
                  {section.items.map((item) => (
                    <article key={`${section.slug}-${item.question}`} className="support-directory-answer-item">
                      <h2 className="support-directory-answer-question">{item.question}</h2>
                      <p className="support-directory-answer-copy">{item.answer}</p>
                    </article>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="support-directory-cta scroll-reveal-block">
        <div className="support-directory-cta-copy">
          <p className="support-directory-kicker">Butuh bantuan langsung?</p>
          <h2>Hubungi tim Bradwear untuk konsultasi model, bahan, dan tindak lanjut order.</h2>
        </div>
        <div className="support-directory-cta-actions">
          <a
            href={buildWhatsAppUrl(buildConsultationMessage('estimasi biaya, bahan, dan timeline produksi'))}
            target="_blank"
            rel="noreferrer"
            className="catalog-bottom-cta-primary"
          >
            Konsultasi Gratis
            <InlineWhatsAppIcon />
          </a>
          <button
            type="button"
            onClick={() => setCurrentRoute(RouteKey.LACAK_PESANAN)}
            className="catalog-bottom-cta-secondary"
          >
            Cek Status Order
            <ArrowRightTinyIcon />
          </button>
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

  const scrollToBrandProfileSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderLegacyBrandProfilePage = () => {
    if (!activeBrandProfilePage) return null;

    return (
      <div className="brand-profile-page px-0 py-8">
        {/* Hero halaman profil mengambil teks dari BRAND_PROFILE_ITEMS sesuai route aktif. */}
        <section className="brand-profile-hero brand-profile-hero-flat px-6 py-8 text-white md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">{activeBrandProfilePage.kicker}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight">{activeBrandProfilePage.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">{activeBrandProfilePage.intro}</p>
        </section>

        {/* Ringkasan resmi dan poin utama profil perusahaan. */}
        <section className="brand-profile-grid mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="brand-profile-card brand-profile-card-flat brand-profile-reading-card">
            <p className="brand-profile-section-label">Ringkasan resmi</p>
            <h2 className="brand-profile-section-title">{activeBrandProfilePage.kicker}</h2>
            <div className="brand-profile-reading-flow">
              {activeBrandProfilePage.paragraphs.map((paragraph, index) => (
                <p key={`${activeBrandProfilePage.route}-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>

            {activeBrandProfilePage.note ? (
              <aside className="brand-profile-note">
                <p>{activeBrandProfilePage.note}</p>
              </aside>
            ) : null}

            <div className="section-action-stack mt-6">
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.HOME)}
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
              >
                Kembali ke beranda
              </button>
            </div>
          </article>

          <article className="brand-profile-card brand-profile-card-flat brand-profile-side-stack">
            <section className="brand-profile-side-panel">
              <p className="brand-profile-section-label">Poin utama</p>
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
            </section>

            {activeBrandProfilePage.facts?.length ? (
              <section className="brand-profile-side-panel">
                <p className="brand-profile-section-label">Data perusahaan</p>
                <div className="brand-profile-fact-list mt-5">
                  {activeBrandProfilePage.facts.map((fact) => (
                    <article key={`${activeBrandProfilePage.route}-${fact.label}`} className="brand-profile-fact-item">
                      <p className="brand-profile-fact-label">{fact.label}</p>
                      <p className="brand-profile-fact-value">{fact.value}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </section>
      </div>
    );
  };

  const renderBrandProfileShowcasePage = () => {
    if (!activeBrandProfileVisualPage) return null;

    return (
      <div className="profile-showcase-page px-0 py-8">
        <section className="profile-showcase-hero scroll-reveal-block">
          <article className="profile-showcase-hero-copy">
            <p className="profile-showcase-kicker">{activeBrandProfileVisualPage.kicker}</p>
            <h1 className="profile-showcase-title">{activeBrandProfileVisualPage.title}</h1>
            <p className="profile-showcase-intro">{activeBrandProfileVisualPage.intro}</p>
            <a
              href={buildWhatsAppUrl(buildConsultationMessage(activeBrandProfileVisualPage.cta.primaryMessage))}
              target="_blank"
              rel="noreferrer"
              className="profile-showcase-primary"
            >
              <span>{activeBrandProfileVisualPage.cta.primaryLabel}</span>
              <span className="profile-showcase-primary-icon" aria-hidden="true">
                <InlineWhatsAppIcon />
              </span>
            </a>
          </article>

          <div className="profile-showcase-hero-media">
            <img
              src={activeBrandProfileVisualPage.heroImage}
              alt={activeBrandProfileVisualPage.heroImageAlt}
              className="profile-showcase-hero-image"
            />
          </div>
        </section>

        <section className="profile-showcase-values scroll-reveal-block">
          <div className="profile-showcase-section-head">
            <h2>Nilai yang Kami Pegang</h2>
          </div>
          <div className="profile-showcase-values-grid">
            {activeBrandProfileVisualPage.values.map((item) => (
              <article key={`${activeBrandProfileVisualPage.route}-${item.title}`} className="profile-showcase-value-card">
                <div className="profile-showcase-value-icon">
                  <BrandProfileIcon icon={item.icon} className="profile-showcase-icon-svg" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-showcase-stats scroll-reveal-block">
          {activeBrandProfileVisualPage.stats.map((item) => (
            <article key={`${activeBrandProfileVisualPage.route}-${item.label}`} className="profile-showcase-stat-card">
              <div className="profile-showcase-stat-icon">
                <BrandProfileIcon icon={item.icon} className="profile-showcase-icon-svg" />
              </div>
              <p className="profile-showcase-stat-value">{item.value}</p>
              <p className="profile-showcase-stat-label">{item.label}</p>
              <p className="profile-showcase-stat-copy">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="profile-showcase-story scroll-reveal-block">
          <article className="profile-showcase-story-copy">
            <h2>{activeBrandProfileVisualPage.story.title}</h2>
            <div className="profile-showcase-story-flow">
              {activeBrandProfileVisualPage.story.paragraphs.map((paragraph, index) => (
                <p key={`${activeBrandProfileVisualPage.route}-story-${index}`}>{paragraph}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => (
                activeBrandProfileVisualPage.story.articleSlug
                  ? navigateToArticle(activeBrandProfileVisualPage.story.articleSlug)
                  : scrollToBrandProfileSection(`profile-process-${activeBrandProfileVisualPage.route}`)
              )}
              className="profile-showcase-secondary"
            >
              <span>{activeBrandProfileVisualPage.story.buttonLabel}</span>
              <ArrowRightTinyIcon />
            </button>
          </article>

          <div className="profile-showcase-story-media">
            <img
              src={activeBrandProfileVisualPage.story.image}
              alt={activeBrandProfileVisualPage.story.imageAlt}
              className="profile-showcase-story-image"
            />
          </div>
        </section>

        {renderProfileProcessSection(
          activeBrandProfileVisualPage.route,
          activeBrandProfileVisualPage.processTitle,
          activeBrandProfileVisualPage.processSteps,
        )}

        <section className="profile-showcase-cta scroll-reveal-block">
          <article className="profile-showcase-cta-copy">
            <h2>{activeBrandProfileVisualPage.cta.title}</h2>
            <p>{activeBrandProfileVisualPage.cta.copy}</p>
          </article>

          <div className="profile-showcase-cta-actions">
            <a
              href={buildWhatsAppUrl(buildConsultationMessage(activeBrandProfileVisualPage.cta.primaryMessage))}
              target="_blank"
              rel="noreferrer"
              className="profile-showcase-cta-primary"
            >
              <span>{activeBrandProfileVisualPage.cta.primaryLabel}</span>
              <span className="profile-showcase-primary-icon" aria-hidden="true">
                <InlineWhatsAppIcon />
              </span>
            </a>
            <button
              type="button"
              onClick={() => setCurrentRoute(RouteKey.KATALOG)}
              className="profile-showcase-cta-secondary"
            >
              <span>{activeBrandProfileVisualPage.cta.secondaryLabel}</span>
              <ArrowRightTinyIcon />
            </button>
          </div>
        </section>
      </div>
    );
  };

  const renderClientGallery = () => {
    const portfolioPage = activeBrandProfileVisualPage;
    if (!portfolioPage) return null;

    return (
      <div className="client-gallery-page-shell px-0 py-8">
        <div className="profile-showcase-page client-portfolio-page">
          <section className="profile-showcase-hero scroll-reveal-block">
            <article className="profile-showcase-hero-copy">
              <p className="profile-showcase-kicker">{portfolioPage.kicker}</p>
              <h1 className="profile-showcase-title">{portfolioPage.title}</h1>
              <p className="profile-showcase-intro">{portfolioPage.intro}</p>
              <a
                href={buildWhatsAppUrl(buildConsultationMessage(portfolioPage.cta.primaryMessage))}
                target="_blank"
                rel="noreferrer"
                className="profile-showcase-primary"
              >
                <span>{portfolioPage.cta.primaryLabel}</span>
                <span className="profile-showcase-primary-icon" aria-hidden="true">
                  <InlineWhatsAppIcon />
                </span>
              </a>
            </article>

            <div className="profile-showcase-hero-media">
              <img
                src={portfolioPage.heroImage}
                alt={portfolioPage.heroImageAlt}
                className="profile-showcase-hero-image"
              />
            </div>
          </section>

          <section className="profile-showcase-values scroll-reveal-block">
            <div className="profile-showcase-section-head">
              <h2>Nilai yang Kami Pegang</h2>
            </div>
            <div className="profile-showcase-values-grid">
              {portfolioPage.values.map((item) => (
                <article key={`${portfolioPage.route}-${item.title}`} className="profile-showcase-value-card">
                  <div className="profile-showcase-value-icon">
                    <BrandProfileIcon icon={item.icon} className="profile-showcase-icon-svg" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="profile-showcase-stats scroll-reveal-block">
            {portfolioPage.stats.map((item) => (
              <article key={`${portfolioPage.route}-${item.label}`} className="profile-showcase-stat-card">
                <div className="profile-showcase-stat-icon">
                  <BrandProfileIcon icon={item.icon} className="profile-showcase-icon-svg" />
                </div>
                <p className="profile-showcase-stat-value">{item.value}</p>
                <p className="profile-showcase-stat-label">{item.label}</p>
                <p className="profile-showcase-stat-copy">{item.copy}</p>
              </article>
            ))}
          </section>

          <section className="profile-showcase-story scroll-reveal-block">
            <article className="profile-showcase-story-copy">
              <h2>{portfolioPage.story.title}</h2>
              <div className="profile-showcase-story-flow">
                {portfolioPage.story.paragraphs.map((paragraph, index) => (
                  <p key={`${portfolioPage.route}-story-${index}`}>{paragraph}</p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => scrollToBrandProfileSection('client-portfolio-categories')}
                className="profile-showcase-secondary"
              >
                <span>{portfolioPage.story.buttonLabel}</span>
                <ArrowRightTinyIcon />
              </button>
            </article>

            <div className="profile-showcase-story-media">
              <img
                src={portfolioPage.story.image}
                alt={portfolioPage.story.imageAlt}
                className="profile-showcase-story-image"
              />
            </div>
          </section>

          {renderProfileProcessSection(
            portfolioPage.route,
            portfolioPage.processTitle,
            portfolioPage.processSteps,
          )}

          <section id="client-portfolio-categories" className="portfolio-gallery-overview scroll-reveal-block">
            <div className="profile-showcase-section-head portfolio-gallery-head">
              <h2>Kategori Portofolio</h2>
              <p>Referensi hasil jadi diringkas per sektor agar Anda lebih cepat menemukan model yang paling dekat dengan kebutuhan tim.</p>
            </div>

            <div className="portfolio-gallery-card-grid">
              {clientGalleryGroups.map((group) => {
                const meta = CLIENT_GALLERY_META[group.slug] ?? {
                  title: group.name,
                  subtitle: 'Dokumentasi hasil jadi klien Bradwear Indonesia.',
                  logo: clientLogoMap.KEMENDAGRI,
                };
                const cover = group.images[0] ?? portfolioPage.heroImage;

                return (
                  <article key={`portfolio-card-${group.slug}`} className="portfolio-gallery-card">
                    <div className="portfolio-gallery-card-media">
                      <img src={cover} alt={`${meta.title} cover`} className="portfolio-gallery-card-image" />
                    </div>

                    <div className="portfolio-gallery-card-copy">
                      <div className="portfolio-gallery-card-topline">
                        {meta.logo ? <img src={meta.logo} alt={meta.title} className="portfolio-gallery-card-logo" /> : <span />}
                        <span>{group.images.length} dokumentasi</span>
                      </div>
                      <h3>{meta.title}</h3>
                      <p>{meta.subtitle}</p>
                      <button
                        type="button"
                        onClick={() => scrollToBrandProfileSection(`client-band-${group.slug}`)}
                        className="profile-showcase-secondary portfolio-gallery-card-action"
                      >
                        <span>Lihat detail</span>
                        <ArrowRightTinyIcon />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="parallax-static-zone portfolio-gallery-band-stack scroll-reveal-block">
            {clientGalleryGroups.map((group) => {
              const meta = CLIENT_GALLERY_META[group.slug] ?? {
                title: group.name,
                subtitle: 'Dokumentasi hasil jadi klien Bradwear Indonesia.',
                logo: clientLogoMap.KEMENDAGRI,
              };
              const [featuredImage, ...otherImages] = group.images;
              const gallerySlides = [...(featuredImage ? [featuredImage] : []), ...otherImages];

              return (
                <article id={`client-band-${group.slug}`} key={group.slug} className="client-gallery-band">
                  <div className="client-gallery-band-copy px-6 py-7 md:px-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Kategori Portofolio</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      {meta.logo ? <img src={meta.logo} alt={meta.title} className="client-gallery-band-logo" /> : null}
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

          <section className="profile-showcase-cta scroll-reveal-block">
            <article className="profile-showcase-cta-copy">
              <h2>{portfolioPage.cta.title}</h2>
              <p>{portfolioPage.cta.copy}</p>
            </article>

            <div className="profile-showcase-cta-actions">
              <a
                href={buildWhatsAppUrl(buildConsultationMessage(portfolioPage.cta.primaryMessage))}
                target="_blank"
                rel="noreferrer"
                className="profile-showcase-cta-primary"
              >
                <span>{portfolioPage.cta.primaryLabel}</span>
                <span className="profile-showcase-primary-icon" aria-hidden="true">
                  <InlineWhatsAppIcon />
                </span>
              </a>
              <button
                type="button"
                onClick={() => setCurrentRoute(RouteKey.KATALOG)}
                className="profile-showcase-cta-secondary"
              >
                <span>{portfolioPage.cta.secondaryLabel}</span>
                <ArrowRightTinyIcon />
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  };

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
        return renderCatalog(featured);
      case RouteKey.DOWNLOAD:
        return renderDownloadPage();
      case RouteKey.CLIENT:
        return renderClientGallery();
      case RouteKey.TESTIMONI:
        return renderTestimonialsPage();
      case RouteKey.ABOUT:
      case RouteKey.VISION_MISSION:
      case RouteKey.PRODUCTS_SERVICES:
      case RouteKey.COMPETITIVE_ADVANTAGE:
      case RouteKey.CLIENT_REACH:
        return renderBrandProfileShowcasePage();
      case RouteKey.LEGAL_LICENSE:
        return renderLegacyBrandProfilePage();
      case RouteKey.PANTS:
        return renderCatalog(pantsProducts);
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
