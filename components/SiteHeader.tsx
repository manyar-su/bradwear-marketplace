import React from 'react';
import { PRIMARY_NAV_ITEMS, ROUTE_LABELS, UTILITY_NAV_ITEMS } from '../lib/siteConfig';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  selectedProductName?: string | null;
  onNavigate: (route: RouteKey) => void;
  onSelectCatalogCategory: (category: Category) => void;
}

const flowRoutes = [RouteKey.HOME, RouteKey.EDITOR, RouteKey.SUMMARY];
const catalogCategories: Category[] = ['Kemeja', 'Jaket', 'Celana', 'Rompi', 'Polo'];

const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  selectedProductName,
  onNavigate,
  onSelectCatalogCategory,
}) => {
  const [isDesktopCatalogOpen, setIsDesktopCatalogOpen] = React.useState(false);
  const isCatalogRoute = currentRoute === RouteKey.KATALOG || currentRoute === RouteKey.PANTS;

  return (
    <header className="site-header">
      <div className="site-utility">
        <div className="site-utility-leading">
          <button className="brand-mark brand-mark-utility" onClick={() => onNavigate(RouteKey.HOME)} aria-label="Bradwear home">
            <span className="brand-mark-shell">
              <img src={ASSETS.BRAND.LOGO} alt="Bradwear" className="h-10 w-auto object-contain" />
            </span>
          </button>
          <span className="route-chip route-chip-utility">{ROUTE_LABELS[currentRoute]}</span>
        </div>

        <div className="site-utility-links">
          {UTILITY_NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.route)}
              className="site-utility-link"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="site-utility-controls">
          <details className="mobile-main-menu">
            <summary className="market-link mobile-main-menu-trigger">Menu</summary>
            <div className="mobile-main-menu-panel">
              {PRIMARY_NAV_ITEMS.map((item) =>
                item.route === RouteKey.KATALOG ? (
                  <details key={item.route} className="catalog-dropdown mobile-catalog-dropdown">
                    <summary
                      className={`market-link catalog-dropdown-trigger mobile-main-menu-link ${
                        isCatalogRoute ? 'bg-[var(--surface-soft)] text-[var(--brand-accent-strong)]' : ''
                      }`}
                    >
                      {item.label}
                    </summary>
                    <div className="catalog-dropdown-menu mobile-catalog-dropdown-menu">
                      {catalogCategories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={(event) => {
                            onSelectCatalogCategory(category);
                            event.currentTarget.closest('.mobile-main-menu')?.removeAttribute('open');
                          }}
                          className="catalog-dropdown-item"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </details>
                ) : (
                  <button
                    key={item.route}
                    type="button"
                    onClick={(event) => {
                      onNavigate(item.route);
                      event.currentTarget.closest('.mobile-main-menu')?.removeAttribute('open');
                    }}
                    className={`market-link mobile-main-menu-link ${currentRoute === item.route ? 'bg-[var(--surface-soft)] text-[var(--brand-accent-strong)]' : ''}`}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>
          </details>
          <span className="route-chip route-chip-mobile">{ROUTE_LABELS[currentRoute]}</span>
          <button
            type="button"
            onClick={() => onNavigate(selectedProductName ? RouteKey.EDITOR : RouteKey.KATALOG)}
            className="design-cta design-cta-mobile"
          >
            Mulai Desain
          </button>
        </div>
      </div>

      <div className="site-nav">
        <nav aria-label="Menu marketplace" className="market-nav">
          <ul className="no-scrollbar market-nav-desktop flex items-center gap-1 overflow-x-auto">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <li key={item.route}>
                {item.route === RouteKey.KATALOG ? (
                  <div
                    className={`catalog-dropdown ${isDesktopCatalogOpen ? 'is-open' : ''}`}
                    onMouseEnter={() => setIsDesktopCatalogOpen(true)}
                    onMouseLeave={() => setIsDesktopCatalogOpen(false)}
                    onFocusCapture={() => setIsDesktopCatalogOpen(true)}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setIsDesktopCatalogOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isDesktopCatalogOpen}
                      aria-haspopup="menu"
                      className={`market-link catalog-dropdown-trigger ${
                        isCatalogRoute ? 'bg-[var(--surface-soft)] text-[var(--brand-accent-strong)]' : ''
                      }`}
                      onClick={() => onNavigate(RouteKey.KATALOG)}
                    >
                      {item.label}
                    </button>
                    <div className="catalog-dropdown-menu" hidden={!isDesktopCatalogOpen}>
                      {catalogCategories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            onSelectCatalogCategory(category);
                            setIsDesktopCatalogOpen(false);
                          }}
                          className="catalog-dropdown-item"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className={`market-link ${currentRoute === item.route ? 'bg-[var(--surface-soft)] text-[var(--brand-accent-strong)]' : ''}`}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <div className="nav-route-details">
            <span className="route-chip route-chip-desktop">{ROUTE_LABELS[currentRoute]}</span>
          </div>

          <div className="nav-action-row">
            <button
              type="button"
              onClick={() => onNavigate(selectedProductName ? RouteKey.EDITOR : RouteKey.KATALOG)}
              className="design-cta"
            >
              Mulai Desain
            </button>
          </div>

          <ul className="flow-nav" aria-label="Alur aplikasi">
            {flowRoutes.map((route) => (
              <li key={route}>
                <button
                  type="button"
                  onClick={() => onNavigate(route)}
                  className={`flow-link ${currentRoute === route ? 'is-active' : ''}`}
                >
                  {route === RouteKey.HOME ? 'Beranda' : route === RouteKey.EDITOR ? 'Editor' : 'Ringkasan'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
