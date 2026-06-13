import React from 'react';
import { ASSETS } from '../assets';
import {
  CONTACT_CHANNELS,
  PRIMARY_NAV_ITEMS,
  SITE_NAME,
  SITE_TAGLINE,
  STORE_ADDRESS,
  buildConsultationMessage,
  buildWhatsAppUrl,
} from '../lib/siteConfig';
import { RouteKey } from '../types';

interface SiteFooterProps {
  onNavigate: (route: RouteKey) => void;
}

const footerRoutes = PRIMARY_NAV_ITEMS.filter((item) =>
  [RouteKey.HOME, RouteKey.KATALOG, RouteKey.CARA_ORDER, RouteKey.LAYANAN_PELANGGAN, RouteKey.BRAD_AI].includes(item.route),
);

const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <div className="site-footer-logo-shell">
            <img src={ASSETS.BRAND.LOGO} alt={SITE_NAME} className="site-footer-logo" />
          </div>
          <p className="site-footer-title">{SITE_NAME}</p>
          <p className="site-footer-copy">{SITE_TAGLINE}</p>
          <p className="site-footer-address">{STORE_ADDRESS}</p>
        </div>

        <div>
          <p className="site-footer-heading">Navigasi</p>
          <div className="site-footer-links">
            {footerRoutes.map((item) => (
              <button key={item.route} type="button" onClick={() => onNavigate(item.route)} className="site-footer-link">
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="site-footer-heading">Kontak Cepat</p>
          <div className="site-footer-links">
            {CONTACT_CHANNELS.map((channel) => (
              <div key={channel.label} className="site-footer-contact-card">
                <p className="site-footer-contact-label">{channel.label}</p>
                <p className="site-footer-contact-value">{channel.value}</p>
                <p className="site-footer-contact-note">{channel.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="site-footer-heading">Mulai Konsultasi</p>
          <p className="site-footer-copy">
            Kirim kebutuhan model, bahan, jumlah, atau target produksi ke tim Bradwear untuk dibantu lebih cepat.
          </p>
          <a
            href={buildWhatsAppUrl(buildConsultationMessage('konsultasi seragam custom untuk instansi atau perusahaan'))}
            target="_blank"
            rel="noreferrer"
            className="site-footer-whatsapp"
          >
            Konsultasi via WhatsApp
          </a>
        </div>
      </div>

      <div className="site-footer-meta">
        <p>Bradwear Indonesia · Tasikmalaya · Melayani pengiriman ke seluruh Indonesia.</p>
        <p>UI dirancang ringan, compact, dan siap dipakai di mobile maupun desktop.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;

