
/**
 * File: assets.ts
 * Deskripsi: Centralized Image Repository.
 * Mendukung pemanggilan file lokal dari folder ./assets
 */

// Import logo dan UI assets
import LOGO_BRADWEAR from './assets/logo_bradwear.png';
import HERO_BG from './assets/factory_hero.jpg';

// Supabase Integration Toggle
// Set 'true' untuk menggunakan asset dari Supabase Storage
export const USE_SUPABASE_STORAGE = true;
export const SUPABASE_BASE_URL = 'https://kppsavzarjxtwsljwzzi.supabase.co/storage/v1/object/public/assets';

// Helper untuk mendapatkan path asset (lokal atau remote)
const getAssetPath = (localPath: string, remotePath: string): string => {
  return USE_SUPABASE_STORAGE ? `${SUPABASE_BASE_URL}/${remotePath}` : localPath;
};

// Import Produk
// Import Produk - KEMEJA MAIN & GALLERY
// Dynamic Front Image Detection (supports jpeg, jpg, png, webp)
// Universal Image Detection (supports jpeg, jpg, png, webp, and generic naming)
const allImagesGlob = import.meta.glob('./assets/Model Kemeja/**/*.(jpeg|jpg|png|webp)', { eager: true, query: '?url', import: 'default' });

const getModelAsset = (folder: string, fileName: string) => {
  const extensions = ['png', 'jpg', 'jpeg', 'webp'];
  const possibleNames = [fileName, `${folder}_${fileName}`, `series-${folder}-${fileName}`];

  for (const name of possibleNames) {
    for (const ext of extensions) {
      const key = `./assets/Model Kemeja/${folder}/${name}.${ext}`;
      if (allImagesGlob[key]) return allImagesGlob[key] as string;
    }
  }
  return '';
};

const getFrontImage = (folder: string) => getModelAsset(folder, 'depan');
const getBackImage = (folder: string) => getModelAsset(folder, 'belakang');

// --- DYNAMIC COLOR LOADING (Robust format detection & Supabase Support) ---
const allWarnaGlob = import.meta.glob('./assets/warna/**/*.(jpeg|jpg|png|webp)', { eager: true, query: '?url', import: 'default' });

const getColorAsset = (name: string): string => {
  const extensions = ['jpeg', 'jpg', 'png', 'webp'];
  let detectedExt = 'jpeg'; // Default fallback
  let localUrl = '';

  // 1. Local File Check (Multiple Formats)
  for (const ext of extensions) {
    const key = `./assets/warna/${name}.${ext}`;
    if (allWarnaGlob[key]) {
      localUrl = allWarnaGlob[key] as string;
      detectedExt = ext;
      break;
    }
  }

  // 2. Return Local URL if found (as requested: restore to load from assets warna)
  if (localUrl) return localUrl;

  // 3. Fallback to Supabase URL if enabled
  if (USE_SUPABASE_STORAGE) {
    return `${SUPABASE_BASE_URL}/warna/${encodeURIComponent(name)}.${detectedExt}`;
  }

  return '';
};

const BRAD_V3_FRONT = getFrontImage('Brad-V3') || getFrontImage('gatam');
const BRAD_V3_BACK = getBackImage('Brad-V3') || getBackImage('gatam');
const BRAD_V3_GAL_1 = getModelAsset('Brad-V3', '1') || getModelAsset('gatam', '1');
const BRAD_V3_GAL_2 = getModelAsset('Brad-V3', '2') || getModelAsset('gatam', '2');
const BRAD_V3_GAL_3 = getModelAsset('Brad-V3', '3') || getModelAsset('gatam', '3');

const BRAD_V1_FRONT = getFrontImage('Brad-v1');
const BRAD_V1_GAL_1 = getModelAsset('Brad-v1', '1');
const BRAD_V1_GAL_2 = getModelAsset('Brad-v1', '2');

const BRAD_V2_FRONT = getFrontImage('Brad-v2');
const BRAD_V2_GAL_1 = getModelAsset('Brad-v2', '1');
const BRAD_V2_GAL_2 = getModelAsset('Brad-v2', '2');
const BRAD_V2_GAL_3 = getModelAsset('Brad-v2', '3');


const PDH_FRONT = getFrontImage('Pdh');
const PDH_GAL_1 = getModelAsset('Pdh', '1');
const PDH_GAL_2 = getModelAsset('Pdh', '2');
const PDH_GAL_3 = getModelAsset('Pdh', '3');

const PDH_BARU_FRONT = getFrontImage('Pdh-baru');
const PDH_BARU_GAL_1 = getModelAsset('Pdh-baru', '1');
const PDH_BARU_GAL_2 = getModelAsset('Pdh-baru', '2');

const ROBOTIC_FRONT = getFrontImage('robotik');
const ROBOTIC_GAL_1 = getModelAsset('robotik', '1');
const ROBOTIC_GAL_2 = getModelAsset('robotik', '2');

const STRAZAR_FRONT = getFrontImage('Strazard');
const STRAZAR_GAL_1 = getModelAsset('Strazard', '1');
const STRAZAR_GAL_2 = getModelAsset('Strazard', '2');
const STRAZAR_GAL_3 = getModelAsset('Strazard', '3');

const VENTURA_FRONT = getFrontImage('Ventura');
const VENTURA_GAL_1 = getModelAsset('Ventura', '1');
const VENTURA_GAL_2 = getModelAsset('Ventura', '2');
const VENTURA_GAL_3 = getModelAsset('Ventura', '3');

import MTAC_FRONT from './assets/mtac_front.png';
import BOMBER_FRONT from './assets/Jacket/bomber_front.png';

const YOROI_FRONT = getFrontImage('Yoroi');
import YOROI_BACK from './assets/yoroiblkg.jpeg';
import YOROI_GAL_1 from './assets/Model Kemeja/Yoroi/series-yoroi-1.webp';
import YOROI_GAL_2 from './assets/Model Kemeja/Yoroi/series-yoroi-2.webp';
import YOROI_GAL_3 from './assets/Model Kemeja/Yoroi/series-yoroi-3.webp';

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

// --- COLORS ARE NOW LOADED DYNAMICALLY BELOW ---

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
    BRAD_V3: {
      FRONT: BRAD_V3_FRONT,
      BACK: BRAD_V3_BACK,
      GALLERY: [BRAD_V3_GAL_1, BRAD_V3_GAL_2, BRAD_V3_GAL_3].filter(Boolean)
    },
    BRAD_V1: {
      FRONT: BRAD_V1_FRONT,
      BACK: getBackImage('Brad-v1'),
      GALLERY: [BRAD_V1_GAL_1, BRAD_V1_GAL_2].filter(Boolean)
    },
    BRAD_V2: {
      FRONT: BRAD_V2_FRONT,
      BACK: getBackImage('Brad-v2'),
      GALLERY: [BRAD_V2_GAL_1, BRAD_V2_GAL_2, BRAD_V2_GAL_3].filter(Boolean)
    },
    PDH: {
      FRONT: PDH_FRONT,
      BACK: getBackImage('Pdh'),
      GALLERY: [PDH_GAL_1, PDH_GAL_2, PDH_GAL_3].filter(Boolean)
    },
    PDH_BARU: {
      FRONT: PDH_BARU_FRONT,
      BACK: getBackImage('Pdh-baru'),
      GALLERY: [PDH_BARU_GAL_1, PDH_BARU_GAL_2].filter(Boolean)
    },
    ROBOTIC: {
      FRONT: ROBOTIC_FRONT,
      BACK: getBackImage('robotik'),
      GALLERY: [ROBOTIC_GAL_1, ROBOTIC_GAL_2].filter(Boolean)
    },
    STRAZAR: {
      FRONT: STRAZAR_FRONT,
      BACK: getBackImage('Strazard'),
      GALLERY: [STRAZAR_GAL_1, STRAZAR_GAL_2, STRAZAR_GAL_3].filter(Boolean)
    },
    VENTURA: {
      FRONT: VENTURA_FRONT,
      BACK: getBackImage('Ventura'),
      GALLERY: [VENTURA_GAL_1, VENTURA_GAL_2, VENTURA_GAL_3].filter(Boolean)
    },
    YOROI: {
      FRONT: YOROI_FRONT,
      BACK: YOROI_BACK || getBackImage('Yoroi'),
      GALLERY: [YOROI_GAL_1, YOROI_GAL_2, YOROI_GAL_3].filter(Boolean)
    },

    // Legacy / Fallback
    MTAC_FRONT,
  },

  // --- KATEGORI JAKET ---
  JAKET: {
    BOMBER: BOMBER_FRONT,
  },

  // --- KATEGORI CELANA ---
  CELANA: {
    WARRIOR: getAssetPath('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600', 'Celana/warrior.jpg'),
    FORMAL: getAssetPath('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600', 'Celana/formal.jpg'),
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
    BIRU_MUDA: getColorAsset('biru muda'),
    COKLAT_TUA: getColorAsset('coklat tua'),
    COKLAT: getColorAsset('coklat'),
    DENIM: getColorAsset('denim'),
    HIJAU_ARMY: getColorAsset('hijau army'),
    HIJAU_BUNGLON: getColorAsset('hijau bunglon'),
    HIJAU: getColorAsset('hijau'),
    HITAM: getColorAsset('hitam'),
    KHAKI: getColorAsset('khaki'),
    KUNING: getColorAsset('kuning'),
    MAROON: getColorAsset('maroon'),
    MERAH_CABE: getColorAsset('merah cabe'),
    MOCHA: getColorAsset('mocha'),
    NAVI: getColorAsset('navi'),
    OREN: getColorAsset('oren'),
    PUTIH: getColorAsset('putih'),
    SAGE: getColorAsset('sage'),
    UNGU_MUDA: getColorAsset('ungu muda'),
    UNGU_TUA: getColorAsset('ungu tua'),
  },

  // --- WARNA BELAKANG ---
  COLORS_BACK: {
    BIRU_MUDA: getColorAsset('biru muda belakang'),
    COKLAT_TUA: getColorAsset('coklat tua belakang'),
    COKLAT: getColorAsset('coklat belakang'),
    DENIM: getColorAsset('denim belakang'),
    HIJAU_ARMY: getColorAsset('hijau army belakang'),
    HIJAU_BUNGLON: getColorAsset('hijau bunglon belakang'),
    HIJAU: getColorAsset('hijau belakang'),
    HITAM: getColorAsset('hitam belakang'),
    KHAKI: getColorAsset('khaki belakang'),
    KUNING: getColorAsset('kuning belakang'),
    MAROON: getColorAsset('maroon belakang'),
    MERAH_CABE: getColorAsset('merah cabe belakang'),
    MOCHA: getColorAsset('mocha belakang'),
    NAVI: getColorAsset('navi belakang'),
    OREN: getColorAsset('oren belakang'),
    PUTIH: getColorAsset('putih belakang'),
    SAGE: getColorAsset('sage belakang'),
    UNGU_MUDA: getColorAsset('ungu muda belakang'),
    UNGU_TUA: getColorAsset('ungu tua belakang'),
  }
};

// Helper untuk mendapatkan asset berdasarkan nama string (jika diperlukan)
export const getAssetByName = (name: string): string => {
  const flatAssets: Record<string, any> = {
    ...ASSETS.BRAND,
    ...ASSETS.KEMEJA,
    ...ASSETS.JAKET,
    ...ASSETS.CELANA,
    ...ASSETS.ROMPI,
    ...ASSETS.AVATARS,
    ...ASSETS.COLORS,
    ...ASSETS.COLORS_BACK
  };
  const result = flatAssets[name];
  return typeof result === 'string' ? result : '';
};
