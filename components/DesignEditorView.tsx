
import React, { useState, useRef } from 'react';
import { Product, DesignData } from '../types';
import { MATERIALS, COLORS } from '../constants';

interface DesignEditorViewProps {
  product: Product;
  designData: DesignData;
  onUpdate: (data: Partial<DesignData>) => void;
  onBack: () => void;
  onNext: () => void;
  theme: 'light' | 'dark';
}

const DesignEditorView: React.FC<DesignEditorViewProps> = ({ 
  product, 
  designData, 
  onUpdate, 
  onBack, 
  onNext,
  theme
}) => {
  const [showConfig, setShowConfig] = useState<'none' | 'color' | 'text'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        onUpdate({ logoUrl: readerEvent.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      {/* Header */}
      <header className={`px-6 py-4 flex items-center justify-between border-b sticky top-0 z-10 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest">Desain {product.category}</h1>
        <button onClick={onNext} className="text-xs font-bold text-yellow-600 hover:text-yellow-700">SIMPAN</button>
      </header>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className={`relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-inner flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
          <div className="relative w-4/5 h-4/5 flex items-center justify-center">
             <div 
               className="w-full h-full relative"
               style={{ 
                 backgroundColor: designData.color,
                 maskImage: `url(${product.image})`,
                 WebkitMaskImage: `url(${product.image})`,
                 maskSize: 'contain',
                 maskRepeat: 'no-repeat',
                 maskPosition: 'center',
                 mixBlendMode: 'multiply'
               }}
             />
             <img 
               src={product.image} 
               alt="Shirt Outline" 
               className="absolute top-0 left-0 w-full h-full object-contain opacity-40 mix-blend-overlay" 
             />

             <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full">
                  {designData.customName && (
                    <div className="absolute top-[38%] left-[58%] bg-white/10 px-1 border border-zinc-900/10 rounded">
                       <span className="text-[8px] font-bold text-zinc-800" style={{ color: designData.color === '#000000' ? 'white' : 'black' }}>
                         {designData.customName}
                       </span>
                    </div>
                  )}
                  {designData.logoUrl && (
                    <div className="absolute top-[42%] left-[58%] w-12 h-12 bg-white/20 rounded flex items-center justify-center p-1 border border-zinc-900/5">
                      <img src={designData.logoUrl} className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="absolute top-4 left-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-zinc-500 shadow-sm uppercase tracking-tighter">
            Tampilan: {designData.view}
          </div>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar max-w-full px-4">
          {['Depan', 'Belakang', 'Lengan Kanan', 'Lengan Kiri'].map((v: any) => (
            <button
              key={v}
              onClick={() => onUpdate({ view: v })}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                designData.view === v ? 'bg-zinc-900 dark:bg-yellow-500 dark:text-black text-white' : `${theme === 'dark' ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'bg-white text-zinc-500 border-zinc-200'} border`
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className={`rounded-t-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => fileInputRef.current?.click()} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700 hover:border-yellow-500' : 'bg-zinc-50 border-zinc-100 hover:border-yellow-200'}`}>
            <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-yellow-500 flex items-center justify-center text-white dark:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-[10px] font-bold">Logo</span>
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/png" />
          </button>
          <button onClick={() => setShowConfig('text')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700 hover:border-yellow-500' : 'bg-zinc-50 border-zinc-100 hover:border-yellow-200'}`}>
            <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-yellow-500 flex items-center justify-center text-white dark:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <span className="text-[10px] font-bold">Nama</span>
          </button>
          <button onClick={() => setShowConfig('color')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700 hover:border-yellow-500' : 'bg-zinc-50 border-zinc-100 hover:border-yellow-200'}`}>
            <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-yellow-500 flex items-center justify-center text-white dark:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            </div>
            <span className="text-[10px] font-bold">Warna</span>
          </button>
        </div>
        <button onClick={onNext} className="w-full mt-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl shadow-xl shadow-yellow-500/20 transition-all active:scale-95">
          Lanjutkan
        </button>
      </div>

      {/* Pop-up Config Panels */}
      {showConfig !== 'none' && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/40 backdrop-blur-[2px]">
          <div className={`rounded-t-[40px] p-8 animate-slide-up ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">
                {showConfig === 'color' ? 'Pilih Warna & Bahan' : 'Tambah Nama'}
              </h3>
              <button onClick={() => setShowConfig('none')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {showConfig === 'color' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Warna Dasar</p>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar">
                    {COLORS.map(c => (
                      <button key={c.hex} onClick={() => onUpdate({ color: c.hex })} className={`w-10 h-10 rounded-full border-2 transition-all shrink-0 ${designData.color === c.hex ? 'border-yellow-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Bahan Kain</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {MATERIALS.map(m => (
                      <button key={m} onClick={() => onUpdate({ material: m })} className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all ${designData.material === m ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700' : 'border-zinc-100 dark:border-zinc-700 text-zinc-500'}`}>{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {showConfig === 'text' && (
              <div className="space-y-4">
                <input type="text" value={designData.customName || ''} onChange={(e) => onUpdate({ customName: e.target.value })} placeholder="Ketik nama (Contoh: Budi S.)" className={`w-full px-5 py-4 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-yellow-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`} autoFocus />
                <p className="text-[10px] text-zinc-400 text-center italic">*Teks akan otomatis diletakkan di atas saku.</p>
              </div>
            )}
            <button onClick={() => setShowConfig('none')} className={`w-full mt-8 py-4 font-bold rounded-2xl ${theme === 'dark' ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-white'}`}>Simpan Perubahan</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignEditorView;
