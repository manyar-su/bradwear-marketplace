import React from 'react';
import { ASSETS } from '../assets';
import { CLIENT_LOGOS } from '../constants';
import {
  CATEGORY_ROUTE_PATHS,
  INFO_ROUTE_PATHS,
  ROUTE_PATHS,
  SITE_NAME,
  STORE_ADDRESS,
} from '../lib/siteConfig';
import { RouteKey } from '../types';

interface SiteFooterProps {
  onNavigate: (route: RouteKey, options?: { path?: string }) => void;
}

const footerProductLinks = [
  { label: 'Kemeja Dinas', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.KEMEJA_DINAS },
  { label: 'PDH & PDL', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.PDH_PDL },
  { label: 'Wearpack', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.WEARPACK },
  { label: 'Polo & Jaket', route: RouteKey.KATALOG, path: CATEGORY_ROUTE_PATHS.POLO_JAKET },
  { label: 'Celana Tactical', route: RouteKey.PANTS, path: ROUTE_PATHS[RouteKey.PANTS] },
];

const footerInfoLinks = [
  { label: 'Tentang Kami', route: RouteKey.ABOUT, path: ROUTE_PATHS[RouteKey.ABOUT] },
  { label: 'Galeri Client', route: RouteKey.CLIENT, path: ROUTE_PATHS[RouteKey.CLIENT] },
  { label: 'FAQ', route: RouteKey.LAYANAN_PELANGGAN, path: ROUTE_PATHS[RouteKey.LAYANAN_PELANGGAN] },
  { label: 'Kontak', route: RouteKey.TEMUKAN_TOKO, path: ROUTE_PATHS[RouteKey.TEMUKAN_TOKO] },
];

const footerLegalLinks = [
  { label: 'Kebijakan Privasi', route: RouteKey.LAYANAN_PELANGGAN, path: INFO_ROUTE_PATHS.KEBIJAKAN_PRIVASI },
  { label: 'Syarat dan Ketentuan', route: RouteKey.LAYANAN_PELANGGAN, path: INFO_ROUTE_PATHS.SYARAT_KETENTUAN },
];

const footerSocialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bradwear_indonesia/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="site-footer-social-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.3" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@bradwearindonesia',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="site-footer-social-icon" fill="currentColor">
        <path d="M16.4 2c.34 1.88 1.46 3.38 3.38 4.08v3.15a7.2 7.2 0 0 1-3.44-.86v6.11c0 3.93-3.18 7.12-7.12 7.12S2.1 18.41 2.1 14.48 5.29 7.36 9.22 7.36c.43 0 .87.04 1.3.13v3.52a3.72 3.72 0 1 0 2.31 3.47V2h3.57Z" />
      </svg>
    ),
  },
];

const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const handleAnchorNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    route: RouteKey,
    path: string,
  ) => {
    event.preventDefault();
    onNavigate(route, { path });
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-partners">
        <div className="site-footer-partners-copy">
          <p className="site-footer-partners-kicker">Partner Instansi</p>
          <h2 className="site-footer-partners-title">Dipercaya berbagai institusi dan tim operasional</h2>
        </div>
        <div className="marquee-mask site-footer-marquee-mask">
          <div className="marquee-track site-footer-marquee-track">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, index) => (
              <div key={`${client.name}-${index}`} className="marquee-item site-footer-marquee-item">
                <div className="partner-logo-frame site-footer-logo-frame">
                  <img src={client.logo} alt={client.name} />
                </div>
                <span className="site-footer-marquee-name">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer-main-shell">
        <div className="site-footer-main-column site-footer-brand-panel">
          <div className="site-footer-logo-shell">
            <img src={ASSETS.BRAND.LOGO} alt={SITE_NAME} className="site-footer-logo" />
          </div>
          <p className="site-footer-tagline">Stay bold. Stay Bradwear.</p>
          <p className="site-footer-title">{SITE_NAME}</p>
          <p className="site-footer-address">{STORE_ADDRESS}</p>
          <div className="site-footer-socials" aria-label="Sosial media Bradwear">
            {footerSocialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="site-footer-social-link"
                aria-label={social.label}
                title={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer-main-column">
          <p className="site-footer-heading">Produk</p>
          <div className="site-footer-links site-footer-nav-links">
            {footerProductLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleAnchorNavigation(event, item.route, item.path)}
                className="site-footer-link"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer-main-column">
          <p className="site-footer-heading">Informasi</p>
          <div className="site-footer-faq-list">
            {footerInfoLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleAnchorNavigation(event, item.route, item.path)}
                className="site-footer-faq-item"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer-main-column">
          <p className="site-footer-heading">Legal</p>
          <div className="site-footer-faq-list">
            {footerLegalLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleAnchorNavigation(event, item.route, item.path)}
                className="site-footer-faq-item"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-footer-meta">
        <p>Bradwear Indonesia · Tasikmalaya · Pengiriman seragam custom ke seluruh Indonesia.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
