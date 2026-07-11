import React from 'react';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';
import { CATEGORY_ROUTE_PATHS, INFO_ROUTE_PATHS, ROUTE_PATHS } from '../lib/siteConfig';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  selectedProductName?: string | null;
  onNavigate: (route: RouteKey, options?: { path?: string }) => void;
  onSelectCatalogCategory: (category: Category) => void;
  onOpenCatalogGuide?: (guide: 'size' | 'material') => void;
}

type HeaderNavItem = {
  label: string;
  route: RouteKey;
  path?: string;
  homeSection?: string;
  catalogGuide?: 'size' | 'material';
};

type HeaderMenuSection = {
  title: string;
  items: HeaderNavItem[];
};

const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Beranda', route: RouteKey.HOME, path: ROUTE_PATHS[RouteKey.HOME], homeSection: 'hero' },
  { label: 'Kemeja Dinas', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.KEMEJA_DINAS },
  { label: 'PDH & PDL', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.PDH_PDL },
  { label: 'Wearpack', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.WEARPACK },
  { label: 'Polo & Jaket', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.POLO_JAKET },
  { label: 'Celana Tactical', route: RouteKey.PANTS, path: ROUTE_PATHS[RouteKey.PANTS] },
  { label: 'Katalog', route: RouteKey.KATALOG, path: ROUTE_PATHS[RouteKey.KATALOG] },
  { label: 'Galeri Client', route: RouteKey.CLIENT, path: ROUTE_PATHS[RouteKey.CLIENT] },
  { label: 'Tentang Kami', route: RouteKey.ABOUT, path: ROUTE_PATHS[RouteKey.ABOUT] },
  { label: 'Kontak', route: RouteKey.TEMUKAN_TOKO, path: ROUTE_PATHS[RouteKey.TEMUKAN_TOKO] },
];

const MOBILE_MENU_SECTIONS: HeaderMenuSection[] = [
  {
    title: 'Navigasi Utama',
    items: [
      { label: 'Beranda', route: RouteKey.HOME, homeSection: 'hero' },
      { label: 'Kemeja Dinas', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.KEMEJA_DINAS },
      { label: 'PDH & PDL', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.PDH_PDL },
      { label: 'Wearpack', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.WEARPACK },
      { label: 'Polo & Jaket', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.POLO_JAKET },
      { label: 'Celana Tactical', route: RouteKey.PANTS, path: ROUTE_PATHS[RouteKey.PANTS] },
      { label: 'Katalog', route: RouteKey.KATALOG, path: ROUTE_PATHS[RouteKey.KATALOG] },
      { label: 'Galeri Client', route: RouteKey.CLIENT, path: ROUTE_PATHS[RouteKey.CLIENT] },
      { label: 'Tentang Kami', route: RouteKey.ABOUT, path: ROUTE_PATHS[RouteKey.ABOUT] },
      { label: 'Kontak', route: RouteKey.TEMUKAN_TOKO, path: ROUTE_PATHS[RouteKey.TEMUKAN_TOKO] },
    ],
  },
  {
    title: 'Panduan',
    items: [
      { label: 'Panduan Ukuran', route: RouteKey.KATALOG, path: ROUTE_PATHS[RouteKey.KATALOG], catalogGuide: 'size' },
      { label: 'Jenis Bahan', route: RouteKey.KATALOG, path: ROUTE_PATHS[RouteKey.KATALOG], catalogGuide: 'material' },
      { label: 'Artikel', route: RouteKey.ARTIKEL, path: ROUTE_PATHS[RouteKey.ARTIKEL] },
      { label: 'Cara Order', route: RouteKey.CARA_ORDER, path: ROUTE_PATHS[RouteKey.CARA_ORDER] },
      { label: 'FAQ', route: RouteKey.LAYANAN_PELANGGAN, path: ROUTE_PATHS[RouteKey.LAYANAN_PELANGGAN] },
    ],
  },
  {
    title: 'Bantuan & Legal',
    items: [
      { label: 'Lacak Pesanan', route: RouteKey.LACAK_PESANAN, path: ROUTE_PATHS[RouteKey.LACAK_PESANAN] },
      { label: 'Kebijakan Privasi', route: RouteKey.LAYANAN_PELANGGAN, path: INFO_ROUTE_PATHS.KEBIJAKAN_PRIVASI },
      { label: 'Syarat & Ketentuan', route: RouteKey.LAYANAN_PELANGGAN, path: INFO_ROUTE_PATHS.SYARAT_KETENTUAN },
      { label: 'Studio 3D', route: RouteKey.THREE_D, path: ROUTE_PATHS[RouteKey.THREE_D] },
    ],
  },
];

const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  selectedProductName,
  onNavigate,
  onSelectCatalogCategory: _onSelectCatalogCategory,
  onOpenCatalogGuide,
}) => {
  const mobileMenuRef = React.useRef<HTMLDetailsElement | null>(null);
  const isCatalogRoute = currentRoute === RouteKey.KATALOG || currentRoute === RouteKey.PANTS;

  const isActiveNavItem = (route: RouteKey, homeSection?: string) => {
    if (currentRoute === RouteKey.HOME) {
      return homeSection === 'hero';
    }

    if (route === RouteKey.KATALOG && isCatalogRoute) {
      return true;
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

  const handleHeaderNavigation = (route: RouteKey, path?: string, homeSection?: string, catalogGuide?: 'size' | 'material') => {
    mobileMenuRef.current?.removeAttribute('open');
    if (catalogGuide && onOpenCatalogGuide) {
      onOpenCatalogGuide(catalogGuide);
      return;
    }
    if (path) {
      onNavigate(route, { path });
      return;
    }
    navigateToHomeSection(route, homeSection);
  };

  const handleAnchorNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    route: RouteKey,
    path?: string,
    homeSection?: string,
    catalogGuide?: 'size' | 'material',
  ) => {
    event.preventDefault();
    handleHeaderNavigation(route, path, homeSection, catalogGuide);
  };

  return (
    <header className="site-header site-header-dark">
      <div className="site-nav site-nav-single">
        <a
          href={ROUTE_PATHS[RouteKey.HOME]}
          className="brand-mark brand-mark-single"
          onClick={(event) => handleAnchorNavigation(event, RouteKey.HOME, ROUTE_PATHS[RouteKey.HOME], 'hero')}
          aria-label="Bradwear home"
        >
          <span className="brand-mark-shell">
            <img src={ASSETS.BRAND.LOGO} alt="Bradwear" className="h-10 w-auto object-contain" />
          </span>
        </a>

        <nav aria-label="Navigasi utama" className="market-nav market-nav-desktop">
          <ul className="no-scrollbar header-nav-list">
            {HEADER_NAV_ITEMS.map((item) => (
              <li key={`${item.route}-${item.path ?? item.label}`}>
                <a
                  href={item.path ?? ROUTE_PATHS[item.route]}
                  onClick={(event) => handleAnchorNavigation(event, item.route, item.path, item.homeSection, item.catalogGuide)}
                  className={`market-link header-nav-link ${isActiveNavItem(item.route, item.homeSection) ? 'is-active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <details ref={mobileMenuRef} className="mobile-main-menu">
          <summary className="mobile-main-menu-trigger">Menu</summary>
          <div className="mobile-main-menu-panel">
            <div className="mobile-main-menu-groups">
              {MOBILE_MENU_SECTIONS.map((section) => (
                <div key={section.title} className="mobile-main-menu-group">
                  <p className="mobile-main-menu-heading">{section.title}</p>
                  <ul className="mobile-main-menu-list">
                    {section.items.map((item) => (
                      <li key={`${item.label}-${item.route}-${item.homeSection ?? 'route'}`}>
                        <a
                          href={item.path ?? ROUTE_PATHS[item.route]}
                          onClick={(event) => handleAnchorNavigation(event, item.route, item.path, item.homeSection, item.catalogGuide)}
                          className={`mobile-main-menu-link ${isActiveNavItem(item.route, item.homeSection) ? 'is-active' : ''}`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
