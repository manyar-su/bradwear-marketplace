# Navbar Animation Reference

Panduan ini dibuat dari inspeksi visual dan source `https://www.bahanseragam.com/` pada 21 Juni 2026, lalu diterjemahkan menjadi referensi implementasi yang lebih rapi untuk dipakai ulang.

## Ringkasan Temuan

Navbar/header pada situs target **bukan** animasi berat. Efek yang terlihat di area atas halaman adalah gabungan beberapa hal:

1. `Header overlay`
   Header berada di atas hero, posisinya overlay dan transparan.
2. `Gradient gelap tipis`
   Ada gradasi transparan ke hitam tipis agar logo dan menu tetap terbaca di atas gambar hero.
3. `Transition ringan`
   Header punya transisi umum, tetapi tidak ada morphing kompleks saat scroll.
4. `Hero yang sebenarnya bergerak`
   Kesan "header animasi" pada situs itu lebih banyak datang dari hero:
   - slideshow fade
   - zoom-fade pada background image
   - rise-up pada teks
   - fade-in pada tombol
   - parallax saat scroll

## Identifikasi Teknis

Hasil identifikasi dari source situs target:

| Area | Efek | Temuan |
|---|---|---|
| Navbar | overlay | `position: absolute` di atas hero |
| Navbar | gradient | background linear-gradient gelap tipis |
| Navbar | transisi | `transition: all` |
| Hero slider | fade | `Flickity` dengan mode `is-fade` |
| Hero image | zoom-fade | keyframe `zoom-fade` |
| Hero text | rise-up | keyframe `rise-up` |
| CTA | fade-in | keyframe `fade-in` |
| Hero wrapper | parallax | `data-parallax="true"` |

## Apa yang Dibuat di Folder Ini

Folder ini berisi versi implementasi yang bisa dipakai ulang:

- `navbar-overlay-demo.html`
  Demo mandiri yang bisa langsung dibuka di browser.
- `navbar-overlay-demo.css`
  Styling lengkap.
- `navbar-overlay-demo.js`
  Logika scroll, hide/reveal, dan mobile menu.

## Perbedaan Antara Situs Target dan Demo Ini

Demo di folder ini sengaja dibagi menjadi dua lapisan:

1. `Clone dekat ke situs target`
   - overlay navbar di atas hero
   - gradient tipis
   - warna teks terang di hero
   - hero zoom + text reveal

2. `Upgrade untuk dipakai produksi`
   - navbar berubah menjadi panel kaca/solid saat scroll
   - navbar auto-hide saat scroll ke bawah
   - navbar muncul lagi saat scroll ke atas
   - mobile drawer lebih jelas
   - dukungan `prefers-reduced-motion`

Jadi, bila Anda ingin hasil yang sangat mirip dengan situs referensi, pakai hanya state:

- default overlay
- scrolled solid

Kalau ingin pengalaman lebih modern, aktifkan juga:

- hide on scroll down
- reveal on scroll up

## Cara Pakai Cepat

1. Buka file [navbar-overlay-demo.html](./navbar-overlay-demo.html).
2. Pastikan file CSS dan JS di folder yang sama.
3. Salin struktur HTML, lalu pindahkan CSS dan JS sesuai stack proyek Anda.

## Struktur Efek

### 1. Overlay State

Dipakai saat halaman masih di atas hero.

Karakter:

- navbar transparan
- ada gradient ke bawah
- teks berwarna terang
- tidak ada shadow berat

### 2. Scrolled State

Dipakai setelah user scroll melewati ambang tertentu.

Karakter:

- background jadi semi-solid / glass
- blur halus
- border bawah tipis
- shadow kecil
- teks menjadi lebih gelap

### 3. Hidden State

Dipakai saat user scroll turun agar area konten lebih lega.

Karakter:

- navbar bergeser ke atas dengan `transform: translateY(-110%)`
- saat user scroll naik, navbar muncul lagi

### 4. Link Hover State

Dipakai untuk interaksi menu desktop.

Karakter:

- underline animasi dari kiri ke kanan
- opacity teks tidak berubah drastis

### 5. Mobile Menu State

Dipakai saat layar kecil.

Karakter:

- tombol hamburger
- panel turun dari atas
- animasi opacity + translate

## Logika JavaScript

Flow utama:

1. baca posisi scroll sekarang
2. bandingkan dengan posisi scroll sebelumnya
3. jika melewati threshold, tambahkan class `is-scrolled`
4. jika scroll turun cukup jauh, tambahkan class `is-hidden`
5. jika scroll naik, hapus class `is-hidden`
6. jika menu mobile terbuka, jangan hide navbar

## Ambang yang Direkomendasikan

Nilai awal yang aman:

- `SCROLLED_THRESHOLD = 36`
- `HIDE_THRESHOLD = 140`

Penyesuaian:

- Hero pendek: kecilkan `HIDE_THRESHOLD`
- Hero tinggi: besarkan `HIDE_THRESHOLD`
- Navbar sangat tinggi: tambahkan jarak hide lebih besar

## Integrasi ke React

Untuk proyek React, pindahkan isi file demo menjadi:

1. markup navbar di component
2. CSS ke file global atau CSS module
3. logika scroll ke `useEffect`

Contoh pola React:

```tsx
import { useEffect, useState } from 'react';

export function NavbarMotion() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastY;

      setIsScrolled(currentY > 36);

      if (!isOpen && scrollingDown && currentY > 140) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastY = currentY;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  return (
    <header
      className={[
        'navbar-motion',
        isScrolled ? 'is-scrolled' : '',
        isHidden ? 'is-hidden' : '',
        isOpen ? 'is-menu-open' : '',
      ].join(' ')}
    >
      {/* content */}
    </header>
  );
}
```

## Kapan Memakai Efek Ini

Efek ini cocok untuk:

- landing page dengan hero image/video
- katalog fashion
- website brand
- homepage yang butuh kesan premium

Efek ini kurang cocok untuk:

- dashboard internal
- halaman data padat
- halaman tanpa hero section

## Checklist Produksi

- pastikan tinggi navbar konsisten desktop/mobile
- cek kontras teks di atas hero
- cek scroll behavior di iPhone dan Android
- aktifkan `prefers-reduced-motion`
- jangan terlalu agresif menyembunyikan navbar
- uji ketika hero memakai video, bukan hanya gambar

## Catatan Penting

Jika ingin meniru situs referensi dengan ketat, fokus pada:

- overlay navbar
- gradient tipis
- hero fade slider
- zoom-fade image
- rise-up text

Jika ingin hasil lebih modern untuk proyek sendiri, gunakan demo di folder ini sebagai baseline.
