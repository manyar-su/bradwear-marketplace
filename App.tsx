import React, { useEffect } from 'react';
import { RouteKey } from './types';
const PublicSiteView = React.lazy(() => import('./components/PublicSiteView'));
const DesignEditorView = React.lazy(() => import('./components/DesignEditorView'));
const SummaryView = React.lazy(() => import('./components/SummaryView'));
import { preloadCriticalAssets } from './assets';
import { useStore } from './context/StoreContext';
import { SITE_FAQS } from './lib/siteConfig';
import { applySeoMeta } from './lib/seo';
import SiteHeader from './components/SiteHeader';
import BradAiChat from './components/BradAiChat';

const App: React.FC = () => {
  const { currentRoute, setCurrentRoute, theme, setTheme, selectedProduct, products, setPreferredCatalogCategory } = useStore();
  const [showBradAiWidget, setShowBradAiWidget] = React.useState(false);

  useEffect(() => {
    preloadCriticalAssets();
  }, []);

  useEffect(() => {
    if ((currentRoute === RouteKey.EDITOR || currentRoute === RouteKey.SUMMARY) && !selectedProduct) {
      setCurrentRoute(RouteKey.HOME, { replace: true });
    }
  }, [currentRoute, selectedProduct, setCurrentRoute]);

  useEffect(() => {
    applySeoMeta(currentRoute, products, SITE_FAQS);
  }, [currentRoute, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.querySelector('main')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentRoute]);

  return (
    <div className="min-h-screen w-full bg-[var(--surface-subtle)] text-[var(--text-primary)]">
      <div className="min-h-screen w-full">
        <div className="web-shell min-h-screen overflow-hidden">
          <SiteHeader
            currentRoute={currentRoute}
            theme={theme}
            selectedProductName={selectedProduct?.name}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            onSelectCatalogCategory={(category) => {
              setPreferredCatalogCategory(category);
              setCurrentRoute(category === 'Celana' ? RouteKey.PANTS : RouteKey.KATALOG);
            }}
            onNavigate={(route) => {
              if ((route === RouteKey.EDITOR || route === RouteKey.SUMMARY) && !selectedProduct) {
                setCurrentRoute(RouteKey.KATALOG);
                return;
              }
              setCurrentRoute(route);
            }}
          />

          <div className="flex-1">
            <React.Suspense
              fallback={
                <div className="flex min-h-[70vh] items-center justify-center bg-[var(--surface-base)]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border-soft)] border-t-[var(--brand-accent)]" />
                    <p className="text-sm font-medium text-[var(--text-muted)]">Memuat halaman...</p>
                  </div>
                </div>
              }
            >
              {currentRoute !== RouteKey.EDITOR && currentRoute !== RouteKey.SUMMARY && <PublicSiteView />}
              {currentRoute === RouteKey.EDITOR && selectedProduct && <DesignEditorView />}
              {currentRoute === RouteKey.SUMMARY && selectedProduct && <SummaryView />}
            </React.Suspense>
          </div>

          {currentRoute !== RouteKey.EDITOR ? (
            <div className="fixed bottom-3 right-2 z-50 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5 sm:gap-3">
              {showBradAiWidget ? (
                <div className="animate-fade-in-up h-[min(80dvh,760px)] w-[min(96vw,420px)] max-h-[calc(100dvh-5.25rem)]">
                  <BradAiChat variant="widget" onClose={() => setShowBradAiWidget(false)} />
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setShowBradAiWidget((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black tracking-tight shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm ${
                  theme === 'dark'
                    ? 'border border-[#8dfc35]/20 bg-[linear-gradient(135deg,#6cf30c,#224d0d)] text-[#041102]'
                    : 'bg-[linear-gradient(135deg,#75f21a,#2c7a12)] text-[#071106]'
                }`}
              >
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-base sm:h-10 sm:w-10 sm:text-lg ${theme === 'dark' ? 'bg-black/15 text-[#031001]' : 'bg-white/25 text-white'}`}>AI</span>
                Brodi
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
