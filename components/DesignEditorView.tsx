import React, { useState, useRef, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Product, DesignData, DesignElement, RouteKey } from '../types';
import { MATERIALS, COLORS, MATERIAL_SPECS, PRODUCTS, POLO_MATERIALS, POLO_MATERIAL_SPECS } from '../constants';
import { removeBackground } from '../utils/imageProcessor';
import { uploadImageToSupabase } from '../utils/supabaseService';
import { getModelColorImage, getItemSpecificColors, COLOR_CATALOGS, ASSETS } from '../assets';
import { analyzeImageWithGemini } from '../utils/geminiService';
import { useStore } from '../context/StoreContext';
import { openCustomerServiceDialog } from '../lib/customerServiceDialog';

const STEP_GUIDE_CONTENT = {
  1: {
    heading: 'Pilih bahan dan warna utama',
    body: 'Tentukan jenis kain dan referensi warna yang paling mendekati kebutuhan seragam Anda, ini hanya simulasi untuk memudahkan anda dalam visual produk jadi nantinya.',
    next: 'Setelah itu, lanjutkan ke pengaturan identitas seperti logo, nama, dan detail penempatan.',
  },
  2: {
    heading: 'Atur identitas seragam',
    body: 'Sesuaikan logo, nama, jabatan, atau elemen identitas lain, upload dan atur posisi.',
    next: 'Berikutnya, lengkapi data pesanan per item sebelum masuk ke ringkasan akhir.',
  },
  3: {
    heading: 'Lengkapi data item pesanan',
    body: 'Tambahkan ukuran, gender, lengan, jumlah, dan kode warna untuk setiap item.',
    next: 'Jika semua item sudah sesuai, lanjutkan ke ringkasan untuk meninjau data sebelum dikirim.',
  },
} as const;

const DesignEditorView: React.FC = () => {
  const { 
    selectedProduct: product, 
    designData, 
    updateDesignData: onUpdate, 
    handleGoBack: onBack, 
    handleSelectProduct: onSelectProduct, 
    theme,
    setOrderItems,
    setCurrentRoute
  } = useStore();

  if (!product) return null;


  // Helper Haptic
  const triggerHaptic = async (_style?: unknown) => {
    try {
      if (window.navigator?.vibrate) window.navigator.vibrate(10);
    } catch (e) {
      // Fallback silent
    }
  };

  const handleBackCustom = () => {
    if (editorStep === 'finish') {
      if (['Celana', 'Rompi', 'Polo', 'Jaket'].includes(product.category)) {
        // Menghapus semua elemen (teks/logo) saat kembali ke menu utama
        onUpdate({ elements: [] });
        // Reset history
        setHistory([[]]);
        setHistoryPointer(0);
        onBack();
        return;
      }
      if (product.category === 'Polo') {
        setEditorStep('materials');
      } else {
        setEditorStep('details');
      }
      return;
    }
    if (editorStep === 'details') {
      setEditorStep('materials');
      return;
    }

    // Menghapus semua elemen (teks/logo) saat kembali ke menu utama
    onUpdate({ elements: [] });
    // Reset history
    setHistory([[]]);
    setHistoryPointer(0);
    onBack();
  };

  /* --- LOGIKA TAMBAHAN: Reset saat Refresh/Mount --- */
  useEffect(() => {
    // Memastikan saat komponen dimuat (refresh), desain bersih/reset
    onUpdate({ elements: [] });
    setHistory([[]]); // Reset history lokal
    setHistoryPointer(0);
  }, []); // [] artinya hanya jalan sekali saat mount

  const [editorStep, setEditorStep] = useState<'materials' | 'details' | 'finish'>(
    (['Celana', 'Rompi', 'Polo', 'Jaket'].includes(product.category)) ? 'finish' : 'materials'
  );

  // --- STATE LIST PESANAN (CART SYSTEM) ---
interface OrderItem {
    id: string;
    model: Product;
    color: string;
    colorCode: string;
    name: string;
    size: string;
    gender: 'Pria' | 'Wanita';
    sleeve: 'Panjang' | 'Pendek';
    qty: number;
    customDetail?: string; // Menyimpan detail ukuran custom
    colorCodeImage?: string; // Menyimpan gambar hasil scan
    catalogMaterial?: string; // Menyimpan jenis kain dari katalog
  }

  interface DraftOrderItem {
    name: string;
    colorCode: string;
    size: string;
    gender: 'Pria' | 'Wanita';
    sleeve: 'Panjang' | 'Pendek';
    qty: number;
    colorCodeImage?: string;
  }

  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // State untuk Form "Tambah Item"
  const [activeFormModel, setActiveFormModel] = useState<Product>(product);
  const [activeFormColor, setActiveFormColor] = useState<string>(designData.color);

  const [newItem, setNewItem] = useState<DraftOrderItem>({
    name: '',
    colorCode: '',
    size: 'L',
    gender: 'Pria' as 'Pria' | 'Wanita',
    sleeve: 'Panjang' as 'Panjang' | 'Pendek',
    qty: 1,
    colorCodeImage: undefined,
  });

  const [activeCatalogType, setActiveCatalogType] = useState<string | null>('Tropical (Best Seller)');
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeCatalogImage, setActiveCatalogImage] = useState<string | null>(null);
  const [catalogPan, setCatalogPan] = useState({ x: 0, y: 0 });
  const [isPanningCatalog, setIsPanningCatalog] = useState(false);
  const [lastCatalogMouse, setLastCatalogMouse] = useState({ x: 0, y: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [showValidationNotify, setShowValidationNotify] = useState<string | null>(null);
  const [scanningFragments, setScanningFragments] = useState<string>('');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [colorCodeError, setColorCodeError] = useState<string | null>(null);

  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  // Simpan detail custom sementara sebelum dimasukkan ke cart
  const [customMeasures, setCustomMeasures] = useState({
    tinggi: '', lebarDada: '', lebarBahu: '', panjangLengan: '', kerah: '', manset: '',
    pinggang: '', pinggul: '', paha: '', bawah: '' // Tambahan untuk Celana
  });

  // State Ekspor WhatsApp
  const [showExtraSizes, setShowExtraSizes] = useState(false);
  const [showOrdererForm, setShowOrdererForm] = useState(false);
  const [ordererInfo, setOrdererInfo] = useState({
    name: '',
    agency: '',
    location: ''
  });

  const [showStepNotify, setShowStepNotify] = useState<{ step: number; msg: string } | null>(null);

  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const roiRef = useRef<HTMLDivElement>(null);
  const colorCodeRef = useRef<HTMLDivElement>(null);
  const zoomedCatalogImageRef = useRef<HTMLImageElement>(null);


  // Efek untuk sinkronisasi model & warna dari desain ke form isian pesanan
  useEffect(() => {
    if (editorStep === 'finish') {
      setActiveFormModel(product);
      setActiveFormColor(designData.color);
      onUpdate({ color: designData.color });
      triggerHaptic('medium');
    }
  }, [editorStep, product, designData.color]);

  // Tambahkan item ke cart
  const handleAddToCart = (silent = false) => {
    triggerHaptic('heavy');
    // Validasi: Wanya kode warna yang wajib diisi untuk menghindari kesalahan produksi
    if (!newItem.colorCode.trim()) {
      setColorCodeError("Mohon isi kode warna atau scan katalog agar tidak ada kesalahan produksi");
      colorCodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setColorCodeError(null);

    let customDetailStr = '';
    if (newItem.size === 'Custom') {
      if (product.category === 'Celana') {
        customDetailStr = `(T:${customMeasures.tinggi}, LPng:${customMeasures.pinggang}, LPngl:${customMeasures.pinggul}, LPh:${customMeasures.paha}, LBw:${customMeasures.bawah})`;
      } else {
        customDetailStr = `(T:${customMeasures.tinggi}, LD:${customMeasures.lebarDada}, LB:${customMeasures.lebarBahu}, PL:${customMeasures.panjangLengan})`;
      }
    }

    const item: OrderItem = {
      id: `item_${Date.now()}`,
      model: activeFormModel,
      color: activeFormColor,
      colorCode: newItem.colorCode || '-',
      name: newItem.name || '-',
      size: newItem.size,
      gender: newItem.gender,
      sleeve: newItem.sleeve,
      qty: newItem.qty,
      customDetail: customDetailStr,
      colorCodeImage: newItem.colorCodeImage,
      catalogMaterial: activeCatalogType || 'Unspecified'
    };

    setCartItems([...cartItems, item]);

    // Reset form: Clear fields EXCEPT color code, so it applies to next item
    setNewItem({
      ...newItem,
      name: '',
      qty: 1,
      colorCodeImage: newItem.colorCodeImage,
    });

    // Show success feedback
    const audioSuccess = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
    audioSuccess.volume = 0.5;
    audioSuccess.play().catch(() => { });

    if (!silent) {
      // Optional: non-blocking toast instead of alert if desired, for now we keep behavior simple
      // alert("✅ Item berhasil ditambahkan!"); 
    }
  };

  const handleNextStep = () => {
    if (editorStep === 'materials') {
      if (product.category === 'Polo') {
        setEditorStep('finish');
        setShowStepNotify({ step: 3, msg: 'Lengkapi item pesanan dan kode warna agar data siap diringkas.' });
      } else {
        setEditorStep('details');
        setShowStepNotify({ step: 2, msg: 'Sesuaikan logo, nama, dan detail identitas sebagai acuan desain final.' });
      }
    } else if (editorStep === 'details') {
      setEditorStep('finish');
      setShowStepNotify({ step: 3, msg: 'Tambahkan item pesanan, ukuran, dan kode warna sebelum lanjut ke ringkasan.' });
    }
  };

  // Hapus item dari cart
  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  const normalizeColorCode = (value: string) =>
    value
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/[|]/g, 'I')
      .trim();

  const captureCatalogScanBox = async () => {
    const imageEl = zoomedCatalogImageRef.current;
    const roiEl = roiRef.current;

    if (!imageEl || !roiEl) {
      throw new Error('Area scan belum siap.');
    }

    if (!imageEl.complete || !imageEl.naturalWidth || !imageEl.naturalHeight) {
      throw new Error('Gambar katalog belum siap dipindai.');
    }

    const imageRect = imageEl.getBoundingClientRect();
    const roiRect = roiEl.getBoundingClientRect();

    const overlapLeft = Math.max(roiRect.left, imageRect.left);
    const overlapTop = Math.max(roiRect.top, imageRect.top);
    const overlapRight = Math.min(roiRect.right, imageRect.right);
    const overlapBottom = Math.min(roiRect.bottom, imageRect.bottom);

    if (overlapRight <= overlapLeft || overlapBottom <= overlapTop) {
      throw new Error('Posisikan box scan tepat di atas kode warna katalog.');
    }

    const sourceX = ((overlapLeft - imageRect.left) / imageRect.width) * imageEl.naturalWidth;
    const sourceY = ((overlapTop - imageRect.top) / imageRect.height) * imageEl.naturalHeight;
    const sourceWidth = ((overlapRight - overlapLeft) / imageRect.width) * imageEl.naturalWidth;
    const sourceHeight = ((overlapBottom - overlapTop) / imageRect.height) * imageEl.naturalHeight;

    const canvas = document.createElement('canvas');
    const outputScale = Math.max(1.4, Math.min(2.2, 1200 / Math.max(sourceWidth, 1)));
    canvas.width = Math.max(1, Math.round(sourceWidth * outputScale));
    canvas.height = Math.max(1, Math.round(sourceHeight * outputScale));

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas scan warna tidak tersedia.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      imageEl,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return canvas.toDataURL('image/jpeg', 0.96);
  };

  // --- KONFIGURASI POSISI DEFAULT ELEMEN (EDIT DISINI) ---

  // Panduan Koordinat:
  // X (Horizontal): 0 = Paling Kiri, 50 = Tengah, 100 = Paling Kanan
  // Y (Vertikal):   0 = Paling Atas, 100 = Paling Bawah
  const DEFAULT_POS = {
    // Posisi Teks Nama (Dada Kanan)
    NAMA_TEKS: { x: 36, y: 22 },

    // Posisi Teks Jabatan (Dada Kiri)
    JABATAN_TEKS: { x: 64, y: 22 },

    // Posisi Logo diatas Nama (Dada Kanan)
    LOGO_NAMA: { x: 36, y: 14 },

    // Posisi Logo diatas Jabatan (Dada Kiri)
    LOGO_JABATAN: { x: 64, y: 14 },

    // Posisi Logo Lengan Kanan
    LENGAN_KANAN: { x: 20, y: 30 },

    // Posisi Logo Lengan Kiri
    LENGAN_KIRI: { x: 72, y: 50 },

    // Posisi Desain Punggung / Belakang
    BELAKANG: { x: 50, y: 35 },
  };
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [initialDist, setInitialDist] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState<number>(1);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [history, setHistory] = useState<DesignElement[][]>([designData.elements || []]);
  const [historyPointer, setHistoryPointer] = useState(0);

  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);
  const [viewingModel, setViewingModel] = useState<Product | null>(null);

  const fileInputRefNama = useRef<HTMLInputElement>(null);
  const fileInputRefJabatan = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const fileInputRefLenganKanan = useRef<HTMLInputElement>(null);
  const fileInputRefLenganKiri = useRef<HTMLInputElement>(null);
  const fileInputRefBelakang = useRef<HTMLInputElement>(null);


  const canvasRef = useRef<HTMLDivElement>(null);

  // --- TOUCH HANDLING FOR CATALOG ---
  const [catalogScale, setCatalogScale] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  // --- ESCAPE KEY BACK/FALLBACK ---
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      // 1. Priority: Close Zoom/Catalog Image
      if (isZoomed) {
        setIsZoomed(false);
        setIsPanningCatalog(false);
        setCatalogScale(1);
        setCatalogPan({ x: 0, y: 0 });
        return;
      }

      // 2. Priority: Close Modals
      if (showCatalogModal) {
        setShowCatalogModal(false);
        return;
      }
      if (showCustomSizeModal) {
        setShowCustomSizeModal(false);
        return;
      }
      if (expandedMaterial) {
        setExpandedMaterial(null);
        return;
      }

      // 3. Priority: Editor Steps
      if (editorStep === 'finish') {
        setEditorStep(product.category === 'Polo' ? 'materials' : 'details');
      } else if (editorStep === 'details') {
        setEditorStep('materials');
      } else {
        // 4. Priority: Exit Editor to Home
        onBack();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isZoomed, showCatalogModal, showCustomSizeModal, expandedMaterial, editorStep, product.category, onBack]);

  const elements = useMemo(() => designData.elements || [], [designData.elements]);
  const similarProducts = useMemo(() => PRODUCTS.filter(p => p.category === product.category && p.id !== product.id), [product]);

  /* Scroll Active Model into View */
  useEffect(() => {
    const activeBtn = document.getElementById(`model-${product.id}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [product.id, product.category]);

  const specificColors = useMemo(() => {
    const modelToUse = (editorStep === 'finish') ? activeFormModel : product;
    return getItemSpecificColors(modelToUse.name, modelToUse.category);
  }, [product, activeFormModel, editorStep]);

  const availableViews = useMemo(() => {
    return ['Depan', 'Belakang'];
  }, []);

  /* Auto-select first specific color and check view availability */
  useEffect(() => {
    // 1. Check if current view is still available
    if (!availableViews.includes(designData.view)) {
      onUpdate({ view: 'Depan' });
    }

    // 2. Auto-select color for Shirts
    if (product.category === 'Kemeja' && specificColors.length > 0) {
      // If current color is not in specific colors, pick the first one
      const isCurrentInSpecific = specificColors.some(sc => {
        const matchingGlobal = COLORS.find(gc => gc.name.toLowerCase() === sc.name.toLowerCase());
        return matchingGlobal ? designData.color === matchingGlobal.hex : designData.color === sc.name;
      });

      if (!isCurrentInSpecific) {
        const firstColor = specificColors[0];
        const matchingGlobal = COLORS.find(gc => gc.name.toLowerCase() === firstColor.name.toLowerCase());
        const colorVal = matchingGlobal?.hex || firstColor.name;
        setActiveFormColor(colorVal);
        onUpdate({ color: colorVal, view: 'Depan' });
      }
    }
  }, [product.id, specificColors, availableViews, designData.view]);

  const activeMaterials = useMemo(() => product.category === 'Polo' ? POLO_MATERIALS : MATERIALS, [product.category]);
  const activeMaterialSpecs = useMemo(() => product.category === 'Polo' ? POLO_MATERIAL_SPECS : MATERIAL_SPECS, [product.category]);

  const pushToHistory = (newElements: DesignElement[]) => {
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push(JSON.parse(JSON.stringify(newElements)));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  };

  const undo = () => {
    if (historyPointer > 0) {
      const prev = history[historyPointer - 1];
      setHistoryPointer(historyPointer - 1);
      onUpdate({ elements: JSON.parse(JSON.stringify(prev)) });
      setActiveElementId(null);
    }
  };

  const redo = () => {
    if (historyPointer < history.length - 1) {
      const next = history[historyPointer + 1];
      setHistoryPointer(historyPointer + 1);
      onUpdate({ elements: JSON.parse(JSON.stringify(next)) });
      setActiveElementId(null);
    }
  };

  const addElement = (type: 'text' | 'image', content: string, overrides: Partial<DesignElement> = {}) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newElement: DesignElement = {
      id: newId,
      type,
      content,
      pos: { x: 50, y: 50 },
      scale: 1,
      view: designData.view,
      ...overrides
    };
    const newElements = [...elements, newElement];
    onUpdate({ elements: newElements });
    pushToHistory(newElements);
    setActiveElementId(newId);
    return newId;
  };

  const updateElement = (id: string, updates: Partial<DesignElement>, skipHistory = false) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    onUpdate({ elements: newElements });
    if (!skipHistory) {
      pushToHistory(newElements);
    }
  };

  const removeElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    onUpdate({ elements: newElements });
    pushToHistory(newElements);
    setActiveElementId(null);
  };

  useEffect(() => {
    if (editorStep === 'materials') {
      setShowStepNotify({ step: 1, msg: 'Pilih bahan dan warna simulasi sebagai referensi awal desain.' });
    } else if (editorStep === 'details') {
      setShowStepNotify({ step: 2, msg: 'Sesuaikan identitas desain agar tampilan seragam sesuai kebutuhan tim Anda.' });
    } else {
      setShowStepNotify({ step: 3, msg: 'Lengkapi item pesanan dan kode warna sebelum masuk ke ringkasan akhir.' });
    }
  }, []);

  /* --- LOGIKA UPLOAD LOGO (SUPPORT MULTIPLE FILES) --- */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetView?: 'Depan' | 'Belakang' | 'Kanan' | 'Kiri', targetPos?: { x: number, y: number }) => {
    const input = e.target; // Simpan referensi input
    const files = input.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    // Copy elements to avoid mutation issues during async process
    let currentElements = JSON.parse(JSON.stringify(elements));
    let hasChanges = false;

    try {
      // Proses setiap file secara berurutan
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const originalSrc = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          let finalSrc = originalSrc;

          // RESIZE LOGIC (PREVENT MEMORY CRASH)
          const resizedSrc = await new Promise<string>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const MAX = 800; // Limit 800px
              let w = img.width; let h = img.height;
              if (w > MAX || h > MAX) {
                if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
                else { w = Math.round((w * MAX) / h); h = MAX; }
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                const ctx = c.getContext('2d');
                if (ctx) { ctx.drawImage(img, 0, 0, w, h); resolve(c.toDataURL()); return; }
              }
              resolve(originalSrc);
            };
            img.onerror = () => resolve(originalSrc);
            img.src = originalSrc;
          });

          finalSrc = resizedSrc;
          // Coba hapus background
          try {
            await new Promise(r => setTimeout(r, 50));
            const noBgSrc = await removeBackground(resizedSrc);
            if (noBgSrc && noBgSrc.length > 100) finalSrc = noBgSrc;
          } catch (bgError) {
            console.warn("Background removal failed", bgError);
          }

          // UPLOAD KE SUPABASE
          const supabasePath = `user_uploads/${Date.now()}_${i}.png`;
          const uploadedUrl = await uploadImageToSupabase(finalSrc, supabasePath);

          if (uploadedUrl) {
            finalSrc = uploadedUrl;
          } else {
            console.warn("Supabase upload failed, falling back to base64");
            // Biarkan finalSrc sebagai base64 jika gagal upload
          }

          // Generate ID unik
          const newId = `img_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`;

          const overrides: Partial<DesignElement> = {};
          if (targetView) overrides.view = targetView;
          if (targetPos) {
            // Geser posisi agar tidak menumpuk (semakin banyak semakin ke kanan-bawah)
            overrides.pos = {
              x: targetPos.x + (i * 3),
              y: targetPos.y + (i * 3)
            };
          }

          const newElement: DesignElement = {
            id: newId,
            type: 'image',
            content: finalSrc,
            pos: { x: 50, y: 50 }, // Default
            scale: 1,
            view: designData.view,
            ...overrides
          };

          currentElements.push(newElement);
          hasChanges = true;

        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
          // Continue to next file
        }
      }

      if (hasChanges) {
        onUpdate({ elements: currentElements });
        pushToHistory(currentElements);
      }
    } catch (criticalErr) {
      console.error("Critical upload error:", criticalErr);
      alert("Terjadi kesalahan saat memproses upload.");
    } finally {
      // Reset input value
      if (input) input.value = '';
      setIsProcessing(false);
    }
  };

  const handleTextChange = (idPrefix: string, text: string) => {
    const existing = elements.find(el => el.id.startsWith(idPrefix));
    if (text.trim() === '') {
      if (existing) removeElement(existing.id);
      return;
    }

    if (existing) {
      updateElement(existing.id, { content: text });
    } else {
      // Buat elemen baru jika belum ada
      const isRightChest = idPrefix.includes('dada_kanan'); // Dada Kanan = Nama
      const pos = isRightChest ? DEFAULT_POS.NAMA_TEKS : DEFAULT_POS.JABATAN_TEKS;

      const newId = `${idPrefix}_${Date.now()}`; // Gunakan timestamp agar unik tapi awalan konsisten
      const newElement: DesignElement = {
        id: newId,
        type: 'text',
        content: text,
        pos: { ...pos },
        scale: 0.8,
        view: 'Depan'
      };

      const newElements = [...elements, newElement];
      onUpdate({ elements: newElements });
      pushToHistory(newElements);
    }
  };

  const getElementContent = (idPrefix: string) => {
    return elements.find(el => el.id.startsWith(idPrefix))?.content || '';
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    if (isPanning && canvasZoom > 1) {
      const dx = clientX - lastTouchPos.x;
      const dy = clientY - lastTouchPos.y;
      setPanPos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastTouchPos({ x: clientX, y: clientY });
      return;
    }

    if (!draggingId || draggingId !== activeElementId) return;

    if ('touches' in e && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (initialDist === null) {
        setInitialDist(dist);
        const el = elements.find(el => el.id === draggingId);
        setInitialScale(el?.scale || 1);
      } else {
        const factor = dist / initialDist;
        const newScale = Math.min(Math.max(0.2, initialScale * factor), 4);
        updateElement(draggingId, { scale: newScale }, true);
      }
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((clientX - rect.left) / rect.width) * 100), 100);
    const y = Math.min(Math.max(0, ((clientY - rect.top) / rect.height) * 100), 100);

    updateElement(draggingId, { pos: { x, y } }, true);
  };

  const stopDragging = () => {
    if (draggingId) pushToHistory(elements);
    setDraggingId(null);
    setInitialDist(null);
    setIsPanning(false);
  };

  useEffect(() => {
    if (draggingId || isPanning) {
      window.addEventListener('mousemove', handleDrag as any);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleDrag as any, { passive: false });
      window.addEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag as any);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleDrag as any);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [draggingId, isPanning, canvasZoom, lastTouchPos, elements]);

  const selectedColorObj = COLORS.find(c => c.hex === designData.color);

  // 0. PRE-CALCULATE SPECIFIC IMAGE FROM FOLDER
  const modelSpecificColorImg = useMemo(() => {
    const colorName = selectedColorObj?.name || (designData.color.startsWith('#') ? '' : designData.color);
    if (!colorName) return '';
    return getModelColorImage(product.name, colorName, designData.view, product.category);
  }, [product.name, product.category, designData.color, designData.view, selectedColorObj]);

  const isSpecificColorImage = !!modelSpecificColorImg ||
    (designData.view === 'Depan' && !!selectedColorObj?.image) ||
    (designData.view === 'Belakang' && !!selectedColorObj?.backImage);

  /* --- LOGIKA PEMANGGILAN GAMBAR UTAMA --- */
  // Menentukan gambar produk yang ditampilkan berdasarkan View (Depan/Belakang) dan Warna yang dipilih
  const currentDisplayImage = useMemo(() => {
    // 0. PRIORITAS: Cek apakah ada gambar model-spesifik untuk warna ini (misal di folder Yoroi atau Rompi)
    if (modelSpecificColorImg) return modelSpecificColorImg;

    const colorName = selectedColorObj?.name || (designData.color.startsWith('#') ? '' : designData.color);
    if (colorName) {
      // 0. PRIORITAS 2: Cek specificColors yang sudah ter-scan di folder (redundancy check)
      const foundSpecific = specificColors.find(sc => sc.name.toLowerCase() === colorName.toLowerCase());
      if (foundSpecific) {
        if (designData.view === 'Belakang') {
          if (foundSpecific.backImage) return foundSpecific.backImage;
        } else {
          return foundSpecific.image;
        }
      }
    }

    // 1. Cek apakah ada gambar khusus untuk warna tertentu (global fallback)
    // HANYA untuk Kemeja/Kids karena asset warna global mayoritas berbentuk Kemeja
    // Polo removed from here to prevent using Kemeja assets for Polo
    const isKemejaLike = ['Kemeja'].includes(product.category);
    if (isKemejaLike && isSpecificColorImage && selectedColorObj) {
      if (designData.view === 'Depan' && selectedColorObj.image) return selectedColorObj.image;
      if (designData.view === 'Belakang' && selectedColorObj.backImage) return selectedColorObj.backImage;
    }

    // 2. Jika tidak ada gambar khusus warna, gunakan gambar default produk per sisi
    if (!product.images) return product.image;
    switch (designData.view) {
      case 'Depan': return product.images.front; // Foto Tampak Depan
      case 'Belakang':
        if (product.images.back && !product.images.back.includes('unsplash') && !product.images.back.includes('bradwearindonesia.com')) {
          return product.images.back;
        }
        // Fallback: Gunakan asset warna belakang jika tersedia
        if (selectedColorObj) {
          const colorKey = selectedColorObj.name.toUpperCase().replace(/\s+/g, '_');
          const fallbackBack = (ASSETS.COLORS_BACK as any)[colorKey];
          if (fallbackBack) return fallbackBack;
        }
        return product.images.back || product.image; // Foto Tampak Belakang
      case 'Kanan': return product.images.rightSleeve || product.image; // Foto Lengan Kanan
      case 'Kiri': return product.images.leftSleeve || product.image; // Foto Lengan Kiri
      default: return product.image;
    }
  }, [product, designData.view, designData.color, isSpecificColorImage, selectedColorObj]);

  /* --- HELPER: Load image as blob (bypass CORS, support semua sumber) --- */
  const loadImageAsBlob = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const isBase64 = src.startsWith('data:');
      const isLocal = !src.startsWith('http') && !src.startsWith('data:');

      // Base64 atau asset lokal: langsung load tanpa crossOrigin
      if (isBase64 || isLocal) {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        return;
      }

      // URL remote: coba dengan crossOrigin dulu
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback: tanpa crossOrigin (untuk URL yang tidak support CORS header)
        const img2 = new Image();
        img2.onload = () => resolve(img2);
        img2.onerror = reject;
        img2.src = src;
      };
      // Cache-busting hanya untuk URL remote
      img.src = src + (src.includes('?') ? '&' : '?') + '_t=' + Date.now();
    });
  };

  /* --- FUNGSI RENDER CANVAS MANUAL (Tidak bergantung html2canvas/CORS) --- */
  const renderDesignToCanvas = async (): Promise<string> => {
    const SIZE = 1200;
    const offscreen = document.createElement('canvas');
    offscreen.width = SIZE;
    offscreen.height = SIZE;
    const ctx = offscreen.getContext('2d')!;

    // Background putih (bukan transparan) agar hasil download tidak hitam di semua device
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // 1. Gambar produk utama
    try {
      const productImg = await loadImageAsBlob(currentDisplayImage);
      const scale = Math.min(SIZE / productImg.width, SIZE / productImg.height);
      const w = productImg.width * scale;
      const h = productImg.height * scale;
      const x = (SIZE - w) / 2;
      const y = (SIZE - h) / 2;
      ctx.drawImage(productImg, x, y, w, h);
    } catch (e) {
      console.warn('Gagal load gambar produk:', e);
    }

    // 2. Overlay warna jika tidak pakai gambar spesifik
    if (!isSpecificColorImage && designData.color) {
      ctx.globalAlpha = 0.45;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = designData.color;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    // 3. Render elemen desain (teks & logo) untuk view aktif
    const activeElements = (designData.elements || []).filter(el => el.view === designData.view);
    for (const el of activeElements) {
      const posX = (el.pos.x / 100) * SIZE;
      const posY = (el.pos.y / 100) * SIZE;

      if (el.type === 'text') {
        const fontSize = Math.round(28 * el.scale);
        ctx.font = `900 ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const metrics = ctx.measureText(el.content);
        const textW = metrics.width + 16;
        const textH = fontSize + 10;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(posX - textW / 2, posY - textH / 2, textW, textH);
        ctx.fillStyle = '#000000';
        ctx.fillText(el.content.toUpperCase(), posX, posY);
      } else if (el.type === 'image') {
        try {
          const logoImg = await loadImageAsBlob(el.content);
          const logoSize = Math.round(90 * el.scale);
          ctx.drawImage(logoImg, posX - logoSize / 2, posY - logoSize / 2, logoSize, logoSize);
        } catch (e) {
          console.warn('Gagal load logo:', e);
        }
      }
    }

    // Kembalikan sebagai JPEG (lebih kompatibel di semua Android) dengan kualitas 95%
    return offscreen.toDataURL('image/jpeg', 0.95);
  };

  /* --- FUNGSI SIMPAN GAMBAR KE PERANGKAT --- */
  const handleSaveImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const base64Data = await renderDesignToCanvas();
      const fileName = `BRADWEAR_${product.name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;


      // --- WEB / BROWSER ---
      // Coba Web Share API (Android Chrome, Samsung Internet)
      try {
        const blob = await (await fetch(base64Data)).blob();
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Desain Bradwear' });
          return;
        }
      } catch (shareErr) {
        console.warn('Share API gagal:', shareErr);
      }

      // Fallback: download via <a> tag
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Gambar diunduh ke perangkat.');

    } catch (err) {
      console.error('Save failed:', err);
      alert('Gagal menyimpan gambar. Coba ulangi proses download atau gunakan browser yang mendukung penyimpanan file.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReviewOrder = () => {
    // Sync Cart to Global Order Items
    const simpleItems = cartItems.map(item => ({
      size: item.size,
      quantity: item.qty,
      gender: item.gender,
      sleeve: item.model.category === 'Rompi' ? undefined : item.sleeve,
      name: item.name,
      color: item.color,
      colorCode: item.colorCode,
      catalogMaterial: item.catalogMaterial,
      customDetail: item.customDetail,
      productId: item.model.id,
      productName: item.model.name,
      productCategory: item.model.category,
      productImage: item.model.image,
      colorCodeImage: item.colorCodeImage,
    }));
    setOrderItems(simpleItems);
    setCurrentRoute(RouteKey.SUMMARY);
  };

  /* --- LOGIKA EKSPOR WHATSAPP (MODAL FORM TERLEBIH DAHULU) --- */
  const handleExport = () => {
    setShowOrdererForm(true);
  };

  /* --- DOWNLOAD DESAIN LANGSUNG (TANPA WHATSAPP) --- */
  const handleDownloadDesign = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    const originalView = designData.view;
    const originalZoom = canvasZoom;
    const originalPan = panPos;

    try {
      setCanvasZoom(1);
      setPanPos({ x: 0, y: 0 });

      // Download DEPAN
      onUpdate({ view: 'Depan' });
      await new Promise(r => setTimeout(r, 800));
      const canvasFront = await html2canvas(canvasRef.current, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: null });
      const linkFront = document.createElement('a');
      linkFront.href = canvasFront.toDataURL('image/png');
      linkFront.download = `BRADWEAR_DEPAN_${product.name}_${Date.now()}.png`;
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      // Download BELAKANG
      onUpdate({ view: 'Belakang' });
      await new Promise(r => setTimeout(r, 800));
      const canvasBack = await html2canvas(canvasRef.current, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: null });
      const linkBack = document.createElement('a');
      linkBack.href = canvasBack.toDataURL('image/png');
      linkBack.download = `BRADWEAR_BELAKANG_${product.name}_${Date.now()}.png`;
      document.body.appendChild(linkBack);
      linkBack.click();
      document.body.removeChild(linkBack);

    } catch (err) {
      console.error('Download failed', err);
      alert('Gagal mengunduh desain. Coba lagi.');
    } finally {
      setCanvasZoom(originalZoom);
      setPanPos(originalPan);
      onUpdate({ view: originalView });
      setIsExporting(false);
    }
  };

  const executeWhatsAppExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setShowOrdererForm(false);

    const originalView = designData.view;

    try {
      // RESET ZOOM & PAN
      const originalZoom = canvasZoom;
      const originalPan = panPos;
      setCanvasZoom(1);
      setPanPos({ x: 0, y: 0 });

      // 1. CAPTURE & UPLOAD DEPAN
      onUpdate({ view: 'Depan' });
      await new Promise(r => setTimeout(r, 1500));

      const canvasFront = await html2canvas(canvasRef.current, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: null });
      const imageFront = canvasFront.toDataURL("image/png");

      // Auto Download
      const linkFront = document.createElement('a');
      linkFront.href = imageFront;
      linkFront.download = `BRAD_DEPAN_${ordererInfo.name || 'ORDER'}_${Date.now()}.png`;
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      // Upload
      const frontUrl = await uploadImageToSupabase(imageFront, `orders/front_${Date.now()}.png`);

      // 2. CAPTURE & UPLOAD BELAKANG
      onUpdate({ view: 'Belakang' });
      await new Promise(r => setTimeout(r, 1500));

      const canvasBack = await html2canvas(canvasRef.current, { useCORS: true, allowTaint: true, scale: 2, backgroundColor: null });
      const imageBack = canvasBack.toDataURL("image/png");

      // Auto Download
      const linkBack = document.createElement('a');
      linkBack.href = imageBack;
      linkBack.download = `BRAD_BELAKANG_${ordererInfo.name || 'ORDER'}_${Date.now()}.png`;
      document.body.appendChild(linkBack);
      linkBack.click();
      document.body.removeChild(linkBack);

      // Upload
      const backUrl = await uploadImageToSupabase(imageBack, `orders/back_${Date.now()}.png`);

      // Restore state
      setCanvasZoom(originalZoom);
      setPanPos(originalPan);
      onUpdate({ view: originalView });

      // 3. PROCESS ITEMS & UPLOAD SCANS
      const materialName = designData.material || 'Standar';

      const rawItems = cartItems.length > 0 ? cartItems : [
        {
          id: 'temp',
          model: activeFormModel,
          color: activeFormColor,
          name: newItem.name || '-',
          size: newItem.size,
          gender: newItem.gender,
          sleeve: newItem.sleeve,
          qty: newItem.qty,
          customDetail: newItem.size === 'Custom' ? `(Custom: ${customMeasures.tinggi}...)` : '',
          colorCode: newItem.colorCode,
          colorCodeImage: newItem.colorCodeImage
        }
      ];

      // Upload Scans Loop
      const processedItems = await Promise.all(rawItems.map(async (item, idx) => {
        let scanUrl = null;
        if (item.colorCodeImage && item.colorCodeImage.startsWith('data:image')) {
          scanUrl = await uploadImageToSupabase(item.colorCodeImage, `orders/scan_${Date.now()}_${idx}.png`);
        }
        return { ...item, scanUrl };
      }));

      // 4. GROUPING & TEXT
      const groupedItems: Record<string, typeof processedItems> = {};
      processedItems.forEach(item => {
        // Modified: Use Color Code exclusively for grouping key if available
        const colorName = item.colorCode && item.colorCode !== '-' ? item.colorCode : (COLORS.find(c => c.hex === item.color)?.name || 'Custom');
        const key = `*MODEL: ${item.model.name} - KODE: ${colorName}*`;
        if (!groupedItems[key]) groupedItems[key] = [];
        groupedItems[key].push(item);
      });

      let ordersText = '';
      Object.entries(groupedItems).forEach(([modelKey, items]) => {
        ordersText += `\n📦 ${modelKey}\n──────────────────\n`;
        items.forEach((item, i) => {
          const sleeveInfo = item.model.category === 'Rompi' ? '' : `\n      ✂️ Lengan: ${item.sleeve}`;
          const materialPrefix = item.catalogMaterial && item.catalogMaterial !== 'Unspecified' ? `${item.catalogMaterial} - ` : '';
          ordersText += `   ${i + 1}. 👤 Nama: *${item.name}*\n      📐 Size: ${item.size}${sleeveInfo}\n      🎨 Kode/Warna: ${materialPrefix}${item.colorCode}\n      🔢 Qty: ${item.qty} Pcs`;
          if (item.scanUrl) ordersText += `\n      📷 Scan Warna: ${item.scanUrl}`;
          ordersText += `\n\n`;
        });
      });

      const text = `Halo Admin Bradwear! 👋%0aSaya ingin *ORDER PRODUKSI ${product.category.toUpperCase()}* 🚀:%0a%0a` +
        `📋 *DATA PEMESAN*%0a` +
        `   👤 Nama: ${ordererInfo.name || '-'}%0a` +
        `   🏢 Instansi: ${ordererInfo.agency || '-'}%0a` +
        `   📍 Lokasi: ${ordererInfo.location || '-'}%0a%0a` +
        `👕 *MATERIAL INFO*%0a` +
        `   👕 Model: ${product.name}%0a` +
        `   ✨ Bahan: ${materialName}%0a%0a` +
        `📝 *DETAIL PESANAN*${encodeURIComponent(ordersText)}%0a` +
        `📎 *PREVIEW DESAIN*%0a` +
        `   Front: ${frontUrl || '(Lihat Lampiran)'}%0a` +
        `   Back: ${backUrl || '(Lihat Lampiran)'}%0a%0a` +
        `Mohon info total harga dan invoice resminya. Terima kasih! 🙏`;

      const waMessage = [
        `Halo tim Bradwear Indonesia, saya konsumen dari website Bradwear dan ingin melanjutkan order produksi ${product.category} custom.`,
        '',
        'DATA PEMESAN',
        `- Nama: ${ordererInfo.name || '-'}`,
        `- Instansi: ${ordererInfo.agency || '-'}`,
        `- Lokasi: ${ordererInfo.location || '-'}`,
        '',
        'MATERIAL INFO',
        `- Model: ${product.name}`,
        `- Bahan: ${materialName}`,
        '',
        'DETAIL PESANAN',
        ordersText,
        'PREVIEW DESAIN',
        `- Front: ${frontUrl || '(Lihat lampiran)'}`,
        `- Back: ${backUrl || '(Lihat lampiran)'}`,
        '',
        'Mohon bantuannya untuk estimasi harga, timeline produksi, dan langkah approval berikutnya. Terima kasih.',
      ].join('\n');

      openCustomerServiceDialog({
        message: waMessage,
        title: 'Pilih costumer service yang kamu inginkan',
        description: 'Pilih customer service tujuan untuk meneruskan hasil preview desain dan data pemesanan Anda.',
      });
      alert(`✅ Berhasil! Link gambar telah disematkan di WhatsApp.`);
      handleBackCustom();

    } catch (err) {
      console.error("Export failed", err);
      alert("Gagal memproses upload gambar. Pastikan internet lancar.");
      onUpdate({ view: originalView });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-none flex-col overflow-y-auto bg-[var(--surface-subtle)] md:h-[calc(100vh-96px)] md:flex-row md:overflow-hidden">
      <style>{`
        .step-transition-container {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          width: 300%;
        }
        .step-panel {
          width: 33.333%;
          display: flex;
          flex-direction: column;
          padding-bottom: 20px;
          min-height: min-content;
        }
        @media (min-width: 768px) {
          .step-transition-container { height: 100%; }
          .step-panel { height: 100%; min-height: 0; }
        }
        .material-rating-dot {
          width: 4px;
          height: 4px;
          border-radius: 99px;
        }
      `}</style>

      {/* Loading Overlay */}
      {(isProcessing || isExporting) && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-bold tracking-widest uppercase text-sm animate-pulse">
            {isExporting ? 'Menyiapkan Desain...' : 'Memproses Logo...'}
          </span>
        </div>
      )}

      {/* LEFT PANEL: PREVIEW */}
      <div
        className={`w-full md:w-[60%] lg:w-[65%] md:h-full relative flex flex-col border-b md:border-b-0 md:border-r shrink-0 transition-all duration-700 ${theme === 'dark' ? 'border-white/5' : 'border-zinc-300'}`}
        style={{
          background: theme === 'dark'
            ? `radial-gradient(circle at center, ${designData.color}15 0%, #0a0a0a 100%)`
            : `radial-gradient(circle at center, ${designData.color}20 0%, #e5e7eb 100%)`
        }}
      >

        {/* Section Title - di atas canvas, bukan overlay */}
        {!isProcessing && !isExporting && (
          <div className={`shrink-0 flex items-center justify-between px-5 py-3 border-b z-10 ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
            <div>
              <h2 className={`text-sm font-black uppercase tracking-widest neon-text`}>
                {editorStep === 'materials' ? 'Desain Warna & Bahan' : editorStep === 'details' ? 'Detail Atribut' : 'Data Pesanan'}
              </h2>
              <div className="flex gap-1.5 mt-1.5">
                {['materials', 'details', 'finish'].map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-500 ${editorStep === s ? 'w-6 bg-emerald-500' :
                      (i < ['materials', 'details', 'finish'].indexOf(editorStep) ? 'w-3 bg-emerald-500/40' : 'w-3 bg-zinc-700')
                      }`}
                  />
                ))}
              </div>
            </div>
            {/* Undo/Redo + Download */}
            {!viewingModel && !expandedMaterial && !showCustomSizeModal && !showStepNotify && (
              <div className="flex items-center gap-2">
                <div className={`flex gap-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-black/40' : 'bg-white/60 shadow-sm'}`}>
                  <button onClick={undo} disabled={historyPointer === 0} className={`p-2 rounded transition-all ${historyPointer === 0 ? 'opacity-20' : theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-200 text-zinc-800'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  </button>
                  <button onClick={redo} disabled={historyPointer === history.length - 1} className={`p-2 rounded transition-all ${historyPointer === history.length - 1 ? 'opacity-20' : theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-200 text-zinc-800'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
                  </button>
                </div>
                {/* Tombol Download Desain */}
                <button
                  onClick={handleDownloadDesign}
                  disabled={isExporting}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100'}`}
                  title="Download Desain"
                >
                  {isExporting ? (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  )}
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Canvas area - flex-1 mengisi sisa ruang */}
        <div className="flex-1 relative min-h-0">

        {/* Canvas */}
        <div id="design-canvas" className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div
            ref={canvasRef}
            className="relative w-full h-full flex items-center justify-center"
            onMouseDown={(e) => {
              setActiveElementId(null);
              if (canvasZoom > 1) {
                setIsPanning(true);
                setLastTouchPos({ x: e.clientX, y: e.clientY });
              }
            }}
            onTouchStart={(e) => {
              setActiveElementId(null);
              if (canvasZoom > 1 && e.touches.length === 1) {
                setIsPanning(true);
                setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
              }
            }}
          >
            <div
              className={`relative transition-all duration-300 flex items-center justify-center h-[90%] w-full max-w-full`}
              style={{
                transform: `scale(${canvasZoom}) translate(${panPos.x / canvasZoom}px, ${panPos.y / canvasZoom}px)`,
                cursor: canvasZoom > 1 ? 'grab' : 'crosshair'
              }}
            >
              {/* --- TAMPILAN GAMBAR UTAMA PRODUK --- */}
              <img
                src={currentDisplayImage}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none"
                onClick={() => {
                  if (!isPanning) {
                    setCanvasZoom(prev => prev === 1 ? 2.5 : 1);
                    if (canvasZoom > 1) setPanPos({ x: 0, y: 0 });
                  }
                }}
              />
              {/* --- OVERLAY WARNA (Jika tidak pakai gambar khusus) --- */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-500 mix-blend-multiply ${isSpecificColorImage ? 'opacity-0' : 'opacity-50'}`}
                style={{ backgroundColor: designData.color }}
              />

              {/* Elements */}
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {elements.filter(el => el.view === designData.view).map(el => (
                  <div
                    key={el.id}
                    onMouseDown={(e) => { e.stopPropagation(); setDraggingId(el.id); setActiveElementId(el.id); setIsPanning(false); }}
                    onTouchStart={(e) => { e.stopPropagation(); setDraggingId(el.id); setActiveElementId(el.id); setIsPanning(false); }}
                    className={`absolute transition-transform cursor-grab active:cursor-grabbing ${activeElementId === el.id ? 'z-50' : 'z-20'}`}
                    style={{
                      top: `${el.pos.y}%`,
                      left: `${el.pos.x}%`,
                      transform: `translate(-50%, -50%) scale(${el.scale})`,
                      touchAction: 'none'
                    }}
                  >
                    {el.type === 'text' ? (
                      <div className={`rounded-sm whitespace-nowrap transition-all ${activeElementId === el.id || el.content.trim() !== ''
                        ? 'bg-white border border-zinc-300'
                        : 'bg-transparent'
                        }`}
                        style={{ padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1' }}
                      >
                        <span className="text-[12px] md:text-[14px] font-black uppercase text-black" style={{ display: 'block', lineHeight: '1' }}>{el.content}</span>
                      </div>
                    ) : (
                      /* --- ELEMENT GAMBAR (LOGO) --- */
                      <div className={`relative flex items-center justify-center p-1 rounded-lg border-2 transition-all ${activeElementId === el.id ? 'neon-border bg-emerald-500/10 border-emerald-500/50' : 'border-transparent'}`}>
                        <img src={el.content} className="h-20 w-auto object-contain pointer-events-none" alt="design-element" />
                      </div>
                    )}
                    {activeElementId === el.id && (
                      <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="absolute -top-10 left-1/2 -translate-x-1/2 p-2 bg-red-600 rounded-full text-white shadow-lg z-[60]">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* END Canvas area */}
        </div>

      </div>

      {/* RIGHT PANEL: EDITOR */}
      <div className={`w-full md:w-[40%] lg:w-[35%] flex-shrink-0 md:h-full min-h-0 flex flex-col border-t md:border-t-0 md:border-l relative z-10 shadow-2xl transition-colors duration-500 overflow-visible md:overflow-hidden ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`}>

        {/* Panel Header - hanya step indicator */}
        <div className={`px-5 py-3 md:px-8 border-b shrink-0 transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'bg-zinc-50 border-zinc-100'}`}>
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex shrink-0 gap-1.5">
              {['materials', 'details', 'finish'].map((s, i) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-500 ${editorStep === s ? 'w-6 bg-emerald-500' :
                    (i < ['materials', 'details', 'finish'].indexOf(editorStep) ? 'w-3 bg-emerald-500/40' : 'w-3 bg-zinc-800')
                    }`}
                />
              ))}
            </div>

            <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 whitespace-nowrap">
              <div className={`flex shrink-0 gap-1 rounded-2xl border p-1 ${theme === 'dark' ? 'border-white/10 bg-zinc-900' : 'border-zinc-200 bg-white shadow-sm'}`}>
                {availableViews.map(v => (
                  <button
                    key={v}
                    onClick={() => onUpdate({ view: v as any })}
                    className={`rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider transition-all sm:px-4 sm:text-[10px] ${designData.view === v ? (theme === 'dark' ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black')}`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <button
                onClick={handleBackCustom}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 sm:px-4 sm:text-[10px] ${theme === 'dark' ? 'border-white/10 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-800 shadow-sm'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                Kembali
              </button>

              {editorStep !== 'finish' ? (
                <button
                  onClick={handleNextStep}
                  className="flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 sm:px-4 sm:text-[10px]"
                >
                  Lanjut
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sliding Step Container */}
        <div className="flex-1 relative min-h-0 overflow-hidden h-auto md:h-full">
          <div
            className="step-transition-container"
            style={{
              transform: `translateX(-${['materials', 'details', 'finish'].indexOf(editorStep) * 33.333}%)`
            }}
          >

            {/* STEP 1: MATERIALS */}
            <div className="step-panel px-5 md:px-8 pt-6 space-y-8 overflow-y-visible md:overflow-y-auto custom-scrollbar">

              {/* 1. Color Selection (Horizontal) */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest mb-3 flex justify-between items-center ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Pilih Warna</span>
                  <span className="text-[10px] text-emerald-500 neon-text">
                    {specificColors.find(sc => sc.name.toLowerCase() === designData.color.toLowerCase())?.name || COLORS.find(c => c.hex === designData.color)?.name || (designData.color.startsWith('#') ? 'Custom' : designData.color)}
                  </span>
                </label>

                {/* Model Specific Colors (Warna dari Folder) */}
                {specificColors.length > 0 && (
                  <div className="mb-6 animate-fade-in">
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                      {specificColors.map(sc => {
                        const matchingGlobal = COLORS.find(gc => gc.name.toLowerCase() === sc.name.toLowerCase());
                        const isSelected = matchingGlobal ? designData.color === matchingGlobal.hex : designData.color.toLowerCase() === sc.name.toLowerCase();

                        return (
                          <button
                            key={sc.name}
                            onClick={() => onUpdate({ color: matchingGlobal?.hex || sc.name })}
                            className={`group relative aspect-square rounded-xl border-2 transition-all p-0.5 ${isSelected ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-white/5 opacity-70 hover:opacity-100 hover:border-emerald-500/30'}`}
                            title={sc.name}
                          >
                            <img src={sc.image} className="w-full h-full object-cover rounded-lg" />
                            {isSelected && (
                              <div className="absolute top-0 right-0 p-0.5 bg-emerald-500 rounded-bl-lg z-10">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(product.category !== 'Rompi' && product.category !== 'Polo' && product.category !== 'Kemeja') && (
                  <div className="flex overflow-x-auto no-scrollbar gap-3 py-3 -mx-2 px-2">
                    {COLORS.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => onUpdate({ color: c.hex })}
                        className={`flex-shrink-0 w-11 h-11 rounded-full border-2 transition-all duration-300 relative group overflow-hidden shadow-sm ${designData.color === c.hex ? 'border-emerald-500 scale-110 ring-4 ring-emerald-500/10 z-10' : 'border-white/10 hover:border-emerald-500/50'}`}
                        style={{
                          backgroundColor: c.hex,
                          backgroundImage: `url("${c.image}")`,
                          backgroundSize: 'cover'
                        }}
                        title={c.name}
                      >
                        {designData.color === c.hex && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Color Reference Notice */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mt-4 animate-fade-in">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[10px] font-bold text-emerald-500 leading-tight uppercase tracking-widest">
                    Pemberitahuan: Warna pada layar hanya sebagai referensi warna untuk mempermudah visualisasi desain Anda.
                  </p>
                </div>
              </div>

              {/* 2. Model Switcher (Hidden for Kemeja) */}
              {product.category !== 'Kemeja' && (
                <>
                  <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}></div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-widest mb-3 block ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Ganti Model ({product.category})</label>
                    <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-2 px-2">
                      {[product, ...similarProducts].map(p => {
                        const isActive = p.id === product.id;
                        return (
                          <div
                            key={p.id}
                            className={`flex-shrink-0 w-60 p-3 rounded-2xl border transition-all relative group flex items-center gap-3 ${isActive
                              ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                              : theme === 'dark'
                                ? 'border-white/5 bg-zinc-900/50 hover:bg-zinc-800 hover:border-white/10'
                                : 'border-zinc-200 bg-white hover:bg-zinc-50'
                              }`}
                          >
                            <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-black/20 shrink-0 overflow-hidden relative">
                              <img src={p.image} className="w-full h-full object-contain p-1" />
                              {isActive && <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className={`text-[10px] font-black uppercase truncate leading-tight ${isActive ? 'text-emerald-500' : theme === 'dark' ? 'text-white' : 'text-black'}`}>{p.name}</h4>
                              <p className="text-[9px] text-zinc-500 mb-2 truncate">{p.category}</p>

                              {isActive ? (
                                <span className="text-[8px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md">Dipilih</span>
                              ) : (
                                <button
                                  onClick={() => onSelectProduct(p)}
                                  className="text-[9px] font-bold text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-md hover:bg-emerald-500 hover:text-white transition-colors"
                                >
                                  Gunakan
                                </button>
                              )}
                            </div>

                            <button
                              onClick={(e) => { e.stopPropagation(); setViewingModel(p); }}
                              className="absolute top-2 right-2 p-1.5 rounded-full text-zinc-400 hover:text-emerald-500 hover:bg-white/10 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}></div>

              {/* 3. Material Selection (Vertical List) */}
              <div className="flex-1 min-h-0 flex flex-col">
                <label className={`text-xs font-bold uppercase tracking-widest mb-4 flex justify-between items-center ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Pilih Bahan</span>
                  <span className="text-[10px] text-emerald-500 neon-text animate-pulse">Scroll info</span>
                </label>
                <div className="space-y-3 pb-2">
                  {activeMaterials.map(m => {
                    const MATERIAL_RATINGS: Record<string, { cool: number, thick: number, soft: number }> = {
                      // Standar Materials
                      'TROPICAL': { cool: 5, thick: 2, soft: 5 },
                      'NAGATA DRILL': { cool: 4, thick: 3, soft: 4 },
                      'AMERICAN DRILL': { cool: 2, thick: 4, soft: 3 },
                      'RIPSTOP PERNUSA': { cool: 3, thick: 5, soft: 2 },
                      'BABY CANVAS': { cool: 4, thick: 4, soft: 4 },
                      'STF': { cool: 5, thick: 2, soft: 3 },
                      'OXFORD': { cool: 5, thick: 2, soft: 3 },
                      'SOFT DENIM': { cool: 4, thick: 3, soft: 5 },
                      // Polo Materials
                      'PIQUE COTTON': { cool: 5, thick: 3, soft: 5 },
                      'LACOSTE CVC': { cool: 4, thick: 4, soft: 4 },
                      'PIQUE PE': { cool: 2, thick: 3, soft: 2 },
                      'DRI-FIT': { cool: 5, thick: 2, soft: 4 },
                      'WAFFLE KNIT': { cool: 3, thick: 5, soft: 3 },
                      'VISCOSE': { cool: 5, thick: 2, soft: 5 }
                    };
                    const ratings = MATERIAL_RATINGS[m] || { cool: 3, thick: 3, soft: 3 };

                    return (
                      <div
                        key={m}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative group shrink-0 ${designData.material === m
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : theme === 'dark'
                            ? 'border-zinc-900 bg-zinc-900/10 hover:border-zinc-800'
                            : 'border-zinc-200 bg-zinc-50 hover:border-zinc-100'
                          }`}
                      >
                        {/* Material Badges */}
                        {(m === 'TROPICAL' || m === 'NAGATA DRILL') && (
                          <div className="absolute -top-3 left-4 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 rounded-full shadow-lg animate-bounce z-10 border border-white/20">
                            <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                              {m === 'TROPICAL' ? 'Best Seller' : 'Favorit'}
                            </span>
                          </div>
                        )}

                        <button onClick={() => { onUpdate({ material: m }); triggerHaptic(); }} className="w-full text-left">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm font-black uppercase tracking-tight ${designData.material === m
                              ? (theme === 'dark' ? 'text-white' : 'text-black')
                              : (theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400')
                              }`}>{activeMaterialSpecs[m]?.title || m}</span>
                            {designData.material === m && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></div>}
                          </div>

                          {/* Material Ratings */}
                          <div className="flex gap-4 items-center">
                            <div className="flex flex-col gap-1">
                              <span className="text-[7px] text-zinc-500 uppercase font-black tracking-tighter">Adem</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div key={i} className={`w-2 h-1 rounded-full ${i <= ratings.cool ? 'bg-cyan-500' : 'bg-zinc-800'}`} />
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[7px] text-zinc-500 uppercase font-black tracking-tighter">Tebal</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div key={i} className={`w-2 h-1 rounded-full ${i <= ratings.thick ? 'bg-orange-500' : 'bg-zinc-800'}`} />
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[7px] text-zinc-500 uppercase font-black tracking-tighter">Lembut</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div key={i} className={`w-2 h-1 rounded-full ${i <= ratings.soft ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedMaterial(m); triggerHaptic(); }}
                          className="absolute right-4 bottom-3 w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-emerald-500 transition-colors z-10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 2: DETAILS */}
            <div className="step-panel px-5 md:px-8 pt-6 space-y-8 overflow-y-visible md:overflow-y-auto custom-scrollbar">

              {/* Position Simulation Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 animate-fade-in mb-4">
                <svg className="w-4 h-4 text-orange-500 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Pemberitahuan Simulasi</p>
                  <p className="text-[9px] font-bold text-orange-500/80 leading-tight uppercase tracking-wide">
                    Posisi nama atau logo pada layar hanya sebagai simulasi acuan. Penempatan aslinya akan menyesuaikan standar produksi.
                  </p>
                </div>
              </div>

              {/* --- KONTROL UKURAN (SCALE) --- */}
              {activeElementId && (
                <div className={`p-5 rounded-2xl border transition-colors animate-fade-in ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'}`}>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex justify-between">
                    <span>Ukuran Logo / Teks</span>
                    <span className="text-emerald-500">{Math.round((elements.find(el => el.id === activeElementId)?.scale || 1) * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.1"
                    value={elements.find(el => el.id === activeElementId)?.scale || 1}
                    onChange={(e) => updateElement(activeElementId, { scale: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              )}

              {/* Nama (Dada Kanan) */}
              <div className={`p-5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'}`}>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nama (Dada Kanan)</label>
                  <button
                    onClick={() => fileInputRefNama.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-95"
                  >
                    + Logo
                  </button>
                  <input type="file" ref={fileInputRefNama} className="hidden" multiple accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LOGO_NAMA)} />
                </div>
                <input
                  type="text"
                  placeholder="KETIK NAMA..."
                  value={getElementContent('dada_kanan')}
                  onChange={(e) => handleTextChange('dada_kanan', e.target.value)}
                  className={`w-full border-b-2 p-3 text-sm font-bold outline-none uppercase tracking-wide transition-all ${theme === 'dark'
                    ? 'bg-black/50 border-zinc-800 focus:border-emerald-500 text-white placeholder:text-zinc-700'
                    : 'bg-white border-zinc-200 focus:border-emerald-500 text-black placeholder:text-zinc-300'
                    }`}
                />
              </div>

              {/* Jabatan (Dada Kiri) */}
              <div className={`p-5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'}`}>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Jabatan (Dada Kiri)</label>
                  <button
                    onClick={() => fileInputRefJabatan.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 border border-emerald-500/20 transition-all active:scale-95"
                  >
                    + Logo
                  </button>
                  <input type="file" ref={fileInputRefJabatan} className="hidden" multiple accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LOGO_JABATAN)} />
                </div>
                <input
                  type="text"
                  placeholder="KETIK JABATAN..."
                  value={getElementContent('dada_kiri')}
                  onChange={(e) => handleTextChange('dada_kiri', e.target.value)}
                  className={`w-full border-b-2 p-3 text-sm font-bold outline-none uppercase tracking-wide transition-all ${theme === 'dark'
                    ? 'bg-black/50 border-zinc-800 focus:border-emerald-500 text-white placeholder:text-zinc-700'
                    : 'bg-white border-zinc-200 focus:border-emerald-500 text-black placeholder:text-zinc-300'
                    }`}
                />
              </div>

              {/* Atribut Lain (Lengan & Belakang) */}
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Posisi Atribut Lain</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => fileInputRefLenganKanan.current?.click()}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 group transition-all active:scale-95 ${theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-500 hover:text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-black'
                      }`}
                  >
                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-[9px] font-bold uppercase transition-colors">Lengan Kanan</span>
                    <input type="file" ref={fileInputRefLenganKanan} className="hidden" multiple accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LENGAN_KANAN)} />
                  </button>

                  <button
                    onClick={() => fileInputRefLenganKiri.current?.click()}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 group transition-all active:scale-95 ${theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-500 hover:text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-black'
                      }`}
                  >
                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-[9px] font-bold uppercase transition-colors">Lengan Kiri</span>
                    <input type="file" ref={fileInputRefLenganKiri} className="hidden" multiple accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LENGAN_KIRI)} />
                  </button>

                  <button
                    onClick={() => { onUpdate({ view: 'Belakang' }); fileInputRefBelakang.current?.click(); }}
                    className={`col-span-2 p-4 rounded-xl border flex flex-row items-center justify-center gap-3 group transition-all active:scale-95 ${theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-500 hover:text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-black'
                      }`}
                  >
                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-[9px] font-bold uppercase transition-colors">Upload Desain Belakang</span>
                    <input type="file" ref={fileInputRefBelakang} className="hidden" multiple accept="image/*" onChange={(e) => handleLogoUpload(e, 'Belakang', DEFAULT_POS.BELAKANG)} />
                  </button>
                </div>
              </div>

              {/* BUTTON LANJUT (INLINE) */}
              <div className="pt-4 pb-8 md:hidden">
                <button
                  onClick={handleNextStep}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white'}`}
                >
                  Lanjut
                </button>
              </div>

            </div>

            {/* STEP 3: FINISH */}
            <div className="step-panel px-5 md:px-8 pt-6 space-y-6 overflow-y-visible md:overflow-y-auto custom-scrollbar">

              {/* --- HEADER & SUMMARY --- */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Daftar Pesanan</h3>
                  <p className="text-xs opacity-60">
                    Menampilkan pesanan untuk {activeFormModel.name} - {COLORS.find(c => c.hex === activeFormColor)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-500">{cartItems.length}</span>
                  <span className="text-xs block opacity-60">Total Item</span>
                </div>
              </div>

              {/* --- LIST ITEM DI KERANJANG (SEMUA ITEM) --- */}
              <div className="space-y-3 mb-8">
                {cartItems.length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed text-center opacity-50">
                    <p className="text-xs">Belum ada pesanan.</p>
                  </div>
                )}
                {cartItems.map((item) => (
                  <div key={item.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 group transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/30' : 'bg-white border-zinc-200 shadow-sm hover:border-emerald-500/30'}`}>
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-1 shrink-0 relative overflow-hidden group-hover:scale-110 transition-transform shadow-md border border-zinc-200">
                        {/* Dynamic Image based on model and color */}
                        {(() => {
                          const colorObj = COLORS.find(c => c.hex === item.color) || COLORS.find(c => c.name.toLowerCase() === item.color.toLowerCase());
                          const colorName = colorObj?.name || item.color;
                          const modelImg = getModelColorImage(item.model.name, colorName, 'Depan', item.model.category);

                          return (
                            <img
                              src={modelImg || item.model.image}
                              className="w-full h-full object-contain relative z-10 rounded-xl transition-all"
                              onError={(e) => { e.currentTarget.src = item.model.image; }}
                            />
                          );
                        })()}
                        {/* Overlay Color hint */}
                        <div className="absolute bottom-0 inset-x-0 h-1 z-20" style={{ backgroundColor: COLORS.find(c => c.hex === item.color)?.hex || (item.color.startsWith('#') ? item.color : 'transparent') }}></div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center flex-wrap gap-2 mb-1.5">
                          <span className={`text-sm font-black tracking-tight truncate ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.name}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-black border border-emerald-500/20">{item.size}</span>
                        </div>
                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          <span className="uppercase tracking-wider">{item.model.name}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                          <span className="flex items-center gap-1.5">
                            {(() => {
                              const colorObj = COLORS.find(c => c.hex === item.color) || COLORS.find(c => c.name.toLowerCase() === item.color.toLowerCase());
                              const displayHex = colorObj?.hex || (item.color.startsWith('#') ? item.color : '#888');
                              // Modified: Show Color Code as primary name
                              return (
                                <>
                                  <div className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: displayHex }}></div>
                                  <span className="font-bold text-emerald-500">
                                    {item.catalogMaterial && item.catalogMaterial !== 'Unspecified' ? `${item.catalogMaterial.replace(/\s*\(Best\s*Seller\)/gi, '').replace(/\s*\(Favorit\)/gi, '').replace(/\s*\(Favorite\)/gi, '').replace(/\s*\(Popular\)/gi, '')} - ` : ''}
                                    {item.colorCode !== '-' ? item.colorCode : (colorObj?.name || item.color)}
                                  </span>
                                </>
                              );
                            })()}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                          <span>{item.gender}</span>
                          {item.model.category !== 'Rompi' && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                              <span>{item.sleeve}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button onClick={() => handleRemoveFromCart(item.id)} className="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{item.qty} Pcs</span>
                    </div>
                  </div>
                ))}
              </div>


              {/* --- FORM TAMBAH ITEM BARU --- */}
              <div className={`p-5 rounded-2xl border-2 relative ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50'}`}>


                <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Tambahkan Item Pesanan
                </h4>

                {/* 1. MODEL & WARNA SELECTOR */}
                <div className="mb-6 space-y-4">
                  {/* Model Horizontal Scroll (Hidden for Kemeja) */}
                  {product.category !== 'Kemeja' && (
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-2 flex justify-between items-center opacity-70">
                        <span>Pilih Model</span>
                        <span className="text-emerald-500 font-extrabold">{activeFormModel.name}</span>
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {[product, ...similarProducts].map(p => (
                          <button
                            key={p.id}
                            id={`model-form-${p.id}`}
                            onClick={() => {
                              setActiveFormModel(p);
                              // Khusus Celana, Rompi, Polo, Jaket: Sinkronkan visual utama dengan model yang dipilih di form
                              if (['Celana', 'Rompi', 'Polo', 'Jaket'].includes(product.category)) {
                                onSelectProduct(p);
                              }
                            }}
                            className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 p-1 transition-all relative ${activeFormModel.id === p.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-transparent bg-black/5'}`}
                          >
                            <img src={p.image} className="w-full h-full object-contain" alt={p.name} />
                            {activeFormModel.id === p.id && <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white"></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selector for Celana (Specific Model Colors) */}
                  {activeFormModel.category === 'Celana' && specificColors.length > 0 && (
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-2 flex justify-between items-center opacity-70">
                        <span>Pilih Warna</span>
                        <span className="text-emerald-500 font-extrabold">{specificColors.find(sc => sc.name.toLowerCase() === activeFormColor.toLowerCase())?.name || COLORS.find(c => c.hex === activeFormColor)?.name || (activeFormColor.startsWith('#') ? 'Custom' : activeFormColor)}</span>
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {specificColors.map(sc => {
                          const matchingGlobal = COLORS.find(gc => gc.name.toLowerCase() === sc.name.toLowerCase());
                          const isSelected = matchingGlobal ? activeFormColor === matchingGlobal.hex : activeFormColor.toLowerCase() === sc.name.toLowerCase();

                          return (
                            <button
                              key={sc.name}
                              onClick={() => {
                                const newColor = matchingGlobal?.hex || sc.name;
                                setActiveFormColor(newColor);
                                onUpdate({ color: newColor }); // Sync visual preview
                                setNewItem({ ...newItem, colorCode: sc.name.toUpperCase() });
                                setColorCodeError(null);
                              }}
                              className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 p-1 transition-all relative ${isSelected ? 'border-emerald-500 bg-emerald-500/10' : 'border-transparent bg-black/5'}`}
                            >
                              <img src={sc.image} className="w-full h-full object-cover rounded-lg" alt={sc.name} />
                              {isSelected && <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white"></div>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. FORM INPUTS */}
                <div className="grid gap-4">
                  {/* Kode Warna & Katalog Button */}
                  <div ref={colorCodeRef} className={`transition-all duration-300 ${colorCodeError ? 'animate-shake' : ''}`}>
                    <div className="flex justify-between items-center mb-1">
                      <label className={`text-[10px] font-black uppercase block flex justify-between items-center ${colorCodeError ? 'text-red-500' : 'opacity-70'}`}>
                        <span>Kode Warna <span className="text-red-500">*</span></span>
                        {colorCodeError && <span className="text-[8px] animate-pulse italic bg-red-500 text-white px-1.5 py-0.5 rounded">Wajib Isi Kode Warna</span>}
                      </label>
                      <button
                        onClick={() => setShowCatalogModal(true)}
                        className={`text-[9px] font-black uppercase tracking-widest hover:underline ${colorCodeError ? 'text-red-400' : 'text-emerald-500'}`}
                      >
                        Lihat Katalog
                      </button>
                    </div>
                    {newItem.colorCodeImage ? (
                      <div className={`flex items-center gap-3 p-3 rounded-xl border border-dashed transition-all ${colorCodeError ? 'bg-red-500/5 border-red-500/50' : 'bg-black/5 border-emerald-500/50'}`}>
                        <div className={`w-16 h-12 rounded-lg overflow-hidden bg-white border shrink-0 shadow-sm relative group ${colorCodeError ? 'border-red-300' : 'border-emerald-200'}`}>
                          <img src={newItem.colorCodeImage} className="w-full h-full object-cover" alt="Scan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[9px] uppercase font-black tracking-widest mb-0.5 ${colorCodeError ? 'text-red-500' : 'text-emerald-500/70'}`}>Terpilih</p>
                          <input
                            type="text"
                            value={newItem.colorCode}
                            onChange={(e) => { setNewItem({ ...newItem, colorCode: e.target.value }); setColorCodeError(null); }}
                            className={`font-bold text-sm bg-transparent outline-none w-full border-b border-transparent focus:border-emerald-500/50 transition-colors ${colorCodeError ? 'text-red-600' : 'text-zinc-800'}`}
                          />
                        </div>
                        <button
                          onClick={() => setShowCatalogModal(true)}
                          className={`px-3 py-1.5 font-bold text-xs rounded-lg shadow-sm border active:scale-95 transition-all ${colorCodeError ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-emerald-600 border-zinc-200 hover:bg-emerald-50'}`}
                        >
                          Ubah
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={newItem.colorCode}
                          onChange={(e) => { setNewItem({ ...newItem, colorCode: e.target.value }); setColorCodeError(null); }}
                          placeholder="(ISI KODE WARNA)"
                          className={`w-full p-3 pr-12 rounded-xl border-2 outline-none font-bold text-sm transition-all ${colorCodeError
                            ? 'bg-red-50 border-red-500 focus:ring-2 focus:ring-red-200 placeholder:text-red-300 text-red-700 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            : (theme === 'dark' ? 'bg-black/30 border-zinc-700 focus:border-emerald-500 text-white placeholder:text-zinc-600' : 'bg-white border-zinc-200 focus:border-emerald-500 text-black placeholder:text-zinc-400 shadow-inner shadow-black/5')
                            }`}
                        />
                        {newItem.colorCode && (
                          <div className="absolute -top-2 left-3 px-1.5 bg-emerald-500 rounded text-[7px] font-black text-white uppercase tracking-tighter animate-fade-in">Tersimpan</div>
                        )}
                        <button
                          onClick={() => setShowCatalogModal(true)}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${colorCodeError ? 'text-red-500 hover:bg-red-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 015.656 5.656l-1.172 1.172" /></svg>
                        </button>
                      </div>
                    )}
                    {colorCodeError && (
                      <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1 animate-fadeIn">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {colorCodeError}
                      </p>
                    )}
                  </div>

                  {/* Nama */}
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-70 flex justify-between">
                      <span>Nama</span>
                      <span className="text-red-500 text-[8px] animate-pulse">Wajib isi teks</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Contoh: Budi (Ketua)"
                      className={`w-full p-3 rounded-xl border-2 outline-none font-bold text-sm transition-all ${theme === 'dark'
                        ? 'bg-black/30 border-zinc-700 focus:border-emerald-500 text-white'
                        : 'bg-white border-zinc-200 focus:border-emerald-500 text-black shadow-inner shadow-black/5'}`}
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-70">Ukuran</label>
                    <div className="flex flex-wrap gap-2">
                      {/* Standard Sizes */}
                      {product.category === 'Celana' ? (
                        // Ukuran Celana 28-40
                        [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40].map(size => (
                          <button
                            key={size}
                            onClick={() => setNewItem({ ...newItem, size: size.toString() })}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${newItem.size === size.toString() ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent hover:bg-black/5'}`}
                          >
                            {size}
                          </button>
                        ))
                      ) : (
                        // Ukuran Kemeja/Lainnya S-XXL
                        ['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <button
                            key={size}
                            onClick={() => setNewItem({ ...newItem, size })}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${newItem.size === size ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent hover:bg-black/5'}`}
                          >
                            {size}
                          </button>
                        ))
                      )}

                      {/* Extra Sizes Toggle (Hidden for Celana as it's already 28-40) */}
                      {product.category !== 'Celana' && (
                        <button
                          onClick={() => setShowExtraSizes(!showExtraSizes)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border border-dashed transition-all ${showExtraSizes ? 'bg-black/10' : 'hover:bg-black/5'}`}
                        >
                          {showExtraSizes ? 'Sembunyikan' : 'Size Besar +'}
                        </button>
                      )}

                      {/* Extra Sizes List */}
                      {showExtraSizes && product.category !== 'Celana' && (
                        <>
                          {['3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'].map(size => (
                            <button
                              key={size}
                              onClick={() => setNewItem({ ...newItem, size })}
                              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${newItem.size === size ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent hover:bg-black/5'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </>
                      )}

                      {/* Custom Button */}
                      <button
                        onClick={() => {
                          setNewItem({ ...newItem, size: 'Custom' });
                          setShowCustomSizeModal(true);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${newItem.size === 'Custom' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent hover:bg-black/5'}`}
                      >
                        Custom
                      </button>

                    </div>
                  </div>

                  {/* Gender & Sleeve (Hidden some parts for Celana) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-1 block opacity-70">Gender</label>
                      <div className="flex rounded-lg border overflow-hidden p-1 gap-1">
                        {['Pria', 'Wanita'].map(g => (
                          <button
                            key={g}
                            onClick={() => setNewItem({ ...newItem, gender: g as any })}
                            className={`flex-1 py-1.5 text-xs font-bold rounded ${newItem.gender === g ? 'bg-emerald-500 text-white' : 'hover:bg-black/5'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(product.category !== 'Rompi' && product.category !== 'Celana') && (
                      <div>
                        <label className="text-[10px] font-bold uppercase mb-1 block opacity-70">Lengan</label>
                        <div className="flex rounded-lg border overflow-hidden p-1 gap-1">
                          {['Panjang', 'Pendek'].map(s => (
                            <button
                              key={s}
                              onClick={() => setNewItem({ ...newItem, sleeve: s as any })}
                              className={`flex-1 py-1.5 text-xs font-bold rounded ${newItem.sleeve === s ? 'bg-emerald-500 text-white' : 'hover:bg-black/5'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Qty & Add Button */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setNewItem({ ...newItem, qty: Math.max(1, newItem.qty - 1) })} className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-black/5">-</button>
                      <span className="font-black w-8 text-center">{newItem.qty}</span>
                      <button onClick={() => setNewItem({ ...newItem, qty: newItem.qty + 1 })} className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-black/5">+</button>
                    </div>
                    <button
                      onClick={() => handleAddToCart()}
                      className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      + Tambah
                    </button>
                  </div>

                  {editorStep === 'finish' && (
                    <div className={`mt-4 rounded-2xl border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/[0.03]' : 'border-zinc-200 bg-white'}`}>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Finalisasi Ringkasan</p>
                      <p className={`mt-2 text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        Setelah daftar item sudah sesuai, lanjutkan ke ringkasan untuk meninjau detail pesanan sebelum dikirim ke tim Bradwear.
                      </p>
                      <button
                        onClick={handleReviewOrder}
                        className="mt-4 w-full rounded-xl bg-[var(--brand-accent)] py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-red-500/20 transition-all hover:brightness-110 active:scale-95"
                      >
                        Lanjut ke Ringkasan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {editorStep !== 'finish' ? (
          <div className={`sticky bottom-0 z-20 shrink-0 border-t px-4 pb-3 pt-2 backdrop-blur-md md:px-6 md:pb-5 md:pt-3 ${theme === 'dark' ? 'border-white/5 bg-black/80' : 'border-zinc-200 bg-white/95'} ${showStepNotify ? 'hidden' : (editorStep === 'details' ? 'hidden md:block' : '')}`}>
            <button
              onClick={() => {
                if (['Celana', 'Rompi', 'Polo', 'Jaket'].includes(product.category)) {
                  setEditorStep('finish');
                } else {
                  handleNextStep();
                }
              }}
              className={`w-full py-4 font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg animate-pulse hover:animate-none ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5' : 'bg-black text-white hover:bg-zinc-800 shadow-xl'}`}
            >
              {['Celana', 'Rompi', 'Polo', 'Jaket'].includes(product.category) ? 'Pesan Sekarang' : 'Lanjut ke Tahap Berikutnya'}
            </button>
          </div>
        ) : null}
      </div>




      {/* POPUP: MATERIAL DETAILS */}
      {expandedMaterial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setExpandedMaterial(null)}>
          <div className={`w-full max-w-md p-6 rounded-3xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} shadow-2xl transform scale-100 transition-all`} onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black uppercase tracking-wider mb-2 text-emerald-500">{activeMaterialSpecs[expandedMaterial]?.title}</h3>
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{activeMaterialSpecs[expandedMaterial]?.desc}</p>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Keunggulan Utama:</h4>
              {activeMaterialSpecs[expandedMaterial]?.points?.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 animate-stagger-fade-in opacity-0"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className={`text-sm font-medium leading-tight ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{point}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setExpandedMaterial(null)} className="w-full mt-8 py-3 rounded-xl bg-emerald-500 text-white font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* POPUP: MODEL CATALOG */}
      {viewingModel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setViewingModel(null)}>
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 rounded-3xl relative ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} shadow-2xl`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-wider mb-1 text-white/90">{viewingModel.name}</h3>
                <p className="text-sm text-zinc-500">Katalog Tampilan Produk</p>
              </div>
              <button onClick={() => setViewingModel(null)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority: Gallery -> Images -> Single Image */}
              {viewingModel.gallery && viewingModel.gallery.length > 0 ? (
                <>
                  {/* Main Front Image */}
                  <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative group">
                    <img src={viewingModel.images?.front || viewingModel.image} className="w-full h-full object-cover rounded-xl" />
                    <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Tampak Depan</span>
                  </div>

                  {/* Gallery Images */}
                  {viewingModel.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-2 border border-white/5 relative group overflow-hidden">
                      <img src={img} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" />
                      <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Detail #{idx + 1}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative">
                    <img src={viewingModel.images?.front || viewingModel.image} className="w-full h-full object-contain" />
                    <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Tampak Depan</span>
                  </div>

                  <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative">
                    <img src={viewingModel.images?.back || viewingModel.image} className="w-full h-full object-contain" />
                    <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Tampak Belakang</span>
                  </div>

                  {(viewingModel.images?.rightSleeve || viewingModel.images?.leftSleeve) && (
                    <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative">
                      <img src={viewingModel.images?.rightSleeve || viewingModel.image} className="w-full h-full object-contain" />
                      <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Samping</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => { onSelectProduct(viewingModel); setViewingModel(null); }}
                className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Gunakan Model Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: FORM DATA PEMESAN (WHATSAPP) */}
      {showOrdererForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md p-7 rounded-[32px] relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} shadow-2xl`}>
            <div className="mb-6">
              <h3 className="text-xl font-black uppercase tracking-wider text-emerald-500 mb-1">Data Pemesan</h3>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Lengkapi data untuk invoice & pengiriman</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1.5 block">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={ordererInfo.name}
                  onChange={(e) => setOrdererInfo({ ...ordererInfo, name: e.target.value })}
                  className={`w-full p-3.5 rounded-2xl border outline-none font-bold text-sm transition-all ${theme === 'dark' ? 'bg-black/40 border-white/10 focus:border-emerald-500 focus:bg-black/60' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-500 focus:bg-white'}`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1.5 block">Instansi / Perusahaan</label>
                <input
                  type="text"
                  placeholder="Nama Kantor/Organisasi"
                  value={ordererInfo.agency}
                  onChange={(e) => setOrdererInfo({ ...ordererInfo, agency: e.target.value })}
                  className={`w-full p-3.5 rounded-2xl border outline-none font-bold text-sm transition-all ${theme === 'dark' ? 'bg-black/40 border-white/10 focus:border-emerald-500 focus:bg-black/60' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-500 focus:bg-white'}`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1.5 block">Lokasi / Kota</label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta Selatan"
                  value={ordererInfo.location}
                  onChange={(e) => setOrdererInfo({ ...ordererInfo, location: e.target.value })}
                  className={`w-full p-3.5 rounded-2xl border outline-none font-bold text-sm transition-all ${theme === 'dark' ? 'bg-black/40 border-white/10 focus:border-emerald-500 focus:bg-black/60' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-500 focus:bg-white'}`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowOrdererForm(false)}
                className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
              >
                Batal
              </button>
              <button
                onClick={executeWhatsAppExport}
                disabled={!ordererInfo.name}
                className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale"
              >
                Selesai & Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: CUSTOM SIZE FORM */}
      {showCustomSizeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md p-6 rounded-3xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} shadow-2xl`}>
            <button onClick={() => setShowCustomSizeModal(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-black uppercase tracking-wider mb-6 text-emerald-500">Ukuran Kustom</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.category === 'Celana' ? (
                // Fields kustom khusus Celana
                <>
                  {[
                    { label: 'Tinggi (cm)', key: 'tinggi' },
                    { label: 'Lingkar Pinggang (cm)', key: 'pinggang' },
                    { label: 'Lingkar Pinggul (cm)', key: 'pinggul' },
                    { label: 'Lingkar Paha (cm)', key: 'paha' },
                    { label: 'Lingkar Bawah (cm)', key: 'bawah' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 block">{field.label}</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customMeasures[field.key as keyof typeof customMeasures]}
                        onChange={(e) => setCustomMeasures({ ...customMeasures, [field.key]: e.target.value })}
                        className={`w-full p-2.5 rounded-lg border outline-none font-bold text-sm ${theme === 'dark' ? 'bg-black/30 border-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-500'}`}
                      />
                    </div>
                  ))}
                </>
              ) : (
                // Fields kustom standar (Kemeja/Lainnya)
                ([
                  ['Tinggi Badan', 'tinggi'],
                  ['Lebar Dada', 'lebarDada'],
                  ['Lebar Bahu', 'lebarBahu'],
                  ['Panjang Lengan', 'panjangLengan'],
                  ['Lingkar Kerah', 'kerah'],
                  ['Lingkar Manset', 'manset'],
                ] as const).map(([label, key]) => {
                  return (
                    <div key={key}>
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 block">{label} (cm)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customMeasures[key as keyof typeof customMeasures]}
                        onChange={(e) => setCustomMeasures({ ...customMeasures, [key]: e.target.value })}
                        className={`w-full p-2.5 rounded-lg border outline-none font-bold text-sm ${theme === 'dark' ? 'bg-black/30 border-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-500'}`}
                      />
                    </div>
                  )
                })
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomSizeModal(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 font-bold uppercase tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => setShowCustomSizeModal(false)}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP: COLOR CATALOG */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg h-[90vh] flex flex-col rounded-3xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-950 border border-white/5' : 'bg-white'} shadow-2xl`}>

            {/* Header */}
            <div className="p-6 border-b border-white/5 shrink-0 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-wider text-emerald-500">Katalog Warna</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pilih Kain & Zoom Unt Ambil Kode</p>
              </div>
              <button onClick={() => { setShowCatalogModal(false); setIsZoomed(false); }} className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-black/5 text-black'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-4 p-4 pt-8 overflow-x-auto no-scrollbar shrink-0 items-end">
              {Object.keys(COLOR_CATALOGS).map(cat => (
                <div key={cat} className="relative shrink-0">
                  {cat.includes('Tropical') && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-orange-400 to-yellow-500 px-2.5 py-1 rounded-full shadow-xl shadow-orange-500/30 animate-bounce z-10 whitespace-nowrap border border-white/20">
                      <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-[7px] font-black text-white uppercase tracking-tighter">Best Seller</span>
                    </div>
                  )}
                  {cat.includes('Nagata') && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-teal-500 px-2.5 py-1 rounded-full shadow-xl shadow-emerald-500/30 animate-bounce z-10 whitespace-nowrap border border-white/20">
                      <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-[7px] font-black text-white uppercase tracking-tighter">Favorit</span>
                    </div>
                  )}
                  <button
                    onClick={() => { setActiveCatalogType(cat); setIsZoomed(false); }}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCatalogType === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-zinc-500'}`}
                  >
                    {cat}
                  </button>
                </div>
              ))}
            </div>

            {/* Catalog View */}
            <div className="flex-1 overflow-hidden p-0 relative bg-black/20">
              {!activeCatalogType ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-xs font-bold uppercase tracking-widest">Silakan pilih jenis kain</p>
                </div>
              ) : (
                <div
                  ref={zoomContainerRef}
                  className={`w-full h-full relative transition-all duration-300 ${isZoomed ? 'cursor-grab active:cursor-grabbing touch-none' : 'overflow-y-auto custom-scrollbar p-4'}`}
                  onMouseDown={(e) => {
                    if (isZoomed) {
                      setIsPanningCatalog(true);
                      setLastCatalogMouse({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (isPanningCatalog && isZoomed) {
                      const dx = e.clientX - lastCatalogMouse.x;
                      const dy = e.clientY - lastCatalogMouse.y;
                      setCatalogPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                      setLastCatalogMouse({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseUp={() => setIsPanningCatalog(false)}
                  onMouseLeave={() => setIsPanningCatalog(false)}

                  // TOUCH EVENTS
                  onTouchStart={(e) => {
                    if (!isZoomed) return;
                    if (e.touches.length === 1) {
                      setIsPanningCatalog(true);
                      setLastCatalogMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                    } else if (e.touches.length === 2) {
                      // Pinch Zoom Start
                      const dist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                      );
                      setLastTouchDistance(dist);
                    }
                  }}
                  onTouchMove={(e) => {
                    if (!isZoomed) return;

                    if (e.touches.length === 1 && isPanningCatalog) {
                      // Pan
                      const dx = e.touches[0].clientX - lastCatalogMouse.x;
                      const dy = e.touches[0].clientY - lastCatalogMouse.y;
                      setCatalogPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                      setLastCatalogMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                    } else if (e.touches.length === 2 && lastTouchDistance) {
                      // Pinch Zoom
                      const dist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                      );
                      const delta = dist - lastTouchDistance;

                      // Sensitivity limiter
                      if (Math.abs(delta) > 5) {
                        const newScale = Math.max(1, Math.min(4, catalogScale + (delta * 0.005)));
                        setCatalogScale(newScale);
                        setLastTouchDistance(dist);
                      }
                    }
                  }}
                  onTouchEnd={() => {
                    setIsPanningCatalog(false);
                    setLastTouchDistance(null);
                  }}
                >
                  {isZoomed ? (
                    <div className="w-full h-full flex items-center justify-center pointer-events-none">
                      <img
                        src={activeCatalogImage || ''}
                        ref={zoomedCatalogImageRef}
                        draggable={false}
                        className={`max-w-none w-[300%] h-auto origin-top-left pointer-events-auto`}
                        style={{
                          transform: `translate(${catalogPan.x}px, ${catalogPan.y}px) scale(${catalogScale})`,
                          transition: isPanningCatalog ? 'none' : 'transform 0.1s linear'
                        }}
                      />

                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-6">
                        {/* NEW: Label Kode Warna Outside Box */}
                        <div className="mb-[-12px] bg-emerald-500/90 backdrop-blur px-6 py-1.5 rounded-t-2xl border-x border-t border-emerald-400 shadow-[0_-10px_20px_rgba(16,185,129,0.2)] z-10">
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] drop-shadow-md">Kode warna</span>
                        </div>

                        <div
                          ref={roiRef}
                          className="w-[320px] h-[220px] border-2 border-emerald-500 rounded-[32px] shadow-[0_0_80px_rgba(16,185,129,0.3)] bg-transparent relative overflow-hidden ring-1 ring-white/10 flex flex-col"
                        >
                          <div className="flex-1 relative overflow-hidden">
                            {/* Scanning Laser Line */}
                            {isScanning && (
                              <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_20px_#10b981] animate-scan-line z-10"></div>
                            )}

                            {/* ROI Aesthetic Corners */}
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl"></div>
                              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl"></div>
                              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl"></div>
                              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl"></div>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center">
                              {isScanning ? (
                                <div className="flex flex-col items-center gap-3">
                                  <div className="bg-emerald-500/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse">
                                    <p className="text-sm font-black text-emerald-400 tracking-widest">{detectedCode || scanningFragments}</p>
                                  </div>
                                  <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">{detectedCode ? 'AUTO-SAVED' : 'ANALYZING...'}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] animate-pulse">Scanning Zone</div>
                                  <div className="w-4 h-4 text-emerald-500">
                                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Flash Overlay */}
                          {showFlash && <div className="absolute inset-0 bg-white animate-flash z-20"></div>}
                        </div>

                        {/* Instruction Text */}
                        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                          <p className="text-[10px] font-bold text-center text-white/90 uppercase tracking-[0.15em] leading-relaxed">
                            Pas kan area scanning dengan <br />
                            <span className="text-emerald-400">kode warna kain</span> di atas area scan
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {COLOR_CATALOGS[activeCatalogType as keyof typeof COLOR_CATALOGS].map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-2xl overflow-hidden border border-white/5 cursor-zoom-in"
                          onClick={() => {
                            setActiveCatalogImage(img);
                            setIsZoomed(true);
                            setCatalogPan({ x: 0, y: 0 });
                          }}
                        >
                          <img src={img} className="w-full transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                            <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Klik Untuk Zoom & Pindai</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Area with Action Buttons */}
            <div className="p-6 bg-zinc-950/50 border-t border-white/5 space-y-4 shrink-0">
              {isZoomed ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsZoomed(false);
                      setIsPanningCatalog(false);
                      setCatalogScale(1);
                      setCatalogPan({ x: 0, y: 0 });
                    }}
                    className="p-4 rounded-2xl bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all border border-white/5"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      setIsScanning(true);
                      setDetectedCode(null);

                      // Flickering text fragments effect
                      const fragmentInterval = setInterval(() => {
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- ';
                        let f = '';
                        for (let i = 0; i < 8; i++) f += chars[Math.floor(Math.random() * chars.length)];
                        setScanningFragments(f);
                      }, 100);

                      const audioScan = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                      audioScan.volume = 0.2;
                      audioScan.play().catch(() => { });

                      // REAL AI OCR INTEGRATION
                      let capturedText = "";
                      let capturedImage = "";
                      try {
                        capturedImage = await captureCatalogScanBox();

                        const link = document.createElement('a');
                        link.href = capturedImage;
                        link.download = `scan_color_${Date.now()}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        capturedText = await analyzeImageWithGemini(capturedImage);
                      } catch (err) {
                        console.error("Capture Error:", err);
                      }

                      await new Promise(r => setTimeout(r, 1800));

                      const finalCode = capturedText && capturedText !== "No text detected" && capturedText !== "Error scanning"
                        ? normalizeColorCode(capturedText)
                        : ""; // Set to empty to trigger validation and show placeholder

                      setDetectedCode(finalCode);
                      clearInterval(fragmentInterval);

                      // ... Animation delays ...
                      await new Promise(r => setTimeout(r, 600));
                      setShowFlash(true);
                      await new Promise(r => setTimeout(r, 800));
                      setShowFlash(false);

                      setNewItem(prev => ({ ...prev, colorCode: finalCode, colorCodeImage: capturedImage }));
                      setIsScanning(false);
                      setDetectedCode(null);
                      setShowCatalogModal(false);
                      setIsZoomed(false);
                    }}
                    disabled={isScanning}
                    className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Analyzing Capture...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>Pindai Kode Warna</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2 px-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Pilih bahan, zoom area kode, lalu klik pindai untuk deteksi otomatis.</p>
                </div>
              )}
            </div>


          </div>
        </div>
      )}

      {/* POPUP: STEP NOTIFICATION */}
      {showStepNotify && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),rgba(15,23,42,0.86))] p-6 backdrop-blur-md animate-fade-in" onClick={() => setShowStepNotify(null)}>
          <div className={`w-full max-w-md overflow-hidden rounded-[36px] border shadow-2xl ${theme === 'dark' ? 'border-white/10 bg-zinc-950' : 'border-emerald-100 bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="bg-[linear-gradient(135deg,#0f3d25,#10b981)] px-7 py-6 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">Panduan Editor</p>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.16em]">Step {showStepNotify.step}</h3>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((step) => (
                    <span
                      key={step}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black transition ${
                        step === showStepNotify.step ? 'border-white/50 bg-white/20 text-white' : 'border-white/15 bg-black/10 text-white/55'
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-7 py-7">
              <p className={`text-base font-semibold leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {showStepNotify.msg}
              </p>

              <div className="mt-6 rounded-[24px] border border-emerald-500/15 bg-emerald-500/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                  {STEP_GUIDE_CONTENT[showStepNotify.step as 1 | 2 | 3]?.heading || 'Panduan Singkat'}
                </p>
                <p className={`mt-2 text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {STEP_GUIDE_CONTENT[showStepNotify.step as 1 | 2 | 3]?.body}
                </p>
                <p className={`mt-3 text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {STEP_GUIDE_CONTENT[showStepNotify.step as 1 | 2 | 3]?.next}
                </p>
              </div>

              <button onClick={() => setShowStepNotify(null)} className="mt-6 w-full rounded-2xl bg-emerald-500 py-4 text-sm font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                Mulai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DesignEditorView;

