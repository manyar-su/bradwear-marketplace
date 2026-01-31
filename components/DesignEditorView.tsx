import React, { useState, useRef, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Product, DesignData, DesignElement } from '../types';
import { MATERIALS, COLORS, MATERIAL_SPECS, PRODUCTS } from '../constants';
import { removeBackground } from '../utils/imageProcessor';

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

  const [editorStep, setEditorStep] = useState<'materials' | 'details'>('materials');

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, targetView?: 'Depan' | 'Belakang' | 'Kanan' | 'Kiri', targetPos?: { x: number, y: number }) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalSrc = event.target?.result as string;
        const overrides: Partial<DesignElement> = {};
        if (targetView) overrides.view = targetView;
        if (targetPos) overrides.pos = targetPos;

        try {
          await new Promise(r => setTimeout(r, 50));
          const processedSrc = await removeBackground(originalSrc);
          addElement('image', processedSrc, overrides);
        } catch (e) {
          addElement('image', originalSrc, overrides);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
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
    // 1. Cek apakah ada gambar khusus untuk warna tertentu (misal: Baju Merah Tampak Depan sudah ada fotonya sendiri)
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

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      // Small delay to ensure UI is updated
      await new Promise(r => setTimeout(r, 100));

      // Capture Canvas
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2, // Befter quality
        backgroundColor: null
      });

      // Download Image
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `BRADWEAR_${product.name}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // WhatsApp Message
      const colorName = COLORS.find(c => c.hex === designData.color)?.name || designData.color;
      const materialName = designData.material || 'Standar';
      const text = `Halo Admin Bradwear, saya ingin memesan kustom desain ini:%0a%0a` +
        `*Produk*: ${product.name}%0a` +
        `*Warna*: ${colorName}%0a` +
        `*Bahan*: ${materialName}%0a` +
        `*Catatan*: (Gambar Desain Terlampir)`;

      const phone = '6282232133926'; // Default CS
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');

      onNext();
    } catch (err) {
      console.error("Export failed", err);
      alert("Gagal menyimpan gambar. Silakan coba lagi.");
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

        {/* Undo/Redo/Back Header */}
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
          {/* Tombol Kembali (Menggunakan HandleBackCustom untuk reset) */}
          <button onClick={handleBackCustom} className={`p-2 rounded-full hover:bg-white/10 ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-white/60 text-zinc-800 shadow-sm'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className={`flex gap-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-black/40' : 'bg-white/60 shadow-sm'}`}>
            <button onClick={undo} disabled={historyPointer === 0} className={`p-2 rounded transition-all ${historyPointer === 0 ? 'opacity-20' : theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-200 text-zinc-800'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <button onClick={redo} disabled={historyPointer === history.length - 1} className={`p-2 rounded transition-all ${historyPointer === history.length - 1 ? 'opacity-20' : theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-zinc-200 text-zinc-800'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
            </button>
          </div>
        </div>

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

        {/* View Controls (Depan/Belakang) */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 p-2 rounded-2xl border backdrop-blur-md z-30 ${theme === 'dark' ? 'bg-zinc-900/90 border-white/10' : 'bg-white/90 border-zinc-200 shadow-xl'}`}>
          <button onClick={() => onUpdate({ view: 'Depan' })} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${designData.view === 'Depan' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : (theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black')}`}>Depan</button>
          <button onClick={() => onUpdate({ view: 'Belakang' })} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${designData.view === 'Belakang' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : (theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black')}`}>Belakang</button>
        </div>

      </div>

      {/* RIGHT PANEL: EDITOR */}
      <div className={`w-full md:w-[40%] lg:w-[35%] flex-1 md:h-full flex flex-col border-t md:border-t-0 md:border-l relative z-10 shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`}>

        {/* Panel Header */}
        <div className={`px-8 py-6 border-b shrink-0 transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-zinc-100 bg-zinc-50'}`}>
          <h2 className="text-xl font-black uppercase tracking-widest neon-text mb-1">
            {editorStep === 'materials' ? 'Desain Warna & Bahan' : 'Detail Atribut'}
          </h2>
          <p className="text-xs text-zinc-500 font-medium">Steps: {editorStep === 'materials' ? '1/2' : '2/2'}</p>
        </div>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 pb-32 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>

          {editorStep === 'materials' && (
            <div className="space-y-10 animate-fade-in">

              {/* Model Switcher (Vertical List) */}
              <div className="h-[350px] flex flex-col">
                <label className={`text-xs font-bold uppercase tracking-widest mb-4 block ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Ganti Model ({product.category})</label>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                  {/* Current Active Model */}
                  <div className={`p-3 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 flex items-center gap-4 relative`}>
                    <img src={product.image} className="w-16 h-16 object-contain bg-white/5 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-black uppercase truncate text-emerald-500">{product.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500 text-white">AKTIF</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span className="flex items-center text-amber-500"><svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> 4.9</span>
                        <span>|</span>
                        <span>{product.soldCount || '2.5k'} Terjual</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingModel(product)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-500 hover:text-emerald-500 transition-colors"
                      title="Lihat Katalog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </div>

                  {/* List Other Models */}
                  {similarProducts.map(p => (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border flex items-center gap-4 transition-all group ${theme === 'dark' ? 'border-white/5 hover:border-white/20 bg-white/5' : 'border-zinc-200 hover:border-zinc-300 bg-white'}`}
                    >
                      <img src={p.image} className="w-16 h-16 object-contain bg-black/5 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold uppercase truncate mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{p.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <span className="flex items-center text-amber-500"><svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> {((Math.random() * 0.5) + 4.5).toFixed(1)}</span>
                          <span>|</span>
                          <span>{p.soldCount || '1k+'} Terjual</span>
                        </div>
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="mt-2 text-[10px] font-bold text-emerald-500 hover:underline"
                        >
                          Gunakan Model Ini
                        </button>
                      </div>
                      <button
                        onClick={() => setViewingModel(p)}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-zinc-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500'}`}
                        title="Lihat Katalog"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest mb-4 flex justify-between items-center ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Pilih Warna</span>
                  <span className="text-[10px] text-emerald-500 neon-text">{COLORS.find(c => c.hex === designData.color)?.name}</span>
                </label>
                <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => onUpdate({ color: c.hex })}
                      className={`aspect-square rounded-xl border-2 transition-all duration-300 relative group overflow-hidden ${designData.color === c.hex ? 'border-white scale-110 z-10 shadow-lg' : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'}`}
                      style={{ backgroundColor: c.hex }}
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

              {/* Material Selection */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest mb-4 block flex justify-between items-center ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Pilih Bahan</span>
                  <span className="text-[10px] text-emerald-500 neon-text animate-pulse">Scroll untuk melihat</span>
                </label>
                <div className="space-y-3 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {MATERIALS.map(m => (
                    <div
                      key={m}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative group ${designData.material === m
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

                      {/* Detail Info Button */}
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
                  <input type="file" ref={fileInputRefNama} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LOGO_NAMA)} />
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
                  <input type="file" ref={fileInputRefJabatan} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LOGO_JABATAN)} />
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

              {/* --- KONTROL UKURAN (SCALE) --- */
                activeElementId && (
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
                    <input type="file" ref={fileInputRefLenganKanan} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LENGAN_KANAN)} />
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
                    <input type="file" ref={fileInputRefLenganKiri} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'Depan', DEFAULT_POS.LENGAN_KIRI)} />
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
                    <input type="file" ref={fileInputRefBelakang} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, 'Belakang', DEFAULT_POS.BELAKANG)} />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className={`p-6 border-t shrink-0 z-20 backdrop-blur-md ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-zinc-200 bg-white/60'}`}>
          {editorStep === 'materials' ? (
            <button
              onClick={() => setEditorStep('details')}
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
                className="w-full py-3 neon-bg text-black font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Kirim Desain via WhatsApp
              </button>
            </div>
          )}
        </div>

      </div>

      {/* POPUP: MATERIAL DETAILS */}
      {expandedMaterial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setExpandedMaterial(null)}>
          <div className={`w-full max-w-md p-6 rounded-3xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border border-white/10' : 'bg-white'} shadow-2xl transform scale-100 transition-all`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setExpandedMaterial(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors">
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
              <button onClick={() => setViewingModel(null)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tampilan Utama */}
              <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5">
                <img src={viewingModel.images?.front || viewingModel.image} className="w-full h-full object-contain" />
                <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Tampak Depan</span>
              </div>

              <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative">
                <img src={viewingModel.images?.back || viewingModel.image} className="w-full h-full object-contain" />
                <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Tampak Belakang</span>
              </div>

              <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative">
                <img src={viewingModel.images?.rightSleeve || viewingModel.image} className="w-full h-full object-contain" />
                <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Lengan Kanan</span>
              </div>

              <div className="aspect-square rounded-2xl bg-zinc-800/50 flex items-center justify-center p-8 border border-white/5 relative">
                <img src={viewingModel.images?.leftSleeve || viewingModel.image} className="w-full h-full object-contain" />
                <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/50 backdrop-blur rounded-lg text-white">Lengan Kiri</span>
              </div>
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

    </div>
  );
};

export default DesignEditorView;
