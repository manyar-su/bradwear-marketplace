export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  keywords: string[];
  category: string;
  heroImage: string;
  ctaTitle: string;
  ctaBody: string;
  sections: ArticleSection[];
};

export const ARTICLES: Article[] = [
  {
    slug: "panduan-pemesanan-kemeja-seragam-kantor",
    title: "Panduan Pemesanan Kemeja Seragam Kantor agar Branding Tim Lebih Profesional",
    description:
      "Pelajari alur pemesanan kemeja seragam kantor mulai dari menentukan model, bahan, warna, sampai konsultasi desain agar identitas perusahaan lebih rapi.",
    excerpt:
      "Artikel ini membantu Anda menyiapkan pemesanan kemeja untuk seragam kantor tanpa bingung memilih model, bahan, atau alur produksi.",
    publishedAt: "2026-06-08",
    keywords: ["pemesanan kemeja", "seragam kantor", "kemeja custom"],
    category: "Seragam Kantor",
    heroImage: "/assets/katalog/Model Kemeja/Executive Series/executive-depan-hitam.jpeg",
    ctaTitle: "Butuh Seragam Kantor yang Siap Diproduksi?",
    ctaBody:
      "Konsultasikan kebutuhan jumlah, model, dan deadline Anda bersama tim Bradwear agar penawaran lebih akurat dan proses produksi lebih cepat.",
    sections: [
      {
        heading: "Mulai dari fungsi seragam, bukan hanya model",
        paragraphs: [
          "Saat melakukan pemesanan kemeja untuk seragam kantor, langkah pertama adalah menentukan fungsi utamanya. Apakah seragam dipakai harian, untuk event perusahaan, kunjungan lapangan, atau kebutuhan front office yang menuntut tampilan formal.",
          "Dengan memahami fungsi seragam lebih dulu, Anda akan lebih mudah memilih model kemeja custom yang nyaman dipakai namun tetap selaras dengan citra perusahaan.",
        ],
      },
      {
        heading: "Pilih bahan yang sesuai dengan ritme kerja tim",
        paragraphs: [
          "Bahan menentukan kenyamanan dan kesan akhir. Untuk seragam kantor yang dipakai harian, bahan seperti tropical, oxford, atau drill sering menjadi pilihan karena tetap rapi dan cukup mudah dirawat.",
          "Jika tim Anda lebih sering bergerak aktif, konsultasikan bahan yang lebih tahan gesekan dan tetap adem agar seragam kantor tidak hanya bagus di foto, tetapi juga nyaman dipakai sepanjang hari.",
        ],
      },
      {
        heading: "Kunci efisiensi ada pada alur order yang jelas",
        paragraphs: [
          "Website Bradflow memudahkan Anda memilih model, meninjau desain, lalu melanjutkan ke konsultasi. Ini mempercepat proses karena kebutuhan awal sudah lebih terstruktur sejak awal percakapan.",
          "Semakin lengkap data awal seperti jumlah tim, warna brand, ukuran, dan deadline, semakin cepat pula estimasi harga dan waktu pengerjaan bisa diberikan.",
        ],
      },
    ],
  },
  {
    slug: "tips-memilih-bahan-seragam-dinas",
    title: "Tips Memilih Bahan Seragam Dinas yang Tahan Pakai dan Tetap Nyaman",
    description:
      "Panduan memilih bahan seragam dinas untuk kebutuhan lapangan dan kerja harian agar hasil akhir kuat, nyaman, dan mudah dirawat.",
    excerpt:
      "Seragam dinas membutuhkan bahan yang tepat agar tetap nyaman, kuat, dan mendukung mobilitas kerja tim di lapangan maupun di kantor.",
    publishedAt: "2026-06-08",
    keywords: ["seragam dinas", "kemeja custom", "konveksi seragam"],
    category: "Seragam Dinas",
    heroImage: "/assets/katalog/Model Kemeja/Pdh/Pdh Depan hitam.png",
    ctaTitle: "Perlu Rekomendasi Bahan Seragam Dinas?",
    ctaBody:
      "Tim Bradwear bisa membantu menyesuaikan bahan dengan kebutuhan mobilitas, lokasi kerja, dan target tampilan seragam dinas Anda.",
    sections: [
      {
        heading: "Seragam dinas membutuhkan material yang stabil",
        paragraphs: [
          "Banyak tim memilih seragam dinas hanya dari warna dan model, padahal bahan adalah penentu utama daya tahan dan kenyamanan. Untuk aktivitas lapangan, material perlu tahan pakai dan tetap nyaman di iklim tropis.",
          "Bahan yang tepat juga membantu seragam tetap terlihat rapi meskipun digunakan untuk kegiatan dengan frekuensi tinggi.",
        ],
      },
      {
        heading: "Pertimbangkan lingkungan kerja tim",
        paragraphs: [
          "Jika tim bekerja di lapangan, bahan drill, ripstop, atau material yang lebih kokoh sering lebih relevan. Untuk kegiatan administrasi atau pertemuan resmi, bahan yang lebih halus dan presentable bisa menjadi pilihan.",
          "Inilah sebabnya konsultasi sebelum produksi penting, karena seragam dinas untuk petugas lapangan tentu berbeda kebutuhannya dengan seragam dinas untuk staf kantor.",
        ],
      },
      {
        heading: "Desain yang baik harus seimbang dengan fungsi",
        paragraphs: [
          "Tambahan bordir nama, logo instansi, saku, atau aksen warna harus tetap mendukung fungsi, bukan justru mengurangi kenyamanan pemakaian.",
          "Bradflow membantu Anda menyusun brief yang lebih jelas agar desain seragam dinas tetap kuat secara visual dan fungsional.",
        ],
      },
    ],
  },
  {
    slug: "rekomendasi-desain-seragam-komunitas",
    title: "Rekomendasi Desain Seragam Komunitas agar Identitas Tim Lebih Solid",
    description:
      "Temukan ide desain seragam komunitas yang mudah diterapkan untuk event, touring, organisasi, dan kegiatan lapangan dengan hasil yang tetap rapi.",
    excerpt:
      "Seragam komunitas yang baik tidak harus rumit. Yang penting mudah dikenali, nyaman dipakai, dan relevan dengan karakter kelompok Anda.",
    publishedAt: "2026-06-08",
    keywords: ["seragam komunitas", "jaket custom", "polo custom"],
    category: "Komunitas",
    heroImage: "/assets/katalog/jaket/jaket-depan-hitam.jpeg",
    ctaTitle: "Siapkan Desain Seragam Komunitas Anda",
    ctaBody:
      "Gunakan Brad AI untuk eksplorasi awal, lalu lanjutkan ke WhatsApp agar desain, warna, dan kuantitas bisa dibahas lebih detail.",
    sections: [
      {
        heading: "Mulai dari aktivitas komunitas",
        paragraphs: [
          "Desain seragam komunitas akan terasa lebih tepat jika disesuaikan dengan aktivitas utama komunitas. Untuk touring atau event outdoor, jaket custom atau vest bisa lebih relevan daripada kemeja formal.",
          "Untuk komunitas kreatif, panitia event, atau organisasi kampus, polo custom sering menjadi pilihan yang lebih fleksibel dan santai.",
        ],
      },
      {
        heading: "Gunakan elemen identitas yang mudah dibaca",
        paragraphs: [
          "Nama komunitas, logo, dan warna utama sebaiknya tampil jelas tanpa membuat desain terlalu ramai. Seragam komunitas yang baik justru terlihat kompak karena elemen visualnya rapi.",
          "Pertimbangkan juga posisi bordir atau sablon agar nyaman dipakai saat duduk, bergerak, atau membawa tas dan perlengkapan.",
        ],
      },
      {
        heading: "Pilih model yang realistis untuk diproduksi ulang",
        paragraphs: [
          "Jika komunitas Anda berkembang, desain seragam sebaiknya mudah diulang untuk batch berikutnya. Ini penting agar identitas visual tetap konsisten walau order dilakukan bertahap.",
          "Di sinilah brief desain dan penyimpanan referensi model menjadi sangat membantu untuk pemesanan berikutnya.",
        ],
      },
    ],
  },
  {
    slug: "perbedaan-polo-kemeja-dan-jaket-custom",
    title: "Perbedaan Polo Custom, Kemeja Custom, dan Jaket Custom untuk Kebutuhan Seragam",
    description:
      "Bandingkan polo custom, kemeja custom, dan jaket custom agar Anda lebih mudah memilih produk yang paling sesuai untuk kebutuhan seragam tim.",
    excerpt:
      "Setiap jenis seragam punya karakter yang berbeda. Memahami perbedaannya membantu Anda mengambil keputusan yang lebih efisien.",
    publishedAt: "2026-06-08",
    keywords: ["polo custom", "kemeja custom", "jaket custom"],
    category: "Perbandingan Produk",
    heroImage: "/assets/katalog/Polo shirt/Kaospolo-hitam.png",
    ctaTitle: "Masih Bingung Memilih Jenis Produk?",
    ctaBody:
      "Tanyakan ke Brad AI atau konsultasikan langsung kebutuhan tim Anda supaya kami bisa merekomendasikan kombinasi produk yang paling sesuai.",
    sections: [
      {
        heading: "Kemeja custom untuk tampilan formal dan rapi",
        paragraphs: [
          "Kemeja custom sering dipilih untuk seragam kantor, seragam dinas, dan kebutuhan organisasi yang ingin menampilkan kesan formal.",
          "Keunggulannya ada pada struktur desain yang lebih tegas, cocok untuk bordir nama, identitas jabatan, dan kebutuhan representatif.",
        ],
      },
      {
        heading: "Polo custom untuk suasana kerja yang lebih santai",
        paragraphs: [
          "Polo custom cocok digunakan ketika perusahaan atau komunitas ingin tetap rapi namun tidak terlalu formal. Produk ini sering dipilih untuk event, frontliner, dan kegiatan lapangan ringan.",
          "Dari sisi fleksibilitas, polo custom juga cocok untuk merchandise komunitas atau kegiatan promosi brand.",
        ],
      },
      {
        heading: "Jaket custom untuk mobilitas dan proteksi tambahan",
        paragraphs: [
          "Jaket custom lebih tepat untuk kebutuhan luar ruang, mobilitas tinggi, atau tim yang membutuhkan tampilan lebih tangguh. Ini termasuk vest atau outerwear kerja yang mendukung aktivitas operasional.",
          "Jika ingin hasil terbaik, Anda bisa mengombinasikan kemeja atau polo dengan jaket custom sebagai paket seragam yang lebih lengkap.",
        ],
      },
    ],
  },
  {
    slug: "cara-menentukan-ukuran-seragam-untuk-tim",
    title: "Cara Menentukan Ukuran Seragam untuk Tim agar Produksi Lebih Efisien",
    description:
      "Panduan menentukan ukuran seragam tim untuk mengurangi revisi, mempercepat produksi, dan menjaga kenyamanan pemakaian.",
    excerpt:
      "Ukuran yang tepat membantu proses produksi berjalan lebih efisien dan mengurangi risiko seragam tidak terpakai setelah jadi.",
    publishedAt: "2026-06-08",
    keywords: ["seragam kantor", "seragam komunitas", "pemesanan kemeja"],
    category: "Produksi",
    heroImage: "/assets/katalog/Model Kemeja/Ventura/Ventura Hitam.png",
    ctaTitle: "Perlu Bantuan Menyusun Data Ukuran?",
    ctaBody:
      "Hubungi tim Bradwear untuk menyusun format data ukuran yang lebih rapi sebelum pesanan Anda masuk ke tahap produksi.",
    sections: [
      {
        heading: "Pisahkan ukuran standar dan kebutuhan khusus",
        paragraphs: [
          "Dalam pemesanan kemeja atau seragam tim, ukuran standar seperti S sampai XXL biasanya bisa langsung dikelompokkan. Namun beberapa anggota mungkin membutuhkan ukuran besar atau penyesuaian tertentu.",
          "Memisahkan data sejak awal akan memudahkan tim produksi menyiapkan material dan meminimalkan revisi.",
        ],
      },
      {
        heading: "Gunakan format data yang konsisten",
        paragraphs: [
          "Format yang rapi mempermudah komunikasi. Cantumkan nama, ukuran, jenis kelamin bila relevan, dan catatan khusus jika ada penyesuaian.",
          "Semakin rapi data yang diberikan, semakin cepat tim bisa menghitung estimasi harga dan waktu pengerjaan.",
        ],
      },
      {
        heading: "Pastikan ukuran mendukung fungsi kerja",
        paragraphs: [
          "Ukuran seragam kantor yang terlalu sempit atau terlalu longgar bisa memengaruhi kenyamanan. Hal yang sama berlaku untuk seragam lapangan dan komunitas yang memerlukan ruang gerak lebih besar.",
          "Karena itu, ukuran sebaiknya diputuskan berdasarkan kenyamanan aktual, bukan hanya kebiasaan memilih size sehari-hari.",
        ],
      },
    ],
  },
  {
    slug: "estimasi-proses-produksi-seragam-custom",
    title: "Estimasi Proses Produksi Seragam Custom dari Brief hingga Pengiriman",
    description:
      "Kenali tahapan produksi seragam custom agar Anda bisa menyiapkan timeline internal dengan lebih realistis dan minim kendala.",
    excerpt:
      "Mengetahui alur produksi membantu Anda menentukan deadline yang lebih masuk akal dan meminimalkan revisi yang memperlambat proses.",
    publishedAt: "2026-06-08",
    keywords: ["konveksi seragam", "estimasi pengerjaan", "pemesanan kemeja"],
    category: "Timeline Produksi",
    heroImage: "/assets/katalog/factory_hero.jpg",
    ctaTitle: "Ingin Estimasi Pengerjaan untuk Kebutuhan Anda?",
    ctaBody:
      "Gunakan Brad AI untuk estimasi awal, lalu lanjutkan konsultasi WhatsApp agar timeline produksi bisa disesuaikan dengan jumlah dan kompleksitas order Anda.",
    sections: [
      {
        heading: "Produksi dimulai dari brief yang jelas",
        paragraphs: [
          "Tahap awal produksi seragam custom dimulai dari penentuan produk, jumlah, bahan, warna, dan posisi identitas seperti logo atau nama.",
          "Semakin jelas brief di awal, semakin sedikit revisi yang berpotensi menambah waktu pengerjaan.",
        ],
      },
      {
        heading: "Estimasi dipengaruhi jumlah dan kompleksitas desain",
        paragraphs: [
          "Estimasi pengerjaan tidak hanya bergantung pada jumlah order, tetapi juga pada jenis produk, kombinasi bahan, jumlah size, dan detail aplikasi desain.",
          "Kemeja formal, vest lapangan, dan paket seragam lengkap tentu memiliki kebutuhan produksi yang berbeda.",
        ],
      },
      {
        heading: "Konsultasi awal membantu mengamankan deadline",
        paragraphs: [
          "Jika Anda memiliki kebutuhan deadline untuk event, peluncuran, atau kegiatan dinas, informasikan sejak awal. Ini membantu tim menyusun prioritas dan memberikan arahan yang lebih realistis.",
          "Bradflow dirancang agar proses awal konsultasi lebih cepat, tetapi final timeline tetap perlu dikonfirmasi melalui tim produksi.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}
