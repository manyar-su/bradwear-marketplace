"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { Download, Save, ShoppingCart, Upload, Undo2, Redo2, ScanLine } from "lucide-react";
import {
  CatalogScanResult,
  DesignDataV2,
  DesignEditorStep,
  DesignElement,
  DesignViewLabel,
  OrderItemDraft,
  ProductCatalogModel,
} from "@/lib/design-editor-types";
import {
  DESIGN_ASSET_MAP,
  DESIGN_MODELS,
  MATERIALS_BY_CATEGORY,
  findColorByHex,
  getAvailableViews,
  getModelByName,
  getModelBySlug,
} from "@/lib/design-catalog";

type Props = {
  slug: string;
  productName: string;
  color: string;
  productImage?: string;
};

type ItemForm = {
  size: string;
  gender: "Pria" | "Wanita";
  sleeve: "Panjang" | "Pendek";
  qty: number;
  colorCode: string;
  note: string;
};

const STEP_LABELS: Array<{ key: DesignEditorStep; label: string }> = [
  { key: "materials", label: "Material" },
  { key: "details", label: "Detail" },
  { key: "finish", label: "Finish" },
];

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "Kustom"];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function DesignStudio({ slug, productName, color, productImage }: Props) {
  const router = useRouter();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const scanRef = useRef<HTMLInputElement | null>(null);

  const initialModel =
    getModelBySlug(slug) ||
    getModelByName(productName) ||
    DESIGN_MODELS.find((item) => item.category === "Kemeja") ||
    DESIGN_MODELS[0];

  const [model, setModel] = useState<ProductCatalogModel>({
    ...initialModel,
    image: initialModel.image || productImage || "",
  });

  const [step, setStep] = useState<DesignEditorStep>(
    model.category === "Celana" ? "finish" : "materials"
  );
  const [activeView, setActiveView] = useState<DesignViewLabel>("Depan");
  const [material, setMaterial] = useState(
    MATERIALS_BY_CATEGORY[model.category][0] || "TROPICAL"
  );
  const [activeColor, setActiveColor] = useState(color || "#1A237E");
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState("");
  const [scanResult, setScanResult] = useState<CatalogScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItemDraft[]>([]);
  const [itemForm, setItemForm] = useState<ItemForm>({
    size: "L",
    gender: "Pria",
    sleeve: "Panjang",
    qty: 1,
    colorCode: "",
    note: "",
  });
  const [history, setHistory] = useState<DesignElement[][]>([[]]);
  const [historyPointer, setHistoryPointer] = useState(0);

  const availableViews = useMemo(() => getAvailableViews(model.category), [model.category]);
  const selectedElement = elements.find((item) => item.id === selectedId) || null;

  const imageByView = useMemo(() => {
    if (activeView === "Depan") return model.images.front || model.image || productImage || "";
    if (activeView === "Belakang")
      return model.images.back || model.images.front || model.image || productImage || "";
    if (activeView === "Kanan")
      return model.images.rightSleeve || model.images.front || model.image || productImage || "";
    return model.images.leftSleeve || model.images.front || model.image || productImage || "";
  }, [activeView, model, productImage]);

  function syncHistory(nextElements: DesignElement[]) {
    const nextHistory = [...history.slice(0, historyPointer + 1), nextElements];
    setHistory(nextHistory);
    setHistoryPointer(nextHistory.length - 1);
  }

  function setElementsWithHistory(nextElements: DesignElement[]) {
    setElements(nextElements);
    syncHistory(nextElements);
  }

  function selectModel(nextModel: ProductCatalogModel) {
    setModel(nextModel);
    setMaterial(MATERIALS_BY_CATEGORY[nextModel.category][0] || "TROPICAL");
    const nextViews = getAvailableViews(nextModel.category);
    setActiveView(nextViews[0]);
    setElements([]);
    setHistory([[]]);
    setHistoryPointer(0);
    setOrderItems([]);
    setStep(nextModel.category === "Celana" ? "finish" : "materials");
  }

  function addTextElement(kind: "nama" | "jabatan") {
    const text = kind === "nama" ? "NAMA" : "JABATAN";
    const element: DesignElement = {
      id: uid("txt"),
      type: "text",
      content: text,
      pos: kind === "nama" ? { x: 36, y: 22 } : { x: 64, y: 22 },
      scale: 1,
      view: activeView,
      color: "#FFFFFF",
    };
    const next = [...elements, element];
    setSelectedId(element.id);
    setElementsWithHistory(next);
  }

  function addLogoElement(src: string) {
    const element: DesignElement = {
      id: uid("img"),
      type: "image",
      content: src,
      pos: { x: 36, y: 14 },
      scale: 1,
      view: activeView,
    };
    const next = [...elements, element];
    setSelectedId(element.id);
    setElementsWithHistory(next);
  }

  function updateSelectedElement(patch: Partial<DesignElement>) {
    if (!selectedId) return;
    const next = elements.map((item) => (item.id === selectedId ? { ...item, ...patch } : item));
    setElements(next);
  }

  function commitElementMutation() {
    syncHistory(elements);
  }

  function undo() {
    if (historyPointer <= 0) return;
    const nextPointer = historyPointer - 1;
    setHistoryPointer(nextPointer);
    setElements(history[nextPointer] || []);
    setSelectedId(null);
  }

  function redo() {
    if (historyPointer >= history.length - 1) return;
    const nextPointer = historyPointer + 1;
    setHistoryPointer(nextPointer);
    setElements(history[nextPointer] || []);
    setSelectedId(null);
  }

  function moveElementFromPointer(pointerX: number, pointerY: number) {
    if (!draggingId || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = clamp(((pointerX - rect.left) / rect.width) * 100, 2, 98);
    const y = clamp(((pointerY - rect.top) / rect.height) * 100, 2, 98);
    setElements((prev) =>
      prev.map((item) => (item.id === draggingId ? { ...item, pos: { x, y } } : item))
    );
  }

  function extractDesignData(): DesignDataV2 {
    return {
      schema_version: "bradmock_v2",
      productSlug: model.slug,
      productName: model.name,
      category: model.category,
      material,
      color: activeColor,
      view: activeView,
      elements,
      orderItems,
      scanMetadata: scanResult,
    };
  }

  async function exportPng() {
    if (!boardRef.current) return null;
    return toPng(boardRef.current, { cacheBust: true, pixelRatio: 2 });
  }

  async function handleDownload() {
    const image = await exportPng();
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `${model.slug}-${activeView.toLowerCase()}.png`;
    link.click();
    setStatus("Desain berhasil didownload.");
  }

  async function handleSave() {
    const image = await exportPng();
    if (!image) return;
    setStatus("Menyimpan desain...");
    const res = await fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: model.slug,
        designDataUrl: image,
        designJson: extractDesignData(),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Gagal menyimpan desain.");
      return;
    }
    localStorage.setItem(
      "marketplace_last_design",
      JSON.stringify({
        designId: data.item.id,
        designUrl: data.item.design_url,
        previewUrl: data.item.preview_url,
        productSlug: model.slug,
        productName: model.name,
        category: model.category,
        designJson: extractDesignData(),
      })
    );
    setStatus("Desain tersimpan.");
  }

  async function handleCheckout() {
    const image = await exportPng();
    if (!image) return;
    const payload = extractDesignData();
    localStorage.setItem(
      "marketplace_checkout_seed",
      JSON.stringify({
        productSlug: model.slug,
        productName: model.name,
        category: model.category,
        designDataUrl: image,
        designJson: payload,
        qty: orderItems.reduce((sum, item) => sum + item.qty, 0) || 1,
        model: model.name,
        warna: findColorByHex(activeColor)?.name || activeColor,
        sizeDetails:
          orderItems.length > 0
            ? orderItems.map((item) => ({
                size: item.size,
                qty: item.qty,
                gender: item.gender,
                sleeve: item.sleeve,
              }))
            : [{ size: "L", qty: 1 }],
      })
    );
    router.push("/checkout");
  }

  async function handleScanImage(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const imageDataUrl = String(reader.result || "");
      setScanning(true);
      setStatus("Menganalisa scan katalog...");
      try {
        const res = await fetch("/api/designs/scan-catalog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDataUrl,
            material,
            model: model.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.error || "Scan gagal.");
          return;
        }
        const result = data.result as CatalogScanResult;
        setScanResult(result);
        if (result.normalizedColorHex) {
          setActiveColor(result.normalizedColorHex);
        }
        if (result.colorCode) {
          setItemForm((prev) => ({ ...prev, colorCode: result.colorCode || prev.colorCode }));
        }
        setStatus("Scan selesai, data warna berhasil dipetakan.");
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function addOrderItem() {
    const item: OrderItemDraft = {
      id: uid("item"),
      modelSlug: model.slug,
      modelName: model.name,
      colorHex: activeColor,
      colorCode: itemForm.colorCode || "-",
      size: itemForm.size,
      gender: itemForm.gender,
      sleeve: itemForm.sleeve,
      qty: itemForm.qty,
      note: itemForm.note || undefined,
    };
    setOrderItems((prev) => [item, ...prev]);
    setItemForm((prev) => ({ ...prev, qty: 1, note: "" }));
  }

  const materials = MATERIALS_BY_CATEGORY[model.category];
  const filteredElements = elements.filter((item) => item.view === activeView);
  const totalQty = orderItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="rounded-[32px] border border-emerald-300/20 bg-neutral-950 p-3 text-slate-100 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-5">
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-3 grid grid-cols-3 gap-2">
          {STEP_LABELS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStep(item.key)}
              className={`rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                step === item.key
                  ? "bg-emerald-400 text-neutral-950"
                  : "border border-white/15 bg-black/30 text-slate-300 hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs">
            <span className="mb-1 block uppercase tracking-wider text-slate-300">Model</span>
            <select
              value={model.slug}
              onChange={(e) => {
                const next = getModelBySlug(e.target.value);
                if (next) selectModel(next);
              }}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-emerald-300"
            >
              {DESIGN_MODELS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase tracking-wider text-slate-300">Material</span>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-emerald-300"
            >
              {materials.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase tracking-wider text-slate-300">Zoom</span>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block uppercase tracking-wider text-slate-300">Pan X/Y</span>
            <div className="grid grid-cols-2 gap-1">
              <input
                type="range"
                min={-100}
                max={100}
                value={pan.x}
                onChange={(e) => setPan((prev) => ({ ...prev, x: Number(e.target.value) }))}
                className="w-full accent-emerald-400"
              />
              <input
                type="range"
                min={-100}
                max={100}
                value={pan.y}
                onChange={(e) => setPan((prev) => ({ ...prev, y: Number(e.target.value) }))}
                className="w-full accent-emerald-400"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px,1fr,330px]">
        <section className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Panel Kontrol</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => addTextElement("nama")}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold hover:bg-white/10"
            >
              + Nama
            </button>
            <button
              type="button"
              onClick={() => addTextElement("jabatan")}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold hover:bg-white/10"
            >
              + Jabatan
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="col-span-2 rounded-xl border border-emerald-300/30 bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/25"
            >
              <Upload className="mr-1 inline h-3.5 w-3.5" />
              Upload Logo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => addLogoElement(String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
            />
          </div>

          <div>
            <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-300">Mode View</p>
            <div className="grid grid-cols-2 gap-2">
              {availableViews.map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                    activeView === view
                      ? "bg-emerald-400 text-neutral-950"
                      : "border border-white/15 bg-black/30 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-300">Pilihan Warna</p>
            <div className="grid grid-cols-6 gap-2">
              {DESIGN_ASSET_MAP.colors.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  title={item.name}
                  onClick={() => setActiveColor(item.hex)}
                  className={`h-8 rounded-full border-2 transition ${
                    item.hex.toLowerCase() === activeColor.toLowerCase()
                      ? "border-emerald-300 ring-2 ring-emerald-300/30"
                      : "border-white/20"
                  }`}
                  style={{ backgroundColor: item.hex }}
                />
              ))}
            </div>
            <div className="mt-1 text-xs text-slate-300">
              Aktif: {findColorByHex(activeColor)?.name || activeColor}
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-black/35 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Scan Katalog AI</p>
              <button
                type="button"
                onClick={() => scanRef.current?.click()}
                className="rounded-lg border border-white/15 px-2 py-1 text-[11px] hover:bg-white/10"
              >
                <ScanLine className="mr-1 inline h-3.5 w-3.5" />
                Scan
              </button>
            </div>
            <input
              ref={scanRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleScanImage(file);
              }}
            />
            {scanning ? <p className="text-xs text-emerald-200">Menganalisa gambar...</p> : null}
            {scanResult ? (
              <div className="space-y-1 text-xs text-slate-300">
                <p>Warna: {scanResult.normalizedColorName || "-"}</p>
                <p>Kode: {scanResult.colorCode || "-"}</p>
                <p>Confidence: {scanResult.confidence}</p>
                {scanResult.warnings.length > 0 ? (
                  <p className="text-amber-200">{scanResult.warnings.join(" | ")}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={historyPointer <= 0}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs disabled:opacity-40"
            >
              <Undo2 className="mr-1 inline h-3.5 w-3.5" />
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={historyPointer >= history.length - 1}
              className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs disabled:opacity-40"
            >
              <Redo2 className="mr-1 inline h-3.5 w-3.5" />
              Redo
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-gradient-to-b from-slate-900/80 to-black p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight">{model.name}</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                {model.category} • {activeView}
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
              {step}
            </span>
          </div>

          <div
            className="relative mx-auto h-[520px] w-full max-w-[370px] overflow-hidden rounded-[36px] border border-white/20 bg-neutral-900"
            onPointerMove={(e) => moveElementFromPointer(e.clientX, e.clientY)}
            onPointerUp={() => {
              if (draggingId) commitElementMutation();
              setDraggingId(null);
            }}
            onPointerCancel={() => {
              if (draggingId) commitElementMutation();
              setDraggingId(null);
            }}
          >
            <div
              ref={boardRef}
              className="absolute inset-0"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: "center center",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_45%)]" />
              <div className="absolute inset-5 rounded-[30px]" style={{ backgroundColor: activeColor }} />
              {imageByView ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageByView}
                  alt={`${model.name} ${activeView}`}
                  className="pointer-events-none absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] object-contain opacity-70"
                />
              ) : null}
              {filteredElements.map((item) =>
                item.type === "text" ? (
                  <button
                    key={item.id}
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSelectedId(item.id);
                      setDraggingId(item.id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-xs font-extrabold uppercase tracking-wide ${
                      selectedId === item.id
                        ? "border border-emerald-300 bg-black/60 shadow-[0_0_0_2px_rgba(52,211,153,0.3)]"
                        : "border border-white/20 bg-black/45"
                    }`}
                    style={{
                      left: `${item.pos.x}%`,
                      top: `${item.pos.y}%`,
                      transform: `translate(-50%, -50%) scale(${item.scale})`,
                      color: item.color || "#fff",
                    }}
                  >
                    {item.content}
                  </button>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={item.id}
                    src={item.content}
                    alt="logo"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSelectedId(item.id);
                      setDraggingId(item.id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-move rounded-md ${
                      selectedId === item.id ? "ring-2 ring-emerald-300" : ""
                    }`}
                    style={{
                      left: `${item.pos.x}%`,
                      top: `${item.pos.y}%`,
                      width: `${92 * item.scale}px`,
                    }}
                  />
                )
              )}
            </div>
          </div>

          {selectedElement ? (
            <div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-black/30 p-3 md:grid-cols-3">
              <label className="text-xs">
                <span className="mb-1 block text-slate-300">Scale</span>
                <input
                  type="range"
                  min={0.4}
                  max={2.6}
                  step={0.1}
                  value={selectedElement.scale}
                  className="w-full accent-emerald-400"
                  onChange={(e) =>
                    updateSelectedElement({
                      scale: Number(e.target.value),
                    })
                  }
                  onMouseUp={commitElementMutation}
                />
              </label>
              {selectedElement.type === "text" ? (
                <>
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Text</span>
                    <input
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
                      value={selectedElement.content}
                      onChange={(e) => updateSelectedElement({ content: e.target.value })}
                      onBlur={commitElementMutation}
                    />
                  </label>
                  <label className="text-xs">
                    <span className="mb-1 block text-slate-300">Color</span>
                    <input
                      type="color"
                      className="h-8 w-full rounded-lg border border-white/15 bg-black/30"
                      value={selectedElement.color || "#ffffff"}
                      onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      onMouseUp={commitElementMutation}
                    />
                  </label>
                </>
              ) : (
                <button
                  type="button"
                  className="rounded-lg border border-red-300/40 bg-red-500/15 px-3 py-2 text-xs text-red-100"
                  onClick={() => {
                    const next = elements.filter((item) => item.id !== selectedElement.id);
                    setSelectedId(null);
                    setElementsWithHistory(next);
                  }}
                >
                  Hapus Element
                </button>
              )}
            </div>
          ) : null}
        </section>

        <section className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Produksi & Aksi</h3>

          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/35 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Tambah Item Pesanan</p>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={itemForm.size}
                onChange={(e) => setItemForm((prev) => ({ ...prev, size: e.target.value }))}
                className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
              >
                {SIZE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={itemForm.qty}
                onChange={(e) => setItemForm((prev) => ({ ...prev, qty: Number(e.target.value) }))}
                className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
              />
              <select
                value={itemForm.gender}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, gender: e.target.value as ItemForm["gender"] }))
                }
                className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
              >
                <option>Pria</option>
                <option>Wanita</option>
              </select>
              <select
                value={itemForm.sleeve}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, sleeve: e.target.value as ItemForm["sleeve"] }))
                }
                className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
              >
                <option>Panjang</option>
                <option>Pendek</option>
              </select>
            </div>
            <input
              value={itemForm.colorCode}
              onChange={(e) => setItemForm((prev) => ({ ...prev, colorCode: e.target.value }))}
              placeholder="Kode warna (hasil scan/manual)"
              className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
            />
            <textarea
              value={itemForm.note}
              onChange={(e) => setItemForm((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="Catatan item"
              className="min-h-[58px] rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={addOrderItem}
              className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-neutral-950"
            >
              Tambah Item
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
            <p className="text-xs uppercase tracking-wider text-slate-300">Ringkasan</p>
            <p className="text-sm font-semibold">{model.name}</p>
            <p className="text-xs text-slate-300">Category: {model.category}</p>
            <p className="text-xs text-slate-300">Material: {material}</p>
            <p className="text-xs text-slate-300">Total Item: {orderItems.length}</p>
            <p className="text-xs text-slate-300">Total Qty: {totalQty}</p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-sm font-semibold hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-3 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/25"
            >
              <Save className="h-4 w-4" />
              Simpan Desain
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-3 py-3 text-sm font-bold text-neutral-950 hover:bg-emerald-300"
            >
              <ShoppingCart className="h-4 w-4" />
              Checkout
            </button>
          </div>

          {status ? (
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
              {status}
            </p>
          ) : null}
        </section>
      </div>

      {orderItems.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-300">Order Draft Items</p>
          <div className="space-y-2">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
              >
                <span>
                  {item.modelName} • {item.size} • {item.qty} pcs • {item.colorCode || "-"}
                </span>
                <button
                  type="button"
                  onClick={() => setOrderItems((prev) => prev.filter((row) => row.id !== item.id))}
                  className="rounded-md border border-red-300/40 bg-red-500/15 px-2 py-1 text-red-100"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
