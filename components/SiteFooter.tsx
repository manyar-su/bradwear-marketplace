import React from 'react';
import { ASSETS } from '../assets';
import { CLIENT_LOGOS } from '../constants';
import {
  CONTACT_CHANNELS,
  PRIMARY_NAV_ITEMS,
  SITE_NAME,
  STORE_ADDRESS,
  buildConsultationMessage,
  buildWhatsAppUrl,
} from '../lib/siteConfig';
import { RouteKey } from '../types';

interface SiteFooterProps {
  onNavigate: (route: RouteKey) => void;
}

const footerRoutes = PRIMARY_NAV_ITEMS.filter((item) =>
  [RouteKey.HOME, RouteKey.THREE_D, RouteKey.KATALOG, RouteKey.CLIENT, RouteKey.CARA_ORDER, RouteKey.LAYANAN_PELANGGAN, RouteKey.BRAD_AI].includes(item.route),
);

const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
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

      <div className="site-footer-grid">
        <div className="site-footer-brand site-footer-panel site-footer-brand-panel">
          <div className="site-footer-logo-shell">
            <img src={ASSETS.BRAND.LOGO} alt={SITE_NAME} className="site-footer-logo" />
          </div>
          <p className="site-footer-title">{SITE_NAME}</p>
          <p className="site-footer-address">{STORE_ADDRESS}</p>
        </div>

        <div className="site-footer-panel">
          <p className="site-footer-heading">Navigasi</p>
          <div className="site-footer-links site-footer-nav-links">
            {footerRoutes.map((item) => (
              <button key={item.route} type="button" onClick={() => onNavigate(item.route)} className="site-footer-link">
                {item.label}
              </button>
            ))}
            <a
              href="https://www.bradwear.web.id/"
              target="_blank"
              rel="noreferrer"
              className="site-footer-link"
            >
              Dashboard
            </a>
          </div>
        </div>

        <div className="site-footer-panel">
          <p className="site-footer-heading">Kontak Cepat</p>
          <div className="site-footer-links site-footer-contact-list">
            {CONTACT_CHANNELS.map((channel) => (
              <div key={channel.label} className="site-footer-contact-card">
                <p className="site-footer-contact-label">{channel.label}</p>
                <p className="site-footer-contact-value">{channel.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer-panel site-footer-cta-panel">
          <p className="site-footer-heading">Mulai Konsultasi</p>
          <a
            href={buildWhatsAppUrl(buildConsultationMessage('konsultasi seragam custom untuk instansi atau perusahaan'))}
            target="_blank"
            rel="noreferrer"
            className="site-footer-whatsapp brand-cta"
          >
            Konsultasi via WhatsApp
          </a>
        </div>
      </div>

      <div className="site-footer-meta">
        <p>Bradwear Indonesia · Tasikmalaya · Pengiriman seragam custom ke seluruh Indonesia.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;

