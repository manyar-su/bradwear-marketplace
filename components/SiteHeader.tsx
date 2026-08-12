import React from 'react';
import { Category, RouteKey } from '../types';
import { ASSETS } from '../assets';
import { CATALOG_GUIDE_PATHS, CATEGORY_ROUTE_PATHS, INFO_ROUTE_PATHS, ROUTE_PATHS } from '../lib/siteConfig';

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
  hasMegaMenu?: boolean;
};

type HeaderMenuSection = {
  title: string;
  items: HeaderNavItem[];
};

// Produk mega-menu columns
type MegaMenuColumn = {
  title: string;
  icon: string;
  items: { label: string; desc: string; route: RouteKey; path: string }[];
};

const MEGA_MENU_COLUMNS: MegaMenuColumn[] = [
  {
    title: 'Kemeja',
    icon: '👔',
    items: [
      { label: 'Kemeja Dinas', desc: 'PDH harian instansi & kantor', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.KEMEJA_DINAS },
      { label: 'PDH & PDL', desc: 'Seragam dinas harian & lapangan', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.PDH_PDL },
      { label: 'Wearpack', desc: 'Seragam kerja teknis & industri', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.WEARPACK },
    ],
  },
  {
    title: 'Celana',
    icon: '👖',
    items: [
      { label: 'Celana Tactical', desc: 'Celana operasional & lapangan', route: RouteKey.PANTS, path: ROUTE_PATHS[RouteKey.PANTS] },
      { label: 'Polo & Jaket', desc: 'Polo shirt & jaket promosi event', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.POLO_JAKET },
    ],
  },
  {
    title: 'Lihat Semua',
    icon: '📋',
    items: [
      { label: 'Katalog Lengkap', desc: 'Semua model & kategori produk', route: RouteKey.KATALOG, path: ROUTE_PATHS[RouteKey.KATALOG] },
      { label: 'Panduan Ukuran', desc: 'Tabel ukuran & cara mengukur', route: RouteKey.KATALOG, path: CATALOG_GUIDE_PATHS.size },
      { label: 'Jenis Bahan', desc: 'Perbandingan bahan produksi', route: RouteKey.KATALOG, path: CATALOG_GUIDE_PATHS.material },
    ],
  },
];

// Desktop nav — compact, with mega-menu on "Produk"
const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Beranda', route: RouteKey.HOME, path: ROUTE_PATHS[RouteKey.HOME], homeSection: 'hero' },
  { label: 'Produk', route: RouteKey.KATALOG, path: ROUTE_PATHS[RouteKey.KATALOG], hasMegaMenu: true },
  { label: 'Celana Tactical', route: RouteKey.PANTS, path: ROUTE_PATHS[RouteKey.PANTS] },
  { label: 'Galeri Client', route: RouteKey.CLIENT, path: ROUTE_PATHS[RouteKey.CLIENT] },
  { label: 'Artikel', route: RouteKey.ARTIKEL, path: ROUTE_PATHS[RouteKey.ARTIKEL] },
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
      { label: 'Panduan Ukuran', route: RouteKey.KATALOG, path: CATALOG_GUIDE_PATHS.size },
      { label: 'Jenis Bahan', route: RouteKey.KATALOG, path: CATALOG_GUIDE_PATHS.material },
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
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false);
  const megaMenuRef = React.useRef<HTMLLIElement | null>(null);
  const megaMenuTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCatalogRoute = currentRoute === RouteKey.KATALOG || currentRoute === RouteKey.PANTS;

  const isActiveNavItem = (route: RouteKey, homeSection?: string) => {
    if (currentRoute === RouteKey.HOME) return homeSection === 'hero';
    if (route === RouteKey.KATALOG && isCatalogRoute) return true;
    return currentRoute === route;
  };

  const navigateToHomeSection = (route: RouteKey, homeSection?: string) => {
    if (!homeSection) { onNavigate(route); return; }
    const scrollToSection = () => {
      const target = document.querySelector<HTMLElement>(`[data-home-section="${homeSection}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (currentRoute === RouteKey.HOME) { scrollToSection(); return; }
    onNavigate(RouteKey.HOME);
    window.setTimeout(scrollToSection, 180);
  };

  const handleHeaderNavigation = (route: RouteKey, path?: string, homeSection?: string, catalogGuide?: 'size' | 'material') => {
    mobileMenuRef.current?.removeAttribute('open');
    setMegaMenuOpen(false);
    if (catalogGuide && onOpenCatalogGuide) { onOpenCatalogGuide(catalogGuide); return; }
    if (path) { onNavigate(route, { path }); return; }
    navigateToHomeSection(route, homeSection);
  };

  const handleAnchorNavigation = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    route: RouteKey,
    path?: string,
    homeSection?: string,
    catalogGuide?: 'size' | 'material',
  ) => {
    event.preventDefault();
    handleHeaderNavigation(route, path, homeSection, catalogGuide);
  };

  const openMegaMenu = () => {
    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
    setMegaMenuOpen(true);
  };
  const closeMegaMenuDelayed = () => {
    megaMenuTimerRef.current = setTimeout(() => setMegaMenuOpen(false), 180);
  };

  // Close mega menu on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="site-header site-header-dark">
      {/* Desktop top utility bar */}
      <div className="header-utility-bar">
        <span className="header-utility-text">
          <span className="header-utility-dot" />
          Produksi kemeja dinas &amp; seragam custom — Tasikmalaya, kirim seluruh Indonesia
        </span>
        <div className="header-utility-links">
          <a href={ROUTE_PATHS[RouteKey.CARA_ORDER]} onClick={(e) => handleAnchorNavigation(e, RouteKey.CARA_ORDER, ROUTE_PATHS[RouteKey.CARA_ORDER])} className="header-utility-link">Cara Order</a>
          <span className="header-utility-sep" />
          <a href={ROUTE_PATHS[RouteKey.LACAK_PESANAN]} onClick={(e) => handleAnchorNavigation(e, RouteKey.LACAK_PESANAN, ROUTE_PATHS[RouteKey.LACAK_PESANAN])} className="header-utility-link">Lacak Pesanan</a>
          <span className="header-utility-sep" />
          <a href={ROUTE_PATHS[RouteKey.ARTIKEL]} onClick={(e) => handleAnchorNavigation(e, RouteKey.ARTIKEL, ROUTE_PATHS[RouteKey.ARTIKEL])} className="header-utility-link">Artikel</a>
        </div>
      </div>

      <div className="site-nav site-nav-single">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav aria-label="Navigasi utama" className="market-nav market-nav-desktop">
          <ul className="no-scrollbar header-nav-list">
            {HEADER_NAV_ITEMS.map((item) => {
              if (item.hasMegaMenu) {
                return (
                  <li key="produk-mega" className="header-mega-trigger-li" ref={megaMenuRef}>
                    <button
                      type="button"
                      onMouseEnter={openMegaMenu}
                      onMouseLeave={closeMegaMenuDelayed}
                      onClick={() => setMegaMenuOpen((v) => !v)}
                      className={`market-link header-nav-link header-nav-mega-trigger ${isCatalogRoute ? 'is-active' : ''}`}
                      aria-expanded={megaMenuOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg className={`header-mega-chevron ${megaMenuOpen ? 'is-open' : ''}`} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {megaMenuOpen && (
                      <div
                        className="header-mega-panel"
                        onMouseEnter={openMegaMenu}
                        onMouseLeave={closeMegaMenuDelayed}
                        role="region"
                        aria-label="Menu produk"
                      >
                        <div className="header-mega-inner">
                          {MEGA_MENU_COLUMNS.map((col) => (
                            <div key={col.title} className="header-mega-col">
                              <p className="header-mega-col-title">
                                <span className="header-mega-col-icon">{col.icon}</span>
                                {col.title}
                              </p>
                              <ul className="header-mega-col-list">
                                {col.items.map((colItem) => (
                                  <li key={colItem.path}>
                                    <a
                                      href={colItem.path}
                                      onClick={(e) => handleAnchorNavigation(e, colItem.route, colItem.path)}
                                      className="header-mega-item"
                                    >
                                      <span className="header-mega-item-label">{colItem.label}</span>
                                      <span className="header-mega-item-desc">{colItem.desc}</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <div className="header-mega-cta-col">
                            <p className="header-mega-col-title">
                              Mulai Custom
                            </p>
                            <div className="header-mega-cta-box">
                              <p className="header-mega-cta-body">Desain seragam Anda langsung di browser — pilih model, warna, dan bordir logo.</p>
                              <button
                                type="button"
                                onClick={() => { setMegaMenuOpen(false); onNavigate(RouteKey.KATALOG); }}
                                className="header-mega-cta-btn"
                              >
                                Buka Studio Desain →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              }
              return (
                <li key={`${item.route}-${item.path ?? item.label}`}>
                  <a
                    href={item.path ?? ROUTE_PATHS[item.route]}
                    onClick={(event) => handleAnchorNavigation(event, item.route, item.path, item.homeSection, item.catalogGuide)}
                    className={`market-link header-nav-link ${isActiveNavItem(item.route, item.homeSection) ? 'is-active' : ''}`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
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
