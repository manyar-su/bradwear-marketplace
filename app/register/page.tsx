"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || "Daftar gagal.");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-5">
        <h1 className="text-2xl font-bold">Daftar Akun Marketplace</h1>
        <p className="mt-1 text-sm text-slate-600">Akun ini dipakai untuk simpan desain dan checkout.</p>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Nama lengkap"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="No. WhatsApp"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <button
            className="w-full rounded-md bg-slate-900 px-3 py-2 font-semibold text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar & Lanjut Checkout"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
        <p className="mt-3 text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link className="font-semibold text-slate-900" href="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

