import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, ShoppingBag, UserRound } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bradwear Marketplace",
  description: "Marketplace pemesanan kemeja custom yang terintegrasi dashboard Bradwear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen text-neutral-900">
        <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 bg-neutral-950 text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs md:px-6">
              <div className="flex items-center gap-4">
                <a href="https://wa.me/6281280000581" className="hidden hover:text-lime-300 sm:inline">
                  Layanan Pelanggan
                </a>
                <Link href="/checkout" className="hover:text-lime-300">
                  Lacak Pesanan
                </Link>
                <span className="hidden items-center gap-1 md:inline-flex">
                  <MapPin className="h-3.5 w-3.5" />
                  Produksi Bandung
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/login" className="hover:text-lime-300">
                  Masuk
                </Link>
                <Link href="/register" className="hover:text-lime-300">
                  Daftar
                </Link>
              </div>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-black text-[10px] font-black leading-none text-lime-400">
                BRAD
              </span>
              <span className="hidden text-lg font-black uppercase sm:inline">Bradwear</span>
            </Link>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                className="h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm outline-none focus:border-neutral-500 focus:bg-white"
                placeholder="Cari kemeja, warna, model..."
              />
            </div>
            <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
              <Link href="/katalog" className="rounded-md px-3 py-2 hover:bg-neutral-100">
                Koleksi
              </Link>
              <Link href="/desain/brad-v2-custom" className="rounded-md px-3 py-2 hover:bg-neutral-100">
                Custom
              </Link>
              <Link href="/checkout" className="rounded-md px-3 py-2 hover:bg-neutral-100">
                Checkout
              </Link>
            </nav>
            <Link
              href="/checkout"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-neutral-100 hover:bg-neutral-200"
              aria-label="Checkout"
            >
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-lime-500 text-neutral-950 hover:bg-lime-400"
              aria-label="Login"
            >
              <UserRound className="h-5 w-5" />
            </Link>
          </div>
          <div className="border-t border-neutral-100 bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm font-semibold">
              <Link href="/katalog">Koleksi</Link>
              <Link href="/desain/brad-v2-custom">Custom</Link>
              <Link href="/checkout">Checkout</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-10 border-t border-neutral-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.5fr,1fr,1fr,1fr] md:px-6">
            <div>
              <p className="text-xl font-black uppercase">Bradwear</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600">
                Marketplace kemeja custom yang tersambung langsung ke dashboard produksi Bradwear.
              </p>
            </div>
            <div>
              <p className="font-semibold">Koleksi</p>
              <div className="mt-3 space-y-2 text-sm text-neutral-600">
                <Link className="block hover:text-neutral-950" href="/katalog">Kemeja Custom</Link>
                <Link className="block hover:text-neutral-950" href="/desain/brad-v2-custom">Brad V2</Link>
                <Link className="block hover:text-neutral-950" href="/desain/brad-v3-custom">Brad V3</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Akun</p>
              <div className="mt-3 space-y-2 text-sm text-neutral-600">
                <Link className="block hover:text-neutral-950" href="/login">Masuk</Link>
                <Link className="block hover:text-neutral-950" href="/register">Daftar</Link>
                <Link className="block hover:text-neutral-950" href="/checkout">Checkout</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Bantuan</p>
              <div className="mt-3 space-y-2 text-sm text-neutral-600">
                <a className="block hover:text-neutral-950" href="https://wa.me/6281280000581">WhatsApp</a>
                <span className="block">Produksi: Bandung</span>
                <span className="block">Terhubung Dashboard</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
