# BRADWEAR INDONESIA

Platform web untuk katalog, custom design, dan pemesanan seragam instansi Bradwear Indonesia.

## Ringkasan

- React 19 + TypeScript + Vite
- Katalog publik untuk kemeja, jaket, rompi, celana, dan polo
- Design editor berbasis browser untuk preview, upload logo, scan warna, dan ringkasan order
- Admin panel untuk update katalog dan workflow produksi
- Integrasi Supabase untuk storage dan upload asset

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Build production tanpa auto bump:

```bash
npx vite build
```

Type check:

```bash
npx tsc --noEmit
```

## Struktur Penting

- `components/PublicSiteView.tsx` - halaman publik termasuk katalog, artikel, FAQ, dan download route
- `components/DesignEditorView.tsx` - editor desain dan alur export/checkout
- `components/AdminView.tsx` - panel admin katalog dan workflow
- `lib/siteConfig.ts` - route, copy, SEO config, WhatsApp builder
- `lib/seo.ts` - meta tags dan schema
- `utils/assetManager.ts` - resolver asset Supabase untuk web

## Catatan Web-Only

- Repo ini tidak lagi memakai runtime Android/Capacitor.
- Route `/download` tetap aktif sebagai hub akses web Bradwear, bukan halaman instalasi aplikasi Android.
- Penyimpanan desain, share, dan download memakai API browser yang tersedia, dengan fallback ke unduhan file.
