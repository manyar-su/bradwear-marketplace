import React, { useState } from 'react';
import { OrderItem, CustomMeasurements } from '../types';
import { SIZES, COLORS } from '../constants';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../lib/siteConfig';

const SummaryView: React.FC = () => {
  const {
    selectedProduct: product,
    designData,
    orderItems,
    setOrderItems,
    handleGoBack: onBack,
    theme,
  } = useStore();

  if (!product) return null;

  const [isSending, setIsSending] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState<number | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [localMeasurements, setLocalMeasurements] = useState<CustomMeasurements>(
    designData.customMeasurements || { tinggi: '', lebarDada: '', panjangLengan: '', kerah: '', manset: '' },
  );

  const totalQty = orderItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const displayCustomName =
    designData.elements?.filter((el) => el.type === 'text').map((el) => el.content).join(', ') || designData.customName;

  const resolveItemColorName = (item: OrderItem) => {
    if (item.colorCode?.trim()) {
      const materialLabel =
        item.catalogMaterial && item.catalogMaterial !== 'Unspecified'
          ? `${item.catalogMaterial
              .replace(/\s*\(Best\s*Seller\)/gi, '')
              .replace(/\s*\(Favorit\)/gi, '')
              .replace(/\s*\(Favorite\)/gi, '')
              .replace(/\s*\(Popular\)/gi, '')} - `
          : '';

      return `${materialLabel}${item.colorCode.trim()}`;
    }

    if (!item.color) return '-';

    const colorObj = COLORS.find(
      (entry) => entry.hex === item.color || entry.name.toLowerCase() === item.color?.toLowerCase(),
    );
    return colorObj?.name || item.color;
  };

  const getItemColorHex = (item: OrderItem) => {
    if (!item.color) return '#888888';
    const colorObj = COLORS.find(
      (entry) => entry.hex === item.color || entry.name.toLowerCase() === item.color?.toLowerCase(),
    );
    return colorObj?.hex || (item.color.startsWith('#') ? item.color : '#888888');
  };

  const getCustomDetail = (item: OrderItem) => item.customDetail?.trim() || '';

  const addNewRow = () => {
    setOrderItems([
      ...orderItems,
      {
        size: 'M',
        quantity: 1,
        gender: 'Pria',
        sleeve: product.category === 'Rompi' ? undefined : 'Panjang',
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        productImage: product.image,
        color: designData.color,
        colorCode: '',
        catalogMaterial: designData.material,
      },
    ]);
  };

  const updateRow = (index: number, updates: Partial<OrderItem>) => {
    const newItems = orderItems.map((item, i) => (i === index ? { ...item, ...updates } : item));
    setOrderItems(newItems);

    if (updates.size === 'Kustom' || updates.size === 'Custom') {
      setShowCustomModal(true);
    }
  };

  const removeRow = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendToCS = () => {
    setIsSending(true);

    setTimeout(() => {
      const detailOrder = orderItems
        .map((item, index) => {
          const sleevePart = product.category === 'Rompi' ? '' : ` | Lengan: ${item.sleeve || 'Pendek'}`;
          const namePart = item.name?.trim() ? `${item.name} | ` : '';
          const modelPart = item.productName ? `Model: ${item.productName} | ` : '';
          const colorPart = ` | Kode/Warna: ${resolveItemColorName(item)}`;
          const customPart = getCustomDetail(item) ? ` | Detail: ${getCustomDetail(item)}` : '';
          return `${index + 1}. ${namePart}${modelPart}${item.size} (${item.gender})${sleevePart}${colorPart}${customPart}: ${item.quantity} pcs`;
        })
        .join('\n');

      const fallbackCustomInfo = orderItems.some(
        (item) => (item.size === 'Kustom' || item.size === 'Custom') && !getCustomDetail(item),
      )
        ? `\n\nDETAIL KUSTOM TAMBAHAN\n- Tinggi: ${localMeasurements.tinggi} cm\n- Lebar Dada: ${localMeasurements.lebarDada} cm\n- Lengan: ${localMeasurements.panjangLengan} cm`
        : '';

      const waMessage =
        `Halo tim Bradwear Indonesia, saya konsumen dari website Bradwear dan ingin memesan ${product.name} custom.\n\n` +
        `DETAIL PESANAN\n` +
        `- Bahan: ${designData.material}\n` +
        `- Warna Visual: ${designData.color}\n` +
        `- Personalisasi: ${displayCustomName || '-'}\n\n` +
        `RINGKASAN ITEM STEP 3\n${detailOrder}${fallbackCustomInfo}\n\n` +
        `TOTAL\n- ${totalQty} pcs\n\n` +
        `Mohon bantuannya untuk estimasi produksi, konfirmasi detail, dan langkah order berikutnya. Terima kasih.`;

      window.open(buildWhatsAppUrl(waMessage), '_blank');
      setIsSending(false);
    }, 1200);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden bg-[var(--surface-subtle)] text-[var(--text-primary)]">
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-4xl space-y-8 rounded-[24px] border border-[var(--border-soft)] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={`rounded-xl p-2 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-200'}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="adaptive-text text-[12px] font-black uppercase tracking-[0.2em]">Ringkasan Pesanan</h1>
            </div>
            <button
              onClick={() => setShowSizeChart(true)}
              className="neon-text border-b border-emerald-500/30 pb-0.5 text-[9px] font-black uppercase tracking-widest"
            >
              Panduan Ukuran
            </button>
          </div>

          <div
            className={`flex items-center gap-6 rounded-[32px] border p-6 shadow-xl ${theme === 'dark' ? 'border-white/5 bg-zinc-900' : 'border-zinc-200 bg-white'}`}
          >
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 shadow-lg">
              <img src={product.image} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="adaptive-text text-xs font-black uppercase tracking-tight">{product.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[8px] font-black uppercase ${theme === 'dark' ? 'neon-bg text-black' : 'bg-zinc-900 text-white'}`}
                >
                  {designData.material}
                </span>
                <div
                  className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{
                    backgroundColor: designData.color,
                    backgroundImage: `url(${COLORS.find((c) => c.hex === designData.color)?.image})`,
                    backgroundSize: 'cover',
                  }}
                />
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="adaptive-text-muted text-[10px] font-black uppercase tracking-widest">Data dari Step 3</h4>
              <span
                className={`rounded-lg px-3 py-1 text-[10px] font-black ${theme === 'dark' ? 'bg-zinc-800 text-[#39FF14]' : 'bg-zinc-200 text-emerald-800'}`}
              >
                Total: {totalQty} pcs
              </span>
            </div>

            <div className="space-y-3">
              {orderItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-5 text-center text-sm text-zinc-500">
                  Belum ada item pesanan yang dibawa dari step 3.
                </div>
              ) : (
                orderItems.map((item, idx) => (
                  <article
                    key={`${item.productId || product.id}-${idx}`}
                    className={`rounded-2xl border p-4 shadow-sm ${theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
                        <img src={item.productImage || product.image} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-sm font-black tracking-tight text-zinc-900">{item.name || `Item ${idx + 1}`}</h5>
                          <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                            {item.size}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          {item.productName || product.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold text-zinc-600">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: getItemColorHex(item) }}
                            />
                            {resolveItemColorName(item)}
                          </span>
                          <span>{item.gender}</span>
                          {item.sleeve ? <span>{item.sleeve}</span> : null}
                          <span>{item.quantity} pcs</span>
                        </div>
                        {getCustomDetail(item) ? (
                          <p className="mt-2 text-[11px] font-medium text-zinc-500">{getCustomDetail(item)}</p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="adaptive-text-muted text-[10px] font-black uppercase tracking-widest">Edit Ringkas</h4>
              <span className="text-[10px] font-semibold text-zinc-500">Ubah ukuran dan jumlah bila masih perlu penyesuaian.</span>
            </div>

            <div className={`overflow-hidden rounded-3xl border shadow-xl ${theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
              <table className="w-full text-left text-[9px] font-black uppercase tracking-widest">
                <thead className={`${theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-100 text-zinc-500'}`}>
                  <tr>
                    <th className="p-4">Ukuran</th>
                    <th className="p-4 text-center">Gender</th>
                    <th className="p-4 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-zinc-100'}`}>
                  {orderItems.map((item, idx) => (
                    <tr key={idx} className="group relative transition-colors">
                      <td className="p-4 font-black">
                        <button
                          onClick={() => setShowSizePicker(idx)}
                          className={`rounded-lg border px-3 py-1.5 transition-all ${theme === 'dark' ? 'border-zinc-800 bg-black text-white' : 'border-zinc-200 bg-white text-zinc-900'}`}
                        >
                          {item.size} v
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => updateRow(idx, { gender: 'Pria' })}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[8px] transition-all ${item.gender === 'L' || item.gender === 'Pria' ? 'neon-bg scale-110 text-black shadow-lg' : theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-200 text-zinc-500'}`}
                          >
                            L
                          </button>
                          <button
                            onClick={() => updateRow(idx, { gender: 'Wanita' })}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[8px] transition-all ${item.gender === 'P' || item.gender === 'Wanita' ? 'neon-bg scale-110 text-black shadow-lg' : theme === 'dark' ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-200 text-zinc-500'}`}
                          >
                            P
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => (item.quantity > 1 ? updateRow(idx, { quantity: item.quantity - 1 }) : removeRow(idx))}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${theme === 'dark' ? 'border-zinc-800 text-zinc-400' : 'border-zinc-300'}`}
                          >
                            -
                          </button>
                          <span className="adaptive-text w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateRow(idx, { quantity: item.quantity + 1 })}
                            className="neon-bg flex h-8 w-8 items-center justify-center rounded-lg text-black shadow-md"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addNewRow}
                className={`adaptive-text-muted hover:adaptive-text w-full border-t py-4 text-[9px] font-black uppercase transition-all ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}
              >
                + Tambah Baris
              </button>
            </div>
          </section>
        </div>
      </main>

      {showSizePicker !== null ? (
        <div
          className="fixed inset-0 z-[600] flex items-end justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowSizePicker(null)}
        >
          <div
            className={`view-transition w-full max-w-screen-md space-y-8 rounded-t-[40px] p-10 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="neon-text text-xl font-black uppercase tracking-tighter">Pilih Ukuran</h3>
              <button onClick={() => setShowSizePicker(null)} className="rounded-xl bg-white/5 p-3 text-zinc-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[...SIZES, 'Custom'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    updateRow(showSizePicker, { size });
                    setShowSizePicker(null);
                  }}
                  className={`rounded-2xl border py-4 text-xs font-black uppercase tracking-widest transition-all ${orderItems[showSizePicker].size === size ? 'neon-bg scale-105 border-transparent text-black' : theme === 'dark' ? 'border-white/5 bg-zinc-900 text-zinc-400' : 'border-zinc-200 bg-zinc-100 text-zinc-600'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showCustomModal ? (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 p-6 backdrop-blur-xl">
          <div className={`w-full max-w-sm space-y-8 rounded-[40px] border p-10 shadow-2xl ${theme === 'dark' ? 'border-white/5 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
            <div className="text-center">
              <h3 className="neon-text text-2xl font-black uppercase tracking-tighter">Kustom Ukuran</h3>
              <p className="adaptive-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">Masukkan detail dalam cm</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { label: 'Tinggi Baju', key: 'tinggi' },
                { label: 'Lebar Dada', key: 'lebarDada' },
                { label: 'Panjang Lengan', key: 'panjangLengan' },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="px-2 text-[8px] font-black uppercase tracking-widest text-zinc-500">{field.label}</label>
                  <input
                    type="number"
                    value={(localMeasurements as Record<string, string>)[field.key]}
                    onChange={(e) => setLocalMeasurements({ ...localMeasurements, [field.key]: e.target.value })}
                    className={`w-full rounded-2xl border-2 p-5 font-black outline-none transition-all focus:neon-border ${theme === 'dark' ? 'border-white/5 bg-black' : 'border-zinc-200 bg-zinc-50'}`}
                    placeholder="Contoh: 72"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowCustomModal(false)}
              className="neon-bg w-full rounded-3xl py-6 text-black shadow-xl transition-all active:scale-95"
            >
              Simpan Ukuran
            </button>
          </div>
        </div>
      ) : null}

      {showSizeChart ? (
        <div
          className="fixed inset-0 z-[700] flex items-center justify-center bg-black/98 p-6 backdrop-blur-2xl"
          onClick={() => setShowSizeChart(false)}
        >
          <div className="flex w-full max-w-screen-md flex-col items-center space-y-10" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-2 text-center">
              <h3 className="neon-text text-3xl font-black uppercase tracking-tighter">Panduan Ukuran</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Cara mengukur yang benar</p>
            </div>

            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[48px] border border-white/10 bg-white/5 shadow-premium">
              <img
                src="https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=600"
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-8">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="neon-bg flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-black">A</div>
                    <p className="text-[10px] font-bold uppercase text-white">Tinggi baju: ukur dari bahu tertinggi sampai bawah.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="neon-bg flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-black">B</div>
                    <p className="text-[10px] font-bold uppercase text-white">Lebar dada: ukur dari ketiak kanan ke ketiak kiri.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="neon-bg flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-black">C</div>
                    <p className="text-[10px] font-bold uppercase text-white">Lengan: ukur dari bahu luar sampai ujung manset.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSizeChart(false)}
              className="rounded-full bg-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-2xl transition-all active:scale-95"
            >
              Mengerti
            </button>
          </div>
        </div>
      ) : null}

      <footer className="sticky bottom-0 z-30 border-t border-[var(--border-soft)] bg-white p-4 shadow-[0_-8px_20px_rgba(15,23,42,0.06)] md:p-5">
        <button
          onClick={handleSendToCS}
          disabled={totalQty === 0 || isSending}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl py-5 font-black uppercase tracking-[0.2em] transition-all ${totalQty === 0 ? 'cursor-not-allowed bg-zinc-900 text-zinc-700' : 'neon-bg text-black shadow-xl hover:brightness-110 active:scale-95'}`}
        >
          {isSending ? 'Memproses...' : 'Konfirmasi WhatsApp'}
        </button>
      </footer>
    </div>
  );
};

export default SummaryView;
