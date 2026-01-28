
import React, { useState } from 'react';
import { Product, Category } from '../types';

interface HomeViewProps {
  products: Product[];
  branding: { title: string; subtitle: string };
  onSelectProduct: (product: Product) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenAdmin: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ products, branding, onSelectProduct, theme, toggleTheme, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<Category>('Kemeja');

  const filteredProducts = products.filter(p => p.category === activeTab);

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <header className={`px-6 py-4 flex items-center justify-between border-b sticky top-0 z-10 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-black' : 'text-white'}`}>B</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">{branding.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 text-yellow-500' : 'hover:bg-zinc-100 text-zinc-600'}`}>
            {theme === 'dark' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <button onClick={onOpenAdmin} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Pilih Produk Anda</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{branding.subtitle}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['Kemeja', 'Celana', 'Rompi'] as Category[]).map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === cat ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : theme === 'dark' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white text-zinc-500 border border-zinc-200'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pb-20">
          {filteredProducts.map(product => (
            <div key={product.id} onClick={() => onSelectProduct(product)} className={`rounded-2xl p-3 border shadow-sm hover:shadow-md transition-all cursor-pointer group ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-3">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xs font-bold mb-1 line-clamp-1">{product.name}</h3>
              <p className={`text-[10px] mb-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Mulai dari Rp{product.price.toLocaleString()}</p>
              <button className={`w-full py-2 text-[10px] font-bold rounded-lg transition-colors ${theme === 'dark' ? 'bg-zinc-950 text-white hover:bg-yellow-500 hover:text-black' : 'bg-zinc-900 text-white hover:bg-yellow-500 hover:text-black'}`}>
                Pilih
              </button>
            </div>
          ))}
        </div>
      </main>
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-500 rounded-full shadow-2xl flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all animate-float">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
      </button>
    </div>
  );
};

export default HomeView;
