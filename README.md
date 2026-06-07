# Bradflow / Bradwear Marketplace

Website publik untuk pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam. Fokus utama repo ini sekarang adalah halaman publik yang SEO friendly, AI-search-friendly, dan kuat secara CTA.

## Setup lokal

1. Salin env:

```bash
cp .env.example .env.local
```

2. Isi env yang dibutuhkan:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MARKETPLACE_SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `SUMOPOD_API_KEY`
- `SUMOPOD_BASE_URL`
- `SUMOPOD_MODEL`

3. Jalankan SQL marketplace jika project Supabase yang digunakan memang memuat tabel marketplace:

- `supabase/marketplace_schema.sql`
- `supabase/seed_marketplace_products.sql`

4. Jalankan aplikasi:

```bash
npm run dev
```

## Struktur fitur publik

- `/` untuk homepage utama dan canonical SEO.
- `/katalog` untuk discovery produk dengan copy yang menargetkan pencarian seperti `pemesanan kemeja`, `seragam kantor`, dan `polo custom`.
- `/kategori/*` untuk landing page kategori yang terpisah dan indexable.
- `/cara-order`, `/layanan-pelanggan`, `/faq`, `/lacak-pesanan`, `/temukan-toko`, `/artikel`, dan `/brad-ai`.
- `app/robots.ts` dan `app/sitemap.ts` untuk indexing dasar.

## Brad AI

Brad AI menggunakan Sumopod melalui route server-side `app/api/brad-ai/route.ts`.

### Env Brad AI

- `SUMOPOD_API_KEY`
- `SUMOPOD_BASE_URL`
- `SUMOPOD_MODEL`

### Tanggung jawab Brad AI

- Menjawab pertanyaan seputar website Bradflow.
- Membantu menjelaskan kategori produk, bahan, alur pemesanan, tracking, dan lokasi toko.
- Memberikan estimasi indikatif untuk harga dan waktu pengerjaan.
- Selalu mengarahkan user ke WhatsApp untuk final quote dan konfirmasi produksi.

### Gaya jawaban Brad AI

- Bahasa Indonesia yang natural dan informatif.
- Tidak terdengar seperti boilerplate robot.
- Fokus pada konteks bisnis dan halaman website.
- Jangan mengarang angka final atau janji deadline pasti.
- Jika data tidak cukup, arahkan ke WhatsApp tim Bradwear.

## SEO dan konten

Metadata dikelola lewat helper di `lib/seo.ts`. Konten terpusat untuk halaman publik berada di:

- `lib/site-content.ts`
- `lib/articles.ts`

Saat menambah halaman atau artikel baru:

1. Pastikan judul dan deskripsi punya intent pencarian yang jelas.
2. Gunakan keyword secara natural, bukan keyword stuffing.
3. Tambahkan CTA yang relevan ke WhatsApp, Brad AI, atau halaman katalog/desain.
4. Tambahkan halaman baru ke sitemap jika rutenya tidak otomatis tercakup.

## Verifikasi yang dianjurkan

```bash
npm run lint
npm run build
```

Periksa juga:

- Semua link navbar/footer berfungsi.
- `/home` redirect ke `/`.
- Metadata unik di tiap halaman publik.
- `robots.txt` dan `sitemap.xml` terbentuk.
- CTA WhatsApp memakai nomor yang benar.
- Brad AI hanya memberi estimasi indikatif dan selalu menyediakan jalur handoff ke WhatsApp.
