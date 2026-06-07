"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Truck } from "lucide-react";
import { TRACKING_CARRIERS } from "@/lib/site-content";

export function TrackingLauncher() {
  const [carrierSlug, setCarrierSlug] = useState(TRACKING_CARRIERS[0]?.slug || "");
  const [resi, setResi] = useState("");

  const carrier = useMemo(
    () => TRACKING_CARRIERS.find((item) => item.slug === carrierSlug) || TRACKING_CARRIERS[0],
    [carrierSlug]
  );

  function openTracking() {
    if (!carrier) return;
    const url = resi.trim()
      ? `${carrier.trackingUrl}?resi=${encodeURIComponent(resi.trim())}`
      : carrier.trackingUrl;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Tracking Kurir Indonesia
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
            Cek pengiriman JNE, J&amp;T, SiCepat, AnterAja, Pos Indonesia, dan lainnya
          </h2>
          <p className="mt-4 text-sm leading-8 text-neutral-600 md:text-base">
            Masukkan nomor resi jika sudah ada, pilih kurir yang digunakan, lalu buka halaman resmi tracking. Halaman ini mempermudah pelanggan Bradflow saat melacak pengiriman hasil pemesanan kemeja, polo custom, jaket custom, atau celana seragam.
          </p>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-neutral-700">Pilih kurir</span>
              <select
                value={carrierSlug}
                onChange={(event) => setCarrierSlug(event.target.value)}
                className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none"
              >
                {TRACKING_CARRIERS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-neutral-700">Nomor resi (opsional)</span>
              <input
                value={resi}
                onChange={(event) => setResi(event.target.value)}
                placeholder="Contoh: JX1234567890"
                className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none"
              />
            </label>

            {carrier ? (
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-white px-4 py-4 text-sm text-neutral-600">
                <p className="font-semibold text-neutral-950">{carrier.name}</p>
                <p className="mt-1 leading-7">{carrier.description}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={openTracking}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-4 text-sm font-bold text-white"
            >
              <Truck className="h-4 w-4" />
              Buka Tracking Resmi
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
