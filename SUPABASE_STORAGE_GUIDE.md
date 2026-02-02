# Panduan Konfigurasi Storage Supabase untuk Bradwear

Jika Anda mengalami error "Gagal upload" atau "Network error", kemungkinan besar **Storage Policies (RLS)** di Supabase belum dikonfigurasi untuk mengizinkan upload publik dari aplikasi.

## Langkah 1: Buka Dashboard Supabase

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Pilih project `Bradwear` Anda.

## Langkah 2: Buka Menu Storage

1. Di sidebar kiri, klik icon **Storage** (gambar folder).
2. Anda akan melihat bucket bernama `assets`. Jika belum ada, buat bucket baru bernama `assets` dan set menjadi **Public**.

## Langkah 3: Atur Policies (PENTING)

Secara default, Supabase memblokir semua upload dari "anon" (pengguna tanpa login database, seperti aplikasi web ini). Anda harus membukanya.

1. Klik tab **Configuration** atau pilih bucket `assets` lalu klik tab **Policies**.
2. Klik tombol **New Policy** di bagian "Policies under assets".
3. Pilih **"Get started quickly"** -> Pilih template **"Give users access to all files"** (atau "Give public access to all files").
4. **PENTING:** Pastikan Anda mencentang opsi operasi berikut:
   - [x] **SELECT** (Wajib agar gambar bisa dilihat)
   - [x] **INSERT** (Wajib agar Admin bisa upload gambar baru)
   - [x] **UPDATE** (Opsional, untuk menimpa file)
   - [x] **DELETE** (Opsional, jika ingin fitur delete berfungsi)
5. Klik **Review** lalu **Save Policy**.

## Langkah 4: Verifikasi CORS (Opsional)

Jika masih error "Failed to fetch", cek pengaturan CORS.

1. Masuk ke **Settings** (icon gerigi) > **API**.
2. Di bagian **bucket config** atau **settings**, pastikan tidak ada pembatasan domain yang ketat, atau tambahkan `http://localhost:5173` (dan domain produksi nanti).

---
**Catatan:**  
Setelah policy disimpan, coba upload gambar lagi dari Admin Panel. Perubahan biasanya instan.
