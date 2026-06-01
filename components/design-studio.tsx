"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { Download, Save, ShoppingCart, Upload, Type, Palette } from "lucide-react";

type Props = {
  slug: string;
  productName: string;
  color: string;
  productImage?: string;
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

type DragKind = "text" | "logo";
type ViewMode = "front" | "back" | "sleeve";
type ViewLayer = {
  textLayer: TextLayer;
  logoLayer: LogoLayer | null;
};

const QUICK_COLORS = ["#0f172a", "#1d4ed8", "#0f766e", "#475569", "#f8fafc", "#7f1d1d"];
const VIEW_OPTIONS: Array<{ key: ViewMode; label: string }> = [
  { key: "front", label: "Depan" },
  { key: "back", label: "Belakang" },
  { key: "sleeve", label: "Lengan" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DesignStudio({ slug, productName, color, productImage }: Props) {
  const router = useRouter();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>("front");
  const [viewLayers, setViewLayers] = useState<Record<ViewMode, ViewLayer>>({
    front: {
      textLayer: { x: 132, y: 102, text: "BRADWEAR", color: "#f8fafc" },
      logoLayer: null,
    },
    back: {
      textLayer: { x: 128, y: 100, text: "BACK MARK", color: "#f8fafc" },
      logoLayer: null,
    },
    sleeve: {
      textLayer: { x: 124, y: 94, text: "SLV", color: "#f8fafc" },
      logoLayer: null,
    },
  });
  const [status, setStatus] = useState("");
  const [canvasColor, setCanvasColor] = useState(color);
  const dragRef = useRef<DragKind | null>(null);
  const pointerOffset = useRef({ x: 0, y: 0 });
  const textLayer = viewLayers[activeView].textLayer;
  const logoLayer = viewLayers[activeView].logoLayer;

  const designPayload = useMemo(
    () => ({
      slug,
      productName,
      activeView,
      viewLayers,
      canvasColor,
    }),
    [slug, productName, activeView, viewLayers, canvasColor]
  );

  function updateTextLayer(updater: (prev: TextLayer) => TextLayer) {
    setViewLayers((prev) => ({
      ...prev,
      [activeView]: {
        ...prev[activeView],
        textLayer: updater(prev[activeView].textLayer),
      },
    }));
  }

  function updateLogoLayer(updater: (prev: LogoLayer | null) => LogoLayer | null) {
    setViewLayers((prev) => ({
      ...prev,
      [activeView]: {
        ...prev[activeView],
        logoLayer: updater(prev[activeView].logoLayer),
      },
    }));
  }

  function startDrag(kind: DragKind, pointerX: number, pointerY: number) {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const localX = pointerX - rect.left;
    const localY = pointerY - rect.top;
    dragRef.current = kind;

    if (kind === "text") {
      pointerOffset.current = { x: localX - textLayer.x, y: localY - textLayer.y };
      return;
    }

    if (logoLayer) {
      pointerOffset.current = { x: localX - logoLayer.x, y: localY - logoLayer.y };
    }
  }

  function moveDrag(pointerX: number, pointerY: number) {
    const board = boardRef.current;
    if (!board || !dragRef.current) return;
    const rect = board.getBoundingClientRect();
    const localX = pointerX - rect.left;
    const localY = pointerY - rect.top;
    const nextX = clamp(localX - pointerOffset.current.x, 8, rect.width - 24);
    const nextY = clamp(localY - pointerOffset.current.y, 8, rect.height - 24);

    if (dragRef.current === "text") {
      updateTextLayer((prev) => ({
        ...prev,
        x: nextX,
        y: nextY,
      }));
      return;
    }

    if (logoLayer) {
      updateLogoLayer((prev) =>
        prev
          ? {
              ...prev,
              x: nextX,
              y: nextY,
            }
          : null
      );
    }
  }

  function endDrag() {
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
    <div className="rounded-[32px] border border-emerald-300/20 bg-neutral-950 p-3 text-slate-100 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-5">
      <div className="grid gap-4 xl:grid-cols-[320px,1fr,300px]">
        <section className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <Type className="h-4 w-4 text-emerald-300" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Editor Panel</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">Text Bordir</label>
              <input
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400"
              value={textLayer.text}
              onChange={(e) => updateTextLayer((prev) => ({ ...prev, text: e.target.value }))}
            />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">Warna Text</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-10 w-16 cursor-pointer rounded-xl border border-white/15 bg-black/40"
                  value={textLayer.color}
                  onChange={(e) => updateTextLayer((prev) => ({ ...prev, color: e.target.value }))}
                />
                <input
                  className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  value={textLayer.color}
                  onChange={(e) => updateTextLayer((prev) => ({ ...prev, color: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">Upload Logo</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300/40 bg-emerald-400/10 px-3 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20">
                <Upload className="h-4 w-4" />
                Pilih File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      updateLogoLayer(() => ({
                        src: String(reader.result),
                        x: 90,
                        y: 190,
                        width: 110,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            {logoLayer ? (
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-300">Ukuran Logo</label>
                <input
                  type="range"
                  min={48}
                  max={220}
                  value={logoLayer.width}
                  className="w-full accent-emerald-400"
                  onChange={(e) =>
                    updateLogoLayer((prev) =>
                      prev
                        ? {
                            ...prev,
                            width: Number(e.target.value),
                          }
                        : null
                    )
                  }
                />
              </div>
            ) : null}
            <div>
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                <Palette className="h-3.5 w-3.5" />
                Warna Dasar
              </div>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_COLORS.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    className={`h-9 rounded-xl border transition ${canvasColor === swatch ? "border-emerald-300 ring-2 ring-emerald-300/50" : "border-white/15"}`}
                    style={{ backgroundColor: swatch }}
                    onClick={() => setCanvasColor(swatch)}
                    aria-label={`Color ${swatch}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-gradient-to-b from-slate-900/80 to-black p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight">{productName}</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Mode Desain</p>
            </div>
            <div className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
              Drag Layer
            </div>
          </div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            {VIEW_OPTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveView(item.key)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  activeView === item.key
                    ? "border-emerald-300 bg-emerald-300/25 text-emerald-100"
                    : "border-white/15 bg-black/25 text-slate-300 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            ref={boardRef}
            className="relative mx-auto h-[500px] w-full max-w-[360px] touch-none overflow-hidden rounded-[36px] border border-white/20 bg-slate-100"
            onPointerMove={(e) => moveDrag(e.clientX, e.clientY)}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_45%)]" />
            <div className="absolute inset-5 rounded-[30px] border border-black/15 shadow-inner" style={{ background: canvasColor }} />
            {productImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={productImage} alt={productName} className="pointer-events-none absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] object-contain opacity-35" />
            ) : null}
            <div
              className="absolute cursor-move select-none rounded-xl border border-white/20 bg-black/35 px-3 py-1 text-lg font-bold uppercase tracking-wide text-white"
              style={{ left: textLayer.x, top: textLayer.y, color: textLayer.color }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                startDrag("text", e.clientX, e.clientY);
              }}
            >
              {textLayer.text}
            </div>
            {logoLayer ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoLayer.src}
                alt="Logo"
                className="absolute cursor-move rounded-md"
                style={{
                  left: logoLayer.x,
                  top: logoLayer.y,
                  width: logoLayer.width,
                }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startDrag("logo", e.clientX, e.clientY);
                }}
              />
            ) : null}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Aksi</h2>
          <div className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-sm font-semibold transition hover:bg-white/20"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download Desain
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-3 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/25"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              Simpan Desain
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-3 py-3 text-sm font-bold text-neutral-950 transition hover:bg-emerald-300"
              onClick={handleOrder}
            >
              <ShoppingCart className="h-4 w-4" />
              Lanjut Checkout
            </button>
          </div>
          <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-black/35 p-3 text-xs text-slate-300">
            <p className="font-semibold text-slate-100">Ringkasan Produksi</p>
            <p>Model: {productName}</p>
            <p>Slug: {slug}</p>
            <p>View Aktif: {VIEW_OPTIONS.find((item) => item.key === activeView)?.label}</p>
            <p>Layer Text: {textLayer.text || "-"}</p>
            <p>Layer Logo: {logoLayer ? "Aktif" : "Belum ada"}</p>
          </div>
          {status ? (
            <p className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
              {status}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
