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
    <section className="rounded-[28px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#ffffff,#f5faef)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent-strong)]">Customer Service</p>
          <h3 className="mt-2 text-lg font-black tracking-tight text-[var(--text-primary)] sm:text-xl">Tim CS Bradwear aktif</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Klik avatar untuk langsung kirim WhatsApp dengan topik seputar <strong>{topic}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white text-lg text-[var(--text-primary)] shadow-sm transition hover:-translate-y-0.5"
          aria-label="Tutup panel customer service"
        >
          x
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {CUSTOMER_SERVICE_CONTACTS.map((contact) => (
          <a
            key={contact.id}
            href={buildWhatsAppUrlForPhone(contact.phone, buildCustomerServiceMessage(topic))}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-[22px] border border-[var(--border-soft)] bg-white/92 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[rgba(117,242,26,0.32)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)]"
          >
            <div className="relative shrink-0">
              <img
                src={contact.avatar}
                alt={`Avatar ${contact.name}`}
                className="h-14 w-14 rounded-full border border-[rgba(117,242,26,0.24)] object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#57d70f]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-tight text-[var(--text-primary)]">{contact.name}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                {contact.statusLabel}
              </p>
              <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">+{contact.phone}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CustomerServiceDock;
