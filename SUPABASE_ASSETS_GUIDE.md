# Panduan Asset Supabase

Dokumen ini menjelaskan cara memakai Supabase Storage untuk asset katalog dan upload user pada mode web-only.

## 1. Siapkan bucket

1. Buka Supabase Dashboard.
2. Masuk ke `Storage`.
3. Buat bucket public bernama `assets`.
4. Upload folder atau file dari `./assets` sesuai struktur yang dibutuhkan aplikasi.

Contoh path:

- `assets/Model Kemeja/brad-v3/depan.png`
- `assets/catalog/k1/front.png`

## 2. Environment variable

Isi `.env.local`:

```env
VITE_SUPABASE_URL=https://project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Cara pakai di code

Komponen `OptimizedImage` tetap dipakai sebagai pembungkus loader asset Supabase, tetapi pada mode web-only ia langsung memakai public URL dengan query version untuk cache busting.

```tsx
<OptimizedImage
  supabasePath={`Model Kemeja/${product.name}/depan.png`}
  fallback={product.image}
  className="w-full h-full object-cover"
/>
```

## 4. Update gambar

Jika gambar diganti tetapi browser masih menampilkan versi lama:

1. Ganti nama file di bucket, atau
2. Naikkan prop `version` pada `OptimizedImage`

Contoh:

```tsx
<OptimizedImage version="1.0.1" ... />
```

## 5. Keuntungan teknis

- Asset katalog tetap dilayani dari CDN Supabase
- Browser cache tetap dipakai tanpa dependensi native storage
- Upload logo dan update katalog tetap satu jalur dengan storage Supabase
