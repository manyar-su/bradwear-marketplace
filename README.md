# Bradwear Marketplace

Marketplace pemesanan kemeja custom yang terintegrasi ke dashboard Bradwear.

## Setup Lokal

1. Salin file env:

```bash
cp .env.example .env.local
```

2. Isi env:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MARKETPLACE_SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

3. Jalankan SQL:
- `supabase/marketplace_schema.sql`
- `supabase/seed_marketplace_products.sql`

4. Jalankan aplikasi:

```bash
npm run dev
```

## Fitur v1

- Katalog produk kemeja custom.
- Design Studio (text + upload logo + drag + export PNG).
- Auth internal custom (tanpa Supabase Auth).
- Checkout terhubung ke `konsumen` + `orders` dashboard.
- Bukti transfer opsional (Cloudinary URL disimpan ke DB).

## Deploy

Gunakan project Vercel terpisah:

```bash
vercel --prod
```

