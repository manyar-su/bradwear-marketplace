# Panduan Penyimpanan Asset di Supabase & Caching Device

Dokumen ini menjelaskan cara memindahkan asset lokal ke Supabase Storage untuk mempercepat loading dan cara memperbarui data gambar.

## 1. Persiapan Supabase Storage

1. Masuk ke Dashboard Supabase Anda.
2. Buka menu **Storage** -> **Buckets**.
3. Buat Bucket baru dengan nama `assets`.
4. Pastikan Bucket diatur ke **Public** agar bisa diakses langsung via URL.
5. Upload folder atau file dari folder `./assets` lokal Anda ke bucket tersebut.
   - Contoh struktur: `assets/Model Kemeja/brad-v3/depan.png`

## 2. Konfigurasi Environment Variable

Pastikan file `.env.local` Anda memiliki key berikut:

```env
VITE_SUPABASE_URL=https://project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Cara Penggunaan di Code

### Pemanggilan Asset di Katalog (HomeView)

Untuk katalog, sistem menggunakan komponen `OptimizedImage`. Ini akan mendownload gambar dari Supabase dan menyimpannya di storage device secara permanen.

```tsx
<OptimizedImage 
  supabasePath={`Model Kemeja/${product.name}/depan.png`} 
  fallback={product.image}
  className="w-full h-full object-cover" 
/>
```

### Upload Logo User (DesignEditor)

Saat user mengupload logo, file tidak lagi disimpan sebagai Base64 di memori HP (yang bikin HP lemot), melainkan langsung diupload ke folder `user_uploads/` di Supabase.

### Update Katalog (AdminView)

Admin dapat mengupdate foto katalog 4 sisi. Foto akan otomatis terupload ke folder `catalog/{productId}/` di Supabase.

## 4. Strategi Update Gambar (Versioning)

Jika Anda mengganti foto model baju di Supabase namun user masih melihat foto lama, Anda punya 2 pilihan:

1. **Ganti Nama File**: Misal dari `depan.png` menjadi `depan_v2.png`.
2. **Ubah Versi di Code**: Komponen `OptimizedImage` mendukung prop `version`. Ubah `version="1.0.0"` menjadi `version="1.0.1"` pada pemanggilan komponen tersebut.

## 5. Keuntungan Teknis

- **Memori Aman**: Tidak ada lagi string Base64 raksasa di dalam state aplikasi (mencegah crash di HP spek rendah).
- **Offline Ready**: Gambar yang pernah dibuka tetap bisa tampil meski sinyal hilang karena tersimpan di storage device (Capacitor Filesystem).
- **Proses Cepat**: Menggunakan Public URL Supabase yang didukung CDN (Content Delivery Network).
