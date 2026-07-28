# Folder Foto Artikel

Folder ini untuk menyimpan gambar cover artikel Bradwear Indonesia.

## Konvensi nama file

Format: `[slug-artikel].[ext]`

Contoh:
- `panduan-memilih-bahan-seragam.webp`
- `beda-pdh-pdl-dan-lapangan.webp`
- `tips-order-seragam-instansi.webp`
- `checklist-sebelum-produksi.webp`
- `kemeja-custom-untuk-perusahaan-dan-komunitas.webp`
- `seragam-dinas-dan-komunitas-pilih-model-yang-tepat.webp`
- `vendor-seragam-dinas-untuk-pengadaan-instansi.webp`
- `seragam-komunitas-dan-event-agar-branding-lebih-rapi.webp`
- `bordir-logo-instansi-pada-kemeja-dinas.webp`
- `celana-tactical-dan-seragam-lapangan-untuk-tim-operasional.webp`
- `vendor-seragam-kerja-tasikmalaya-untuk-perusahaan.webp`
- `tentang-bradwear-indonesia-dan-standar-produksi.webp`
- `produk-dan-jasa-seragam-custom-bradwear.webp`
- `keunggulan-bradwear-dalam-produksi-seragam-custom.webp`
- `klien-dan-jangkauan-layanan-seragam-bradwear.webp`

## Spesifikasi

- Format: **WebP** (preferred) atau JPEG
- Ukuran optimal: **1200×630px** (rasio 16:9 atau 1.91:1 untuk OG/Twitter card)
- Ukuran file: maks **120KB** per gambar
- Resolusi: 72–96 dpi

## Cara pakai

Setelah menambahkan foto, ubah nilai `coverImage` di `lib/siteConfig.ts` dari Unsplash URL ke path lokal:

```ts
// Sebelum:
coverImage: 'https://images.unsplash.com/...',

// Sesudah:
coverImage: new URL('../assets/artikel/nama-artikel.webp', import.meta.url).href,
```

## Status

| Artikel | Status |
|---------|--------|
| panduan-memilih-bahan-seragam | ⏳ Menggunakan fallback Unsplash |
| beda-pdh-pdl-dan-lapangan | ⏳ Menggunakan fallback Unsplash |
| tips-order-seragam-instansi | ⏳ Menggunakan fallback Unsplash |
| checklist-sebelum-produksi | ⏳ Menggunakan fallback Unsplash |
| kemeja-custom-untuk-perusahaan-dan-komunitas | ⏳ Menggunakan fallback Unsplash |
| seragam-dinas-dan-komunitas-pilih-model-yang-tepat | ⏳ Menggunakan fallback Unsplash |
| vendor-seragam-dinas-untuk-pengadaan-instansi | ⏳ Menggunakan fallback Unsplash |
| seragam-komunitas-dan-event-agar-branding-lebih-rapi | ⏳ Menggunakan fallback Unsplash |
| bordir-logo-instansi-pada-kemeja-dinas | ⏳ Menggunakan fallback Unsplash |
| celana-tactical-dan-seragam-lapangan-untuk-tim-operasional | ⏳ Menggunakan fallback Unsplash |
| vendor-seragam-kerja-tasikmalaya-untuk-perusahaan | ⏳ Menggunakan fallback Unsplash |
| tentang-bradwear-indonesia-dan-standar-produksi | ⏳ Menggunakan fallback Unsplash |
| produk-dan-jasa-seragam-custom-bradwear | ⏳ Menggunakan fallback Unsplash |
| keunggulan-bradwear-dalam-produksi-seragam-custom | ⏳ Menggunakan fallback Unsplash |
| klien-dan-jangkauan-layanan-seragam-bradwear | ⏳ Menggunakan fallback Unsplash |
