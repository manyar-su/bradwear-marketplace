import React from 'react';
import { PRIMARY_NAV_ITEMS, ROUTE_LABELS, UTILITY_NAV_ITEMS } from '../lib/siteConfig';
import { RouteKey } from '../types';
import { ASSETS } from '../assets';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  selectedProductName?: string | null;
  onNavigate: (route: RouteKey) => void;
}

const flowRoutes = [RouteKey.HOME, RouteKey.EDITOR, RouteKey.SUMMARY];

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentRoute, selectedProductName, onNavigate }) => {
  return (
    <header className="site-header">
      <div className="hidden items-center justify-end gap-2 border-b border-[var(--border-soft)] px-5 py-2 text-[11px] text-[var(--text-muted)] md:flex">
        {UTILITY_NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.route)}
            className="rounded-full px-3 py-1 transition hover:bg-[var(--surface-soft)] hover:text-[var(--brand-accent-strong)]"
          >
            {item.label}
          </button>
        ))}
        <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 font-semibold text-[var(--text-secondary)]">ID</span>
      </div>

      <div className="site-nav">
        <button className="brand-mark" onClick={() => onNavigate(RouteKey.HOME)} aria-label="Bradwear home">
          <img src={ASSETS.BRAND.LOGO} alt="Bradwear" className="h-10 w-auto object-contain" />
        </button>

        <nav aria-label="Menu marketplace" className="market-nav">
          <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <li key={item.route}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className={`market-link ${currentRoute === item.route ? 'bg-[var(--surface-soft)] text-[var(--brand-accent-strong)]' : ''}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <div className="hidden min-w-0 md:block">
            <span className="route-chip">{ROUTE_LABELS[currentRoute]}</span>
            {selectedProductName ? (
              <p className="mt-2 max-w-[220px] truncate text-[11px] font-semibold text-[var(--text-muted)]">{selectedProductName}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onNavigate(selectedProductName ? RouteKey.EDITOR : RouteKey.KATALOG)}
            className="design-cta"
          >
            Mulai Design Custom
          </button>
          <ul className="hidden items-center gap-4 xl:flex" aria-label="Alur aplikasi">
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
