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
  const { currentRoute, setCurrentRoute, setTheme, selectedProduct, products } = useStore();
  const [showBradAiWidget, setShowBradAiWidget] = React.useState(false);

  useEffect(() => {
    preloadCriticalAssets();
    setTheme('light');
  }, [setTheme]);

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
            selectedProductName={selectedProduct?.name}
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
                <div className="flex min-h-[70vh] items-center justify-center bg-white">
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

          <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            {showBradAiWidget ? (
              <div className="w-[min(92vw,420px)]">
                <BradAiChat variant="widget" onClose={() => setShowBradAiWidget(false)} />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setShowBradAiWidget((current) => !current)}
              className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#ef4444,#7c3aed)] px-5 py-3 text-sm font-black tracking-tight text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg">AI</span>
              Brad Ai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
