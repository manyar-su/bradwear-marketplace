import React from 'react';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';
import { buildConsultationMessage, buildWhatsAppUrl } from '../lib/siteConfig';

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

type HeaderMenuSection = {
  title: string;
  items: HeaderNavItem[];
};

const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Beranda', route: RouteKey.HOME, homeSection: 'hero' },
  { label: '3D', route: RouteKey.THREE_D },
  { label: 'Katalog', route: RouteKey.KATALOG },
  { label: 'Download', route: RouteKey.DOWNLOAD },
  { label: 'Artikel', route: RouteKey.ARTIKEL },
  { label: 'Galeri Klien', route: RouteKey.CLIENT },
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
      { label: 'Download', route: RouteKey.DOWNLOAD },
      { label: 'Artikel', route: RouteKey.ARTIKEL },
      { label: 'Galeri Klien', route: RouteKey.CLIENT },
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

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="catalog-header-icon" fill="none" stroke="currentColor" strokeWidth="1.9">
    <circle cx="11" cy="11" r="6.5" />
    <path strokeLinecap="round" d="M16 16l4.2 4.2" />
  </svg>
);

const CatalogIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="catalog-header-button-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="catalog-header-button-icon" fill="currentColor">
    <path d="M20.5 11.86a8.44 8.44 0 0 1-12.47 7.4l-4.03 1.05 1.08-3.92a8.44 8.44 0 1 1 15.42-4.53Zm-8.43-7.02a7 7 0 0 0-6.07 10.5l.22.36-.64 2.3 2.36-.62.35.21a7 7 0 1 0 3.78-12.75Zm3.95 8.86c-.22-.11-1.3-.64-1.5-.71-.2-.08-.34-.11-.48.11-.15.22-.56.71-.69.86-.13.15-.26.17-.48.06-.22-.11-.92-.34-1.75-1.08-.65-.58-1.09-1.29-1.22-1.51-.13-.22-.01-.34.1-.45.1-.1.22-.26.34-.39.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.39-.06-.11-.48-1.16-.66-1.59-.17-.41-.34-.35-.48-.36h-.41c-.14 0-.37.05-.56.26-.19.22-.74.72-.74 1.76s.76 2.04.87 2.18c.11.15 1.49 2.28 3.6 3.2.5.22.89.35 1.19.45.5.16.95.14 1.31.09.4-.06 1.3-.53 1.48-1.04.19-.51.19-.94.13-1.04-.05-.09-.2-.15-.42-.26Z" />
  </svg>
);

const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentRoute,
  selectedProductName,
  onNavigate,
  onSelectCatalogCategory: _onSelectCatalogCategory,
}) => {
  const mobileMenuRef = React.useRef<HTMLDetailsElement | null>(null);
  const isCatalogHeader = currentRoute === RouteKey.KATALOG || currentRoute === RouteKey.PANTS;

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

  if (isCatalogHeader) {
    return (
      <header className="site-header site-header-dark site-header-catalog">
        <div className="site-nav site-nav-catalog">
          <details ref={mobileMenuRef} className="mobile-main-menu catalog-main-menu">
            <summary className="mobile-main-menu-trigger catalog-main-menu-trigger" aria-label="Buka menu utama">
              <span />
              <span />
              <span />
            </summary>
            <div className="mobile-main-menu-panel catalog-main-menu-panel">
              <div className="mobile-main-menu-groups">
                {MOBILE_MENU_SECTIONS.map((section) => (
                  <div key={section.title} className="mobile-main-menu-group">
                    <p className="mobile-main-menu-heading">{section.title}</p>
                    <ul className="mobile-main-menu-list">
                      {section.items.map((item) => (
                        <li key={`${item.label}-${item.route}-${item.homeSection ?? 'route'}`}>
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
                ))}
              </div>
            </div>
          </details>

          <button type="button" className="brand-mark brand-mark-single catalog-brand-mark" onClick={() => onNavigate(RouteKey.HOME)} aria-label="Bradwear home">
            <span className="brand-mark-shell">
              <img src={ASSETS.BRAND.LOGO} alt="Bradwear" className="h-10 w-auto object-contain" />
            </span>
          </button>

          <div className="catalog-header-actions">
            <button
              type="button"
              className="catalog-header-icon-button"
              onClick={() => {
                const target = document.querySelector<HTMLElement>('[data-catalog-filter-band="true"]');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  return;
                }
                onNavigate(RouteKey.KATALOG);
              }}
              aria-label="Lompat ke filter katalog"
            >
              <SearchIcon />
            </button>

            <button type="button" onClick={() => onNavigate(RouteKey.KATALOG)} className="catalog-header-pill-button catalog-header-pill-button-light">
              <CatalogIcon />
              <span>Katalog</span>
            </button>

            <a
              href={buildWhatsAppUrl(buildConsultationMessage('konsultasi model seragam custom dari halaman katalog'))}
              target="_blank"
              rel="noreferrer"
              className="catalog-header-pill-button catalog-header-pill-button-brand"
            >
              <WhatsAppIcon />
              <span>Konsultasi</span>
            </a>
          </div>
        </div>
      </header>
    );
  }

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
            <div className="mobile-main-menu-groups">
              {MOBILE_MENU_SECTIONS.map((section) => (
                <div key={section.title} className="mobile-main-menu-group">
                  <p className="mobile-main-menu-heading">{section.title}</p>
                  <ul className="mobile-main-menu-list">
                    {section.items.map((item) => (
                      <li key={`${item.label}-${item.route}-${item.homeSection ?? 'route'}`}>
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
