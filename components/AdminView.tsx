
import React, { useState } from 'react';
import { WORKFLOW_STAGES } from '../constants';
import { Product } from '../types';

interface AdminViewProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  branding: { title: string; subtitle: string };
  setBranding: (branding: { title: string; subtitle: string }) => void;
  onBack: () => void;
  theme: 'light' | 'dark';
}

const AdminView: React.FC<AdminViewProps> = ({ products, setProducts, branding, setBranding, onBack, theme }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'settings' | 'workflow' | 'layout'>('workflow');
  const [maintenance, setMaintenance] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('ID atau Password salah');
    }
  };

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updated = products.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProducts(updated);
  };

  if (!isLoggedIn) {
    return (
      <div className={`flex flex-col h-full items-center justify-center p-8 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <div className={`w-full max-w-sm p-8 rounded-[40px] shadow-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-xl font-bold">Admin Login</h2>
            <p className="text-xs text-zinc-500 mt-1">Masukkan kredensial untuk akses</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Admin ID</label>
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl text-sm border focus:ring-2 focus:ring-yellow-500 outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                placeholder="ID Pengguna"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl text-sm border focus:ring-2 focus:ring-yellow-500 outline-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl shadow-xl shadow-yellow-500/10 transition-all active:scale-95">
              Masuk Sekarang
            </button>
            <button type="button" onClick={onBack} className="w-full text-zinc-500 text-xs font-bold py-2 hover:text-zinc-700 transition-colors">Kembali ke Home</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      <header className={`px-6 py-4 flex items-center justify-between border-b sticky top-0 z-10 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest">Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="text-xs font-bold text-red-500">LOGOUT</button>
      </header>

      <div className="flex px-4 pt-6 gap-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800">
        {[
          { id: 'workflow', label: 'Alur' },
          { id: 'layout', label: 'Layout' },
          { id: 'settings', label: 'Sistem' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-4 text-xs font-bold uppercase tracking-tighter transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-zinc-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
              <div className="relative space-y-8">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                {WORKFLOW_STAGES.map((stage) => (
                  <div key={stage.id} className="relative flex gap-6 items-start">
                    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 ${
                      stage.status === 'completed' ? 'bg-green-500 border-green-100 dark:border-green-900/30' : 
                      stage.status === 'current' ? 'bg-yellow-500 border-yellow-100 dark:border-yellow-900/30 animate-pulse' : 
                      'bg-zinc-200 dark:bg-zinc-700 border-zinc-100 dark:border-zinc-800'
                    }`}>
                      {stage.status === 'completed' ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${stage.status === 'pending' ? 'text-zinc-400' : ''}`}>{stage.label}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Edit Layout Utama</h2>
              <div className={`p-5 rounded-2xl border space-y-4 ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-zinc-400">Judul Aplikasi</label>
                   <input 
                     type="text" 
                     value={branding.title} 
                     onChange={(e) => setBranding({...branding, title: e.target.value})}
                     className={`w-full px-4 py-3 rounded-xl border text-xs ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-zinc-400">Subjudul Beranda</label>
                   <input 
                     type="text" 
                     value={branding.subtitle} 
                     onChange={(e) => setBranding({...branding, subtitle: e.target.value})}
                     className={`w-full px-4 py-3 rounded-xl border text-xs ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                   />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold">Edit Produk</h2>
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className={`p-5 rounded-3xl border space-y-4 ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          value={product.name} 
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-[10px] font-bold ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                        />
                        <input 
                          type="number" 
                          value={product.price} 
                          onChange={(e) => updateProduct(product.id, 'price', parseInt(e.target.value))}
                          className={`w-full px-3 py-2 rounded-lg border text-[10px] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-zinc-400">URL Foto (Unsplash)</label>
                      <input 
                        type="text" 
                        value={product.image} 
                        onChange={(e) => updateProduct(product.id, 'image', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-[8px] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
              <div>
                <p className="text-sm font-bold">Maintenance Mode</p>
                <p className="text-[10px] text-zinc-500">Nonaktifkan pemesanan</p>
              </div>
              <button onClick={() => setMaintenance(!maintenance)} className={`w-12 h-6 rounded-full relative transition-all ${maintenance ? 'bg-yellow-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${maintenance ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <button className="w-full py-4 bg-yellow-500 text-black font-bold rounded-2xl shadow-xl transition-all active:scale-95">Simpan Konfigurasi</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminView;
