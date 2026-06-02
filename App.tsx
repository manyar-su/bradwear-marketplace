import React, { useEffect } from 'react';
import { View } from './types';
const HomeView = React.lazy(() => import('./components/HomeView'));
const DesignEditorView = React.lazy(() => import('./components/DesignEditorView'));
const SummaryView = React.lazy(() => import('./components/SummaryView'));
import { preloadCriticalAssets } from './assets';
import { useStore } from './context/StoreContext';

const App: React.FC = () => {
  const { currentView, setCurrentView, setTheme, selectedProduct } = useStore();

  useEffect(() => {
    preloadCriticalAssets();
    setTheme('light');
  }, [setTheme]);

  return (
    <div className="min-h-screen w-full bg-[var(--surface-subtle)] text-[var(--text-primary)]">
      <div className="mx-auto min-h-screen w-full max-w-[1360px] px-4 py-6 md:px-6 lg:px-8">
        <div className="web-shell min-h-[calc(100vh-3rem)] overflow-hidden">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--border-soft)] bg-white/95 px-6 py-4 backdrop-blur">
            <button className="text-left" onClick={() => setCurrentView(View.HOME)}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Bradwear Indonesia</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Web Catalog & Design Studio</h1>
            </button>

            <div className="hidden items-center gap-2 md:flex">
              {[View.HOME, View.EDITOR, View.SUMMARY].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    if (v === View.HOME || selectedProduct) {
                      setCurrentView(v);
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    currentView === v
                      ? 'bg-[var(--brand-accent)] text-white'
                      : 'bg-[var(--surface-soft)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                  } ${v !== View.HOME && !selectedProduct ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1">
            <React.Suspense
              fallback={
                <div className="flex min-h-[70vh] items-center justify-center bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border-soft)] border-t-[var(--brand-accent)]" />
                    <p className="text-sm font-medium text-[var(--text-muted)]">Memuat halaman...</p>
                  </div>
                </div>
              }
            >
              {currentView === View.HOME && <HomeView />}
              {currentView === View.EDITOR && selectedProduct && <DesignEditorView />}
              {currentView === View.SUMMARY && selectedProduct && <SummaryView />}
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
