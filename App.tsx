import React, { useEffect } from 'react';
import { RouteKey } from './types';
const PublicSiteView = React.lazy(() => import('./components/PublicSiteView'));
const DesignEditorView = React.lazy(() => import('./components/DesignEditorView'));
const SummaryView = React.lazy(() => import('./components/SummaryView'));
import { preloadCriticalAssets } from './assets';
import { useStore } from './context/StoreContext';
import { SITE_FAQS, buildCustomerServiceMessage, getConsultationTopicForPath } from './lib/siteConfig';
import { applySeoMeta } from './lib/seo';
import { CUSTOMER_SERVICE_DIALOG_EVENT, CustomerServiceDialogDetail } from './lib/customerServiceDialog';
import SiteHeader from './components/SiteHeader';
import CustomerServicePickerModal from './components/CustomerServicePickerModal';

const FloatingWhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
    <path d="M20.52 11.84a8.52 8.52 0 0 1-12.57 7.48l-4.07 1.04 1.09-3.95A8.52 8.52 0 1 1 20.52 11.84Zm-8.5-7.1a7.08 7.08 0 0 0-6.13 10.63l.23.37-.64 2.33 2.4-.63.35.21a7.08 7.08 0 1 0 3.79-12.91Zm4 8.95c-.23-.11-1.31-.64-1.52-.72-.2-.07-.34-.1-.49.11-.14.23-.56.72-.69.87-.13.14-.26.17-.49.05-.23-.1-.93-.34-1.77-1.08-.65-.58-1.1-1.3-1.23-1.52-.12-.21-.01-.33.1-.44.1-.1.23-.26.34-.39.11-.13.14-.22.22-.37.08-.14.04-.28-.02-.39-.06-.11-.48-1.16-.66-1.58-.17-.42-.35-.36-.48-.37h-.41c-.14 0-.37.06-.57.27-.2.21-.75.73-.75 1.77 0 1.03.77 2.04.88 2.17.11.15 1.5 2.3 3.64 3.22.5.22.9.36 1.2.45.5.16.96.14 1.32.09.41-.06 1.31-.53 1.5-1.04.18-.51.18-.94.12-1.04-.05-.09-.2-.15-.42-.26Z" />
  </svg>
);

const App: React.FC = () => {
  const { currentRoute, currentPathname, setCurrentRoute, selectedProduct, products, setPreferredCatalogCategory } = useStore();
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [customerServiceRequest, setCustomerServiceRequest] = React.useState<CustomerServiceDialogDetail | null>(null);

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
    setCustomerServiceRequest(null);
  }, [currentPathname]);

  useEffect(() => {
    const openDialog = (event: Event) => {
      const customEvent = event as CustomEvent<CustomerServiceDialogDetail>;
      if (!customEvent.detail?.message) return;
      setCustomerServiceRequest(customEvent.detail);
    };

    window.addEventListener(CUSTOMER_SERVICE_DIALOG_EVENT, openDialog as EventListener);
    return () => window.removeEventListener(CUSTOMER_SERVICE_DIALOG_EVENT, openDialog as EventListener);
  }, []);

  useEffect(() => {
    const interceptWhatsAppLinks = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.dataset.directWhatsapp === 'true') return;

      const href = link.href;
      if (!href || (!href.includes('wa.me/') && !href.includes('api.whatsapp.com/send'))) return;

      const parsed = new URL(href);
      const message = parsed.searchParams.get('text');
      if (!message) return;

      event.preventDefault();
      setCustomerServiceRequest({
        message,
        title: 'Pilih customer service yang Anda inginkan',
      });
    };

    document.addEventListener('click', interceptWhatsAppLinks);
    return () => document.removeEventListener('click', interceptWhatsAppLinks);
  }, []);

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

  const openCustomerServicePicker = React.useCallback(() => {
    const topic = getConsultationTopicForPath(currentRoute, currentPathname);
    setCustomerServiceRequest({
      message: buildCustomerServiceMessage(topic),
      title: 'Pilih WhatsApp customer service',
      description: 'Pilih admin yang ingin Anda hubungi. Pesan akan langsung dibawa sesuai halaman yang sedang Anda buka.',
    });
  }, [currentPathname, currentRoute]);

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
                  onClick={openCustomerServicePicker}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(37,211,102,0.26)] bg-[linear-gradient(135deg,#ffffff,#f4fff8)] px-3 py-2 text-xs font-black tracking-tight text-[var(--text-primary)] shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
                  aria-label="Buka pilihan WhatsApp customer service"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#25d366,#16803c)] text-white shadow-[0_12px_24px_rgba(37,211,102,0.28)] sm:h-10 sm:w-10">
                    <FloatingWhatsAppIcon />
                  </span>
                  WhatsApp
                </button>
              </div>
            </div>
          ) : null}

          <CustomerServicePickerModal
            request={customerServiceRequest}
            onClose={() => setCustomerServiceRequest(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
