
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category, WorkflowStage, ProductionOrder } from '../types';
import { RANDOM_ORDERS, TESTIMONIALS, FAQS } from '../constants';
import { ASSETS } from '../assets';
import { useRef } from 'react';
import OptimizedImage from './OptimizedImage';
import DynamicFolderGallery from './DynamicFolderGallery';

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

  useEffect(() => {
    if (selectedCatalog) {
      const fetchImages = async () => {
        const paths = [
          `catalog/${selectedCatalog.id}`,
          `catalog/${selectedCatalog.name}`,
          `Model Kemeja/${selectedCatalog.name}`
        ];
        let found: string[] = [];
        for (const p of paths) {
          const list = await import('../utils/supabaseService').then(m => m.listImagesInFolder(p));
          if (list.length > 0) found = [...found, ...list];
        }
        setCatalogImages(Array.from(new Set(found)));
      };
      fetchImages();
    } else {
      setCatalogImages([]);
    }
  }, [selectedCatalog]);
  const [activeModal, setActiveModal] = useState<'none' | 'voucher' | 'guide' | 'tracking' | 'help'>('none');
  const [currentNotification, setCurrentNotification] = useState<typeof RANDOM_ORDERS[0] | null>(null);
  const [currentResi, setCurrentResi] = useState<string | null>(null);
  const [promoSlide, setPromoSlide] = useState(0);
  const [catalogImages, setCatalogImages] = useState<string[]>([]);
  const [showAboutContent, setShowAboutContent] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Cek apakah ada order aktif di localStorage untuk user ini
  const hasActiveOrder = useMemo(() => {
    const savedOrders = localStorage.getItem('bradwear_production_orders');
    if (!savedOrders) return false;
    const orders: ProductionOrder[] = JSON.parse(savedOrders);
    return orders.some(o => o.orderCode === orderCode);
  }, [orderCode]);

  const filteredProducts = products.filter(p => p.category === activeTab && !p.isHidden);

  // Dynamic video from assets/video folder
  const videoGlob = import.meta.glob('../assets/video/*.(mp4|webm|mov)', { eager: true, as: 'url' });
  const videoFiles = Object.values(videoGlob) as string[];
  const heroVideo = videoFiles[0]; // Use first video found

  // Dynamic slideshow images from assets/slideshow folder
  const slideshowGlob = import.meta.glob('../assets/slideshow/*.(jpg|jpeg|png|webp)', { eager: true, as: 'url' });
  const slideshowImages = Object.values(slideshowGlob) as string[];

  const promoSlides = [
    { title: "PRODUKSI MASAL", desc: "Kapasitas ribuan pcs per bulan dengan QC ketat.", img: slideshowImages[0] || "https://images.unsplash.com/photo-1558191053-8edcb01e1da3?auto=format&fit=crop&q=80&w=800", tag: "KAPASITAS" },
    { title: "BORDIR KOMPUTER", desc: "Detail tajam dengan mesin Jepang terbaru.", img: slideshowImages[1] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800", tag: "PRESISI" },
    { title: "NAGATA DRILL", desc: "Bahan adem, lembut, & tidak mudah luntur.", img: slideshowImages[2] || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800", tag: "FAVORIT" },
    { title: "STANDAR TAILOR", desc: "Jahitan rapi & kuat kualitas ekspor.", img: slideshowImages[3] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", tag: "KUALITAS" },
    { title: "BANYAK INSTANSI", desc: "Dipercaya ratusan instansi di seluruh Indonesia.", img: slideshowImages[4] || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", tag: "KEPERCAYAAN" },
    { title: "MANUFAKTUR MODERN", desc: "Proses produksi cepat dengan teknologi terkini.", img: slideshowImages[5] || "https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?auto=format&fit=crop&q=80&w=800", tag: "MODERN" },
    { title: "HARGA PABRIK", desc: "Produksi tangan pertama, lebih hemat biaya.", img: slideshowImages[6] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800", tag: "EKONOMIS" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

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



  return (
    <div className={`flex flex-col flex-shrink-0 no-scrollbar pb-40 ${theme === 'dark' ? 'bg-black' : 'bg-zinc-50'}`}>
      {/* Popups */}
      {currentNotification && (
        <div className="fixed bottom-32 left-6 right-6 z-[200] animate-notification pointer-events-none">
          <div className="glass p-4 rounded-2xl flex items-center gap-4 shadow-2xl border-emerald-500/20 max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-full neon-bg flex items-center justify-center shrink-0 shadow-lg">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p className={`text-[9px] font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-600'}`}>
              <span className="neon-text font-black">{currentNotification.user}</span> baru saja memesan {currentNotification.qty}pcs {currentNotification.product}
            </p>
          </div>
        </div>
      )}

      {/* Hero Standar Industri */}
      <div className="px-6 py-6" id="home-top">
        <div className="w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[16/7] rounded-[40px] overflow-hidden relative shadow-premium group border border-white/5 animate-breathe">
          <img src={ASSETS.BRAND.HERO} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-10">
            <h4 className="text-white text-2xl font-black leading-tight uppercase tracking-tighter">STANDAR<br /><span className="neon-text">INDUSTRI</span></h4>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase shadow-lg">Bradwear Officials</span>
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

      {/* Status Widget (Conditional Logic) */}
      <div className="px-6 py-4">
        {hasActiveOrder ? (
          <div
            onClick={() => setActiveModal('tracking')}
            className={`p-6 rounded-[32px] border flex items-center justify-between glass cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200 shadow-md'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <div className="w-3 h-3 rounded-full neon-bg animate-pulse"></div>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest adaptive-text-muted mb-0.5">Pesanan Anda (#{orderCode})</p>
                <p className="text-[12px] font-extrabold uppercase tracking-tight adaptive-text">Status: <span className="neon-text">{(currentStage.label === 'Shipping' ? 'Dikirim' : currentStage.label)}</span></p>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="text-[9px] font-black neon-text uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg">DETAIL</span>
              <svg className="w-5 h-5 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        ) : (
          <div
            onClick={scrollToCatalog}
            className={`p-6 rounded-[32px] border flex items-center gap-5 glass cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${theme === 'dark' ? 'border-white/10 bg-gradient-to-r from-zinc-900/50 to-transparent' : 'border-zinc-200 bg-white shadow-lg'}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 border border-white/5">
              <svg className="w-6 h-6 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black adaptive-text uppercase leading-tight">Anda belum memesan,</p>
              <p className="text-[9px] font-bold neon-text uppercase tracking-widest">Silakan kustom desain kemeja anda</p>
            </div>
            <div className="w-8 h-8 rounded-full neon-bg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        )}
      </div>

      {/* NEW Slideshow Promosi Menarik (Di atas Katalog) */}
      <div className="px-6 py-4 overflow-hidden">
        <div
          onClick={() => setPromoSlide((prev) => (prev + 1) % promoSlides.length)}
          className="relative w-full aspect-[21/9] rounded-[48px] overflow-hidden shadow-2xl group border border-white/10 cursor-pointer"
        >
          {promoSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === promoSlide ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-110 pointer-events-none'}`}
            >
              <img src={slide.img} className="w-full h-full object-cover brightness-[0.4]" />
              <div className="absolute inset-0 flex flex-col justify-center px-12 space-y-3">
                <div className="inline-block px-4 py-1.5 bg-white text-black text-[8px] font-black rounded-full w-fit uppercase tracking-widest animate-pulse shadow-xl">{slide.tag}</div>
                <h5 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">{slide.title}</h5>
                <p className="text-zinc-300 text-[10px] font-medium leading-relaxed max-w-[80%] italic">"{slide.desc}"</p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-8 left-12 flex gap-2">
            {promoSlides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 shadow-lg ${i === promoSlide ? 'w-10 neon-bg' : 'w-3 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Catalog */}
      <main ref={catalogRef} className="px-6 space-y-8 mt-4">
        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          {(['Kemeja', 'Jaket', 'Celana', 'Rompi', 'Polo', 'Kids'] as Category[]).map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeTab === cat ? 'neon-bg text-black neon-border shadow-lg scale-105' : theme === 'dark' ? 'bg-zinc-900/50 text-zinc-500 border-white/5' : 'bg-white text-zinc-500 border-zinc-200 shadow-sm'}`}>
              {cat}
            </button>
          ))}
        </div>


        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-5">
          {filteredProducts.map(product => (
            <div key={product.id} id={`product-${product.id}`} className={`rounded-[40px] p-4 border shadow-md group transition-all relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-zinc-200'}`}>
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-zinc-800/50 mb-4 cursor-zoom-in">
                <DynamicFolderGallery
                  productId={product.id}
                  folderName={product.name}
                  fallbackImage={product.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  theme={theme}
                  onImageClick={() => setSelectedCatalog(product)}
                />
              </div>
              <div className="px-1 space-y-1">
                <h3 className={`text-xs font-black uppercase line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-700'}`}>{product.name}</h3>
                <p className="text-[9px] font-bold adaptive-text-muted mb-3"><span className="neon-text">{product.soldCount.toLocaleString()}+</span> TERJUAL</p>
                <button onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl bg-zinc-900 text-white hover:neon-bg hover:text-black transition-all shadow-lg active:scale-95">KUSTOM</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 30 Days Log */}
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
                    <p className={`text-[9px] font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-600'}`}>{item.client}</p>
                    <span className="text-[8px] font-black neon-text bg-emerald-500/10 px-1.5 py-0.5 rounded">ID: {item.code}</span>
                  </div>
                  <p className="text-[8px] font-bold adaptive-text-muted uppercase tracking-widest">TAHAP: <span className="neon-text">{item.stage}</span></p>
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
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-6">
          {TESTIMONIALS.map((testi, idx) => (
            <div key={idx} className="glass p-8 rounded-[40px] shrink-0 w-80 space-y-6 shadow-2xl border border-white/5 transition-all hover:scale-105 active:scale-95">
              <div className="flex items-center gap-4">
                <img
                  src={testi.avatar}
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg"
                  alt={testi.name}
                />
                <div>
                  <p className={`text-[11px] font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-zinc-600'}`}>{testi.name}</p>
                  <p className="text-[8px] font-bold neon-text uppercase tracking-widest">{testi.agency}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-3 h-3 text-[#BFFF00]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-xs adaptive-text-muted font-medium italic leading-relaxed">"{testi.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mt-12 px-6">
        <div className={`p-10 rounded-[48px] border glass relative overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-[0_40px_100px_rgba(191,255,0,0.25)] animate-breathe ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
          <div className="absolute -top-12 -right-12 w-64 h-64 neon-bg opacity-10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 neon-bg opacity-5 rounded-full blur-[60px]"></div>
          <div className="relative z-10 text-center space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-black neon-text uppercase tracking-[0.5em] px-4 py-1.5 rounded-full border border-[#BFFF00]/20 bg-[#BFFF00]/5 inline-block animate-pulse">Konsultasi Prioritas</span>
              <h2 className={`text-3xl font-black uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-zinc-600'}`}>Wujudkan Seragam<br /><span className="neon-text italic tracking-normal">Impian Unit Anda</span></h2>
              <p className="text-xs font-medium adaptive-text-muted leading-relaxed px-4 opacity-80">Hubungi tim ahli kami untuk mendapatkan penawaran harga terbaik dan bantuan kustomisasi desain instansi Anda.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.instagram.com/reel/DTPxcXbk3hp/?utm_source=ig_web_copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-6 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-black uppercase tracking-[0.2em] rounded-[32px] shadow-xl hover:scale-[1.05] active:scale-95 transition-all duration-300 text-center flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                INSTAGRAM
              </a>
              <a
                href="https://www.tiktok.com/@bradwearindonesia?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-6 bg-black text-white font-black uppercase tracking-[0.2em] rounded-[32px] shadow-xl hover:scale-[1.05] active:scale-95 transition-all duration-300 text-center flex items-center justify-center gap-3 border border-white/10"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                TIKTOK
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* Modals Container */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setActiveModal('none')}>
          <div className="w-full max-w-sm glass rounded-[48px] flex flex-col max-h-[85vh] view-transition shadow-premium border border-white/10" onClick={e => e.stopPropagation()}>
            <div className={`flex justify-between items-center p-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
              <h3 className="text-xl font-black uppercase tracking-tighter neon-text">
                {activeModal.toUpperCase().replace('-', ' ')}
              </h3>
              <button onClick={() => setActiveModal('none')} className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto no-scrollbar space-y-6">

              {activeModal === 'voucher' && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                    <svg className="w-10 h-10 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                  </div>
                  <div className="space-y-2">
                    <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Dapatkan Voucher Diskon</h4>
                    <p className="text-xs adaptive-text-muted leading-relaxed px-4">
                      Ikuti media sosial kami untuk mendapatkan update voucher diskon dan penawaran menarik lainnya.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href="https://www.instagram.com/reel/DTPxcXbk3hp/?utm_source=ig_web_copy_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-black text-[10px] uppercase tracking-wider shadow-lg flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      INSTAGRAM
                    </a>
                    <a
                      href="https://www.tiktok.com/@bradwearindonesia?is_from_webapp=1&sender_device=pc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-wider shadow-lg flex flex-col items-center gap-1.5 transition-all active:scale-95 border border-white/10"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                      TIKTOK
                    </a>
                  </div>
                </div>
              )}
              {activeModal === 'guide' && (
                <div className="space-y-8">
                  {[1, 2, 3, 4].map(num => (
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
                </div>
              )}
              {activeModal === 'help' && (
                <div className="space-y-8">
                  {FAQS.map((f, i) => (
                    <div key={i} className="space-y-2 group text-left">
                      <p className="text-xs font-black neon-text uppercase tracking-tight">Q: {f.q}</p>
                      <p className="text-[11px] font-medium adaptive-text-muted leading-relaxed opacity-80">A: {f.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Catalog Detail Modal */}
      {selectedCatalog && (
        <div className="fixed inset-0 z-[400] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setSelectedCatalog(null)}>
          <div className="w-full max-w-screen-md h-full flex flex-col relative no-scrollbar" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedCatalog(null)} className={`absolute top-0 right-0 z-50 w-14 h-14 rounded-3xl backdrop-blur flex items-center justify-center shadow-2xl active:scale-90 transition-all ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex-1 overflow-y-auto no-scrollbar py-20 px-4 space-y-16">
              <div className="text-center space-y-4">
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter pt-4 animate-fade-in">{selectedCatalog.name}</h3>
                <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.5em] opacity-60 animate-pulse">KATALOG BRADWEAR</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {(() => {
                  // FILTER LOGIC FOR POPUP
                  const frontImgs = catalogImages.filter(i => i.toLowerCase().includes('depan'));
                  const backImgs = catalogImages.filter(i => i.toLowerCase().includes('belakang'));
                  const sideImgs = catalogImages.filter(i => i.toLowerCase().includes('kiri') || i.toLowerCase().includes('kanan'));
                  const otherImgs = catalogImages.filter(i =>
                    !i.toLowerCase().includes('depan') &&
                    !i.toLowerCase().includes('belakang') &&
                    !i.toLowerCase().includes('kiri') &&
                    !i.toLowerCase().includes('kanan')
                  );

                  // Prioritize: Front (Hero) -> Back -> Sides -> Others
                  const mainImage = frontImgs[0] || catalogImages[0] || selectedCatalog.image;
                  const secondaryImages = [
                    ...backImgs,
                    ...sideImgs,
                    ...otherImgs,
                    ...frontImgs.slice(1) // Extra front images go to gallery
                  ].slice(0, 5); // Limit to 5 extra images to make total 6

                  // Get other images for thumbnails (excluding main)
                  const thumbnailImages = [
                    ...backImgs,
                    ...sideImgs,
                    ...otherImgs,
                    ...frontImgs.slice(1)
                  ].slice(0, 6);

                  return (
                    <div className="col-span-1 md:col-span-2">
                      {/* HERO IMAGE WITH ROUNDED */}
                      <div className="aspect-[3/4] md:aspect-[16/9] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group relative mb-6">
                        <img src={mainImage} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8">
                          <div className="space-y-2">
                            <span className="inline-block bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30">
                              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">PREMIUM QUALITY</span>
                            </span>
                            <h4 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">{selectedCatalog.name}</h4>
                          </div>
                        </div>
                      </div>

                      {/* THUMBNAIL GRID 100x100px */}
                      {thumbnailImages.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                          {thumbnailImages
                            .filter(img => !img.toLowerCase().includes('kiri') && !img.toLowerCase().includes('kanan'))
                            .map((img, idx) => {
                              let label = 'KATALOG';
                              if (img.toLowerCase().includes('belakang')) label = 'BELAKANG';
                              else if (img.toLowerCase().includes('depan')) label = 'DEPAN';

                              return (
                                <div
                                  key={idx}
                                  className="shrink-0 w-[100px] h-[100px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group relative cursor-pointer hover:scale-110 transition-transform duration-300"
                                >
                                  <img src={img} className="w-full h-full object-cover" alt={label} />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white uppercase tracking-wide text-center px-1">{label}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* KONTEN MARKETING & DESKRIPSI */}
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Keunggulan Material */}
                <div className={`glass p-8 rounded-[48px] border space-y-6 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h5 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    KEUNGGULAN MATERIAL
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: '🌟', title: 'Bahan Premium', desc: 'Material pilihan dengan standar kualitas ekspor, nyaman dan tahan lama.' },
                      { icon: '💧', title: 'Anti-Luntur', desc: 'Pewarnaan profesional yang tahan terhadap pencucian berulang.' },
                      { icon: '🌬️', title: 'Breathable', desc: 'Sirkulasi udara optimal, cocok untuk iklim tropis Indonesia.' },
                      { icon: '✨', title: 'Jahitan Presisi', desc: 'Dikerjakan dengan mesin industri modern, hasil rapi dan kuat.' }
                    ].map((feat, i) => (
                      <div key={i} className={`flex gap-4 p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200'}`}>
                        <span className="text-3xl">{feat.icon}</span>
                        <div>
                          <p className={`text-sm font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{feat.title}</p>
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimoni Singkat */}
                <div className={`glass p-8 rounded-[48px] border ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
                  <div className="flex items-start gap-4">
                    <svg className="w-10 h-10 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    <div>
                      <p className={`text-base italic leading-relaxed mb-4 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        "{selectedCatalog.description || 'Material premium dengan detail sempurna. Cocok untuk kebutuhan seragam instansi dengan standar tinggi.'}"
                      </p>
                      <p className="text-emerald-500 text-sm font-black uppercase tracking-widest">— Testimoni Client Bradwear</p>
                    </div>
                  </div>
                </div>

                {/* Daftar Client / Instansi */}
                <div className={`glass p-8 rounded-[48px] border space-y-6 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h5 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    DIPERCAYA RATUSAN INSTANSI
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['POLRI', 'TNI AD', 'DISHUB', 'DAMKAR', 'SATPOL PP', 'BASARNAS', 'BPBD', 'KEMENHUB'].map((inst, i) => (
                      <div key={i} className={`backdrop-blur-sm px-4 py-3 rounded-xl border text-center ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-zinc-100 border-zinc-200'}`}>
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-wider">{inst}</p>
                      </div>
                    ))}
                  </div>
                  <p className={`text-xs text-center italic ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>Dan masih banyak lagi instansi pemerintah & swasta lainnya.</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => { onSelectProduct(selectedCatalog); setSelectedCatalog(null); }}
                  className="w-full py-8 neon-bg text-black font-black uppercase tracking-[0.5em] rounded-[40px] shadow-2xl active:scale-95 transition-all hover:scale-[1.02] hover:brightness-110 text-lg"
                >
                  🚀 MULAI DESAIN SEKARANG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO SECTION */}
      {heroVideo && (
        <div className="px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h3 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                LIHAT KAMI BEKERJA
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Proses produksi profesional dengan standar industri modern
              </p>
            </div>
            <div className="rounded-[48px] overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 group relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              >
                <source src={heroVideo} type="video/mp4" />
                Browser Anda tidak mendukung video.
              </video>
              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  LIVE PRODUCTION
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIPERCAYA RATUSAN INSTANSI (Our Partners) - Moved up and improved animation */}
      <div className="py-12 bg-emerald-500/5 border-y border-emerald-500/10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-8 text-center">
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
            DIPERCAYA RATUSAN INSTANSI
          </h2>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Official Government Partner</p>
        </div>

        {/* Marquee Animation */}
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex gap-12 items-center">
              {['POLRI', 'TNI AD', 'DISHUB', 'DAMKAR', 'SATPOL PP', 'BASARNAS', 'BPBD', 'KEMENHUB', 'KEMENDAGRI', 'BUMN', 'DINKES'].map((inst, i) => (
                <div key={i} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{inst}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TENTANG KAMI SECTION - Interactive Accordion */}
      <div className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Toggle */}
          <button
            onClick={() => setShowAboutContent(!showAboutContent)}
            className={`w-full text-left group transition-all p-8 md:p-12 rounded-[48px] border glass flex flex-col items-center text-center ${showAboutContent ? 'border-emerald-500/50 shadow-emerald-500/10' : theme === 'dark' ? 'border-white/10 hover:border-emerald-500/30' : 'border-zinc-200 hover:border-emerald-500/30 shadow-lg'}`}
          >
            <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              TENTANG KAMI
            </h2>
            <div className={`w-24 h-1 neon-bg rounded-full transition-all duration-500 ${showAboutContent ? 'w-48' : 'w-24'}`}></div>

            <div className="mt-8 flex items-center justify-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">
              <span> {showAboutContent ? 'Tutup Konten' : 'Lihat Profil Kami'} </span>
              <svg className={`w-4 h-4 transition-transform duration-500 ${showAboutContent ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>

          {/* Animated Content Wrapper */}
          <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showAboutContent ? 'max-h-[2000px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
            <div className={`glass p-8 md:p-12 rounded-[48px] border space-y-12 ${theme === 'dark' ? 'border-white/10' : 'border-zinc-200 shadow-2xl'}`}>

              {/* Company Info Box */}
              <div className="relative">
                <div className="absolute -left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-transparent hidden md:block"></div>
                <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                  CV. ASTHAJAYA BRADERINDO
                </h3>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  <strong className="text-emerald-500">CV. ASTHAJAYA BRADERINDO</strong> adalah konveksi resmi penyedia seragam dinas di Indonesia, beroperasi di bawah merek <strong className="text-emerald-500">Bradwear</strong> yang terdaftar di <strong>DJKI KEMENKUMHAM</strong>. Perusahaan ini berkomitmen kuat dalam menyajikan produk berkualitas tinggi dan melayani berbagai kebutuhan seragam dinas untuk instansi pemerintah, perusahaan swasta, sekolah, dan organisasi lainnya.
                </p>
              </div>

              {/* Stats/Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vision Box */}
                <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                  <h4 className={`text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </div>
                    VISI
                  </h4>
                  <p className={`text-base leading-relaxed italic ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Menjadi perusahaan konveksi seragam dinas terdepan di Indonesia dengan prioritas pada kualitas, inovasi, ketepatan waktu, dan kepuasan pelanggan.
                  </p>
                </div>

                {/* Mission Box */}
                <div className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                  <h4 className={`text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    MISI
                  </h4>
                  <ul className="space-y-4">
                    {[
                      'Menyediakan seragam dinas standar kualitas tinggi',
                      'Menggunakan bahan nyaman dan tahan lama',
                      'Memberikan pelayanan profesional & tepat waktu',
                      'Terus berinovasi dalam desain & teknologi'
                    ].map((mission, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></div>
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Social Media Linker */}
              <div className="flex flex-col items-center pt-8 border-t border-white/5">
                <h4 className={`text-sm font-black uppercase tracking-[0.5em] mb-8 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Official Channels
                </h4>
                <div className="flex justify-center gap-8">
                  <a href="https://www.instagram.com/reel/DTPxcXbk3hp/" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="https://www.tiktok.com/@bradwearindonesia" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
              © 2026 <strong className="text-emerald-500">Bradwear</strong> by CV. ASTHAJAYA BRADERINDO. All rights reserved.
            </p>
            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-500'}`}>
              Terdaftar di DJKI KEMENKUMHAM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
