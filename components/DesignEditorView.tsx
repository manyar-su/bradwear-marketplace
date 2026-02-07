import React, { useState, useRef, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Product, DesignData, DesignElement } from '../types';
import { MATERIALS, COLORS, MATERIAL_SPECS, PRODUCTS, CS_TEAM } from '../constants';
import { removeBackground } from '../utils/imageProcessor';
import { uploadImageToSupabase } from '../utils/supabaseService';
import { getModelColorImage } from '../assets';

const DesignEditorView: React.FC<{
  product: Product;
  designData: DesignData;
  onUpdate: (data: Partial<DesignData>) => void;
  onBack: () => void;
  onNext: () => void;
  onSelectProduct: (product: Product) => void;
  theme: 'light' | 'dark';
}> = ({ product, designData, onUpdate, onBack, onNext, onSelectProduct, theme }) => {

  const handleBackCustom = () => {
    if (editorStep === 'finish') {
      setEditorStep('details');
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

  const [editorStep, setEditorStep] = useState<'materials' | 'details' | 'finish'>('materials');

  // --- STATE LIST PESANAN (CART SYSTEM) ---
  interface OrderItem {
    id: string;
    model: Product;
    color: string;
    name: string;
    size: string;
    gender: 'Pria' | 'Wanita';
    sleeve: 'Panjang' | 'Pendek';
    qty: number;
    customDetail?: string; // Menyimpan detail ukuran custom
  }

  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // State untuk Form "Tambah Item"
  const [activeFormModel, setActiveFormModel] = useState<Product>(product);
  const [activeFormColor, setActiveFormColor] = useState<string>(designData.color);

  const [newItem, setNewItem] = useState({
    name: '',
    size: 'L',
    gender: 'Pria' as 'Pria' | 'Wanita',
    sleeve: 'Panjang' as 'Panjang' | 'Pendek',
    qty: 1
  });

  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  // Simpan detail custom sementara sebelum dimasukkan ke cart
  const [customMeasures, setCustomMeasures] = useState({
    tinggi: '', lebarDada: '', lebarBahu: '', panjangLengan: '', kerah: '', manset: ''
  });

  // State Ekspor WhatsApp
  const [showExtraSizes, setShowExtraSizes] = useState(false);
  const [showOrdererForm, setShowOrdererForm] = useState(false);
  const [ordererInfo, setOrdererInfo] = useState({
    name: '',
    agency: '',
    location: ''
  });


  // Tambahkan item ke cart
  const handleAddToCart = (silent = false) => {
    let customDetailStr = '';
    if (newItem.size === 'Custom') {
      customDetailStr = `(T:${customMeasures.tinggi}, LD:${customMeasures.lebarDada}, LB:${customMeasures.lebarBahu}, PL:${customMeasures.panjangLengan})`;
    }

    const item: OrderItem = {
      id: `item_${Date.now()}`,
      model: activeFormModel,
      color: activeFormColor,
      name: newItem.name || '-',
      size: newItem.size,
      gender: newItem.gender,
      sleeve: newItem.sleeve,
      qty: newItem.qty,
      customDetail: customDetailStr
    };

    setCartItems([...cartItems, item]);

    // Reset form
    setNewItem({ ...newItem, name: '', qty: 1 });
    if (!silent) alert("✅ Item berhasil ditambahkan ke daftar!");
  };

  const handleNextStep = () => {
    if (editorStep === 'materials') {
      setEditorStep('details');
    } else if (editorStep === 'details') {
      handleAddToCart(true);
      setEditorStep('finish');
    }
  };

  // Hapus item dari cart
  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  // --- KONFIGURASI POSISI DEFAULT ELEMEN (EDIT DISINI) ---

  // --- KONFIGURASI POSISI DEFAULT ELEMEN (EDIT DISINI) ---
  // Panduan Koordinat:
  // X (Horizontal): 0 = Paling Kiri, 50 = Tengah, 100 = Paling Kanan
  // Y (Vertikal):   0 = Paling Atas, 100 = Paling Bawah
  const DEFAULT_POS = {
    // Posisi Teks Nama (Dada Kanan)
    NAMA_TEKS: { x: 27, y: 24 },

    // Posisi Teks Jabatan (Dada Kiri)
    JABATAN_TEKS: { x: 73, y: 24 },

    // Posisi Logo diatas Nama (Dada Kanan)
    LOGO_NAMA: { x: 35, y: 28 },

    // Posisi Logo diatas Jabatan (Dada Kiri)
    LOGO_JABATAN: { x: 55, y: 28 },

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

  // Hardware Back Button Handler
  useEffect(() => {
    const handleHardwareBack = (e: PopStateEvent) => {
      e.preventDefault();
      // Push state back to maintain our position in history
      window.history.pushState(null, '', window.location.pathname);
      handleBackCustom();
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleHardwareBack);
    return () => window.removeEventListener('popstate', handleHardwareBack);
  }, [editorStep]); // Re-bind when step changes so handleBackCustom has right context
  const fileInputRefLenganKanan = useRef<HTMLInputElement>(null);
  const fileInputRefLenganKiri = useRef<HTMLInputElement>(null);
  const fileInputRefBelakang = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const elements = useMemo(() => designData.elements || [], [designData.elements]);
  const similarProducts = useMemo(() => PRODUCTS.filter(p => p.category === product.category && p.id !== product.id), [product]);

  /* Scroll Active Model into View */
  useEffect(() => {
    const activeBtn = document.getElementById(`model-${product.id}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [product.id]);

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
      // Menggunakan konfigurasi posisi default dari DEFAULT_POS
      const isRightChest = idPrefix.includes('dada_kanan'); // Dada Kanan = Nama
      const pos = isRightChest ? DEFAULT_POS.NAMA_TEKS : DEFAULT_POS.JABATAN_TEKS;

      const newId = `${idPrefix}_${Math.random().toString(36).substr(2, 5)}`;
      const newElement: DesignElement = {
        id: newId,
        type: 'text',
        content: text,
        pos,
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
  const isSpecificColorImage =
    (designData.view === 'Depan' && !!selectedColorObj?.image) ||
    (designData.view === 'Belakang' && !!selectedColorObj?.backImage);

  /* --- LOGIKA PEMANGGILAN GAMBAR UTAMA --- */
  // Menentukan gambar produk yang ditampilkan berdasarkan View (Depan/Belakang) dan Warna yang dipilih
  const currentDisplayImage = useMemo(() => {
    // 0. PRIORITAS: Cek apakah ada gambar model-spesifik untuk warna ini (misal di folder Yoroi)
    const colorName = selectedColorObj?.name;
    if (colorName) {
      const modelSpecificColorImg = getModelColorImage(product.name, colorName, designData.view);
      if (modelSpecificColorImg) return modelSpecificColorImg;
    }

    // 1. Cek apakah ada gambar khusus untuk warna tertentu (global fallback)
    if (isSpecificColorImage && selectedColorObj) {
      if (designData.view === 'Depan' && selectedColorObj.image) return selectedColorObj.image;
      if (designData.view === 'Belakang' && selectedColorObj.backImage) return selectedColorObj.backImage;
    }

    // 2. Jika tidak ada gambar khusus warna, gunakan gambar default produk per sisi
    if (!product.images) return product.image;
    switch (designData.view) {
      case 'Depan': return product.images.front; // Foto Tampak Depan
      case 'Belakang': return product.images.back || product.image; // Foto Tampak Belakang
      case 'Kanan': return product.images.rightSleeve || product.image; // Foto Lengan Kanan
      case 'Kiri': return product.images.leftSleeve || product.image; // Foto Lengan Kiri
      default: return product.image;
    }
  }, [product, designData.view, designData.color, isSpecificColorImage, selectedColorObj]);

  /* --- FUNGSI SIMPAN GAMBAR KE PERANGKAT --- */
  const handleSaveImage = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      // Tunggu sebentar agar UI render sempurna
      await new Promise(r => setTimeout(r, 100));

      // Capture area canvas menjadi gambar
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2, // Kualitas HD
        backgroundColor: null
      });

      // Download gambar hasil capture
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `BRADWEAR_${product.name}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Desain berhasil disimpan ke perangkat!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Gagal menyimpan gambar.");
    } finally {
      setIsExporting(false);
    }
  };

  /* --- LOGIKA EKSPOR WHATSAPP (MODAL FORM TERLEBIH DAHULU) --- */
  const handleExport = () => {
    setShowOrdererForm(true);
  };

  const executeWhatsAppExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setShowOrdererForm(false);

    const originalView = designData.view;

    try {
      // 1. CAPTURE TAMPAK DEPAN
      onUpdate({ view: 'Depan' });
      await new Promise(r => setTimeout(r, 800));

      const canvasFront = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null
      });
      const imageFront = canvasFront.toDataURL("image/png");

      const linkFront = document.createElement('a');
      linkFront.href = imageFront;
      linkFront.download = `BRAD_DEPAN_${ordererInfo.name || 'ORDER'}_${Date.now()}.png`;
      document.body.appendChild(linkFront);
      linkFront.click();
      document.body.removeChild(linkFront);

      // 2. CAPTURE TAMPAK BELAKANG
      onUpdate({ view: 'Belakang' });
      await new Promise(r => setTimeout(r, 800));

      const canvasBack = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null
      });
      const imageBack = canvasBack.toDataURL("image/png");

      const linkBack = document.createElement('a');
      linkBack.href = imageBack;
      linkBack.download = `BRAD_BELAKANG_${ordererInfo.name || 'ORDER'}_${Date.now()}.png`;
      document.body.appendChild(linkBack);
      linkBack.click();
      document.body.removeChild(linkBack);

      onUpdate({ view: originalView });

      // 3. KIRIM PESAN WHATSAPP DENGAN GROUPING
      const materialName = designData.material || 'Standar';

      const finalItems = cartItems.length > 0 ? cartItems : [
        {
          id: 'temp',
          model: activeFormModel,
          color: activeFormColor,
          name: newItem.name || '-',
          size: newItem.size,
          gender: newItem.gender,
          sleeve: newItem.sleeve,
          qty: newItem.qty,
          customDetail: newItem.size === 'Custom' ? `(Custom: ${customMeasures.tinggi}/${customMeasures.lebarDada}...)` : ''
        }
      ];

      // GROUPING LOGIC: Berdasarkan Model & Warna
      const groupedItems: Record<string, OrderItem[]> = {};
      finalItems.forEach(item => {
        const colorName = COLORS.find(c => c.hex === item.color)?.name || 'Custom';
        const key = `*MODEL: ${item.model.name} (${colorName})*`;
        if (!groupedItems[key]) groupedItems[key] = [];
        groupedItems[key].push(item);
      });

      let ordersText = '';
      Object.entries(groupedItems).forEach(([modelKey, items]) => {
        ordersText += `\n${modelKey}\n`;
        items.forEach((item, i) => {
          ordersText += `   ${i + 1}. *${item.name}* | Size: ${item.size} | Lengan: ${item.sleeve} | ${item.qty} Pcs\n`;
        });
      });

      const text = `Halo Admin Bradwear, saya ingin *ORDER PRODUKSI*:%0a%0a` +
        `👤 *DATA PEMESAN*%0a` +
        `   - Nama: ${ordererInfo.name || '-'}%0a` +
        `   - Instansi: ${ordererInfo.agency || '-'}%0a` +
        `   - Lokasi: ${ordererInfo.location || '-'}%0a%0a` +
        `🧵 *MATERIAL INFO*%0a` +
        `   - Bahan: ${materialName}%0a%0a` +
        `📋 *DETAIL DAFTAR PESANAN*${encodeURIComponent(ordersText)}%0a` +
        `🖼️ *DESAIN*: (Gambar DEPAN & BELAKANG sudah saya download, akan saya lampirkan)%0a%0a` +
        `Mohon info total harga dan invoice resminya. Terima kasih!`;

      window.open(`https://wa.me/?text=${text}`, '_blank');

      alert(`✅ Berhasil! Gambar desain sudah terunduh.\n\nSilakan pilih kontak CS/Admin di WhatsApp untuk mengirim list pesanan.`);
      handleBackCustom();
    } catch (err) {
      console.error("Export failed", err);
      alert("Gagal memproses. Silakan coba lagi.");
      onUpdate({ view: originalView });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden ${theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'} relative transition-colors duration-500`}>

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
      <div className={`w-full aspect-square md:w-[60%] lg:w-[65%] md:h-full relative flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r shrink-0 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-zinc-200 border-zinc-300'}`}>

        {/* Undo/Redo/Back Header - Hidden when any popup is active */}
        {!viewingModel && !expandedMaterial && !showCustomSizeModal && !isProcessing && !isExporting && (
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
            {/* Tombol Kembali (Menggunakan HandleBackCustom untuk reset) */}
            {/* Space Placeholder where Back Button was */}
            <div className="w-9 h-9"></div>
            <div className={`flex gap-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-black/40' : 'bg-white/60 shadow-sm'}`}>
              <button onClick={undo} disabled={historyPointer === 0} className={`p-2 rounded transition-all ${historyPointer === 0 ? 'opacity-20' : theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-200 text-zinc-800'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              </button>
              <button onClick={redo} disabled={historyPointer === history.length - 1} className={`p-2 rounded transition-all ${historyPointer === history.length - 1 ? 'opacity-20' : theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-200 text-zinc-800'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
              </button>
            </div>
          </div>
        )}

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
                      <div className={`px-2 py-1 rounded-sm whitespace-nowrap ${activeElementId === el.id
                        ? 'border border-emerald-500 bg-emerald-500/10'
                        : 'bg-transparent'
                        }`}>
                        <span className={`text-[12px] md:text-[14px] font-bold uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${theme === 'dark' ? 'text-white' : 'text-zinc-100'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{el.content}</span>
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

        {/* View Controls (Navigation & Side Toggle) - Hidden when modals are active */}
        {!viewingModel && !expandedMaterial && !showCustomSizeModal && !isProcessing && !isExporting && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 w-full max-w-[90%] md:max-w-max justify-center">

            {/* Tombol Kembali Cepat */}
            <button
              onClick={handleBackCustom}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border backdrop-blur-md transition-all active:scale-90 ${theme === 'dark' ? 'bg-zinc-900/90 border-white/10 text-white' : 'bg-white/90 border-zinc-200 text-zinc-800 shadow-xl'}`}
              title="Kembali"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* View Toggle */}
            <div className={`flex gap-2 p-1.5 rounded-2xl border backdrop-blur-md ${theme === 'dark' ? 'bg-zinc-900/90 border-white/10' : 'bg-white/90 border-zinc-200 shadow-xl'}`}>
              <button onClick={() => onUpdate({ view: 'Depan' })} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${designData.view === 'Depan' ? (theme === 'dark' ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black')}`}>Depan</button>
              <button onClick={() => onUpdate({ view: 'Belakang' })} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${designData.view === 'Belakang' ? (theme === 'dark' ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black')}`}>Belakang</button>
            </div>

            {/* Tombol Lanjut Cepat */}
            {editorStep !== 'finish' && (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all animate-pulse hover:animate-none"
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Lanjut</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        )}

      </div>

      {/* RIGHT PANEL: EDITOR */}
      <div className={`w-full md:w-[40%] lg:w-[35%] flex-1 md:h-full flex flex-col border-t md:border-t-0 md:border-l relative z-10 shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`}>

        {/* Panel Header */}
        <div className={`px-8 py-6 border-b shrink-0 transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-zinc-100 bg-zinc-50'}`}>
          <h2 className="text-xl font-black uppercase tracking-widest neon-text mb-1">
            {editorStep === 'materials' ? 'Desain Warna & Bahan' : editorStep === 'details' ? 'Detail Atribut' : 'Data Pesanan'}
          </h2>
          <p className="text-xs text-zinc-500 font-medium">Steps: {editorStep === 'materials' ? '1/3' : editorStep === 'details' ? '2/3' : '3/3'}</p>
        </div>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 pb-32 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>

          {editorStep === 'materials' && (
            <div className="flex flex-col gap-6 animate-fade-in pb-10">

              {/* 1. Color Selection (Horizontal) */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest mb-3 flex justify-between items-center ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Pilih Warna</span>
                  <span className="text-[10px] text-emerald-500 neon-text">{COLORS.find(c => c.hex === designData.color)?.name}</span>
                </label>
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
              </div>

              <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}></div>

              {/* 2. Model Switcher (Horizontal Card List) */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest mb-3 block ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Ganti Model ({product.category})</label>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 -mx-2 px-2">
                  {/* Join Current Active + Similar Products for a unified list */}
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

              <div className={`h-px w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`}></div>

              {/* 3. Material Selection (Vertical List) */}
              <div className="flex-1 min-h-0 flex flex-col">
                <label className={`text-xs font-bold uppercase tracking-widest mb-4 flex justify-between items-center ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Pilih Bahan</span>
                  <span className="text-[10px] text-emerald-500 neon-text animate-pulse">Scroll info</span>
                </label>
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-2">
                  {MATERIALS.map(m => (
                    <div
                      key={m}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative group shrink-0 ${designData.material === m
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : theme === 'dark'
                          ? 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-700'
                          : 'border-zinc-200 bg-zinc-50 hover:border-zinc-100'
                        }`}
                    >
                      <button onClick={() => onUpdate({ material: m })} className="w-full text-left">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-bold uppercase ${designData.material === m
                            ? (theme === 'dark' ? 'text-white' : 'text-black')
                            : (theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600')
                            }`}>{m}</span>
                          {designData.material === m && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>}
                        </div>
                        <p className={`text-[10px] line-clamp-2 leading-relaxed pr-8 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-500'}`}>{MATERIAL_SPECS[m]?.desc}</p>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedMaterial(m); }}
                        className="absolute right-4 bottom-4 p-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-emerald-500 transition-colors z-10"
                        title="Lihat Detail Bahan"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {editorStep === 'details' && (
            <div className="space-y-8 animate-fade-in-up">

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
                    onClick={() => { onUpdate({ view: 'Depan' }); fileInputRefLenganKanan.current?.click(); }}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 group transition-all active:scale-95 ${theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-500 hover:text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-black'
                      }`}
                  >
                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-[9px] font-bold uppercase transition-colors">Lengan Kanan</span>
                    <input type="file" ref={fileInputRefLenganKanan} className="hidden" multiple accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LENGAN_KANAN)} />
                  </button>

                  <button
                    onClick={() => { onUpdate({ view: 'Depan' }); fileInputRefLenganKiri.current?.click(); }}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 group transition-all active:scale-95 ${theme === 'dark'
                      ? 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-500 hover:text-white'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-black'
                      }`}
                  >
                    <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
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

            </div>
          )}

          {editorStep === 'finish' && (
            <div className="space-y-6">

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
                      <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-1.5 shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                        <img src={item.model.image} className="w-full h-full object-contain relative z-10" />
                        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundColor: item.color }}></div>
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
                            <div className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: item.color }}></div>
                            {COLORS.find(c => c.hex === item.color)?.name || 'Custom'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                          <span>{item.gender}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                          <span>{item.sleeve}</span>
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
              <div className={`p-5 rounded-2xl border-2 ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50'}`}>
                <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Tambah Item Baru
                </h4>

                {/* 1. MODEL & WARNA SELECTOR */}
                <div className="mb-6 space-y-4">
                  {/* Model Horizontal Scroll */}
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-2 flex justify-between items-center opacity-70">
                      <span>Pilih Model</span>
                      <span className="text-emerald-500 font-extrabold">{activeFormModel.name}</span>
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {[product, ...similarProducts].map(p => (
                        <button
                          key={p.id}
                          onClick={() => setActiveFormModel(p)}
                          className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 p-1 transition-all relative ${activeFormModel.id === p.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-transparent bg-black/5'}`}
                        >
                          <img src={p.image} className="w-full h-full object-contain" />
                          {activeFormModel.id === p.id && <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white"></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-2 block opacity-70">Pilih Warna (Preview)</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setActiveFormColor(c.hex);
                            onUpdate({ color: c.hex });
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${activeFormColor === c.hex ? 'border-emerald-500 scale-110 ring-2 ring-emerald-500/20' : 'border-white/10 hover:scale-105'}`}
                          style={{
                            backgroundColor: c.hex,
                            backgroundImage: `url("${c.image}")`,
                            backgroundSize: 'cover'
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. FORM INPUTS */}
                <div className="grid gap-4">
                  {/* Nama */}
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-70">Nama / Label</label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Contoh: Budi (Ketua)"
                      className={`w-full p-3 rounded-xl border outline-none font-bold text-sm ${theme === 'dark' ? 'bg-black/30 border-zinc-700 focus:border-emerald-500' : 'bg-white border-zinc-200 focus:border-emerald-500'}`}
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-[10px] font-bold uppercase mb-1 block opacity-70">Ukuran</label>
                    <div className="flex flex-wrap gap-2">
                      {/* Standard Sizes */}
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <button
                          key={size}
                          onClick={() => setNewItem({ ...newItem, size })}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${newItem.size === size ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent hover:bg-black/5'}`}
                        >
                          {size}
                        </button>
                      ))}

                      {/* Extra Sizes Toggle */}
                      <button
                        onClick={() => setShowExtraSizes(!showExtraSizes)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border border-dashed transition-all ${showExtraSizes ? 'bg-black/10' : 'hover:bg-black/5'}`}
                      >
                        {showExtraSizes ? 'Sembunyikan' : 'Size Besar +'}
                      </button>

                      {/* Extra Sizes List */}
                      {showExtraSizes && (
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

                  {/* Gender & Sleeve */}
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
                </div>
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className={`p-6 border-t shrink-0 z-20 backdrop-blur-md ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-zinc-200 bg-white/60'}`}>
            {editorStep !== 'finish' ? (
              <button
                onClick={handleNextStep}
                className={`w-full py-4 font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg animate-pulse hover:animate-none ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5' : 'bg-black text-white hover:bg-zinc-800 shadow-xl'}`}
              >
                Lanjut &rarr;
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSaveImage}
                  className={`w-full py-3 font-bold uppercase tracking-widest rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10' : 'border-zinc-800 text-zinc-800 hover:bg-zinc-100'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Simpan Gambar
                </button>
                <button
                  onClick={handleExport}
                  className="w-full py-4 neon-bg text-black font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  KIRIM DESAIN
                </button>
              </div>
            )}
          </div>




          {/* POPUP: MATERIAL DETAILS */}
          {expandedMaterial && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setExpandedMaterial(null)}>
              <div className={`w-full max-w-md p-6 rounded-3xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} shadow-2xl transform scale-100 transition-all`} onClick={e => e.stopPropagation()}>
                <button onClick={() => setExpandedMaterial(null)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h3 className="text-2xl font-black uppercase tracking-wider mb-2 text-emerald-500">{MATERIAL_SPECS[expandedMaterial]?.title}</h3>
                <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{MATERIAL_SPECS[expandedMaterial]?.desc}</p>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-70">Keunggulan Utama:</h4>
                  {MATERIAL_SPECS[expandedMaterial]?.points?.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{point}</span>
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
                  {['Tinggi Badan', 'Lebar Dada', 'Lebar Bahu', 'Panjang Lengan', 'Lingkar Kerah', 'Lingkar Manset'].map((label, idx) => {
                    const key = ['tinggi', 'lebarDada', 'lebarBahu', 'panjangLengan', 'kerah', 'manset'][idx] as keyof typeof customMeasures;
                    return (
                      <div key={key}>
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 block">{label} (cm)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={customMeasures[key]}
                          onChange={(e) => setCustomMeasures({ ...customMeasures, [key]: e.target.value })}
                          className={`w-full p-2.5 rounded-lg border outline-none font-bold text-sm ${theme === 'dark' ? 'bg-black/30 border-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-500'}`}
                        />
                      </div>
                    )
                  })}
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

        </div>
      </div>
    </div >
  );
};

export default DesignEditorView;
