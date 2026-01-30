
/**
 * File: assets.ts
 * Deskripsi: Centralized Image Repository.
 * Mendukung pemanggilan file lokal dari folder ./assets
 */

// Import logo dan UI assets
import LOGO_BRADWEAR from './assets/logo_bradwear.png';
import HERO_BG from './assets/factory_hero.jpg';

// Import Produk
import GATAM_FRONT from './assets/gatam_front.png';
import GATAM_BACK from './assets/gatam_back.png';
import MTAC_FRONT from './assets/mtac_front.png';
import BOMBER_FRONT from './assets/bomber_front.png';
import YOROI_FRONT from './assets/yoroidpn.jpeg';
import YOROI_BACK from './assets/yoroiblkg.jpeg';

// Import Our Partners Logos
import PARTNER_KEMENDAGRI_1 from './assets/Logo our partner/GKL14_Kemendagri (Kementerian Dalam Negeri) - koleksilogo.com (1).png';
import PARTNER_KEMENDAGRI from './assets/Logo our partner/GKL14_Kemendagri (Kementerian Dalam Negeri) - koleksilogo.com.png';
import PARTNER_TUTWURI from './assets/Logo our partner/GKL15_Tut Wuri Handayani - koleksilogo.com.png';
import PARTNER_HAM from './assets/Logo our partner/GKL16_Kementerian Hak Asasi Manusia - koleksilogo.com.png';
import PARTNER_DPR from './assets/Logo our partner/GKL21_DPR RI (Dewan Perwakilan Daerah) - koleksilogo.com.png';
import PARTNER_BMKG from './assets/Logo our partner/GKL29_BMKG - Koleksilogo.com.png';
import PARTNER_BAPPENAS from './assets/Logo our partner/GKL29_Bappenas 2023 (Kementerian Perencanaan Pembangunan Nasional).png';
import PARTNER_KPI from './assets/Logo our partner/GKL74_Komisi Penyiaran Indonesia (KPI) - koleksilogo.com.png';
import PARTNER_BUMN from './assets/Logo our partner/Kementerian BUMN (Baru 2020) Logo (PNG-1080p) - Logopedia.png';
import PARTNER_PUPR from './assets/Logo our partner/Logo Kementerian PUPR (PNG-2160p) - Logopedia.png';
import PARTNER_HUB from './assets/Logo our partner/Logo Kementerian Perhubungan Indonesia (Kemenhub)  (PNG-2160p) - Logopedia.png';
import PARTNER_PERINDUS from './assets/Logo our partner/Logo Kementerian Perindustrian Indonesia (PNG-2160p) - Logopedia.png';

export const ASSETS = {
  // --- UI & BRANDING ---
  BRAND: {
    LOGO: LOGO_BRADWEAR,
    HERO: HERO_BG,
  },

  // --- OUR PARTNERS ---
  PARTNERS: [
    PARTNER_KEMENDAGRI,
    PARTNER_HAM,
    PARTNER_DPR,
    PARTNER_BMKG,
    PARTNER_BAPPENAS,
    PARTNER_KPI,
    PARTNER_BUMN,
    PARTNER_PUPR,
    PARTNER_HUB,
    PARTNER_PERINDUS,
    PARTNER_TUTWURI,
    PARTNER_KEMENDAGRI_1
  ],

  // --- KATEGORI KEMEJA ---
  KEMEJA: {
    GATAM_FRONT: GATAM_FRONT,
    GATAM_BACK: GATAM_BACK,
    MTAC_FRONT: MTAC_FRONT,
    YOROI_FRONT: YOROI_FRONT,
    YOROI_BACK: YOROI_BACK,
    VENTURA: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
    PDH: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600',
  },

  // --- KATEGORI JAKET ---
  JAKET: {
    BOMBER: BOMBER_FRONT,
  },

  // --- KATEGORI CELANA ---
  CELANA: {
    WARRIOR: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600',
    FORMAL: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
  },

  // --- KATEGORI ROMPI ---
  ROMPI: {
    BUPATI: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=600',
  },

  // --- UI ASSETS (Avatars, etc) ---
  AVATARS: {
    DAFFA: 'https://i.pravatar.cc/150?u=daffa',
    SISKA: 'https://i.pravatar.cc/150?u=siska',
  }
};

export const getAssetByName = (name: string): string => {
  const flatAssets: Record<string, string> = {
    ...ASSETS.BRAND,
    ...ASSETS.KEMEJA,
    ...ASSETS.JAKET,
    ...ASSETS.CELANA,
    ...ASSETS.ROMPI,
    ...ASSETS.AVATARS
  };
  return flatAssets[name] || '';
};
