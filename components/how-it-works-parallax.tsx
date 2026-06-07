"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STEPS = [
  {
    title: "Tentukan kebutuhan seragam Anda",
    description:
      "Mulai dari kebutuhan pemesanan kemeja untuk seragam kantor, seragam dinas, atau seragam komunitas. Tentukan juga jumlah, model, dan deadline.",
    image: "/assets/katalog/Model Kemeja/Executive Series/executive-depan-hitam.jpeg",
  },
  {
    title: "Pilih model dan eksplorasi desain",
    description:
      "Masuk ke kategori produk yang sesuai, lalu pilih kemeja custom, polo custom, jaket custom, atau celana seragam sebelum lanjut ke konsultasi detail.",
    image: "/assets/katalog/Model Kemeja/Brad-V3/(brad v-3)hitam.png",
  },
  {
    title: "Simpan brief dan lanjutkan konsultasi",
    description:
      "Gunakan Brad AI untuk estimasi awal atau langsung ke WhatsApp agar tim Bradwear membantu bahan, warna, ukuran, dan penyesuaian kebutuhan produksi.",
    image: "/assets/katalog/Polo shirt/Kaospolo-hitam.png",
  },
];

export function HowItWorksParallax() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function onScroll() {
      setOffset(window.scrollY * 0.08);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="space-y-8">
      {STEPS.map((step, index) => (
        <section
          key={step.title}
          className="grid gap-6 rounded-[32px] border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-[1.1fr,0.9fr] md:p-8"
        >
          <div
            className="relative h-[320px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_32%),linear-gradient(160deg,#f8fafc,#edf7f0)]"
            style={{ transform: `translateY(${index % 2 === 0 ? offset * 0.25 : -offset * 0.18}px)` }}
          >
            <Image src={step.image} alt={step.title} fill className="object-contain p-6" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Langkah {index + 1}
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">{step.title}</h3>
            <p className="mt-4 text-sm leading-8 text-neutral-600 md:text-base">{step.description}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
