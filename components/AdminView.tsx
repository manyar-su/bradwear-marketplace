import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, Category, WorkflowStage, ProductionOrder, OrderItem } from '../types';
import { INITIAL_WORKFLOW_STAGES, SIZES } from '../constants';
import { uploadImageToSupabase } from '../utils/supabaseService';
import OptimizedImage from './OptimizedImage';

interface AdminViewProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  productionOrders: ProductionOrder[];
  setProductionOrders: (orders: ProductionOrder[]) => void;
  orderCode: string;
  setOrderCode: (code: string) => void;
  branding: { title: string; subtitle: string };
  setBranding: (branding: { title: string; subtitle: string }) => void;
  onBack: () => void;
  theme: 'light' | 'dark';
}

interface OrderHistoryItem {
  code: string;
  productName: string;
  completedAt: string;
  resi: string;
}

type AdminUser = {
  id: string;
  name: string;
  role?: string;
};

const AdminView: React.FC<AdminViewProps> = ({
  products,
  setProducts,
  productionOrders,
  setProductionOrders,
  onBack,
  theme
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'layout' | 'riwayat'>('workflow');
  const [showResiModal, setShowResiModal] = useState<string | null>(null);
  const [resiInput, setResiInput] = useState('');
  const [showViewEditor, setShowViewEditor] = useState<string | null>(null);
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ productId: string, view: string, isGallery?: boolean } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Form Manual Order State
  const [manualForm, setManualForm] = useState({
    customerName: '',
    productCode: '',
    productName: products[0]?.name || '',
    category: products[0]?.category || 'Kemeja',
    items: [{ size: 'M', quantity: 1, gender: 'L' }] as OrderItem[]
  });

  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(() => {
    const saved = localStorage.getItem('bradwear_order_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bradwear_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await fetch('/api/admin/session', {
          credentials: 'same-origin',
        });
        const payload = await response.json().catch(() => ({}));

        if (!isMounted) {
          return;
        }

        if (response.ok && payload?.authenticated && payload?.user) {
          setIsLoggedIn(true);
          setCurrentUser(payload.user as AdminUser);
        }
      } catch {
        if (isMounted) {
          setError('Sesi admin tidak dapat diverifikasi.');
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLogin) return;

    setIsSubmittingLogin(true);
    setError('');

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          loginId,
          password,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload?.error === 'string' ? payload.error : 'Login admin gagal diproses.',
        );
      }

      setIsLoggedIn(true);
      setCurrentUser(
        payload?.user && typeof payload.user.name === 'string'
          ? (payload.user as AdminUser)
          : { id: 'admin', name: 'Admin' },
      );
      setError('');
      setPassword('');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'ID atau password salah.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const toggleStageStatus = (orderCode: string, stageId: string) => {
    const updated = productionOrders.map(order => {
      if (order.orderCode === orderCode) {
        const newStages = order.stages.map(s => {
          if (s.id === stageId) {
            let nextStatus: WorkflowStage['status'] = 'pending';
            if (s.status === 'pending') nextStatus = 'current';
            else if (s.status === 'current') nextStatus = 'completed';
            else nextStatus = 'pending';
            return { ...s, status: nextStatus };
          }
          return s;
        });
        return { ...order, stages: newStages };
      }
      return order;
    });
    setProductionOrders(updated);
  };

  const finalizeOrder = () => {
    if (!resiInput || !showResiModal) return;
    const orderToFinalize = productionOrders.find(o => o.orderCode === showResiModal);
    if (!orderToFinalize) return;

    const newHistory: OrderHistoryItem = {
      code: orderToFinalize.orderCode,
      productName: orderToFinalize.productName,
      completedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      resi: resiInput
    };

    setOrderHistory([newHistory, ...orderHistory]);
    setProductionOrders(productionOrders.filter(o => o.orderCode !== showResiModal));
    setResiInput('');
    setShowResiModal(null);
    setActiveTab('riwayat');
  };

  const handleAddManualOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newCode = Math.floor(Math.random() * 9000 + 1000).toString();
    const totalQty = manualForm.items.reduce((acc, curr) => acc + curr.quantity, 0);

    const newOrder: ProductionOrder = {
      orderCode: newCode,
      productCode: manualForm.productCode,
      customerName: manualForm.customerName,
      productName: manualForm.productName,
      category: manualForm.category,
      totalQty: totalQty,
      orderItems: JSON.parse(JSON.stringify(manualForm.items)),
      stages: INITIAL_WORKFLOW_STAGES.map(s => ({ ...s, status: 'pending' })),
      createdAt: new Date().toISOString()
    };
    setProductionOrders([newOrder, ...productionOrders]);
    setShowAddOrderForm(false);
    setManualForm({
      customerName: '',
      productCode: '',
      productName: products[0]?.name || '',
      category: products[0]?.category || 'Kemeja',
      items: [{ size: 'M', quantity: 1, gender: 'L' }]
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        // Upload to Supabase
        // Determine correct path structure based on new requirements
        // Catalog structure: catalog/{ProductName}/{view}.png or similar
        const folder = uploadTarget.isGallery ? 'gallery' : 'catalog';
        const productNameSanitized = editingProduct?.name.replace(/[^a-zA-Z0-9]/g, '_') || uploadTarget.productId;

        let fileName = `${uploadTarget.view}_${Date.now()}.png`;
        let supabasePath = `${folder}/${productNameSanitized}/${fileName}`;

        // If it's a model specific part (front, back, sleeves), try to keep it organized
        if (!uploadTarget.isGallery) {
          const viewName = uploadTarget.view === 'front' ? 'depan' :
            uploadTarget.view === 'back' ? 'belakang' :
              uploadTarget.view === 'leftSleeve' ? 'kiri' :
                uploadTarget.view === 'rightSleeve' ? 'kanan' : 'other';
          supabasePath = `Model Kemeja/${productNameSanitized}/${viewName}_${Date.now()}.png`;
        } else {
          // For gallery, put in catalog folder too so it appears in the dynamic grid
          supabasePath = `catalog/${productNameSanitized}/${fileName}`;
        }

        const uploadedUrl = await uploadImageToSupabase(base64, supabasePath);

        if (uploadedUrl) {
          setProducts(products.map(p => {
            if (p.id === uploadTarget.productId) {
              if (uploadTarget.isGallery) {
                return { ...p, gallery: [...(p.gallery || []), uploadedUrl] };
              } else {
                const newImages = { ...(p.images || { front: p.image }), [uploadTarget.view]: uploadedUrl };
                return {
                  ...p,
                  image: uploadTarget.view === 'front' ? uploadedUrl : p.image,
                  images: newImages as any
                };
              }
            }
            return p;
          }));

          if (editingProduct && editingProduct.id === uploadTarget.productId) {
            setEditingProduct(prev => {
              if (!prev) return null;
              if (uploadTarget.isGallery) {
                // For gallery, we just append to the list
                return { ...prev, gallery: [...(prev.gallery || []), uploadedUrl] };
              } else {
                // For main views
                const newImages = { ...(prev.images || { front: prev.image }), [uploadTarget.view]: uploadedUrl };
                return {
                  ...prev,
                  image: uploadTarget.view === 'front' ? uploadedUrl : prev.image,
                  images: newImages as any
                };
              }
            });

            // Also update the main products list immediately so changes are reflected in background
            setProducts(currentProducts => currentProducts.map(p => {
              if (p.id === uploadTarget.productId) {
                if (uploadTarget.isGallery) {
                  return { ...p, gallery: [...(p.gallery || []), uploadedUrl] };
                } else {
                  const newImages = { ...(p.images || { front: p.image }), [uploadTarget.view]: uploadedUrl };
                  return {
                    ...p,
                    image: uploadTarget.view === 'front' ? uploadedUrl : p.image,
                    images: newImages as any
                  };
                }
              }
              return p;
            }));

            alert('Upload Berhasil & Tersimpan di Supabase!');
          }
        } else {
          alert('Gagal upload ke Supabase. Periksa koneksi atau konfigurasi.');
        }
        setUploadTarget(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProductInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    alert('Data produk berhasil diperbarui!');
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `p_${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: 'Produk Baru',
      category: 'Kemeja',
      soldCount: 0,
      image: 'https://via.placeholder.com/600x800?text=No+Image',
      description: '',
      gallery: [],
      images: { front: 'https://via.placeholder.com/600x800?text=No+Image' }
    };
    setProducts([...products, newProduct]);
    setShowAddProductForm(false);
    setEditingProduct(newProduct);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/session', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } catch {
      // noop
    } finally {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setPassword('');
      setError('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`flex flex-col h-full items-center justify-center p-8 ${theme === 'dark' ? 'bg-black' : 'bg-zinc-100'}`}>
        <div className={`w-full max-w-sm p-10 rounded-[48px] shadow-2xl border transition-all glass ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 neon-bg rounded-3xl flex items-center justify-center mb-5 shadow-lg">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter adaptive-text">Admin Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input required disabled={isCheckingSession || isSubmittingLogin} type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} className={`w-full px-6 py-5 rounded-2xl text-sm font-bold border outline-none focus:neon-border transition-all disabled:opacity-60 ${theme === 'dark' ? 'bg-black border-white/5 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} placeholder="ID LOGIN" autoComplete="username" />
            <input required disabled={isCheckingSession || isSubmittingLogin} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-6 py-5 rounded-2xl text-sm font-bold border outline-none focus:neon-border transition-all disabled:opacity-60 ${theme === 'dark' ? 'bg-black border-white/5 text-white' : 'bg-white border-zinc-300 text-zinc-900'}`} placeholder="PASSWORD" autoComplete="current-password" />

            <p className="text-[10px] text-center font-bold uppercase tracking-widest adaptive-text-muted">
              Kredensial diverifikasi di server dan sesi disimpan aman di cookie HttpOnly.
            </p>

            {error && <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest bg-red-500/10 py-2 rounded-xl">{error}</p>}

            <button type="submit" disabled={isCheckingSession || isSubmittingLogin} className="w-full py-6 neon-bg text-black font-black uppercase tracking-widest rounded-3xl shadow-lg active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60">
              {isCheckingSession ? 'MEMERIKSA SESI...' : isSubmittingLogin ? 'MEMPROSES LOGIN...' : 'MASUK SISTEM'}
            </button>
            <button type="button" onClick={onBack} className="w-full adaptive-text-muted text-[10px] font-black uppercase tracking-widest py-2">KEMBALI</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className={`px-6 py-6 flex items-center justify-between border-b sticky top-0 z-[120] ${theme === 'dark' ? 'bg-black border-white/5 backdrop-blur-xl' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`p-3 rounded-2xl border ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex flex-col">
            <p className="text-[8px] font-black neon-text uppercase tracking-widest">USER:</p>
            <p className="text-[10px] font-black uppercase">{currentUser?.name}</p>
          </div>
        </div>
        <h1 className="text-[11px] font-black uppercase tracking-[0.3em] neon-text">ADMIN CONTROL</h1>
        <button onClick={handleLogout} className="text-[10px] font-black text-red-500 uppercase">LOGOUT</button>
      </header>

      <div className="flex px-4 pt-4 gap-4 border-b border-white/5 bg-white/5 backdrop-blur z-20">
        {['WORKFLOW', 'RIWAYAT', 'LAYOUT'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase() as any)} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.toLowerCase() ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-zinc-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        {activeTab === 'workflow' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase neon-text">ANTRIAN AKTIF</h3>
              <button onClick={() => setShowAddOrderForm(true)} className="bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-500 px-6 py-3 rounded-2xl uppercase tracking-widest shadow-lg">+ ORDER MANUAL</button>
            </div>
            {productionOrders.map((order) => (
              <section key={order.orderCode} className={`p-6 rounded-[40px] border glass transition-all ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200 shadow-xl'}`}>
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black neon-text uppercase tracking-widest">KONSUMEN:</p>
                    <h4 className="text-[13px] font-black uppercase tracking-tight">{order.productCode || 'BRD-...'}: {order.customerName}</h4>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{order.productName} • {order.totalQty} PCS</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black neon-text uppercase tracking-widest">ID:</p>
                    <h4 className="text-lg font-black uppercase tracking-tight">#{order.orderCode}</h4>
                  </div>
                </div>

                <div className="space-y-6 relative mb-8">
                  <div className={`absolute left-[23px] top-6 bottom-6 w-0.5 ${theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'}`} />
                  {order.stages.map((stage) => (
                    <div key={stage.id} onClick={() => toggleStageStatus(order.orderCode, stage.id)} className="relative flex gap-10 items-center cursor-pointer">
                      <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${stage.status === 'completed' ? 'neon-bg border-transparent scale-110 shadow-lg' : stage.status === 'current' ? 'bg-black border-[#BFFF00] scale-105' : 'bg-zinc-950 border-white/5'}`}>
                        {stage.status === 'completed' && <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                        {stage.status === 'current' && <div className="w-2.5 h-2.5 rounded-full neon-bg animate-pulse" />}
                      </div>
                      <div className="flex flex-col">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${stage.status !== 'pending' ? 'adaptive-text' : 'adaptive-text-muted'}`}>{stage.label}</p>
                        <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60 ${stage.status !== 'pending' ? 'neon-text' : 'adaptive-text-muted'}`}>{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.stages.every(s => s.status === 'completed') && (
                  <button onClick={() => setShowResiModal(order.orderCode)} className="w-full py-5 neon-bg text-black font-black uppercase tracking-[0.2em] rounded-3xl shadow-xl active:scale-95 transition-all">SELESAI & INPUT RESI</button>
                )}
              </section>
            ))}
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase neon-text">MANAJEMEN KATALOG & ASSET</h3>
              <button onClick={() => setShowAddProductForm(true)} className="bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-500 px-6 py-3 rounded-2xl uppercase tracking-widest shadow-lg">+ PRODUK BARU</button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(p => (
                <div key={p.id} className={`group rounded-[48px] border transition-all overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-zinc-950/50 border-white/5' : 'bg-white border-zinc-200 shadow-xl'}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={p.image} className={`w-full h-full object-cover transition-all duration-700 ${p.isHidden ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`} />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[8px] font-black text-white rounded-full border border-white/10 uppercase tracking-widest">{p.category}</span>
                      {p.isHidden && <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md text-[8px] font-black text-white rounded-full uppercase tracking-widest">HIDDEN</span>}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-sm">
                      <button onClick={() => setEditingProduct(p)} className="neon-bg text-black text-[10px] font-black px-10 py-4 rounded-3xl uppercase tracking-widest shadow-premium active:scale-95 transition-all">PENGATURAN PENUH</button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight adaptive-text">{p.name}</h4>
                      </div>
                      <button onClick={() => setProducts(products.map(item => item.id === p.id ? { ...item, isHidden: !item.isHidden } : item))} className={`p-2 rounded-xl transition-all ${p.isHidden ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {p.isHidden ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'riwayat' && (
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase neon-text">ARSIP PRODUKSI</h3>
            {orderHistory.map((item, idx) => (
              <div key={idx} className="p-8 rounded-[40px] border glass flex justify-between items-center transition-all hover:bg-white/5">
                <div className="space-y-1">
                  <p className="text-[12px] font-black uppercase adaptive-text">{item.code} - {item.productName}</p>
                  <p className="text-[10px] font-black neon-text uppercase tracking-widest">RESI: {item.resi}</p>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase">SELESAI: {item.completedAt}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl neon-bg flex items-center justify-center text-black shadow-2xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MANUAL ORDER MODAL */}
      {showAddOrderForm && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto no-scrollbar" onClick={() => setShowAddOrderForm(false)}>
          <div className={`w-full max-w-sm rounded-[56px] p-10 space-y-6 border shadow-premium view-transition my-auto ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`} onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter neon-text">TAMBAH KERJA MANUAL</h3>
            </div>
            <form onSubmit={handleAddManualOrder} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-3">KODE BARANG:</label>
                <input required type="text" value={manualForm.productCode} onChange={(e) => setManualForm({ ...manualForm, productCode: e.target.value })} className={`w-full p-5 rounded-3xl border-2 font-black uppercase text-[11px] outline-none ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-zinc-50 border-zinc-200'}`} placeholder="EX: BRD-KT-01" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-3">KONSUMEN:</label>
                <input required type="text" value={manualForm.customerName} onChange={(e) => setManualForm({ ...manualForm, customerName: e.target.value })} className={`w-full p-5 rounded-3xl border-2 font-black uppercase text-[11px] outline-none ${theme === 'dark' ? 'bg-black border-white/10' : 'bg-zinc-50 border-zinc-200'}`} placeholder="EX: POLDA JABAR" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-zinc-500">DAFTAR UKURAN:</label>
                  <button type="button" onClick={() => setManualForm({ ...manualForm, items: [...manualForm.items, { size: 'M', quantity: 1, gender: 'L' }] })} className="text-[9px] font-black neon-text uppercase">+ TAMBAH</button>
                </div>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                  {manualForm.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-black/20 p-2 rounded-2xl">
                      <select value={item.size} onChange={(e) => {
                        const newItems = [...manualForm.items];
                        newItems[idx].size = e.target.value;
                        setManualForm({ ...manualForm, items: newItems });
                      }} className="flex-1 p-2 rounded-xl text-[10px] font-black uppercase bg-black border border-white/10 text-white">
                        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={item.gender} onChange={(e) => {
                        const newItems = [...manualForm.items];
                        newItems[idx].gender = e.target.value as 'L' | 'P';
                        setManualForm({ ...manualForm, items: newItems });
                      }} className="p-2 rounded-xl text-[10px] font-black uppercase bg-black border border-white/10 text-white">
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                      <input type="number" min="1" value={item.quantity} onChange={(e) => {
                        const newItems = [...manualForm.items];
                        newItems[idx].quantity = parseInt(e.target.value);
                        setManualForm({ ...manualForm, items: newItems });
                      }} className="w-12 p-2 rounded-xl text-[10px] font-black bg-black border border-white/10 text-center text-white" />
                      <button type="button" onClick={() => setManualForm({ ...manualForm, items: manualForm.items.filter((_, i) => i !== idx) })} className="text-red-500 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-6 neon-bg text-black font-black uppercase tracking-widest rounded-[32px] shadow-2xl active:scale-95 transition-all">SINKRONISASI DATA</button>
            </form>
          </div>
        </div>
      )}

      {/* NEW PRODUCT ADD MODAL */}
      {showAddProductForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
          <div className="w-full max-w-sm glass rounded-[48px] p-12 space-y-8 border border-white/10 text-center animate-fade-in shadow-premium">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">TAMBAH KATALOG BARU</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sistem akan membuat produk default, silakan edit melalui Pengaturan Penuh setelah ini.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowAddProductForm(false)} className="flex-1 py-5 glass text-zinc-500 font-black uppercase text-[10px] rounded-2xl">BATAL</button>
              <button onClick={handleAddNewProduct} className="flex-1 py-5 neon-bg text-black font-black uppercase text-[10px] rounded-2xl shadow-xl">BUAT PRODUK</button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PRODUCT EDITOR MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-[800] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 overflow-hidden" onClick={() => setEditingProduct(null)}>
          <div className="w-full max-w-4xl h-full flex flex-col glass rounded-[56px] border border-white/10 overflow-hidden view-transition" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
              <div>
                <h3 className="text-2xl font-black uppercase neon-text">PENGATURAN PRODUK</h3>
                <p className="text-[9px] font-bold adaptive-text-muted mt-1 uppercase tracking-widest">ID: {editingProduct.id}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-4 bg-white/5 rounded-3xl text-white hover:bg-white/10 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 no-scrollbar">
              {/* Left Side: General Info */}
              <form onSubmit={handleUpdateProductInfo} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">NAMA PRODUK</label>
                    <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white outline-none focus:neon-border transition-all" />
                  </div>

                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">KATEGORI</label>
                    <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white outline-none focus:neon-border transition-all appearance-none">
                      {['Kemeja', 'Jaket', 'Celana', 'Rompi'].map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">DESKRIPSI PRODUK</label>
                    <textarea rows={4} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white outline-none focus:neon-border transition-all resize-none" />
                  </div>
                </div>

                <button type="submit" className="w-full py-6 neon-bg text-black font-black uppercase tracking-widest rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">SIMPAN SEMUA PERUBAHAN DATA</button>

                <div className="pt-4 px-2">
                  <button type="button" onClick={() => { if (confirm('Hapus produk ini secara permanen?')) { setProducts(products.filter(p => p.id !== editingProduct.id)); setEditingProduct(null); } }} className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-widest underline decoration-red-500/20 underline-offset-8">HAPUS PRODUK DARI KATALOG</button>
                </div>
              </form>

              {/* Right Side: Media Assets */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] neon-text italic">Foto Utama & 4 Sisi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(['front', 'back', 'leftSleeve', 'rightSleeve'] as const).map(v => {
                      const currentUrl = editingProduct.images?.[v] || (v === 'front' ? editingProduct.image : '');
                      const labels: Record<string, string> = { front: 'DEPAN', back: 'BELAKANG', leftSleeve: 'KIRI', rightSleeve: 'KANAN' };
                      return (
                        <div key={v} className="space-y-2">
                          <label className="text-[8px] font-black text-zinc-500 uppercase ml-2">SISI {labels[v]}</label>
                          <div onClick={() => { setUploadTarget({ productId: editingProduct.id, view: v }); fileInputRef.current?.click(); }} className="aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            {currentUrl ? <img src={currentUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" /> : <div className="text-[10px] opacity-20">UPLOAD</div>}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <svg className="w-8 h-8 neon-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] neon-text italic">Galeri Inspirasi</h4>
                    <button onClick={() => { setUploadTarget({ productId: editingProduct.id, view: `gal_${Date.now()}`, isGallery: true }); fileInputRef.current?.click(); }} className="text-[10px] font-black bg-white/10 px-4 py-2 rounded-xl border border-white/5">+ TAMBAH FOTO</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(editingProduct.gallery || []).map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl bg-white/5 border border-white/10 relative group overflow-hidden">
                        <img src={img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer" onClick={() => {
                          const newGal = (editingProduct.gallery || []).filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, gallery: newGal });
                          setProducts(products.map(p => p.id === editingProduct.id ? { ...p, gallery: newGal } : p));
                        }}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATALOG IMAGE EDITOR MODAL (OLD - MAINTAIN FOR COMPATIBILITY OR REMOVE) */}

      {/* RESI MODAL */}
      {showResiModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
          <div className="w-full max-w-sm glass rounded-[60px] p-12 space-y-10 border border-emerald-500/30 shadow-2xl">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter neon-text">INPUT RESI KURIR</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Selesaikan Produksi #{showResiModal}</p>
            </div>
            <input type="text" value={resiInput} onChange={(e) => setResiInput(e.target.value)} className={`w-full p-7 border-4 rounded-[32px] text-sm font-black uppercase tracking-[0.2em] outline-none focus:neon-border transition-all text-center ${theme === 'dark' ? 'bg-black border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`} placeholder="RESI: BRD-..." autoFocus />
            <div className="flex gap-5">
              <button onClick={() => { setShowResiModal(null); setResiInput(''); }} className="flex-1 py-6 glass text-zinc-500 font-black uppercase text-[11px] rounded-[28px] border border-white/5 active:scale-95 transition-all">BATAL</button>
              <button onClick={finalizeOrder} className="flex-1 py-6 neon-bg text-black font-black uppercase text-[11px] rounded-[28px] shadow-2xl active:scale-95 transition-all">SELESAI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
