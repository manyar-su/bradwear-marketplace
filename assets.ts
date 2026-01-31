
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

// Import Warna Images
import COLOR_BIRU_MUDA from './assets/warna/biru muda.jpeg';
import COLOR_COKLAT_TUA from './assets/warna/coklat tua.jpeg';
import COLOR_COKLAT from './assets/warna/coklat.jpeg';
import COLOR_DENIM from './assets/warna/denim.jpeg';
import COLOR_HIJAU_ARMY from './assets/warna/hijau army.jpeg';
import COLOR_HIJAU_BUNGLON from './assets/warna/hijau bunglon.jpeg';
import COLOR_HIJAU from './assets/warna/hijau.jpeg';
import COLOR_HITAM from './assets/warna/hitam.jpeg';
import COLOR_KHAKI from './assets/warna/khaki.jpeg';
import COLOR_KUNING from './assets/warna/kuning.jpeg';
import COLOR_MAROON from './assets/warna/maroon.jpeg';
import COLOR_MERAH_CABE from './assets/warna/merah cabe.jpeg';
import COLOR_MOCHA from './assets/warna/mocha.jpeg';
import COLOR_NAVI from './assets/warna/navi.jpeg';
import COLOR_OREN from './assets/warna/oren.jpeg';
import COLOR_PUTIH from './assets/warna/putih.jpeg';
import COLOR_SAGE from './assets/warna/sage.jpeg';
import COLOR_UNGU_MUDA from './assets/warna/ungu muda.jpeg';
import COLOR_UNGU_TUA from './assets/warna/ungu tua.jpeg';

// Import Warna Images (BACK)
import COLOR_BIRU_MUDA_BACK from './assets/warna/biru muda belakang.png';
import COLOR_COKLAT_TUA_BACK from './assets/warna/coklat tua belakang.png';
import COLOR_COKLAT_BACK from './assets/warna/coklat belakang.png';
import COLOR_DENIM_BACK from './assets/warna/denim belakang.png';
import COLOR_HIJAU_ARMY_BACK from './assets/warna/hijau army belakang.png';
import COLOR_HIJAU_BUNGLON_BACK from './assets/warna/hijau bunglon belakang.png';
import COLOR_HIJAU_BACK from './assets/warna/hijau belakang.png';
import COLOR_HITAM_BACK from './assets/warna/hitam belakang.png';
import COLOR_KHAKI_BACK from './assets/warna/khaki belakang.png';
import COLOR_KUNING_BACK from './assets/warna/kuning belakang.png';
import COLOR_MAROON_BACK from './assets/warna/maroon belakang.png';
import COLOR_MERAH_CABE_BACK from './assets/warna/merah cabe belakang.png';
import COLOR_MOCHA_BACK from './assets/warna/mocha belakang.png';
import COLOR_NAVI_BACK from './assets/warna/navi belakang.png';
import COLOR_OREN_BACK from './assets/warna/oren belakang.png';
import COLOR_PUTIH_BACK from './assets/warna/putih belakang.png';
import COLOR_SAGE_BACK from './assets/warna/sage belakang.png';
import COLOR_UNGU_MUDA_BACK from './assets/warna/ungu muda belakang.png';
import COLOR_UNGU_TUA_BACK from './assets/warna/ungu tua belakang.png';

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
  },

  // --- WARNA ---
  COLORS: {
    BIRU_MUDA: COLOR_BIRU_MUDA,
    COKLAT_TUA: COLOR_COKLAT_TUA,
    COKLAT: COLOR_COKLAT,
    DENIM: COLOR_DENIM,
    HIJAU_ARMY: COLOR_HIJAU_ARMY,
    HIJAU_BUNGLON: COLOR_HIJAU_BUNGLON,
    HIJAU: COLOR_HIJAU,
    HITAM: COLOR_HITAM,
    KHAKI: COLOR_KHAKI,
    KUNING: COLOR_KUNING,
    MAROON: COLOR_MAROON,
    MERAH_CABE: COLOR_MERAH_CABE,
    MOCHA: COLOR_MOCHA,
    NAVI: COLOR_NAVI,
    OREN: COLOR_OREN,
    PUTIH: COLOR_PUTIH,
    SAGE: COLOR_SAGE,
    UNGU_MUDA: COLOR_UNGU_MUDA,
    UNGU_TUA: COLOR_UNGU_TUA,
  },

  // --- WARNA BELAKANG ---
  COLORS_BACK: {
    BIRU_MUDA: COLOR_BIRU_MUDA_BACK,
    COKLAT_TUA: COLOR_COKLAT_TUA_BACK,
    COKLAT: COLOR_COKLAT_BACK,
    DENIM: COLOR_DENIM_BACK,
    HIJAU_ARMY: COLOR_HIJAU_ARMY_BACK,
    HIJAU_BUNGLON: COLOR_HIJAU_BUNGLON_BACK,
    HIJAU: COLOR_HIJAU_BACK,
    HITAM: COLOR_HITAM_BACK,
    KHAKI: COLOR_KHAKI_BACK,
    KUNING: COLOR_KUNING_BACK,
    MAROON: COLOR_MAROON_BACK,
    MERAH_CABE: COLOR_MERAH_CABE_BACK,
    MOCHA: COLOR_MOCHA_BACK,
    NAVI: COLOR_NAVI_BACK,
    OREN: COLOR_OREN_BACK,
    PUTIH: COLOR_PUTIH_BACK,
    SAGE: COLOR_SAGE_BACK,
    UNGU_MUDA: COLOR_UNGU_MUDA_BACK,
    UNGU_TUA: COLOR_UNGU_TUA_BACK,
  }
};

export const getAssetByName = (name: string): string => {
  const flatAssets: Record<string, string> = {
    ...ASSETS.BRAND,
    ...ASSETS.KEMEJA,
    ...ASSETS.JAKET,
    ...ASSETS.CELANA,
    ...ASSETS.ROMPI,
    ...ASSETS.AVATARS,
    ...ASSETS.COLORS,
    ...ASSETS.COLORS_BACK
  };
  return flatAssets[name] || '';
};
