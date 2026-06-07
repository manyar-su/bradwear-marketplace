"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bot, MapPin, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { CONTACT, MAIN_NAV, UTILITY_NAV, getWhatsAppHref } from "@/lib/site-content";

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-neutral-950 text-white"
          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") || "");

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/katalog?q=${encodeURIComponent(next)}` : "/katalog");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur">
      <div className="border-b border-neutral-200 bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs md:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <a href={getWhatsAppHref()} className="hover:text-emerald-300">
              Layanan Pelanggan
            </a>
            <span className="hidden text-white/40 sm:inline">|</span>
            {UTILITY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-emerald-300">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-white/80 md:flex">
            <MapPin className="h-3.5 w-3.5" />
            <span>{CONTACT.phoneDisplay}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6">
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-sm font-black text-neutral-950">
              BF
            </span>
            <div>
              <p className="text-lg font-black uppercase tracking-[0.18em]">{`BRADFLOW`}</p>
              <p className="text-xs text-neutral-500">Kemeja, polo, jaket, dan seragam custom</p>
            </div>
          </div>
        </Link>

        <form onSubmit={onSearch} className="relative hidden min-w-0 flex-1 md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
            placeholder="Cari pemesanan kemeja, seragam kantor, polo custom, jaket custom..."
          />
        </form>

        <nav className="hidden items-center gap-1 xl:flex">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            />
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href="/brad-ai"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            <Bot className="h-4 w-4" />
            Brad AI
          </Link>
          <a
            href={getWhatsAppHref()}
            className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Konsultasi WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 bg-white xl:hidden"
          aria-label="Buka menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-neutral-200 bg-white xl:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 md:px-6">
            <form onSubmit={onSearch} className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none"
                placeholder="Cari produk atau artikel..."
              />
            </form>
            <div className="flex flex-wrap gap-2">
              {MAIN_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {UTILITY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/brad-ai"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
              >
                Buka Brad AI
              </Link>
              <a
                href={getWhatsAppHref()}
                className="rounded-2xl bg-neutral-950 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
