import React from 'react';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';

interface SiteHeaderProps {
  currentRoute: RouteKey;
  selectedProductName?: string | null;
  onNavigate: (route: RouteKey) => void;
  onSelectCatalogCategory: (category: Category) => void;
  onOpenCatalogGuide?: (guide: 'size' | 'material') => void;
}

type HeaderNavItem = {
  label: string;
  route: RouteKey;
  homeSection?: string;
  catalogGuide?: 'size' | 'material';
};

type HeaderMenuSection = {
  title: string;
  items: HeaderNavItem[];
};

const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Beranda', route: RouteKey.HOME, homeSection: 'hero' },
  { label: '3D', route: RouteKey.THREE_D },
  { label: 'Katalog', route: RouteKey.KATALOG },
  { label: 'Panduan Ukuran', route: RouteKey.KATALOG, catalogGuide: 'size' },
  { label: 'Jenis Bahan', route: RouteKey.KATALOG, catalogGuide: 'material' },
  { label: 'Download', route: RouteKey.DOWNLOAD },
  { label: 'Artikel', route: RouteKey.ARTIKEL },
  { label: 'Portofolio', route: RouteKey.CLIENT },
  { label: 'Testimoni', route: RouteKey.TESTIMONI },
  { label: 'Cara Order', route: RouteKey.CARA_ORDER },
  { label: 'FAQ', route: RouteKey.LAYANAN_PELANGGAN },
];

const MOBILE_MENU_SECTIONS: HeaderMenuSection[] = [
  {
    title: 'Navigasi Utama',
    items: [
      { label: 'Beranda', route: RouteKey.HOME, homeSection: 'hero' },
      { label: 'Studio 3D', route: RouteKey.THREE_D },
      { label: 'Katalog', route: RouteKey.KATALOG },
      { label: 'Panduan Ukuran', route: RouteKey.KATALOG, catalogGuide: 'size' },
      { label: 'Jenis Bahan', route: RouteKey.KATALOG, catalogGuide: 'material' },
      { label: 'Download', route: RouteKey.DOWNLOAD },
      { label: 'Artikel', route: RouteKey.ARTIKEL },
      { label: 'Portofolio', route: RouteKey.CLIENT },
      { label: 'Testimoni', route: RouteKey.TESTIMONI },
      { label: 'Cara Order', route: RouteKey.CARA_ORDER },
      { label: 'FAQ', route: RouteKey.LAYANAN_PELANGGAN },
    ],
  },
  {
    title: 'Profil Bradwear',
    items: [
      { label: 'Tentang Kami', route: RouteKey.ABOUT },
      { label: 'Visi & Misi', route: RouteKey.VISION_MISSION },
      { label: 'Produk & Jasa', route: RouteKey.PRODUCTS_SERVICES },
      { label: 'Keunggulan', route: RouteKey.COMPETITIVE_ADVANTAGE },
      { label: 'Klien & Jangkauan', route: RouteKey.CLIENT_REACH },
    ],
  },
  {
    title: 'Bantuan & Legal',
    items: [
      { label: 'Lacak Pesanan', route: RouteKey.LACAK_PESANAN },
      { label: 'Temukan Toko', route: RouteKey.TEMUKAN_TOKO },
      { label: 'Layanan Pelanggan', route: RouteKey.LAYANAN_PELANGGAN },
      { label: 'Legal & Lisensi', route: RouteKey.LEGAL_LICENSE },
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

  const handleHeaderNavigation = (route: RouteKey, homeSection?: string, catalogGuide?: 'size' | 'material') => {
    mobileMenuRef.current?.removeAttribute('open');
    if (catalogGuide && onOpenCatalogGuide) {
      onOpenCatalogGuide(catalogGuide);
      return;
    }
    navigateToHomeSection(route, homeSection);
  };

  return (
    <header className="site-header site-header-dark">
      <div className="site-nav site-nav-single">
        <button type="button" className="brand-mark brand-mark-single" onClick={() => handleHeaderNavigation(RouteKey.HOME, 'hero')} aria-label="Bradwear home">
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
                  onClick={() => handleHeaderNavigation(item.route, item.homeSection, item.catalogGuide)}
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
            <div className="mobile-main-menu-groups">
              {MOBILE_MENU_SECTIONS.map((section) => (
                <div key={section.title} className="mobile-main-menu-group">
                  <p className="mobile-main-menu-heading">{section.title}</p>
                  <ul className="mobile-main-menu-list">
                    {section.items.map((item) => (
                      <li key={`${item.label}-${item.route}-${item.homeSection ?? 'route'}`}>
                        <button
                          type="button"
                          onClick={() => handleHeaderNavigation(item.route, item.homeSection, item.catalogGuide)}
                          className={`mobile-main-menu-link ${isActiveNavItem(item.route, item.homeSection) ? 'is-active' : ''}`}
                        >
                          {item.label}
                        </button>
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
