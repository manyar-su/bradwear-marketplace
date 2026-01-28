
import React, { useState } from 'react';
import { Product, DesignData, OrderItem, CustomerService } from '../types';
import { CS_TEAM } from '../constants';

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

  const totalQty = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const updateQty = (size: string, delta: number) => {
    setOrderItems(prev => prev.map(item => 
      item.size === size 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ));
  };

  const handleSendToCS = () => {
    setIsSending(true);
    setTimeout(() => {
      const message = `Halo ${selectedCS.name}, saya ingin memesan ${product.name} custom.\n\nDetail:\n- Bahan: ${designData.material}\n- Warna: ${designData.color}\n- Total Qty: ${totalQty} pcs\n\n(File PDF terlampir di sistem Bradermock)`;
      window.open(`https://wa.me/${selectedCS.phone}?text=${encodeURIComponent(message)}`, '_blank');
      setIsSending(false);
    }, 2000);
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <header className={`px-6 py-4 flex items-center justify-between border-b sticky top-0 z-10 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
          <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest">Ringkasan Pesanan</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className={`rounded-3xl p-6 shadow-sm border flex gap-6 items-center ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
          <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-100 flex-shrink-0">
             <div 
               className="w-full h-full"
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
          </div>
          <div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-xs text-zinc-500 mt-1">{designData.material} • {designData.color}</p>
            {designData.customName && <p className="text-[10px] text-yellow-600 font-bold mt-2">Custom Nama: {designData.customName}</p>}
          </div>
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Kuantitas per Ukuran</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>Total: {totalQty} pcs</span>
          </div>
          <div className="space-y-3">
            {orderItems.map(item => (
              <div key={item.size} className={`px-5 py-4 rounded-2xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
                <span className="font-bold">Size {item.size}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => updateQty(item.size, -1)} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${theme === 'dark' ? 'border-zinc-600 text-zinc-400 hover:bg-zinc-700' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-100'}`}>-</button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.size, 1)} className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-yellow-500 dark:text-black flex items-center justify-center text-white">+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Pilih Customer Service</h4>
          <div className="space-y-3">
            {CS_TEAM.map(cs => (
              <div key={cs.id} onClick={() => setSelectedCS(cs)} className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${selectedCS.id === cs.id ? 'border-yellow-500 bg-yellow-50/50' : `${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={cs.avatar} className="w-10 h-10 rounded-full object-cover" />
                    {cs.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{cs.name}</p>
                    <p className="text-[10px] text-zinc-400">{cs.isOnline ? 'Aktif' : 'Sibuk'}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCS.id === cs.id ? 'border-yellow-500' : 'border-zinc-200'}`}>{selectedCS.id === cs.id && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={`p-6 border-t ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <button onClick={handleSendToCS} disabled={totalQty === 0 || isSending} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${totalQty === 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-600 shadow-xl shadow-yellow-500/20 active:scale-95'}`}>
          {isSending ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Mengirim Desain...</span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.075L0 24l6.117-1.605A11.803 11.803 0 0012.05 24.01h.005c6.632 0 12.042-5.408 12.046-12.044a11.83 11.83 0 00-3.417-8.485z"/></svg>
              <span>Hubungi Customer Service</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default SummaryView;
