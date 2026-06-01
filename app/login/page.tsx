"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath] = useState(() => {
    if (typeof window === "undefined") return "/checkout";
    return new URLSearchParams(window.location.search).get("next") || "/checkout";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || "Login gagal.");
      return;
    }

    router.push(nextPath);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-5">
        <h1 className="text-2xl font-bold">Login Marketplace</h1>
        <p className="mt-1 text-sm text-slate-600">Masuk dulu sebelum checkout pesanan custom.</p>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full rounded-md bg-slate-900 px-3 py-2 font-semibold text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
        <p className="mt-3 text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link className="font-semibold text-slate-900" href="/register">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
