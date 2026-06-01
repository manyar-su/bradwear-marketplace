"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  productName: string;
  color: string;
};

type TextLayer = {
  x: number;
  y: number;
  text: string;
  color: string;
};

type LogoLayer = {
  x: number;
  y: number;
  src: string;
  width: number;
};

export function DesignStudio({ slug, productName, color }: Props) {
  const router = useRouter();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [textLayer, setTextLayer] = useState<TextLayer>({
    x: 120,
    y: 80,
    text: "BRADWEAR",
    color: "#111827",
  });
  const [logoLayer, setLogoLayer] = useState<LogoLayer | null>(null);
  const [status, setStatus] = useState("");
  const dragRef = useRef<"text" | "logo" | null>(null);
  const pointerOffset = useRef({ x: 0, y: 0 });

  const designPayload = useMemo(
    () => ({
      slug,
      productName,
      textLayer,
      logoLayer,
    }),
    [slug, productName, textLayer, logoLayer]
  );

  function pointerDown(kind: "text" | "logo", clientX: number, clientY: number) {
    dragRef.current = kind;
    if (kind === "text") {
      pointerOffset.current = { x: clientX - textLayer.x, y: clientY - textLayer.y };
    } else if (logoLayer) {
      pointerOffset.current = { x: clientX - logoLayer.x, y: clientY - logoLayer.y };
    }
  }

  function pointerMove(clientX: number, clientY: number) {
    if (!dragRef.current) return;
    if (dragRef.current === "text") {
      setTextLayer((prev) => ({
        ...prev,
        x: Math.max(8, clientX - pointerOffset.current.x),
        y: Math.max(8, clientY - pointerOffset.current.y),
      }));
    } else if (logoLayer) {
      setLogoLayer((prev) =>
        prev
          ? {
              ...prev,
              x: Math.max(8, clientX - pointerOffset.current.x),
              y: Math.max(8, clientY - pointerOffset.current.y),
            }
          : null
      );
    }
  }

  function pointerUp() {
    dragRef.current = null;
  }

  async function exportPng() {
    if (!boardRef.current) return null;
    const dataUrl = await toPng(boardRef.current, { cacheBust: true, pixelRatio: 2 });
    return dataUrl;
  }

  async function handleDownload() {
    const png = await exportPng();
    if (!png) return;
    const a = document.createElement("a");
    a.href = png;
    a.download = `${slug}-design.png`;
    a.click();
    setStatus("Desain berhasil didownload.");
  }

  async function handleSave() {
    const png = await exportPng();
    if (!png) return;
    setStatus("Menyimpan desain...");
    const res = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: slug,
        designDataUrl: png,
        designJson: designPayload,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Gagal simpan desain.");
      return;
    }

    localStorage.setItem(
      "marketplace_last_design",
      JSON.stringify({
        designId: data.item.id,
        designUrl: data.item.design_url,
        previewUrl: data.item.preview_url,
        productSlug: slug,
        productName,
        designJson: designPayload,
      })
    );
    setStatus("Desain tersimpan.");
  }

  async function handleOrder() {
    const png = await exportPng();
    if (!png) return;
    localStorage.setItem(
      "marketplace_checkout_seed",
      JSON.stringify({
        productSlug: slug,
        productName,
        designJson: designPayload,
        designDataUrl: png,
      })
    );
    router.push("/checkout");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px,1fr]">
      <section className="card space-y-3 p-4">
        <h2 className="text-lg font-semibold">Pengaturan Desain</h2>
        <label className="block text-sm font-medium text-slate-700">Teks</label>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={textLayer.text}
          onChange={(e) => setTextLayer((prev) => ({ ...prev, text: e.target.value }))}
        />
        <label className="block text-sm font-medium text-slate-700">Warna Teks</label>
        <input
          type="color"
          className="h-9 w-full rounded-md border border-slate-300"
          value={textLayer.color}
          onChange={(e) => setTextLayer((prev) => ({ ...prev, color: e.target.value }))}
        />
        <label className="block text-sm font-medium text-slate-700">Upload Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              setLogoLayer({
                src: String(reader.result),
                x: 70,
                y: 170,
                width: 92,
              });
            };
            reader.readAsDataURL(file);
          }}
        />
        <div className="grid grid-cols-1 gap-2 pt-2">
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            onClick={handleDownload}
          >
            Download Desain
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold"
            onClick={handleSave}
          >
            Simpan Desain
          </button>
          <button
            type="button"
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
            onClick={handleOrder}
          >
            Pesan Sekarang
          </button>
        </div>
        {status ? <p className="text-xs text-slate-600">{status}</p> : null}
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">{productName}</h2>
        <div
          ref={boardRef}
          className="relative mx-auto h-[460px] w-[340px] overflow-hidden rounded-xl border border-slate-300 bg-slate-100"
          onMouseMove={(e) => pointerMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
          onMouseUp={pointerUp}
          onMouseLeave={pointerUp}
        >
          <div className="absolute inset-5 rounded-[28px] border border-slate-300" style={{ background: color }} />
          <div
            className="absolute cursor-move select-none text-xl font-bold"
            style={{ left: textLayer.x, top: textLayer.y, color: textLayer.color }}
            onMouseDown={(e) => pointerDown("text", e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
          >
            {textLayer.text}
          </div>
          {logoLayer ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoLayer.src}
              alt="Logo"
              className="absolute cursor-move"
              style={{
                left: logoLayer.x,
                top: logoLayer.y,
                width: logoLayer.width,
              }}
              onMouseDown={(e) => pointerDown("logo", e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
