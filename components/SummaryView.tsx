
import React, { useState, useMemo } from 'react';
import { Product, DesignData, OrderItem, CustomerService, CustomMeasurements } from '../types';
import { CS_TEAM, SIZES, COLORS } from '../constants';

interface SummaryViewProps {
  product: Product;
  designData: DesignData;
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  onBack: () => void;
  theme: 'light' | 'dark';
}

const SummaryView: React.FC<SummaryViewProps> = ({
  product,
  designData,
  orderItems,
  setOrderItems,
  onBack,
  theme
}) => {
  const [selectedCS, setSelectedCS] = useState<CustomerService>(CS_TEAM[0]);
  const [isSending, setIsSending] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState<number | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const [localMeasurements, setLocalMeasurements] = useState<CustomMeasurements>(
    designData.customMeasurements || { tinggi: '', lebarDada: '', panjangLengan: '', kerah: '', manset: '' }
  );

  const totalQty = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const displayCustomName = designData.elements?.filter(el => el.type === 'text').map(el => el.content).join(', ') || designData.customName;

  const addNewRow = () => {
    setOrderItems([...orderItems, { size: 'M', quantity: 1, gender: 'L' }]);
  };

  const updateRow = (index: number, updates: Partial<OrderItem>) => {
    const newItems = orderItems.map((item, i) => i === index ? { ...item, ...updates } : item);
    setOrderItems(newItems);

    // Jika user memilih kustom, buka modal kustom
    if (updates.size === 'Kustom') {
      setShowCustomModal(true);
    }
  };

  const removeRow = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendToCS = () => {
    setIsSending(true);
    setTimeout(() => {
      const detailOrder = orderItems.map(i => `${i.size} (${i.gender}): ${i.quantity}pcs`).join(', ');
      const kustomInfo = orderItems.some(i => i.size === 'Kustom')
        ? `\n\nDetail Kustom:\n- Tinggi: ${localMeasurements.tinggi}\n- Lebar Dada: ${localMeasurements.lebarDada}\n- Lengan: ${localMeasurements.panjangLengan}`
        : '';

      const message = `Halo ${selectedCS.name}, saya ingin memesan ${product.name} kustom.\n\nDetail:\n- Bahan: ${designData.material}\n- Warna: ${designData.color}\n- Personalisasi: ${displayCustomName || '-'}\n- Detail Ukuran: ${detailOrder}${kustomInfo}\n- Total Qty: ${totalQty} pcs\n\n(Mohon bantuannya untuk proses produksi)`;
      window.open(`https://wa.me/${selectedCS.phone}?text=${encodeURIComponent(message)}`, '_blank');
      setIsSending(false);
    }, 2000);
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-200'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button>
            <h1 className="text-[12px] font-black uppercase tracking-[0.2em] adaptive-text">RINGKASAN PESANAN</h1>
          </div>
          <button onClick={() => setShowSizeChart(true)} className="text-[9px] font-black neon-text border-b border-emerald-500/30 pb-0.5 uppercase tracking-widest">Panduan Ukuran</button>
        </div>

        <div className={`rounded-[32px] p-6 shadow-xl border flex gap-6 items-center ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}>
          <div className="w-20 h-24 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 shadow-lg border border-white/10">
            <img src={product.image} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-black uppercase text-xs tracking-tight adaptive-text">{product.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${theme === 'dark' ? 'neon-bg text-black' : 'bg-zinc-900 text-white'}`}>{designData.material}</span>
              <div className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{
                backgroundColor: designData.color,
                backgroundImage: `url(${COLORS.find(c => c.hex === designData.color)?.image})`,
                backgroundSize: 'cover'
              }}></div>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black adaptive-text-muted uppercase tracking-widest">TABEL PESANAN</h4>
            <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-zinc-800 text-[#39FF14]' : 'bg-zinc-200 text-emerald-800'}`}>TOTAL: {totalQty} PCS</span>
          </div>

          <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'} shadow-xl`}>
            <table className="w-full text-left text-[9px] font-black uppercase tracking-widest">
              <thead className={`${theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-100 text-zinc-500'}`}>
                <tr>
                  <th className="p-4">UKURAN</th>
                  <th className="p-4 text-center">GENDER</th>
                  <th className="p-4 text-right">JUMLAH</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-zinc-100'}`}>
                {orderItems.map((item, idx) => (
                  <tr key={idx} className="group transition-colors relative">
                    <td className="p-4 font-black">
                      <button onClick={() => setShowSizePicker(idx)} className={`px-3 py-1.5 rounded-lg border transition-all ${theme === 'dark' ? 'border-zinc-800 bg-black text-white' : 'border-zinc-200 bg-white text-zinc-900'}`}>
                        {item.size} ▼
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => updateRow(idx, { gender: 'L' })} className={`w-8 h-8 rounded-lg text-[8px] flex items-center justify-center transition-all ${item.gender === 'L' ? 'neon-bg text-black shadow-lg scale-110' : theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-200 text-zinc-500'}`}>L</button>
                        <button onClick={() => updateRow(idx, { gender: 'P' })} className={`w-8 h-8 rounded-lg text-[8px] flex items-center justify-center transition-all ${item.gender === 'P' ? 'neon-bg text-black shadow-lg scale-110' : theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-200 text-zinc-500'}`}>P</button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => item.quantity > 1 ? updateRow(idx, { quantity: item.quantity - 1 }) : removeRow(idx)} className={`w-8 h-8 rounded-lg border flex items-center justify-center ${theme === 'dark' ? 'border-zinc-800 text-zinc-400' : 'border-zinc-300'}`}>-</button>
                        <span className="w-4 text-center font-bold text-sm adaptive-text">{item.quantity}</span>
                        <button onClick={() => updateRow(idx, { quantity: item.quantity + 1 })} className="w-8 h-8 rounded-lg neon-bg text-black flex items-center justify-center shadow-md">+</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addNewRow} className={`w-full py-4 text-[9px] font-black uppercase adaptive-text-muted hover:adaptive-text transition-all border-t ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>+ TAMBAH BARIS</button>
          </div>
        </section>

        <section className="pb-10">
          <h4 className="text-[10px] font-black adaptive-text-muted uppercase tracking-widest mb-6">SPESIALIS LAYANAN</h4>
          <div className="space-y-4">
            {CS_TEAM.map(cs => (
              <div key={cs.id} onClick={() => setSelectedCS(cs)} className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between cursor-pointer ${selectedCS.id === cs.id ? 'neon-border bg-black/5 shadow-lg' : `${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-100 shadow-sm'}`}`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={cs.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-md" />
                    {cs.isOnline && <div className="absolute -top-1 -right-1 w-4 h-4 neon-bg border-4 border-black rounded-full" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase adaptive-text">{cs.name}</p>
                    <p className={`text-[8px] font-bold ${cs.isOnline ? 'text-green-500' : 'text-zinc-500'}`}>{cs.isOnline ? 'ONLINE' : 'OFFLINE'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal Pemilih Ukuran */}
      {showSizePicker !== null && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-end justify-center" onClick={() => setShowSizePicker(null)}>
          <div className={`w-full max-w-screen-md rounded-t-[40px] p-10 space-y-8 view-transition ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter neon-text">Pilih Ukuran</h3>
              <button onClick={() => setShowSizePicker(null)} className="p-3 bg-white/5 rounded-xl text-zinc-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => { updateRow(showSizePicker, { size: s }); setShowSizePicker(null); }}
                  className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest border transition-all ${orderItems[showSizePicker].size === s ? 'neon-bg text-black border-transparent scale-105' : theme === 'dark' ? 'bg-zinc-900 border-white/5 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Kustom Ukuran */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className={`w-full max-w-sm rounded-[40px] p-10 space-y-8 border shadow-2xl ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`}>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter neon-text">Kustom Ukuran</h3>
              <p className="text-[10px] font-bold adaptive-text-muted mt-1 uppercase tracking-widest">Masukkan detail dalam CM</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { label: 'TINGGI BAJU', key: 'tinggi' },
                { label: 'LEBAR DADA', key: 'lebarDada' },
                { label: 'PANJANG LENGAN', key: 'panjangLengan' }
              ].map(f => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest px-2">{f.label}</label>
                  <input
                    type="number"
                    value={(localMeasurements as any)[f.key]}
                    onChange={(e) => setLocalMeasurements({ ...localMeasurements, [f.key]: e.target.value })}
                    className={`w-full p-5 rounded-2xl border-2 font-black outline-none focus:neon-border transition-all ${theme === 'dark' ? 'bg-black border-white/5' : 'bg-zinc-50 border-zinc-200'}`}
                    placeholder="Contoh: 72"
                  />
                </div>
              ))}
            </div>
            <button onClick={() => setShowCustomModal(false)} className="w-full py-6 neon-bg text-black font-black uppercase tracking-widest rounded-3xl shadow-xl active:scale-95 transition-all">SIMPAN UKURAN</button>
          </div>
        </div>
      )}

      {/* Modal Size Chart */}
      {showSizeChart && (
        <div className="fixed inset-0 z-[700] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowSizeChart(false)}>
          <div className="w-full max-w-screen-md flex flex-col items-center space-y-10" onClick={e => e.stopPropagation()}>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tighter neon-text">PANDUAN UKURAN</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">CARA MENGUKUR YANG BENAR</p>
            </div>

            <div className="w-full max-w-sm aspect-[4/5] rounded-[48px] overflow-hidden bg-white/5 border border-white/10 shadow-premium relative">
              <img
                src="https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=600"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full neon-bg flex items-center justify-center text-black font-black text-[10px] shrink-0">A</div>
                    <p className="text-[10px] text-white font-bold uppercase">TINGGI BAJU: Ukur dari bahu tertinggi sampai bawah.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full neon-bg flex items-center justify-center text-black font-black text-[10px] shrink-0">B</div>
                    <p className="text-[10px] text-white font-bold uppercase">LEBAR DADA: Ukur dari ketiak kanan ke ketiak kiri.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full neon-bg flex items-center justify-center text-black font-black text-[10px] shrink-0">C</div>
                    <p className="text-[10px] text-white font-bold uppercase">LENGAN: Ukur dari bahu luar sampai ujung manset.</p>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowSizeChart(false)} className="px-12 py-5 bg-white text-black font-black uppercase text-[10px] rounded-full tracking-[0.3em] shadow-2xl active:scale-95 transition-all">MENGERTI</button>
          </div>
        </div>
      )}

      <footer className={`p-6 border-t z-50 absolute bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-black border-white/5' : 'bg-white border-zinc-200 shadow-2xl'}`}>
        <button onClick={handleSendToCS} disabled={totalQty === 0 || isSending} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${totalQty === 0 ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' : 'neon-bg text-black hover:brightness-110 active:scale-95 shadow-xl'}`}>
          {isSending ? 'MEMPROSES...' : 'KONFIRMASI WHATSAPP'}
        </button>
      </footer>
    </div>
  );
};

export default SummaryView;
