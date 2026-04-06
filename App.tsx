import React, { useEffect } from 'react';
import { Filesystem } from '@capacitor/filesystem';
import { View } from './types';
const HomeView = React.lazy(() => import('./components/HomeView'));
const DesignEditorView = React.lazy(() => import('./components/DesignEditorView'));
const SummaryView = React.lazy(() => import('./components/SummaryView'));
import { preloadCriticalAssets } from './assets';
import { App as CapacitorApp } from '@capacitor/app';
import { useStore } from './context/StoreContext';

const App: React.FC = () => {
  const { currentView, setCurrentView, theme, setTheme, selectedProduct } = useStore();

  // Request Permissions on Mount
  useEffect(() => {
    preloadCriticalAssets();
    const initPermissions = async () => {
      try {
        await Filesystem.requestPermissions();
        // Request Media permissions for saving to gallery
        const { Media } = await import('@capacitor-community/media');
        if ((Media as any).requestPermissions) {
          await (Media as any).requestPermissions();
        }
      } catch (e) {
        console.error("Permission request failed", e);
      }
    };
    initPermissions();
  }, []);

  // --- DOUBLE TAP TO EXIT LOGIC ---
  useEffect(() => {
    let lastBackPressed = 0;
    const backListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (currentView === View.HOME) {
        const now = Date.now();
        if (now - lastBackPressed < 2000) {
          CapacitorApp.exitApp();
        } else {
          lastBackPressed = now;
          // Simple Toast for "Press back again to exit"
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold z-[9999] animate-fade-in-up';
          toast.innerText = 'Tekan sekali lagi untuk keluar';
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        }
      }
    });

    return () => {
      backListener.then(f => f.remove());
    };
  }, [currentView]);

  return (
    <div className={`h-screen w-screen overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-200'} flex justify-center items-center`}>
      <div className={`h-full w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[1200px] shadow-premium relative overflow-hidden flex flex-col border-x ${theme === 'dark' ? 'bg-black text-white border-white/5' : 'bg-white text-zinc-900 border-zinc-200'}`}>


        <header className={`px-6 py-3 flex items-center justify-between border-b shrink-0 z-50 ${theme === 'dark' ? 'bg-black/80 border-white/5 backdrop-blur-xl' : 'bg-white/90 border-zinc-100 backdrop-blur-xl'}`}>
          <div className="flex flex-col cursor-pointer group" onClick={() => setCurrentView(View.HOME)}>
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-emerald-500 leading-none">BRAD</span>
              <span className="text-2xl font-black tracking-tighter leading-none" style={{ WebkitTextStroke: '1.2px #10b981', color: 'transparent' }}>WEAR</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-2.5 bg-emerald-500 rounded-l-full rounded-r-md flex items-center justify-end px-2 w-16 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <div className="flex gap-0.5 opacity-50">
                  <span className="text-black font-black text-[8px] leading-none tracking-tighter"> {">>>"} </span>
                </div>
              </div>
              <span className="text-[9px] font-black tracking-[0.3em] text-emerald-500 mt-0.5">INDONESIA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className={`p-2.5 rounded-xl transition-all active:scale-90 ${theme === 'dark' ? 'bg-zinc-900 neon-text border border-white/5' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
              {theme === 'dark' ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
          </div>
        </header>

        <div className="flex-1 h-full overflow-hidden flex flex-col relative no-scrollbar">
          <React.Suspense fallback={
            <div className="h-full w-full flex flex-col items-center justify-center bg-black">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4"></div>
              <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Memuat BRADWEAR...</p>
            </div>
          }>
            {currentView === View.HOME && (
              <div className="h-full overflow-y-auto no-scrollbar scroll-smooth view-transition">
                <HomeView />
              </div>
            )}

            {currentView === View.EDITOR && selectedProduct && (
              <div className="h-full overflow-hidden view-transition">
                <DesignEditorView />
              </div>
            )}

            {currentView === View.SUMMARY && selectedProduct && (
              <div className="h-full overflow-hidden view-transition">
                <SummaryView />
              </div>
            )}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
