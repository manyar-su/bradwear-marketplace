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
  const { currentRoute, setCurrentRoute, theme, setTheme, selectedProduct, products } = useStore();
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

  return (
    <div className="min-h-screen w-full bg-[var(--surface-subtle)] text-[var(--text-primary)]">
      <div className="min-h-screen w-full">
        <div className="web-shell min-h-screen overflow-hidden">
          <SiteHeader
            currentRoute={currentRoute}
            theme={theme}
            selectedProductName={selectedProduct?.name}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
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

          <div className={`fixed right-5 z-50 flex flex-col items-end gap-3 ${currentRoute === RouteKey.EDITOR ? 'bottom-24' : 'bottom-5'}`}>
            {showBradAiWidget ? (
              <div className="animate-fade-in-up w-[min(92vw,420px)] max-h-[min(78vh,720px)]">
                <BradAiChat variant="widget" onClose={() => setShowBradAiWidget(false)} />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setShowBradAiWidget((current) => !current)}
              className={`inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-black tracking-tight shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'border border-[#8dfc35]/20 bg-[linear-gradient(135deg,#6cf30c,#224d0d)] text-[#041102]'
                  : 'bg-[linear-gradient(135deg,#75f21a,#2c7a12)] text-[#071106]'
              }`}
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg ${theme === 'dark' ? 'bg-black/15 text-[#031001]' : 'bg-white/25 text-white'}`}>AI</span>
              Brodi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
