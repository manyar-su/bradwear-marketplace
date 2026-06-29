import React from 'react';
import {
  buildCustomerServiceMessage,
  buildWhatsAppUrlForPhone,
  CUSTOMER_SERVICE_CONTACTS,
  getConsultationTopicForPath,
} from '../lib/siteConfig';
import { RouteKey } from '../types';

interface CustomerServiceDockProps {
  currentRoute: RouteKey;
  currentPathname: string;
  onClose: () => void;
}

const CustomerServiceDock: React.FC<CustomerServiceDockProps> = ({
  currentRoute,
  currentPathname,
  onClose,
}) => {
  const topic = getConsultationTopicForPath(currentRoute, currentPathname);

  return (
    <section className="customer-service-dock-panel rounded-[28px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#ffffff,#f5faef)] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">Customer Service</p>
          <h3 className="mt-1 text-base font-black tracking-tight text-[var(--text-primary)] sm:text-lg">
            Daftar costumer service
          </h3>
          <p className="mt-1 max-w-[30ch] text-xs leading-relaxed text-[var(--text-secondary)]">
            <strong>Pilih kontak untuk konsultasi</strong>
          </p>
          <p className="mt-1 max-w-[30ch] text-xs leading-relaxed text-[var(--text-secondary)]">
            Tanya seputar pemesanan dan jenis bahan yang tersedia.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white text-base text-[var(--text-primary)] shadow-sm transition hover:-translate-y-0.5"
          aria-label="Tutup panel customer service"
        >
          x
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {CUSTOMER_SERVICE_CONTACTS.map((contact) => (
          <a
            key={contact.id}
            href={buildWhatsAppUrlForPhone(contact.phone, buildCustomerServiceMessage(topic))}
            target="_blank"
            rel="noreferrer"
            className="group grid min-h-[72px] grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-[18px] border border-[var(--border-soft)] bg-white/94 px-2.5 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[rgba(117,242,26,0.32)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)]"
          >
            <div className="relative shrink-0">
              <img
                src={contact.avatar}
                alt={`Avatar ${contact.name}`}
                className="h-11 w-11 rounded-full border border-[rgba(117,242,26,0.24)] object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#57d70f]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[13px] font-black tracking-tight text-[var(--text-primary)]">{contact.name}</p>
                <span className="rounded-full bg-[var(--brand-accent-soft)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--brand-accent-strong)]">
                  {contact.statusLabel}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Kirim pesan</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CustomerServiceDock;
