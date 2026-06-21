
/**
 * File: assets.ts
 * Deskripsi: Centralized Image Repository.
 * Mendukung pemanggilan file lokal dari folder ./assets
 */

// Universal Image Detection (supports all product categories + root assets + logos)
const allImagesGlob = import.meta.glob('./assets/**/*.(jpeg|jpg|png|webp)', { eager: true, query: '?url', import: 'default' });

// Supabase Integration Toggle
// Set 'true' untuk menggunakan asset dari Supabase Storage
// Set 'false' untuk menggunakan asset lokal saat sedang memperbarui isi folder
export const USE_SUPABASE_STORAGE = false;
export const SUPABASE_BASE_URL = 'https://kppsavzarjxtwsljwzzi.supabase.co/storage/v1/object/public/assets';

// Robust path resolver for constants and functions
const resolveAsset = (key: string): string => {
  if (!key) return '';
  const localUrl = allImagesGlob[key] as string || '';
  if (!USE_SUPABASE_STORAGE) return localUrl;

  // Convert './assets/Kemeja/xxx.png' to 'Kemeja/xxx.png'
  const remotePath = key.replace(/^\.\/assets\//, '');
  // Encode each segment of the path separately to handle spaces, parentheses, etc.
  const encodedPath = remotePath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${SUPABASE_BASE_URL}/${encodedPath}`;
};

// Helper untuk mendapatkan path asset (lokal atau remote)
const getAssetPath = (localPath: string, remotePath: string): string => {
  return USE_SUPABASE_STORAGE ? `${SUPABASE_BASE_URL}/${remotePath}` : localPath;
};

// Import logo dan UI assets dynamically
const LOGO_BRADWEAR = resolveAsset('./assets/logo.png');
const HERO_BG = resolveAsset('./assets/factory_hero.webp');
const HERO_SLIDES = Object.keys(allImagesGlob)
  .filter((key) => key.toLowerCase().includes('/slideshow/'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => resolveAsset(key));
const MIDDLE_CONTENT_SLIDES = Object.keys(allImagesGlob)
  .filter((key) => key.toLowerCase().includes('/middle content/'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => resolveAsset(key));
const SIZE_GUIDE = resolveAsset('./assets/size guide.webp');
const MATERIAL_GUIDE_SOURCE = Object.keys(allImagesGlob)
  .filter((key) => key.toLowerCase().includes('/jenis bahan/'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const findMaterialGuideImage = (pattern: string) =>
  resolveAsset(MATERIAL_GUIDE_SOURCE.find((key) => key.toLowerCase().includes(pattern)) ?? '');

const MATERIAL_GUIDE_IMAGES = {
  JAPAN_DRILL: findMaterialGuideImage('japan'),
  RIPSTOP: findMaterialGuideImage('ripstop'),
  TROPICAL: findMaterialGuideImage('tropical'),
  TWILL: findMaterialGuideImage('twill.webp') || findMaterialGuideImage('twill'),
  NAGATA_DRILL: findMaterialGuideImage('nagata'),
  STANFORD: findMaterialGuideImage('stanford'),
};

const CLIENT_GALLERY_ORDER = ['dinsos', 'kejagung', 'medis', 'pemkab'] as const;
const formatFolderLabel = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const clientGalleryBuckets = Object.keys(allImagesGlob)
  .filter((key) => key.toLowerCase().includes('/galery client/'))
  .reduce<Record<string, string[]>>((acc, key) => {
    const parts = key.split('/');
    const folderName = parts[3];
    if (!folderName) return acc;
    if (!acc[folderName]) {
      acc[folderName] = [];
    }
    acc[folderName].push(resolveAsset(key));
    return acc;
  }, {});

const CLIENT_GALLERY_GROUPS = [
  ...CLIENT_GALLERY_ORDER.filter((slug) => clientGalleryBuckets[slug]),
  ...Object.keys(clientGalleryBuckets).filter((slug) => !CLIENT_GALLERY_ORDER.includes(slug as typeof CLIENT_GALLERY_ORDER[number])),
].map((slug) => ({
  slug,
  name: formatFolderLabel(slug),
  images: (clientGalleryBuckets[slug] ?? []).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
}));

// Import Produk
// Map untuk menyimpan folder -> path lengkap
// Juga menyimpan file langsung -> path untuk kategori datar
const folderToPathMap = new Map<string, { parent: string, actual: string }>();
const flatFilesMap = new Map<string, string>();

// Helper untuk normalisasi string (Case-insensitive, remove spaces/hyphens, normalize jacket/jaket)
const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '').replace('jacket', 'jaket').replace('warrior', 'warior');

Object.keys(allImagesGlob).forEach(key => {
  const parts = key.split('/');

  if (parts.length > 3) {
    const parent = parts[2];
    const folderOrFile = parts[3];

    // Jika parts.length > 4, berarti ini di dalam subfolder (Model Kemeja/Yoroi/...)
    if (parts.length > 4) {
      folderToPathMap.set(normalize(folderOrFile), { parent, actual: folderOrFile });
    } else {
      // Jika parts.length == 4, ini file langsung di kategori (Jacket/bomber.png)
      // Kita masukkan ke flatFilesMap untuk dicari jika folder tdk ditemukan
      flatFilesMap.set(normalize(folderOrFile), allImagesGlob[key] as string);
    }
  } else if (parts.length === 3) {
    // File di root ./assets/
    flatFilesMap.set(normalize(parts[2]), allImagesGlob[key] as string);
  }
});

// Catalog Images
export const COLOR_CATALOGS = {
  'Tropical (Best Seller)': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/tropical/')).map(k => resolveAsset(k)),
  'Nagata (Favorit)': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/nagata/')).map(k => resolveAsset(k)),
  'American Drill': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/american drill/')).map(k => resolveAsset(k)),
  'STF': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/stf/')).map(k => resolveAsset(k)),
  'Soft Denim': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/soft denim/')).map(k => resolveAsset(k)),
  'Oxford': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/oxford/')).map(k => resolveAsset(k)),
  'Polo': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/polo/')).map(k => resolveAsset(k)),
  'Baby Canvas': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/baby canvas/')).map(k => resolveAsset(k)),
  'Ripstop': Object.keys(allImagesGlob).filter(k => k.toLowerCase().includes('katalog warna/ripstop/')).map(k => resolveAsset(k)),
};

// Helper untuk mencari folder secara case-insensitive & robust matching di semua kategori
export const findFolderInfo = (folder: string, category?: string) => {
  const found = folderToPathMap.get(normalize(folder));
  if (found) return found;

  // Fallback 1: If not found as a subfolder, check if manyar-style direct category folder exists
  // We check all parent folders in the glob
  const allParentFolders = Array.from(new Set(Object.keys(allImagesGlob).map(k => k.split('/')[2])));

  if (category) {
    const catNorm = normalize(category);
    const matchedParent = allParentFolders.find(p =>
      normalize(p) === catNorm ||
      normalize(p) === normalize('Kaos ' + category) ||
      normalize(p) === normalize('Model ' + category)
    );
    if (matchedParent) {
      return { parent: matchedParent, actual: '' };
    }
  }

  // Fallback 2: Check if the folder name itself matches any parent folder
  const folderNorm = normalize(folder);
  const matchedParentByFolder = allParentFolders.find(p => normalize(p) === folderNorm);
  if (matchedParentByFolder) {
    return { parent: matchedParentByFolder, actual: '' };
  }

  return undefined;
};

const getModelAsset = (folder: string, fileName: string) => {
  const info = findFolderInfo(folder);
  if (!info) return '';

  const prefix = `./assets/${info.parent}/${info.actual}${info.actual ? '/' : ''}`;
  const folderFiles = Object.keys(allImagesGlob).filter(k => k.startsWith(prefix));

  if (folderFiles.length === 0) return '';

  const isBack = fileName.toLowerCase().includes('belakang') || fileName.toLowerCase().includes('back');

  // Collect candidates for the specific view
  const candidates = folderFiles.filter(k => {
    const low = k.toLowerCase();
    const indicatesBack = low.includes('belakang') || low.includes('back') || low.includes('blkg') || low.endsWith('2.png') || low.endsWith('2.jpg') || low.endsWith('2.jpeg');
    return isBack ? indicatesBack : !indicatesBack;
  });

  if (candidates.length === 0) return resolveAsset(folderFiles[0]);

  // Priority logic for "Depan" (Front)
  if (!isBack) {
    // 1. Explicit "depan" or "front"
    const explicit = candidates.find(k => k.toLowerCase().includes('depan') || k.toLowerCase().includes('front'));
    if (explicit) return resolveAsset(explicit);

    // 2. Numeric priority like "(brad v-3)1.png"
    const numeric = candidates.find(k => /\d+\.png/.test(k.toLowerCase()));
    if (numeric) return resolveAsset(numeric);

    // 3. Just the first one
    return resolveAsset(candidates[0]);
  }

  // Priority logic for "Belakang" (Back)
  const explicitBack = candidates.find(k => k.toLowerCase().includes('belakang') || k.toLowerCase().includes('back'));
  return resolveAsset(explicitBack || candidates[0]);
};

const getFrontImage = (folder: string) => getModelAsset(folder, 'depan');
const getBackImage = (folder: string) => getModelAsset(folder, 'belakang');

/**
 * Mendapatkan gambar model spesifik berdasarkan warna dan view
 * Digunakan di DesignEditorView untuk menampilkan versi berwarna jika tersedia di folder model
 */
const getModelColorImageInternal = (modelName: string, colorName: string, view: string, category?: string): string => {
  const info = findFolderInfo(modelName, category);
  if (!info) return '';

  const extensions = ['jpeg', 'jpg', 'png', 'webp'];
  const isBack = view.toLowerCase().includes('belakang') || view.toLowerCase().includes('back');
  const backIndicators = ['belakang', 'back', 'blkg', 'rear'];
  const suffix = isBack ? ' belakang' : '';
  const searchName = colorName.toLowerCase();

  const folderPath = `${info.parent}${info.actual ? '/' + info.actual : ''}`;

  for (const ext of extensions) {
    const key = `./assets/${folderPath}/${searchName}${suffix}.${ext}`;
    if (allImagesGlob[key]) return resolveAsset(key);
  }

  const prefix = `./assets/${folderPath}/`;
  const folderFiles = Object.keys(allImagesGlob).filter(k => k.startsWith(prefix));

  // Collect all candidates first
  const candidates: string[] = [];

  for (const key of folderFiles) {
    const rawFileName = key.split('/').pop()?.toLowerCase() || '';
    const nameWithoutExt = rawFileName.split('.')[0];
    const cleanFileName = nameWithoutExt.replace(/[\s_-]/g, '');
    const cleanSearch = searchName.replace(/[\s_-]/g, '');

    // Check if filename matches color name (fuzzy)
    if (cleanSearch.includes(cleanFileName) || cleanFileName.includes(cleanSearch)) {
      candidates.push(key);
    } else if (nameWithoutExt.includes(searchName)) {
      candidates.push(key);
    }
  }

  if (candidates.length === 0) return '';

  // Select the best candidate based on View
  if (isBack) {
    // Cari yang eksplisit ada kata 'belakang'/'back'
    const bestBack = candidates.find(k => k.toLowerCase().includes('belakang') || k.toLowerCase().includes('back') || k.toLowerCase().includes('rear'));
    if (bestBack) return resolveAsset(bestBack);
  } else {
    // VIEW DEPAN
    // 1. Cari yang eksplisit 'depan'/'front'
    const bestFront = candidates.find(k => k.toLowerCase().includes('depan') || k.toLowerCase().includes('front'));
    if (bestFront) return resolveAsset(bestFront);

    // 2. Cari yang TIDAK ada kata 'belakang' (default)
    const cleanCandidates = candidates.filter(k =>
      !k.toLowerCase().includes('belakang') &&
      !k.toLowerCase().includes('back') &&
      !k.toLowerCase().includes('blkg')
    );
    if (cleanCandidates.length > 0) return resolveAsset(cleanCandidates[0]);
  }

  // Last resort
  return '';
};

export const getModelColorImage = (modelName: string, colorName: string, view: string, category?: string): string => {
  // 1. Try to get from the specific model folder first
  const specific = getModelColorImageInternal(modelName, colorName, view, category);
  if (specific) return specific;

  // 2. If it's a Back view and not found, search globally in other folders for the same color & view
  if (view.toLowerCase().includes('belakang')) {
    const searchName = colorName.toLowerCase();
    const backIndicators = ['belakang', 'back', 'blkg', 'rear']; // Ensure backIndicators is defined here too

    // Search images globally, but prioritize same category
    for (const key of Object.keys(allImagesGlob)) {
      const pathParts = key.split('/');
      const fileName = pathParts.pop()?.toLowerCase() || '';
      const folderName = pathParts.pop()?.toLowerCase() || '';

      if (fileName.includes(searchName) && backIndicators.some(ind => fileName.includes(ind))) {
        if (fileName.includes('series') || fileName.includes('gallery')) continue;

        // If category is provided, try to match it in the path
        if (category) {
          const cat = category.toLowerCase();
          if (key.toLowerCase().includes(cat)) return resolveAsset(key);
          // Continue searching for a category match before settling for anything else
          continue;
        }
        return resolveAsset(key);
      }
    }
  }

  return '';
};

/**
 * Mendapatkan semua gambar lokal dalam folder model tertentu
 */
export const getLocalImagesInFolder = (folderName: string): string[] => {
  const info = findFolderInfo(folderName);
  if (!info) return [];

  const prefix = `./assets/${info.parent}/${info.actual}${info.actual ? '/' : ''}`;
  // Optimized: Only filter keys that we know are in this parent/folder
  return Object.keys(allImagesGlob)
    .filter(key => key.startsWith(prefix))
    .map(key => resolveAsset(key));
};

/**
 * Mendapatkan daftar semua model yang memiliki folder aset lokal
 */
export const getAvailableLocalModels = () => Array.from(folderToPathMap.keys());

/**
 * Mendapatkan warna spesifik yang tersedia di folder produk tersebut
 * Mengekstrak warna dari nama file (misal: "Vest-hitam.jpeg" -> "hitam")
 */
export const getItemSpecificColors = (productName: string, category: string) => {
  const info = findFolderInfo(productName, category);
  if (!info) return [];

  const folderPath = `${info.parent}${info.actual ? '/' + info.actual : ''}`;
  const prefix = `./assets/${folderPath}/`;
  const namePrefix = productName.split(' ')[0].toLowerCase() + '-';
  const colorMap = new Map<string, { name: string, image: string, backImage?: string }>();

  Object.keys(allImagesGlob).forEach(key => {
    if (key.startsWith(prefix)) {
      const fileName = key.split('/').pop()?.toLowerCase() || '';
      if (fileName.includes('series') || fileName.includes('gallery')) return;

      let colorPart = fileName;

      // Remove any content inside parentheses (e.g., "(brad v-1)biru muda.png" -> "biru muda.png")
      colorPart = colorPart.replace(/\(.*?\)/g, '').trim();
      // Remove "warna " prefix if exists (e.g., "warna army" -> "army")
      colorPart = colorPart.replace(/^warna\s+/i, '').trim();

      const normalizedName = normalize(productName);
      const nameParts = productName.toLowerCase().split(/\s+/);
      const possiblePrefixes = [
        namePrefix,
        normalizedName,
        normalizedName + '-',
        (info.actual ? info.actual.toLowerCase() + '-' : ''),
        (info.actual ? normalize(info.actual) + '-' : ''),
        ...nameParts.map(p => p + '-'),
        ...nameParts.map(p => p + ' '),
        'kaospolo-',
        'kaospolos-',
        'jaket-',
        'jacket-'
      ];

      for (const p of possiblePrefixes) {
        if (p && colorPart.startsWith(p)) {
          colorPart = colorPart.replace(p, '');
        }
      }

      // If still has leading non-alphabetic chars (like hyphens or spaces), clean them
      colorPart = colorPart.replace(/^[^a-z0-9]+/i, '');

      const isBack = colorPart.includes('belakang') || colorPart.includes('back') || colorPart.includes('blkg');
      const isFront = colorPart.includes('depan') || colorPart.includes('front') || colorPart.includes('dpn');

      // Clean color name from extension and view indicators
      let colorName = colorPart.split('.')[0];
      const viewWords = ['belakang', 'back', 'blkg', 'rear', 'depan', 'front', 'dpn'];
      viewWords.forEach(w => {
        colorName = colorName.replace(new RegExp(`\\b${w}\\b`, 'gi'), '');
        colorName = colorName.replace(new RegExp(`[-_]${w}\\b`, 'gi'), '');
        colorName = colorName.replace(new RegExp(`\\b${w}[-_]`, 'gi'), '');
      });
      colorName = colorName.replace(/[-_]/g, ' ').trim();

      if (!colorName || /^\d+$/.test(colorName)) return;

      const existing = colorMap.get(colorName) || { name: colorName, image: '' };

      if (isBack) {
        existing.backImage = resolveAsset(key);
      } else {
        // Only set as primary image if it's explicitly 'depan' or if we don't have one yet
        if (isFront || !existing.image) {
          existing.image = resolveAsset(key);
        }
      }

      colorMap.set(colorName, existing);
    }
  });

  return Array.from(colorMap.values()).filter(c => c.image);
};

// --- DYNAMIC COLOR LOADING (Robust format detection & Supabase Support) ---
const allWarnaGlob = import.meta.glob('./assets/warna/**/*.(jpeg|jpg|png|webp)', { eager: true, query: '?url', import: 'default' });

const getColorAsset = (name: string): string => {
  const extensions = ['jpeg', 'jpg', 'png', 'webp'];

  // 1. Try local glob with exact match in assets/warna (legacy)
  for (const ext of extensions) {
    const key = `./assets/warna/${name}.${ext}`;
    if (allImagesGlob[key]) return resolveAsset(key);
  }

  // 2. Robust Search: Look for the color name in ALL folders
  // Prioritize files that match the color name exactly or clearly indicate the color
  const searchName = name.toLowerCase();
  const allKeys = Object.keys(allImagesGlob);

  // High priority: Exact match or starting with color (e.g., "hitam.jpeg", "hitam-belakang.png")
  const candidates = allKeys.filter(k => {
    const fileName = k.split('/').pop()?.toLowerCase() || '';
    return fileName.startsWith(searchName) || fileName.includes(`-${searchName}`) || fileName.includes(` ${searchName}`);
  });

  if (candidates.length > 0) {
    const isBackSearch = searchName.includes('belakang') || searchName.includes('back');

    // If we are searching for a back view, prioritize files with 'belakang'
    if (isBackSearch) {
      const bestBack = candidates.find(k => k.toLowerCase().includes('belakang') || k.toLowerCase().includes('back'));
      if (bestBack) return resolveAsset(bestBack);
    } else {
      // If searching for front color, avoid files with 'belakang' or 'back'
      const bestFront = candidates.find(k => !k.toLowerCase().includes('belakang') && !k.toLowerCase().includes('back'));
      if (bestFront) return resolveAsset(bestFront);
    }

    // Generic fallback to first candidate if no specific view match
    return resolveAsset(candidates[0]);
  }

  // 3. Fallback to manual Supabase URL if NOT in glob
  if (USE_SUPABASE_STORAGE) {
    return `${SUPABASE_BASE_URL}/warna/${encodeURIComponent(name)}.jpeg`;
  }

  return '';
};

const BRAD_V3_FRONT = getFrontImage('Brad-V3') || getFrontImage('gatam');
const BRAD_V3_BACK = getBackImage('Brad-V3') || getBackImage('gatam');
const BRAD_V3_GAL = getLocalImagesInFolder('Brad-V3');

const BRAD_V1_FRONT = getFrontImage('Brad-v1');
const BRAD_V1_BACK = getBackImage('Brad-v1');
const BRAD_V1_GAL = getLocalImagesInFolder('Brad-v1');

const BRAD_V2_FRONT = getFrontImage('Brad-v2');
const BRAD_V2_BACK = getBackImage('Brad-v2');
const BRAD_V2_GAL = getLocalImagesInFolder('Brad-v2');


const PDH_FRONT = getFrontImage('Pdh');
const PDH_GAL = getLocalImagesInFolder('Pdh');

const PDH_BARU_FRONT = getFrontImage('Pdh-baru');
const PDH_BARU_GAL = getLocalImagesInFolder('Pdh-baru');

const BRAD_V4_FRONT = getFrontImage('Brad-V4');
const BRAD_V4_GAL = getLocalImagesInFolder('Brad-V4');

const ROBOTIC_FRONT = getFrontImage('robotik');
const ROBOTIC_GAL = getLocalImagesInFolder('robotik');

const STRAZAR_DISPLAY = getModelAsset('Strazard', 'display') || getModelAsset('Strazard', '1') || getLocalImagesInFolder('Strazard')[0];
const STRAZAR_FRONT = getModelAsset('Strazard', 'depan') || getModelAsset('Strazard', 'front') || STRAZAR_DISPLAY;
const STRAZAR_BACK = getModelAsset('Strazard', 'belakang') || getModelAsset('Strazard', 'back') || getModelAsset('Strazard', '2');
const STRAZAR_GAL = getLocalImagesInFolder('Strazard');

const VENTURA_FRONT = getFrontImage('Ventura');
const VENTURA_GAL = getLocalImagesInFolder('Ventura');

// --- ASSETS JAKET DARI FOLDER JAKET ---
const BOMBER_BRAD_FRONT = getFrontImage('jaket') || getFrontImage('Jacket') || resolveAsset('./assets/jaket/jaket-depan-hitam.jpeg');
const BOMBER_BRAD_BACK = getBackImage('jaket') || getBackImage('Jacket') || getColorAsset('hitam belakang');
const BOMBER_BRAD_GAL = getLocalImagesInFolder('jaket');

// --- ASSETS ROMPI DARI FOLDER ROMPI ---
const TACTICAL_VEST_FRONT = getFrontImage('Tactical Vest') || resolveAsset('./assets/Rompi/Tactical Vest/Vest-hitam.jpeg');
const TACTICAL_VEST_BACK = getBackImage('Tactical Vest') || TACTICAL_VEST_FRONT;
const TACTICAL_VEST_GAL = getLocalImagesInFolder('Tactical Vest');

const VEST_PARASUTE_FRONT = getFrontImage('Parasute') || resolveAsset('./assets/Rompi/Parasute/Vest-parasute-1.jpeg');
const VEST_PARASUTE_BACK = getBackImage('Parasute') || resolveAsset('./assets/Rompi/Parasute/Vest-parasute-2.jpeg');
const VEST_PARASUTE_GAL = getLocalImagesInFolder('Parasute');

// --- ASSETS POLO DARI FOLDER POLO SHIRT ---
const POLO_SHIRT_FRONT = getFrontImage('Polo shirt') || resolveAsset('./assets/Polo shirt/Kaospolo-hitam.png');
const POLO_SHIRT_BACK = getBackImage('Polo shirt') || POLO_SHIRT_FRONT;
const POLO_SHIRT_GAL = getLocalImagesInFolder('Polo shirt');

// --- ASSETS CELANA DARI FOLDER CELANA ---
const CARGO_TACTICAL_FRONT = getFrontImage('Warrior') || getFrontImage('Cargo Tactical') || getFrontImage('Pant');
const CARGO_TACTICAL_BACK = getBackImage('Warrior') || getBackImage('Cargo Tactical') || getBackImage('Pant');
const ARMOUR_FRONT = getFrontImage('Armour') || getFrontImage('Armor');
const ARMOUR_BACK = getBackImage('Armour') || getBackImage('Armor');
const BRADWEAR_V3_CELANA_FRONT = getFrontImage('Bradwear V3') || resolveAsset('./assets/Celana/Bradwear V3/bradwear v-3.jpeg');
const BRADWEAR_V3_CELANA_BACK = getBackImage('Bradwear V3') || resolveAsset('./assets/Celana/Bradwear V3/bradwear V-3 (1).jpeg');
const CARGO_TACTICAL_GAL = [1, 2, 3, 4, 5, 6].map(n => getModelAsset('Warrior', n.toString()) || getModelAsset('Cargo Tactical', n.toString())).filter(Boolean);

const MTAC_FRONT = resolveAsset('./assets/mtac_front.png');
const BOMBER_FRONT = resolveAsset('./assets/Jacket/bomber_front.png.webp');

const YOROI_FRONT = getFrontImage('Yoroi') || resolveAsset('./assets/Model Kemeja/Yoroi/hitam.jpeg');
const YOROI_BACK = getBackImage('Yoroi') || resolveAsset('./assets/Model Kemeja/Yoroi/hitam belakang.png');
const YOROI_GAL_1 = resolveAsset('./assets/Model Kemeja/Yoroi/biru muda.jpeg');
const YOROI_GAL_2 = resolveAsset('./assets/Model Kemeja/Yoroi/coklat.jpeg');

// Partner Logos lookups
const PARTNER_KEMENDAGRI = resolveAsset('./assets/Logo our partner/GKL14_Kemendagri (Kementerian Dalam Negeri) - koleksilogo.com (1).webp');
const PARTNER_TUTWURI = resolveAsset('./assets/Logo our partner/GKL15_Tut Wuri Handayani - koleksilogo.com.webp');
const PARTNER_HAM = resolveAsset('./assets/Logo our partner/GKL16_Kementerian Hak Asasi Manusia - koleksilogo.com.webp');
const PARTNER_DPR = resolveAsset('./assets/Logo our partner/GKL21_DPR RI (Dewan Perwakilan Daerah) - koleksilogo.com.webp');
const PARTNER_BMKG = resolveAsset('./assets/Logo our partner/GKL29_BMKG - Koleksilogo.com.webp');
const PARTNER_BAPPENAS = resolveAsset('./assets/Logo our partner/GKL29_Bappenas 2023 (Kementerian Perencanaan Pembangunan Nasional).webp');
const PARTNER_KPI = resolveAsset('./assets/Logo our partner/GKL74_Komisi Penyiaran Indonesia (KPI) - koleksilogo.com.webp');
const PARTNER_BUMN = resolveAsset('./assets/Logo our partner/Kementerian BUMN (Baru 2020) Logo (PNG-1080p) - Logopedia.webp');
const PARTNER_PUPR = resolveAsset('./assets/Logo our partner/Logo Kementerian PUPR (PNG-2160p) - Logopedia.webp');
const PARTNER_HUB = resolveAsset('./assets/Logo our partner/Logo Kementerian Perhubungan Indonesia (Kemenhub)  (PNG-2160p) - Logopedia.webp');
const PARTNER_PERINDUS = resolveAsset('./assets/Logo our partner/Logo Kementerian Perindustrian Indonesia (PNG-2160p) - Logopedia.webp');

// --- COLORS ARE NOW LOADED DYNAMICALLY BELOW ---

export const ASSETS = {
  // --- UI & BRANDING ---
  BRAND: {
    LOGO: LOGO_BRADWEAR,
    HERO: HERO_SLIDES[0] || HERO_BG,
    SLIDES: HERO_SLIDES.length > 0 ? HERO_SLIDES : [HERO_BG],
  },

  CONTENT: {
    MIDDLE_SLIDES: MIDDLE_CONTENT_SLIDES,
    SIZE_GUIDE,
    MATERIAL_GUIDE_IMAGES,
  },

  CLIENT_GALLERY: CLIENT_GALLERY_GROUPS,

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
  ],

  // --- KATEGORI KEMEJA ---
  KEMEJA: {
    BRAD_V3: {
      FRONT: BRAD_V3_FRONT,
      BACK: BRAD_V3_BACK,
      GALLERY: BRAD_V3_GAL
    },
    BRAD_V1: {
      FRONT: BRAD_V1_FRONT,
      BACK: BRAD_V1_BACK,
      GALLERY: BRAD_V1_GAL
    },
    BRAD_V2: {
      FRONT: BRAD_V2_FRONT,
      BACK: BRAD_V2_BACK,
      GALLERY: BRAD_V2_GAL
    },
    PDH: {
      FRONT: PDH_FRONT,
      BACK: getBackImage('Pdh'),
      GALLERY: PDH_GAL
    },
    PDH_BARU: {
      FRONT: PDH_BARU_FRONT,
      BACK: getBackImage('Pdh-baru'),
      GALLERY: PDH_BARU_GAL
    },
    BRAD_V4: {
      FRONT: BRAD_V4_FRONT,
      BACK: getBackImage('Brad-V4') || BRAD_V3_BACK,
      GALLERY: BRAD_V4_GAL
    },
    ROBOTIC: {
      FRONT: ROBOTIC_FRONT,
      BACK: getBackImage('robotik'),
      GALLERY: ROBOTIC_GAL
    },
    STRAZAR: {
      FRONT: STRAZAR_FRONT,
      DISPLAY: STRAZAR_DISPLAY,
      BACK: STRAZAR_BACK,
      GALLERY: STRAZAR_GAL
    },
    VENTURA: {
      FRONT: VENTURA_FRONT,
      BACK: getBackImage('Ventura'),
      GALLERY: VENTURA_GAL
    },
    YOROI: {
      FRONT: YOROI_FRONT,
      BACK: YOROI_BACK || getBackImage('Yoroi'),
      GALLERY: getLocalImagesInFolder('Yoroi')
    },
    EXECUTIVE: {
      FRONT: getFrontImage('Executive Series'),
      BACK: getBackImage('Executive Series'),
      GALLERY: getLocalImagesInFolder('Executive Series')
    },

    // Legacy / Fallback
    MTAC_FRONT,
  },

  // --- KATEGORI JAKET ---
  JAKET: {
    BOMBER: BOMBER_BRAD_FRONT || BOMBER_FRONT,
    BACK: BOMBER_BRAD_BACK,
    GALLERY: BOMBER_BRAD_GAL
  },

  // --- KATEGORI CELANA ---
  CELANA: {
    WARRIOR: CARGO_TACTICAL_FRONT,
    WARRIOR_BACK: CARGO_TACTICAL_BACK,
    ARMOUR: ARMOUR_FRONT,
    ARMOUR_BACK: ARMOUR_BACK,
    BRADWEAR_V1: getFrontImage('Bradwear v1'),
    BRADWEAR_V1_BACK: getBackImage('Bradwear v1'),
    BRADWEAR_V1_GALLERY: getLocalImagesInFolder('Bradwear v1'),
    BRADWEAR_V3: BRADWEAR_V3_CELANA_FRONT,
    BRADWEAR_V3_BACK: BRADWEAR_V3_CELANA_BACK || BRADWEAR_V3_CELANA_FRONT,
    BACK: CARGO_TACTICAL_BACK,
    GALLERY: CARGO_TACTICAL_GAL
  },

  // --- KATEGORI ROMPI ---
  ROMPI: {
    TACTICAL: TACTICAL_VEST_FRONT || 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=600',
    BACK: TACTICAL_VEST_BACK,
    GALLERY: TACTICAL_VEST_GAL,
    PARASUTE: VEST_PARASUTE_FRONT,
    PARASUTE_BACK: VEST_PARASUTE_BACK,
    PARASUTE_GALLERY: VEST_PARASUTE_GAL
  },

  // --- KATEGORI POLO ---
  POLO: {
    BASIC: POLO_SHIRT_FRONT,
    BACK: POLO_SHIRT_BACK,
    GALLERY: POLO_SHIRT_GAL
  },

  // --- UI ASSETS (Avatars, etc) ---
  AVATARS: {
    DAFFA: 'https://i.pravatar.cc/150?u=daffa',
    SISKA: 'https://i.pravatar.cc/150?u=siska',
  },

  // --- WARNA ---
  // Kita jadikan getter agar mencari di folder model favorit (Brad-V3) sebagai icon
  COLORS: {
    BIRU_MUDA: getModelColorImage('Brad-V3', 'biru muda', 'depan') || getColorAsset('biru muda'),
    COKLAT_TUA: getModelColorImage('Brad-V3', 'coklat tua', 'depan') || getColorAsset('coklat tua'),
    COKLAT: getModelColorImage('Brad-V3', 'coklat', 'depan') || getColorAsset('coklat'),
    DENIM: getModelColorImage('Brad-V3', 'denim', 'depan') || getColorAsset('denim'),
    HIJAU_ARMY: getModelColorImage('Brad-V3', 'hijau army', 'depan') || getColorAsset('hijau army'),
    HIJAU_BUNGLON: getModelColorImage('Brad-V3', 'hijau bunglon', 'depan') || getColorAsset('hijau bunglon'),
    HIJAU: getModelColorImage('Brad-V3', 'hijau', 'depan') || getColorAsset('hijau'),
    HITAM: getModelColorImage('Brad-V3', 'hitam', 'depan') || getColorAsset('hitam'),
    KHAKI: getModelColorImage('Brad-V3', 'khaki', 'depan') || getColorAsset('khaki'),
    KUNING: getModelColorImage('Brad-V3', 'kuning', 'depan') || getColorAsset('kuning'),
    MAROON: getModelColorImage('Brad-V3', 'maroon', 'depan') || getColorAsset('maroon'),
    MERAH_CABE: getModelColorImage('Brad-V3', 'merah cabe', 'depan') || getColorAsset('merah cabe'),
    MOCHA: getModelColorImage('Brad-V3', 'mocha', 'depan') || getColorAsset('mocha'),
    NAVI: getModelColorImage('Brad-V3', 'navi', 'depan') || getColorAsset('navi'),
    OREN: getModelColorImage('Brad-V3', 'oren', 'depan') || getColorAsset('oren'),
    PUTIH: getModelColorImage('Brad-V3', 'putih', 'depan') || getColorAsset('putih'),
    SAGE: getModelColorImage('Brad-V3', 'sage', 'depan') || getColorAsset('sage'),
    UNGU_MUDA: getModelColorImage('Brad-V3', 'ungu muda', 'depan') || getColorAsset('ungu muda'),
    UNGU_TUA: getModelColorImage('Brad-V3', 'ungu tua', 'depan') || getColorAsset('ungu tua'),
  },

  // --- WARNA BELAKANG ---
  COLORS_BACK: {
    BIRU_MUDA: getModelColorImage('Brad-V3', 'biru muda', 'belakang') || getColorAsset('biru muda belakang'),
    COKLAT_TUA: getModelColorImage('Brad-V3', 'coklat tua', 'belakang') || getColorAsset('coklat tua belakang'),
    COKLAT: getModelColorImage('Brad-V3', 'coklat', 'belakang') || getColorAsset('coklat belakang'),
    DENIM: getModelColorImage('Brad-V3', 'denim', 'belakang') || getColorAsset('denim belakang'),
    HIJAU_ARMY: getModelColorImage('Brad-V3', 'hijau army', 'belakang') || getColorAsset('hijau army belakang'),
    HIJAU_BUNGLON: getModelColorImage('Brad-V3', 'hijau bunglon', 'belakang') || getColorAsset('hijau bunglon belakang'),
    HIJAU: getModelColorImage('Brad-V3', 'hijau', 'belakang') || getColorAsset('hijau belakang'),
    HITAM: getModelColorImage('Brad-V3', 'hitam', 'belakang') || getColorAsset('hitam belakang'),
    KHAKI: getModelColorImage('Brad-V3', 'khaki', 'belakang') || getColorAsset('khaki belakang'),
    KUNING: getModelColorImage('Brad-V3', 'kuning', 'belakang') || getColorAsset('kuning belakang'),
    MAROON: getModelColorImage('Brad-V3', 'maroon', 'belakang') || getColorAsset('maroon belakang'),
    MERAH_CABE: getModelColorImage('Brad-V3', 'merah cabe', 'belakang') || getColorAsset('merah cabe belakang'),
    MOCHA: getModelColorImage('Brad-V3', 'mocha', 'belakang') || getColorAsset('mocha belakang'),
    NAVI: getModelColorImage('Brad-V3', 'navi', 'belakang') || getColorAsset('navi belakang'),
    OREN: getModelColorImage('Brad-V3', 'oren', 'belakang') || getColorAsset('oren belakang'),
    PUTIH: getModelColorImage('Brad-V3', 'putih', 'belakang') || getColorAsset('putih belakang'),
    SAGE: getModelColorImage('Brad-V3', 'sage', 'belakang') || getColorAsset('sage belakang'),
    UNGU_MUDA: getModelColorImage('Brad-V3', 'ungu muda', 'belakang') || getColorAsset('ungu muda belakang'),
    UNGU_TUA: getModelColorImage('Brad-V3', 'ungu tua', 'belakang') || getColorAsset('ungu tua belakang'),
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

/**
 * Preload critical assets to improve speed
 */
export const preloadCriticalAssets = () => {
  const critical = [
    LOGO_BRADWEAR,
    HERO_BG,
    SIZE_GUIDE,
    // Add first few products or frequent images
    ...Object.values(ASSETS.KEMEJA.BRAD_V3).flatMap(v => Array.isArray(v) ? v : [v as string]),
    ...COLOR_CATALOGS['Tropical (Best Seller)'].slice(0, 5),
    ...MIDDLE_CONTENT_SLIDES.slice(0, 2),
  ];

  critical.forEach(url => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
};
