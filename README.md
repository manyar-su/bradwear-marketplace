<div align="center">

# 🧵 BRADWEAR INDONESIA
### Platform Kustomisasi Seragam Instansi Terpercaya

[![Version](https://img.shields.io/badge/version-1.4.9-emerald?style=for-the-badge)](https://github.com/manyar-su/Bradmock)
[![Platform](https://img.shields.io/badge/platform-Android-green?style=for-the-badge&logo=android)](https://play.google.com/store)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-blue?style=for-the-badge)](https://capacitorjs.com)

</div>

---

## 🎯 Tentang Aplikasi

**Bradwear** adalah aplikasi mobile B2B untuk kustomisasi dan pemesanan seragam instansi pemerintah & swasta di Indonesia. Dikembangkan oleh **CV. Asthajaya Braderindo**, aplikasi ini memungkinkan pelanggan untuk merancang, memilih, dan memesan seragam langsung dari genggaman tangan.

---

## ✨ Fitur Utama

### 👕 Katalog Produk
- 15+ model seragam: Kemeja, Celana, Rompi, Jaket, Polo
- Foto produk HD dari berbagai sudut (depan & belakang)
- Filter kategori yang mudah digunakan

### 🎨 Design Editor
- Simulasi warna bahan secara real-time
- Upload logo instansi dengan auto background removal
- Drag & drop posisi logo dan nama
- Preview tampak depan & belakang
- Undo / Redo history

### 🧵 Pilihan Bahan
- Tropical, Nagata Drill, American Drill
- Ripstop Pernusa, Baby Canvas, STF
- Oxford, Soft Denim, Pique Cotton, dan lainnya
- Rating adem, tebal, dan lembut per bahan

### 📋 Sistem Pemesanan
- Tabel ukuran (S–XXXL + Custom)
- Pilihan gender & lengan per item
- Ukuran custom dengan input dimensi tubuh
- Scan kode warna katalog via kamera + AI (Gemini)

### 📦 Tracking Produksi
- 6 tahap workflow: Design → Cutting → Sewing → QC → Packing → Shipping
- Kode order unik per pelanggan

### 📤 Ekspor & Berbagi
- Download hasil desain ke galeri (HD)
- Kirim detail pesanan langsung ke WhatsApp CS
- Upload desain otomatis ke Supabase Storage

---

## 🏛️ Target Pengguna

| Instansi | Contoh |
|---|---|
| 🚔 Kepolisian | POLRI, Satpol PP |
| 🪖 Militer | TNI AD, BRIMOB |
| 🚒 Darurat | DAMKAR, BASARNAS, BPBD |
| 🚌 Transportasi | DISHUB, KEMENHUB |
| 🏥 Kesehatan | DINKES, Puskesmas |
| 🏛️ Pemerintahan | Kementerian, BUMN |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| 📱 Frontend | React 19 + TypeScript 5.8 |
| 🎨 Styling | Tailwind CSS 4 |
| 📦 Build | Vite 6 + Terser |
| 📲 Mobile | Capacitor 8 (Android) |
| ☁️ Backend | Supabase (Storage + DB) |
| 🤖 AI | Google Gemini 1.5 Flash |
| 🖼️ Canvas | html2canvas + Canvas API |

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 18+
- Android Studio (untuk build APK)
- Java 17

### Development
```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

### Build Android
```bash
# Build web
npm run build

# Sync ke Android
npx cap sync android

# Build APK + AAB release
cd android
./gradlew assembleRelease bundleRelease
```

Output:
- APK → `android/app/build/outputs/apk/release/`
- AAB → `android/app/build/outputs/bundle/release/`
- Mapping → `android/app/build/outputs/mapping/release/mapping.txt`

---

## 📁 Struktur Proyek

```
bradwear/
├── 📂 components/          # React UI components
│   ├── HomeView.tsx        # Halaman utama & katalog
│   ├── DesignEditorView.tsx # Editor desain
│   ├── SummaryView.tsx     # Ringkasan & checkout
│   └── AdminView.tsx       # Panel admin
├── 📂 utils/               # Service layer
│   ├── supabaseService.ts  # Upload/download Supabase
│   ├── geminiService.ts    # AI scan warna
│   └── imageProcessor.ts  # Background removal
├── 📂 assets/              # Gambar produk lokal
├── 📂 android/             # Native Android (Capacitor)
├── App.tsx                 # Root component
├── constants.tsx           # Data produk & konfigurasi
├── types.ts                # TypeScript interfaces
└── assets.ts               # Dynamic asset loader
```

---

## 🔐 Keamanan

- Signing keystore: `android/app/release.keystore`
- Valid hingga: **2053**
- Signature scheme: SHA256withRSA (v2)
- R8/ProGuard aktif untuk obfuscation kode

> ⚠️ **Jangan commit file `.env.local` dan `release.keystore` ke repository publik!**

---

## 📊 Versi & Changelog

| Versi | Keterangan |
|---|---|
| 1.4.9 | R8/ProGuard aktif, mapping.txt untuk Play Store |
| 1.4.8 | Fix download desain via Canvas API (bypass CORS) |
| 1.4.7 | Perbaikan rating bahan (STF, Baby Canvas, dll) |
| 1.4.4 | versionCode otomatis dari package.json |

---

## 📞 Kontak

**CV. Asthajaya Braderindo**
- 💬 WhatsApp: [Hubungi CS](https://wa.me/)
- 🌐 Website: [bradwearindonesia.com](https://www.bradwearindonesia.com)

---

<div align="center">
  <sub>Made with ❤️ by CV. Asthajaya Braderindo · Bandung, Indonesia</sub>
</div>
