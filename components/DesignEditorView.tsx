
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Product, DesignData, DesignElement } from '../types';
import { MATERIALS, COLORS, MATERIAL_SPECS } from '../constants';
import { removeBackground } from '../utils/imageProcessor';

const DesignEditorView: React.FC<{
  product: Product;
  designData: DesignData;
  onUpdate: (data: Partial<DesignData>) => void;
  onBack: () => void;
  onNext: () => void;
  theme: 'light' | 'dark';
}> = ({ product, designData, onUpdate, onBack, onNext, theme }) => {

  const [showConfig, setShowConfig] = useState<'none' | 'color' | 'text'>('none');
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState('');
  const [initialDist, setInitialDist] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState<number>(1);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 });

  const [history, setHistory] = useState<DesignElement[][]>([designData.elements || []]);
  const [historyPointer, setHistoryPointer] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const elements = useMemo(() => designData.elements || [], [designData.elements]);

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

  const addElement = (type: 'text' | 'image', content: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newElement: DesignElement = {
      id: newId,
      type,
      content,
      pos: { x: 50, y: 50 },
      scale: 1,
      view: designData.view
    };
    const newElements = [...elements, newElement];
    onUpdate({ elements: newElements });
    pushToHistory(newElements);
    setActiveElementId(newId);
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalSrc = event.target?.result as string;
        try {
          const processedSrc = await removeBackground(originalSrc);
          addElement('image', processedSrc);
        } catch (e) {
          addElement('image', originalSrc);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const currentDisplayImage = useMemo(() => {
    if (!product.images) return product.image;
    switch (designData.view) {
      case 'Depan': return product.images.front;
      case 'Belakang': return product.images.back || product.image;
      case 'Kanan': return product.images.rightSleeve || product.image;
      case 'Kiri': return product.images.leftSleeve || product.image;
      default: return product.image;
    }
  }, [product, designData.view]);

  return (
    <div className={`flex flex-col h-full transition-all duration-500 relative overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-zinc-50'}`}>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between shrink-0 z-[100] border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] neon-text">Brader editor</h2>
          <p className="text-[9px] font-bold text-zinc-500 uppercase">{product.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 border-r border-white/10 pr-4">
            <button onClick={undo} disabled={historyPointer === 0} className={`p-2 rounded-lg transition-all ${historyPointer === 0 ? 'opacity-20' : 'hover:bg-white/10 text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <button onClick={redo} disabled={historyPointer === history.length - 1} className={`p-2 rounded-lg transition-all ${historyPointer === history.length - 1 ? 'opacity-20' : 'hover:bg-white/10 text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
            </button>
          </div>
          <button onClick={onBack} className="text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-widest">Batal</button>
        </div>
      </header>

      {/* Main Canvas Area - RE-MAXIMIZED FOR PORTRAIT FIT */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#050505]">
        <div
          ref={canvasRef}
          className={`relative w-full h-full flex items-center justify-center transition-all cursor-move overflow-hidden ${theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-100'}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setActiveElementId(null);
              if (canvasZoom > 1) {
                setIsPanning(true);
                setLastTouchPos({ x: e.clientX, y: e.clientY });
              }
            }
          }}
          onTouchStart={(e) => {
            if (e.target === e.currentTarget) {
              setActiveElementId(null);
              if (canvasZoom > 1 && e.touches.length === 1) {
                setIsPanning(true);
                setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
              }
            }
          }}
        >
          {/* Main Product Frame - Fit-to-Screen Maximized */}
          <div
            className={`relative transition-all duration-300 flex items-center justify-center p-0 aspect-[720/1080] h-full max-w-full`}
            style={{
              transform: `scale(${canvasZoom}) translate(${panPos.x / canvasZoom}px, ${panPos.y / canvasZoom}px)`,
              cursor: canvasZoom > 1 ? 'grab' : 'crosshair'
            }}
          >
            <img
              src={currentDisplayImage}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)] pointer-events-none"
              onClick={() => {
                if (!isPanning) {
                  setCanvasZoom(prev => prev === 1 ? 2.5 : 1);
                  if (canvasZoom > 1) setPanPos({ x: 0, y: 0 });
                }
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-1000 mix-blend-multiply opacity-35"
              style={{ backgroundColor: designData.color }}
            />

            {/* Design Elements Layer */}
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
                    <div className={`px-5 py-2 border-2 rounded-2xl shadow-premium ${activeElementId === el.id ? 'neon-border bg-emerald-500/20' : 'border-white/20 bg-black/60 backdrop-blur-xl'}`}>
                      <span className="text-[14px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">{el.content}</span>
                    </div>
                  ) : (
                    <div className={`w-36 h-36 flex items-center justify-center p-2 rounded-3xl border-2 ${activeElementId === el.id ? 'neon-border bg-emerald-500/20' : 'border-transparent'}`}>
                      <img src={el.content} className="max-w-full max-h-full object-cover" draggable={false} style={{ borderRadius: el.borderRadius || '0' }} />
                    </div>
                  )}
                  {activeElementId === el.id && (
                    <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="absolute -top-12 left-1/2 -translate-x-1/2 p-2.5 bg-red-600 rounded-full text-white shadow-2xl">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls - COMPACT & SMART POSITIONING */}
      <div className={`px-6 py-6 border-t z-[110] bg-zinc-950 border-white/5`}>
        {activeElementId && (
          <div className="mb-6 px-6 py-4 rounded-[28px] bg-black/40 border border-white/5 flex flex-wrap items-center gap-6 shadow-inner animate-fade-in">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">SIZE</span>
              <input
                type="range" min="0.2" max="3" step="0.1"
                value={elements.find(el => el.id === activeElementId)?.scale || 1}
                onChange={(e) => updateElement(activeElementId!, { scale: parseFloat(e.target.value) })}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none accent-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-white/10 shrink-0">
              <button onClick={() => updateElement(activeElementId!, { pos: { x: 30, y: 35 } })} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black neon-text uppercase tracking-tighter">KIRI</button>
              <button onClick={() => updateElement(activeElementId!, { pos: { x: 50, y: 50 } })} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black neon-text uppercase tracking-tighter">TENGAH</button>
              <button onClick={() => updateElement(activeElementId!, { pos: { x: 70, y: 35 } })} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black neon-text uppercase tracking-tighter">KANAN</button>
              <button
                onClick={() => { setCanvasZoom(prev => prev === 1 ? 2.5 : 1); setPanPos({ x: 0, y: 0 }); }}
                className={`p-2.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${canvasZoom > 1 ? 'neon-bg text-black' : 'bg-white/5 text-white'}`}
              >
                ZOOM
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 py-5 rounded-[32px] border-2 bg-zinc-900/40 border-white/5 active:scale-95 transition-all">
            <svg className="w-6 h-6 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[9px] font-black uppercase text-zinc-400">+ LOGO</span>
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
          </button>
          <button onClick={() => { setTempText(''); setShowConfig('text'); }} className="flex flex-col items-center gap-2 py-5 rounded-[32px] border-2 bg-zinc-900/40 border-white/5 active:scale-95 transition-all">
            <svg className="w-6 h-6 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-94.114a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span className="text-[9px] font-black uppercase text-zinc-400">+ NAMA</span>
          </button>
          <button onClick={() => setShowConfig('color')} className="flex flex-col items-center gap-2 py-5 rounded-[32px] border-2 bg-zinc-900/40 border-white/5 active:scale-95 transition-all">
            <svg className="w-6 h-6 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            <span className="text-[9px] font-black uppercase text-zinc-400">BAHAN</span>
          </button>
        </div>

        <div className="flex p-2 rounded-[28px] gap-2 mb-6 border bg-black border-zinc-800">
          {['Depan', 'Belakang', 'Kanan', 'Kiri'].map((v: any) => (
            <button key={v} onClick={() => { onUpdate({ view: v }); setCanvasZoom(1); setPanPos({ x: 0, y: 0 }); }} className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${designData.view === v ? 'neon-bg text-black shadow-2xl' : 'text-zinc-600'}`}>
              {v}
            </button>
          ))}
        </div>

        <button onClick={onNext} className="w-full py-7 neon-bg text-black font-black uppercase tracking-[0.4em] rounded-[40px] shadow-3xl hover:brightness-110 active:scale-95 transition-all">
          REVIEW & PESAN
        </button>
      </div>

      {/* Config Overlays */}
      {showConfig !== 'none' && (
        <div className="absolute inset-0 z-[200] flex flex-col justify-end bg-black/98 backdrop-blur-3xl animate-fade-in">
          <div className="rounded-t-[60px] p-10 w-full max-w-screen-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar shadow-premium bg-zinc-950 border-t border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black uppercase tracking-tighter neon-text">{showConfig === 'color' ? 'Bahan & Warna' : 'Nama Unit'}</h3>
              <button onClick={() => setShowConfig('none')} className="p-4 bg-white/5 rounded-[24px] text-zinc-500 transition-transform active:scale-90"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            {showConfig === 'color' && (
              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 px-4">KATALOG WARNA</p>
                  <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-4">
                    {COLORS.map(c => (
                      <div key={c.hex} className="flex flex-col items-center gap-2">
                        <button onClick={() => onUpdate({ color: c.hex })} className={`w-16 h-16 rounded-[32px] border-4 transition-all shrink-0 ${designData.color === c.hex ? 'neon-border scale-110 shadow-2xl' : 'border-zinc-900'}`} style={{ backgroundColor: c.hex }} />
                        {designData.color === c.hex && <span className="text-[9px] font-black uppercase text-zinc-500 text-center leading-tight">{c.name}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  {MATERIALS.map(m => (
                    <button key={m} onClick={() => onUpdate({ material: m })} className={`w-full p-8 rounded-[40px] border-2 text-left transition-all ${designData.material === m ? 'neon-border bg-emerald-500/5' : 'border-zinc-900 bg-zinc-900/20'}`}>
                      <span className={`text-md font-black uppercase block mb-2 ${designData.material === m ? 'neon-text' : 'text-zinc-600'}`}>{m}</span>
                      <p className="text-xs italic text-zinc-500 leading-relaxed">"{MATERIAL_SPECS[m]?.desc || ''}"</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showConfig === 'text' && (
              <input type="text" value={tempText} onChange={(e) => setTempText(e.target.value)} placeholder="KETIK DISINI..." className="w-full px-10 py-10 rounded-[48px] text-4xl font-black uppercase bg-black border-4 border-zinc-800 text-white text-center outline-none focus:neon-border transition-all" autoFocus />
            )}

            <button onClick={() => { if (showConfig === 'text' && tempText.trim()) addElement('text', tempText.trim()); setShowConfig('none'); }} className="w-full mt-12 py-8 neon-bg text-black font-black uppercase tracking-[0.4em] rounded-[40px] shadow-3xl">KONFIRMASI</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignEditorView;
