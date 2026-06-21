import React from 'react';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  selectedProductName?: string | null;
  onNavigate: (route: RouteKey) => void;
  onSelectCatalogCategory: (category: Category) => void;
}

type HeaderNavItem = {
  label: string;
  route: RouteKey;
  homeSection?: string;
};

const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Beranda', route: RouteKey.HOME, homeSection: 'hero' },
  { label: '3D', route: RouteKey.THREE_D },
  { label: 'Katalog', route: RouteKey.KATALOG },
  { label: 'Galeri Klien', route: RouteKey.CLIENT },
  { label: 'Cara Order', route: RouteKey.CARA_ORDER },
  { label: 'FAQ', route: RouteKey.LAYANAN_PELANGGAN },
];

const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  selectedProductName,
  onNavigate,
  onSelectCatalogCategory: _onSelectCatalogCategory,
}) => {
  const mobileMenuRef = React.useRef<HTMLDetailsElement | null>(null);

  const isActiveNavItem = (route: RouteKey, homeSection?: string) => {
    if (currentRoute === RouteKey.HOME) {
      return homeSection === 'hero';
    }

    return currentRoute === route;
  };

  const navigateToHomeSection = (route: RouteKey, homeSection?: string) => {
    if (!homeSection) {
      onNavigate(route);
      return;
    }

    const scrollToSection = () => {
      const target = document.querySelector<HTMLElement>(`[data-home-section="${homeSection}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (currentRoute === RouteKey.HOME) {
      scrollToSection();
      return;
    }

    onNavigate(RouteKey.HOME);
    window.setTimeout(scrollToSection, 180);
  };

  const handleHeaderNavigation = (route: RouteKey, homeSection?: string) => {
    mobileMenuRef.current?.removeAttribute('open');
    navigateToHomeSection(route, homeSection);
  };

  return (
    <header className="site-header site-header-dark">
      <div className="site-nav site-nav-single">
        <button className="brand-mark brand-mark-single" onClick={() => handleHeaderNavigation(RouteKey.HOME, 'hero')} aria-label="Bradwear home">
          <span className="brand-mark-shell">
            <img src={ASSETS.BRAND.LOGO} alt="Bradwear" className="h-10 w-auto object-contain" />
          </span>
        </button>

        <nav aria-label="Menu marketplace" className="market-nav market-nav-desktop">
          <ul className="no-scrollbar header-nav-list">
            {HEADER_NAV_ITEMS.map((item) => (
              <li key={item.route}>
                <button
                  type="button"
                  onClick={() => handleHeaderNavigation(item.route, item.homeSection)}
                  className={`market-link header-nav-link ${isActiveNavItem(item.route, item.homeSection) ? 'is-active' : ''}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <details ref={mobileMenuRef} className="mobile-main-menu">
          <summary className="mobile-main-menu-trigger">Menu</summary>
          <div className="mobile-main-menu-panel">
            <ul className="mobile-main-menu-list">
              {HEADER_NAV_ITEMS.map((item) => (
                <li key={item.route}>
                  <button
                    type="button"
                    onClick={() => handleHeaderNavigation(item.route, item.homeSection)}
                    className={`mobile-main-menu-link ${isActiveNavItem(item.route, item.homeSection) ? 'is-active' : ''}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <button
          type="button"
          onClick={() => onNavigate(selectedProductName ? RouteKey.EDITOR : RouteKey.KATALOG)}
          className="design-cta header-primary-cta"
        >
          <span className="header-primary-cta-label-full">Mulai Desain</span>
          <span className="header-primary-cta-label-compact">Desain</span>
        </button>
      </div>
    </header>
  );
};

export default SiteHeader;
