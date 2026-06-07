import Link from "next/link";
import { CATEGORY_PAGES, CONTACT, MAIN_NAV, STORE, UTILITY_NAV, getWhatsAppHref } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr,1fr,1fr,1fr] md:px-6">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.16em]">Bradflow</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
            Bradflow membantu pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam dengan alur konsultasi yang lebih cepat.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={getWhatsAppHref()}
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white"
            >
              Konsultasi Sekarang
            </a>
            <Link
              href="/brad-ai"
              className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800"
            >
              Tanya Brad AI
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Kategori Produk</p>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            {CATEGORY_PAGES.map((item) => (
              <Link key={item.href} href={item.href} className="block hover:text-neutral-950">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Navigasi</p>
          <div className="mt-4 space-y-3 text-sm text-neutral-600">
            {MAIN_NAV.filter((item) => item.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="block hover:text-neutral-950">
                {item.label}
              </Link>
            ))}
            {UTILITY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="block hover:text-neutral-950">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold">Kontak & Lokasi</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
            <a href={getWhatsAppHref()} className="block hover:text-neutral-950">
              WhatsApp: {CONTACT.phoneDisplay}
            </a>
            <p>{STORE.address}</p>
            <a href={STORE.googleMapsUrl} className="font-semibold text-emerald-700 hover:text-emerald-800">
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
