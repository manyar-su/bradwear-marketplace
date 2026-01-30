
/**
 * File: assets.ts
 * Deskripsi: Centralized Image Repository.
 * Mendukung pemanggilan file lokal dari folder ./assets
 */

// Import logo dan UI assets
import LOGO_BRADWEAR from './assets/logo_bradwear.png';
import HERO_BG from './assets/factory_hero.jpg';

// Import Produk (Contoh beberapa produk utama)
import GATAM_FRONT from './assets/gatam_front.png';
import GATAM_BACK from './assets/gatam_back.png';
import MTAC_FRONT from './assets/mtac_front.png';
import BOMBER_FRONT from './assets/bomber_front.png';

export const ASSETS = {
  // --- UI & BRANDING ---
  BRAND: {
    LOGO: LOGO_BRADWEAR,
    HERO: HERO_BG,
  },

  // --- KATEGORI KEMEJA ---
  KEMEJA: {
    GATAM_FRONT: GATAM_FRONT,
    GATAM_BACK: GATAM_BACK,
    MTAC_FRONT: MTAC_FRONT,
    // Tetap sediakan URL sebagai fallback jika file lokal belum ada
    YOROI: 'https://images.unsplash.com/photo-1621072156002-e2fcced0b170?auto=format&fit=crop&q=80&w=600',
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
    ADMIN: './assets/avatar_admin.png', // Bisa lewat path langsung jika dikonfigurasi vite
  }
};

/**
 * Helper untuk mendapatkan path gambar berdasarkan nama
 * Memudahkan pemanggilan dinamis jika diperlukan
 */
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
