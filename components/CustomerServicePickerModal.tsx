import { CUSTOMER_SERVICE_CONTACTS, buildWhatsAppUrlForPhone } from '../lib/siteConfig';
import { CustomerServiceDialogDetail } from '../lib/customerServiceDialog';

type CustomerServicePickerModalProps = {
  request: CustomerServiceDialogDetail | null;
  onClose: () => void;
};

const CustomerServicePickerModal: React.FC<CustomerServicePickerModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-[710] flex items-start justify-center overflow-y-auto bg-[rgba(4,9,5,0.72)] p-3 pt-6 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="customer-service-picker-panel w-full max-w-[720px] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[32px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#ffffff,#f5faef)] p-5 shadow-[0_28px_80px_rgba(15,23,42,0.26)] animate-modal-fade sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">Customer Service</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">
              {request.title || 'Pilih customer service yang Anda inginkan'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {request.description || 'Pilih customer service yang Anda inginkan, lalu pesan akan langsung dikirim sesuai konteks halaman atau ringkasan desain Anda.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white text-lg text-[var(--text-primary)] shadow-sm"
            aria-label="Tutup pemilih customer service"
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CUSTOMER_SERVICE_CONTACTS.map((contact) => (
            <a
              key={contact.id}
              href={buildWhatsAppUrlForPhone(contact.phone, request.message)}
              target="_blank"
              rel="noreferrer"
              data-direct-whatsapp="true"
              onClick={onClose}
              className="grid gap-3 rounded-[24px] border border-[var(--border-soft)] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[rgba(117,242,26,0.3)]"
            >
              <div className="flex items-center gap-3">
                <img src={contact.avatar} alt={`Avatar ${contact.name}`} className="h-14 w-14 rounded-full object-cover ring-2 ring-[rgba(117,242,26,0.16)]" />
                <div>
                  <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">{contact.name}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent-strong)]">{contact.statusLabel}</p>
                </div>
              </div>
              <span className="inline-flex w-fit rounded-full bg-[linear-gradient(135deg,#75f21a,#2c7a12)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#071106]">
                Pilih CS
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePickerModal;
