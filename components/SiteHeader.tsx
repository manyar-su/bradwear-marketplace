import React from 'react';
import { PRIMARY_NAV_ITEMS, ROUTE_LABELS, UTILITY_NAV_ITEMS } from '../lib/siteConfig';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  theme: 'light' | 'dark';
  selectedProductName?: string | null;
  onToggleTheme: () => void;
  onNavigate: (route: RouteKey) => void;
  onSelectCatalogCategory: (category: Category) => void;
}

const flowRoutes = [RouteKey.HOME, RouteKey.EDITOR, RouteKey.SUMMARY];
const catalogCategories: Category[] = ['Kemeja', 'Jaket', 'Celana', 'Rompi', 'Polo'];

const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  theme,
  selectedProductName,
  onToggleTheme,
  onNavigate,
  onSelectCatalogCategory,
}) => {
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
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle theme-toggle-utility"
            aria-label={theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
          >
            <span className={`theme-toggle-option ${theme === 'light' ? 'is-active' : ''}`}>Light</span>
            <span className={`theme-toggle-option ${theme === 'dark' ? 'is-active' : ''}`}>Dark</span>
          </button>
          <span className="locale-chip">ID</span>
        </div>
      </div>

      <div className="site-nav">
        <button className="brand-mark brand-mark-mobile" onClick={() => onNavigate(RouteKey.HOME)} aria-label="Bradwear home">
          <span className="brand-mark-shell">
            <img src={ASSETS.BRAND.LOGO} alt="Bradwear" className="h-10 w-auto object-contain" />
          </span>
        </button>

        <nav aria-label="Menu marketplace" className="market-nav">
          <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <li key={item.route}>
                {item.route === RouteKey.KATALOG ? (
                  <details className="catalog-dropdown">
                    <summary
                      className={`market-link catalog-dropdown-trigger ${
                        currentRoute === RouteKey.KATALOG ? 'bg-[var(--surface-soft)] text-[var(--brand-accent-strong)]' : ''
                      }`}
                    >
                      {item.label}
                    </summary>
                    <div className="catalog-dropdown-menu">
                      {catalogCategories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={(event) => {
                            onSelectCatalogCategory(category);
                            event.currentTarget.closest('details')?.removeAttribute('open');
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
            <span className="route-chip route-chip-mobile">{ROUTE_LABELS[currentRoute]}</span>
          </div>

          <div className="nav-action-row">
            <button
              type="button"
              onClick={() => onNavigate(selectedProductName ? RouteKey.EDITOR : RouteKey.KATALOG)}
              className="design-cta"
            >
              Mulai Design Custom
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
                  {route === RouteKey.HOME ? 'Home' : route === RouteKey.EDITOR ? 'Editor' : 'Summary'}
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
