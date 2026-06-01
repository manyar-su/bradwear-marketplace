"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [message, setMessage] = useState("");
  const [placing, setPlacing] = useState(false);
  const [designSeed] = useState<{
    productSlug?: string;
    productName?: string;
    designDataUrl?: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    const seedRaw = localStorage.getItem("marketplace_checkout_seed");
    if (!seedRaw) return null;
    try {
      return JSON.parse(seedRaw);
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    qty: 1,
    warna: "Navy",
    model: "Brad V2",
    sizeS: 0,
    sizeM: 1,
    sizeL: 0,
    sizeXL: 0,
  });
  const [proofDataUrl, setProofDataUrl] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      const current = data.user as User | null;
      setUser(current);
      if (!current) {
        router.push("/login?next=/checkout");
        return;
      }
      setForm((prev) => ({
        ...prev,
        fullName: current.full_name,
        email: current.email,
        phone: current.phone || "",
      }));
      setLoadingUser(false);
    })();

  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    setMessage("");

    const sizeDetails = [
      { size: "S", qty: Number(form.sizeS) },
      { size: "M", qty: Number(form.sizeM) },
      { size: "L", qty: Number(form.sizeL) },
      { size: "XL", qty: Number(form.sizeXL) },
    ];

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: designSeed?.productSlug || "manual",
        designDataUrl: designSeed?.designDataUrl,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        notes: form.notes,
        qty: Number(form.qty),
        warna: form.warna,
        model: form.model,
        sizeDetails,
        paymentProofDataUrl: proofDataUrl,
      }),
    });

    const data = await res.json();
    setPlacing(false);
    if (!res.ok) {
      setMessage(data.error || "Checkout gagal.");
      return;
    }

    setMessage(`Order berhasil dibuat. Kode: ${data.order?.kode_barang}`);
    localStorage.removeItem("marketplace_checkout_seed");
  }

  if (loadingUser) {
    return <p className="text-sm text-slate-600">Memuat data akun...</p>;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
      <form className="card space-y-4 p-5" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Checkout Pesanan Kemeja Custom</h1>
        <p className="text-sm text-slate-600">
          Pesanan akan langsung masuk ke dashboard Bradwear dengan status Menunggu.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Nama lengkap"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="No. WA"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
          <input
            type="email"
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Warna"
            value={form.warna}
            onChange={(e) => setForm((prev) => ({ ...prev, warna: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
            required
          />
          <input
            type="number"
            min={1}
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Qty"
            value={form.qty}
            onChange={(e) => setForm((prev) => ({ ...prev, qty: Number(e.target.value) }))}
            required
          />
        </div>
        <textarea
          className="min-h-[90px] w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="Alamat lengkap"
          value={form.address}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          required
        />
        <textarea
          className="min-h-[80px] w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="Catatan tambahan (opsional)"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {(["S", "M", "L", "XL"] as const).map((size) => (
            <label key={size} className="text-sm">
              {size}
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                value={
                  size === "S"
                    ? form.sizeS
                    : size === "M"
                    ? form.sizeM
                    : size === "L"
                    ? form.sizeL
                    : form.sizeXL
                }
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setForm((prev) =>
                    size === "S"
                      ? { ...prev, sizeS: next }
                      : size === "M"
                      ? { ...prev, sizeM: next }
                      : size === "L"
                      ? { ...prev, sizeL: next }
                      : { ...prev, sizeXL: next }
                  );
                }}
              />
            </label>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Bukti transfer (opsional)</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setProofDataUrl(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={placing}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {placing ? "Mengirim Pesanan..." : "Kirim Pesanan"}
        </button>
        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </form>

      <aside className="card h-fit p-4">
        <p className="text-sm font-semibold">Akun Aktif</p>
        <p className="mt-1 text-sm text-slate-700">{user?.full_name}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
        <div className="my-3 h-px bg-slate-200" />
        <p className="text-sm font-semibold">Desain Terpilih</p>
        <p className="mt-1 text-sm text-slate-700">{designSeed?.productName || "Belum ada desain"}</p>
        <p className="text-xs text-slate-500">{designSeed?.productSlug || "-"}</p>
      </aside>
    </div>
  );
}
