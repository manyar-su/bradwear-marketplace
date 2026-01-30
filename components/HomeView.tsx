
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category, WorkflowStage, CustomerService } from '../types';
import { CLIENT_LOGOS, CS_TEAM, TESTIMONIALS, FAQS, RANDOM_ORDERS } from '../constants';

interface HomeViewProps {
  products: Product[];
  workflowStages: WorkflowStage[];
  orderCode: string;
  branding: { title: string; subtitle: string };
  onSelectProduct: (product: Product) => void;
  theme: 'light' | 'dark';
}

const HomeView: React.FC<HomeViewProps> = ({ products, workflowStages, orderCode, branding, onSelectProduct, theme }) => {
  const [activeTab, setActiveTab] = useState<Category>('Kemeja');
  const [selectedCatalog, setSelectedCatalog] = useState<Product | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'voucher' | 'guide' | 'tracking' | 'help' | 'cs-choice'>('none');
  const [currentNotification, setCurrentNotification] = useState<typeof RANDOM_ORDERS[0] | null>(null);
  const [currentResi, setCurrentResi] = useState<string | null>(null);
  const [promoSlide, setPromoSlide] = useState(0);

  const filteredProducts = products.filter(p => p.category === activeTab && !p.isHidden);

  const promoSlides = [
    { title: "BORDIR KOMPUTER", desc: "Detail tajam dengan mesin Jepang terbaru.", img: "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?auto=format&fit=crop&q=80&w=600", tag: "PRESIISI" },
    { title: "NAGATA DRILL", desc: "Bahan adem, lembut, & tidak mudah luntur.", img: "https://images.unsplash.com/photo-1598501479155-02b03362691b?auto=format&fit=crop&q=80&w=600", tag: "FAVORIT" },
    { title: "STANDAR TAILOR", desc: "Jahitan rapi & kuat kualitas ekspor.", img: "https://images.unsplash.com/photo-1558191053-8edcb01e1da3?auto=format&fit=crop&q=80&w=600", tag: "KUALITAS" },
    { title: "DESAIN BEBAS", desc: "Kustomisasi penuh warna & atribut unit.", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600", tag: "KREATIF" },
    { title: "HARGA PABRIK", desc: "Produksi tangan pertama, lebih hemat.", img: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=600", tag: "MURAH" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeModal === 'tracking') {
      const savedResi = localStorage.getItem(`bradwear_resi_${orderCode}`);
      setCurrentResi(savedResi);
    }
  }, [activeModal, orderCode]);

  useEffect(() => {
    const showNotification = () => {
      const randomOrder = RANDOM_ORDERS[Math.floor(Math.random() * RANDOM_ORDERS.length)];
      setCurrentNotification(randomOrder);
      setTimeout(() => setCurrentNotification(null), 10000); 
    };
    const interval = setInterval(showNotification, 60000); 
    return () => clearInterval(interval);
  }, []);

  const liveProductionList = useMemo(() => {
    const agencies = ['DISHUB', 'POLRI', 'TNI AD', 'BASARNAS', 'DAMKAR', 'KEMENHUB', 'SATPOL PP', 'BPBD', 'DINKES'];
    const stages = ['CUTTING', 'SEWING', 'QC CHECK', 'PACKING', 'EMBROIDERY', 'PATTERN'];
    
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      const randomCode = Math.floor(Math.random() * (1700 - 1600 + 1)) + 1600;

      return {
        client: agencies[Math.floor(Math.random() * agencies.length)] + ' ' + (['JABAR', 'METRO', 'DKI', 'PUSAT', 'PROV', 'UNIT'][Math.floor(Math.random() * 6)]),
        stage: stages[Math.floor(Math.random() * stages.length)],
        cs: CS_TEAM[Math.floor(Math.random() * CS_TEAM.length)]?.name || 'Admin',
        time: formattedDate,
        code: randomCode
      };
    });
  }, []);

  const currentStage = useMemo(() => {
    return workflowStages.find(s => s.status === 'current') || 
           workflowStages.slice().reverse().find(s => s.status === 'completed') || 
           workflowStages[0];
  }, [workflowStages]);

  const handleCSChoice = (cs: CustomerService) => {
    window.open(`https://wa.me/${cs.phone}?text=Halo%20${cs.name},%20saya%20tertarik%20konsultasi%20pemesanan%20kustom%20Bradwear.`, '_blank');
    setActiveModal('none');
  };

  return (
    <div className={`flex flex-col flex-shrink-0 no-scrollbar pb-40 ${theme === 'dark' ? 'bg-black' : 'bg-zinc-50'}`}>
      {/* Popups */}
      {currentNotification && (
        <div className="fixed bottom-32 left-6 right-6 z-[200] animate-notification pointer-events-none">
          <div className="glass p-4 rounded-2xl flex items-center gap-4 shadow-2xl border-emerald-500/20 max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-full neon-bg flex items-center justify-center shrink-0 shadow-lg">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase neon-text tracking-widest">INFO TERBARU!</p>
              <p className={`text-[9px] font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                <span className="neon-text font-black">{currentNotification.user}</span> baru saja memesan {currentNotification.qty}pcs {currentNotification.product}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Standar Industri */}
      <div className="px-6 py-6">
        <div className="w-full aspect-[16/7] rounded-[40px] overflow-hidden relative shadow-premium group border border-white/5 animate-breathe">
          <img src="https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Banner-Bradwear.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-10">
            <h4 className="text-white text-2xl font-black leading-tight uppercase tracking-tighter">STANDAR<br/><span className="neon-text">INDUSTRI</span></h4>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase shadow-lg">Toko Resmi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Hub */}
      <div className="px-6 py-2">
        <div className="flex justify-between items-center gap-6 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'voucher', label: 'VOUCHER', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
            { id: 'guide', label: 'PANDUAN', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { id: 'tracking', label: 'LACAK', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
            { id: 'help', label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((action, i) => (
            <button key={i} onClick={() => setActiveModal(action.id as any)} className="flex flex-col items-center gap-3 shrink-0 group">
              <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all group-active:scale-90 ${theme === 'dark' ? 'bg-zinc-900 neon-text border border-white/10' : 'bg-white text-emerald-900 border border-zinc-200 shadow-md'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={action.icon} /></svg>
              </div>
              <span className="text-[8px] font-black adaptive-text-muted uppercase tracking-[0.2em]">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status Widget */}
      <div className="px-6 py-4">
        <div 
          onClick={() => setActiveModal('tracking')}
          className={`p-5 rounded-[28px] border flex items-center justify-between glass cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200 shadow-md'}`}
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <div className="w-2.5 h-2.5 rounded-full neon-bg animate-pulse"></div>
             </div>
             <div>
                <p className="text-[8px] font-black uppercase tracking-widest adaptive-text-muted mb-0.5">Pesanan Anda ({orderCode})</p>
                <p className="text-[11px] font-extrabold uppercase tracking-tight adaptive-text">Status: <span className="neon-text">{(currentStage.label === 'Shipping' ? 'Dikirim' : currentStage.label)}</span></p>
             </div>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className="text-[8px] font-black neon-text uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">LACAK</span>
            <svg className="w-4 h-4 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>

      {/* NEW Slideshow Promosi Menarik (Di atas Katalog) */}
      <div className="px-6 py-6 overflow-hidden">
        <div className="relative w-full aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl group border border-white/5">
           {promoSlides.map((slide, idx) => (
             <div 
                key={idx} 
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === promoSlide ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-110 pointer-events-none'}`}
             >
                <img src={slide.img} className="w-full h-full object-cover brightness-50" />
                <div className="absolute inset-0 flex flex-col justify-center px-10 space-y-2">
                   <div className="inline-block px-3 py-1 bg-white text-black text-[7px] font-black rounded-full w-fit uppercase tracking-widest animate-pulse">{slide.tag}</div>
                   <h5 className="text-white text-xl font-black uppercase tracking-tight leading-none">{slide.title}</h5>
                   <p className="text-zinc-300 text-[9px] font-medium leading-tight max-w-[70%]">{slide.desc}</p>
                </div>
             </div>
           ))}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {promoSlides.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === promoSlide ? 'w-6 neon-bg' : 'w-2 bg-white/20'}`} />
              ))}
           </div>
        </div>
      </div>

      {/* Catalog */}
      <main className="px-6 space-y-8 mt-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          {(['Kemeja', 'Jaket', 'Celana', 'Rompi'] as Category[]).map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeTab === cat ? 'neon-bg text-black neon-border' : theme === 'dark' ? 'bg-zinc-900/50 text-zinc-500 border-white/5' : 'bg-white text-zinc-400 border-zinc-200 shadow-sm'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          {filteredProducts.map(product => (
            <div key={product.id} className={`rounded-[40px] p-4 border shadow-md group transition-all relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-zinc-200'}`}>
              <div onClick={() => setSelectedCatalog(product)} className="aspect-[4/5] rounded-[32px] overflow-hidden bg-zinc-800/50 mb-4 cursor-zoom-in">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="px-1 space-y-1">
                <h3 className="text-xs font-black uppercase line-clamp-1 adaptive-text">{product.name}</h3>
                <p className="text-[9px] font-bold adaptive-text-muted mb-3"><span className="neon-text">{product.soldCount.toLocaleString()}+</span> TERJUAL</p>
                <button onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl bg-zinc-900 text-white hover:neon-bg hover:text-black transition-all">KUSTOM</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 30 Days Log (Moved Below Catalog) */}
      <div className="px-6 py-12 space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full neon-bg"></div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] adaptive-text">LOG AKTIVITAS (30 HARI TERAKHIR)</h5>
          </div>
        </div>
        <div className={`rounded-[28px] border glass p-2 divide-y overflow-y-auto no-scrollbar max-h-[225px] ${theme === 'dark' ? 'border-white/5 divide-white/5' : 'border-zinc-200 divide-zinc-100 shadow-md'}`}>
          {liveProductionList.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5">
              <div className="flex items-center gap-4">
                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-zinc-100 border-zinc-200'}`}>
                    <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-[9px] font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{item.client}</p>
                      <span className="text-[8px] font-black neon-text bg-emerald-500/10 px-1.5 py-0.5 rounded">ID: {item.code}</span>
                    </div>
                    <p className="text-[8px] font-bold adaptive-text-muted uppercase tracking-widest">TAHAP: <span className="neon-text">{item.stage}</span> • {item.cs}</p>
                 </div>
              </div>
              <span className="text-[7px] font-black adaptive-text-muted uppercase text-right">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <section className="mt-8 px-6 space-y-6">
        <div className="text-center">
           <p className="text-[9px] font-black neon-text uppercase tracking-[0.4em]">CERITA PELANGGAN</p>
           <h4 className="text-2xl font-black uppercase tracking-tighter adaptive-text">Apa Kata Mereka</h4>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4">
          {TESTIMONIALS.map((testi, idx) => (
            <div key={idx} className="glass p-6 rounded-[32px] shrink-0 w-72 space-y-4 shadow-xl border border-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black uppercase bg-zinc-900 text-white">{testi.agency.substring(0,2)}</div>
                  <div>
                    <p className={`text-[10px] font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{testi.name}</p>
                    <p className="text-[8px] font-bold neon-text uppercase tracking-widest">{testi.agency}</p>
                  </div>
               </div>
               <p className="text-xs adaptive-text-muted font-medium italic leading-relaxed">"{testi.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION: Consultation */}
      <section className="mt-12 px-6">
        <div className={`p-10 rounded-[48px] border glass relative overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-[0_40px_100px_rgba(191,255,0,0.25)] animate-breathe ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
          <div className="absolute -top-12 -right-12 w-64 h-64 neon-bg opacity-10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 neon-bg opacity-5 rounded-full blur-[60px]"></div>
          <div className="relative z-10 text-center space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-black neon-text uppercase tracking-[0.5em] px-4 py-1.5 rounded-full border border-[#BFFF00]/20 bg-[#BFFF00]/5 inline-block animate-pulse">Konsultasi Prioritas</span>
              <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Wujudkan Seragam<br/><span className="neon-text italic tracking-normal">Impian Unit Anda</span></h2>
              <p className="text-xs font-medium adaptive-text-muted leading-relaxed px-4 opacity-80">Hubungi tim ahli kami untuk mendapatkan penawaran harga terbaik dan bantuan kustomisasi desain instansi Anda.</p>
            </div>
            <button 
              onClick={() => setActiveModal('cs-choice')} 
              className="w-full py-6 neon-bg text-black font-black uppercase tracking-[0.3em] rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-[1.05] active:scale-95 transition-all duration-500 group-hover:brightness-110"
            >
              CHAT KONSULTAN SEKARANG
            </button>
            <div className="flex items-center justify-center gap-2 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full neon-bg animate-ping"></div>
               <p className="text-[8px] font-bold neon-text uppercase tracking-widest">Admin Online Siap Membantu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="mt-24 px-6 space-y-8 pb-10">
        <div className="text-center">
          <p className="text-[9px] font-black adaptive-text-muted uppercase tracking-[0.4em]">KEPERCAYAAN INSTANSI</p>
          <h4 className="text-xl font-black uppercase tracking-tighter adaptive-text">Our Strategic Partners</h4>
        </div>
        <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-[2000ms] pb-10">
           {CLIENT_LOGOS.map((client, idx) => (
             <div key={idx} className="w-12 h-12 flex items-center justify-center filter drop-shadow-md">
                <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
             </div>
           ))}
        </div>
        <div className="text-center pt-6 border-t border-white/5 opacity-40">
           <p className="text-[8px] font-black adaptive-text-muted uppercase tracking-[0.5em] leading-relaxed italic">
             CV. BRADWEAR INDONESIA GROUP<br/>
             © 2024 MANUFACTURE SOLUTIONS
           </p>
        </div>
      </section>

      {/* Modals Container */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setActiveModal('none')}>
          <div className="w-full max-w-sm glass rounded-[48px] flex flex-col max-h-[85vh] view-transition shadow-premium border border-white/10" onClick={e => e.stopPropagation()}>
            <div className={`flex justify-between items-center p-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
              <h3 className="text-xl font-black uppercase tracking-tighter neon-text">
                {activeModal === 'cs-choice' ? 'PILIH KONSULTAN' : activeModal.toUpperCase().replace('-', ' ')}
              </h3>
              <button onClick={() => setActiveModal('none')} className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto no-scrollbar space-y-6">
              {activeModal === 'cs-choice' && (
                <div className="grid grid-cols-1 gap-4">
                  <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest px-2">TIM BRADWEAR SIAP MELAYANI:</p>
                  {CS_TEAM.map(cs => (
                    <button key={cs.id} onClick={() => handleCSChoice(cs)} className={`p-4 rounded-[32px] border-2 transition-all flex items-center gap-5 group hover:border-emerald-500/40 active:scale-95 ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-zinc-100'}`}>
                      <div className="relative shrink-0">
                        <img src={cs.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/10" />
                        {cs.isOnline && <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 neon-bg rounded-full border-4 border-black shadow-[0_0_10px_#BFFF00]" />}
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-black uppercase adaptive-text group-hover:neon-text transition-colors">{cs.name}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Expert Consultant</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {activeModal === 'guide' && (
                <div className="space-y-8">
                   {[1,2,3,4].map(num => (
                     <div key={num} className="flex gap-6 items-start">
                        <div className="w-10 h-10 rounded-2xl neon-bg flex items-center justify-center text-black font-black text-sm shrink-0 shadow-xl">{num}</div>
                        <p className="text-xs adaptive-text font-bold leading-relaxed uppercase tracking-widest">
                          {num === 1 ? 'Pilih model pakaian premium dari Katalog.' : 
                           num === 2 ? 'Kustomisasi logo & bahan di Editor BradEngine.' : 
                           num === 3 ? 'Review ringkasan ukuran & total di Summary.' : 
                           'Konfirmasi WhatsApp untuk verifikasi & produksi.'}
                        </p>
                     </div>
                   ))}
                </div>
              )}
              {activeModal === 'tracking' && (
                <div className="space-y-8">
                   <div className="p-6 rounded-[28px] border text-center glass border-emerald-500/10 shadow-inner">
                      <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">SINKRONISASI AKTIF</p>
                      <h4 className="text-lg font-black uppercase tracking-tight neon-text">ORDER #{orderCode}</h4>
                      <p className="text-[9px] font-bold adaptive-text mt-2 uppercase">TAHAP: {(currentStage.label === 'Shipping' ? 'DIKIRIM' : currentStage.label.toUpperCase())}</p>
                   </div>
                   <div className="space-y-4">
                      {workflowStages.map(s => (
                        <div key={s.id} className="flex items-center gap-4">
                           <div className={`w-3.5 h-3.5 rounded-full border-2 ${s.status === 'completed' ? 'neon-bg border-transparent shadow-[0_0_10px_rgba(191,255,0,0.5)]' : s.status === 'current' ? 'neon-border border-2 animate-pulse' : 'border-zinc-800'}`}></div>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${s.status !== 'pending' ? 'adaptive-text' : 'adaptive-text-muted opacity-50'}`}>{s.label.toUpperCase()}</p>
                        </div>
                      ))}
                   </div>
                   {currentResi && (
                     <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">NOMOR RESI KURIR</p>
                        <p className="text-xs font-black neon-text uppercase">{currentResi}</p>
                     </div>
                   )}
                </div>
              )}
              {activeModal === 'help' && (
                <div className="space-y-8">
                   {FAQS.map((f, i) => (
                    <div key={i} className="space-y-2 group">
                       <p className="text-xs font-black neon-text uppercase tracking-tight group-hover:translate-x-1 transition-transform">Q: {f.q}</p>
                       <p className="text-[11px] font-medium adaptive-text-muted leading-relaxed opacity-80">A: {f.a}</p>
                    </div>
                   ))}
                </div>
              )}
              {activeModal === 'voucher' && (
                <div className="py-16 text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 mx-auto flex items-center justify-center">
                      <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Belum ada promo tersedia saat ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Catalog Detail Modal */}
      {selectedCatalog && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-screen-md h-full flex flex-col relative no-scrollbar">
            <button onClick={() => setSelectedCatalog(null)} className="absolute top-0 right-0 z-50 w-14 h-14 rounded-3xl bg-white/5 backdrop-blur flex items-center justify-center text-white border border-white/10 shadow-2xl active:scale-90">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex-1 overflow-y-auto no-scrollbar py-20 px-4 space-y-16">
              <div className="text-center space-y-4">
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter pt-4 animate-fade-in">{selectedCatalog.name}</h3>
                <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.5em] opacity-60 animate-pulse tracking-widest">INDUSTRIAL WEAR SOLUTIONS</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="rounded-[60px] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] bg-zinc-900">
                  <img src={selectedCatalog.images?.front || selectedCatalog.image} className="w-full h-full object-cover" />
                </div>
                <div className="rounded-[60px] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] bg-zinc-900">
                  <img src={selectedCatalog.images?.back || selectedCatalog.image} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="p-12 glass rounded-[60px] space-y-12 border border-white/10 shadow-premium text-center">
                <p className="text-zinc-400 text-lg font-medium italic leading-relaxed">"{selectedCatalog.description}"</p>
                <button onClick={() => { onSelectProduct(selectedCatalog); setSelectedCatalog(null); }} className="w-full py-8 neon-bg text-black font-black uppercase tracking-[0.5em] rounded-[40px] shadow-2xl active:scale-95 transition-all hover:scale-[1.02] hover:brightness-110">LANJUT KE DESAIN</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
