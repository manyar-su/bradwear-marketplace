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
import CustomerServiceDock from './components/CustomerServiceDock';

const App: React.FC = () => {
  const { currentRoute, currentPathname, setCurrentRoute, selectedProduct, products, setPreferredCatalogCategory } = useStore();
  const [showBradAiWidget, setShowBradAiWidget] = React.useState(false);
  const [showCustomerServiceDock, setShowCustomerServiceDock] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  useEffect(() => {
    preloadCriticalAssets();
  }, []);

  useEffect(() => {
    if ((currentRoute === RouteKey.EDITOR || currentRoute === RouteKey.SUMMARY) && !selectedProduct) {
      setCurrentRoute(RouteKey.HOME, { replace: true });
    }
  }, [currentRoute, selectedProduct, setCurrentRoute]);

  useEffect(() => {
    applySeoMeta(currentRoute, currentPathname, products, SITE_FAQS);
  }, [currentRoute, currentPathname, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.querySelector('main')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentPathname]);

  useEffect(() => {
    setShowBradAiWidget(false);
    setShowCustomerServiceDock(false);
  }, [currentPathname]);

  useEffect(() => {
    const main = document.querySelector('main');
    const threshold = 140;

    const updateScrollTopVisibility = () => {
      const mainScrollable = main instanceof HTMLElement ? main : null;
      const hasMainOverflow = mainScrollable
        ? mainScrollable.scrollHeight - mainScrollable.clientHeight > threshold
        : false;
      const mainAtBottom = hasMainOverflow && mainScrollable
        ? mainScrollable.scrollHeight - mainScrollable.scrollTop - mainScrollable.clientHeight <= threshold
        : false;
      const hasWindowOverflow = document.documentElement.scrollHeight - window.innerHeight > threshold;
      const windowAtBottom =
        hasWindowOverflow && document.documentElement.scrollHeight - window.scrollY - window.innerHeight <= threshold;

      setShowScrollTop(mainAtBottom || windowAtBottom);
    };

    updateScrollTopVisibility();

    window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
    window.addEventListener('resize', updateScrollTopVisibility);
    main?.addEventListener('scroll', updateScrollTopVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollTopVisibility);
      window.removeEventListener('resize', updateScrollTopVisibility);
      main?.removeEventListener('scroll', updateScrollTopVisibility);
    };
  }, [currentPathname]);

  const handleScrollTop = React.useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.querySelector('main')?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--surface-subtle)] text-[var(--text-primary)]">
      <div className="min-h-screen w-full">
        <div className="web-shell min-h-screen overflow-hidden">
          <SiteHeader
            currentRoute={currentRoute}
            selectedProductName={selectedProduct?.name}
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
              {showCustomerServiceDock ? (
                <div className="animate-fade-in-up w-[min(96vw,400px)] max-h-[calc(100dvh-5.25rem)]">
                  <CustomerServiceDock
                    currentRoute={currentRoute}
                    currentPathname={currentPathname}
                    onClose={() => setShowCustomerServiceDock(false)}
                  />
                </div>
              ) : null}
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                {showScrollTop ? (
                  <button
                    type="button"
                    onClick={handleScrollTop}
                    className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[linear-gradient(135deg,#ffffff,#ecfccb)] px-3 py-2 text-xs font-black tracking-tight text-[var(--text-primary)] shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 sm:px-4 sm:py-3 sm:text-sm"
                    aria-label="Scroll ke atas"
                  >
                    <span className="text-sm sm:text-base">^</span>
                    Up
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setShowBradAiWidget(false);
                    setShowCustomerServiceDock((current) => !current);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(117,242,26,0.22)] bg-[linear-gradient(135deg,#ffffff,#f5faef)] px-3 py-2 text-xs font-black tracking-tight text-[var(--text-primary)] shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#1f4d17)] text-[11px] font-black uppercase tracking-[0.18em] text-white sm:h-10 sm:w-10">
                    CS
                  </span>
                  CS Aktif
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerServiceDock(false);
                    setShowBradAiWidget((current) => !current);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#75f21a,#2c7a12)] px-3 py-2 text-xs font-black tracking-tight text-[#071106] shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-base text-white sm:h-10 sm:w-10 sm:text-lg">AI</span>
                  Brodi
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
