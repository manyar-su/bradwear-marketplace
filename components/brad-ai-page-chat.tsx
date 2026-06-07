"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { BRAD_AI_QUICK_PROMPTS, getWhatsAppHref } from "@/lib/site-content";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function BradAiPageChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo, saya Brad AI. Saya siap membantu kebutuhan pemesanan kemeja, seragam kantor, seragam dinas, seragam komunitas, estimasi harga indikatif, pemilihan bahan, dan cara order melalui website Bradflow.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/brad-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "Brad AI belum bisa memberikan jawaban. Silakan lanjutkan konsultasi melalui WhatsApp agar tim kami membantu secara langsung.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Terjadi gangguan saat menghubungi layanan AI. Anda tetap bisa melanjutkan konsultasi melalui WhatsApp untuk respon yang lebih cepat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
      <section className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Brad AI</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
          Asisten digital untuk pemesanan kemeja, seragam kantor, dan konsultasi awal
        </h2>
        <p className="mt-4 text-sm leading-8 text-neutral-600 md:text-base">
          Gunakan Brad AI untuk mendapatkan jawaban yang natural dan informatif tentang produk, bahan, langkah order, rekomendasi kategori, dan estimasi awal sebelum Anda melanjutkan ke WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {BRAD_AI_QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-xs font-semibold text-emerald-800"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm leading-7 text-neutral-600">
          <p className="font-semibold text-neutral-950">Penting untuk diketahui</p>
          <p className="mt-2">
            Estimasi harga dan waktu pengerjaan dari Brad AI bersifat indikatif. Untuk penawaran final, detail bahan, revisi desain, dan kepastian timeline produksi, silakan lanjutkan konsultasi melalui WhatsApp tim Bradwear.
          </p>
          <a
            href={getWhatsAppHref()}
            className="mt-4 inline-flex rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white"
          >
            Lanjutkan ke WhatsApp
          </a>
        </div>
      </section>

      <section className="rounded-[32px] border border-neutral-200 bg-white p-4 shadow-sm md:p-6">
        <div className="space-y-3 rounded-[28px] bg-neutral-50 p-4">
          <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                  message.role === "assistant"
                    ? "bg-white text-neutral-700 shadow-sm"
                    : "ml-8 bg-neutral-950 text-white"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Brad AI sedang menyiapkan jawaban...
              </div>
            ) : null}
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Contoh: Saya butuh seragam kantor 30 pcs, bahan yang nyaman apa dan estimasi harganya bagaimana?"
              className="min-h-[120px] w-full rounded-[24px] border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-4 text-sm font-bold text-white disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Kirim ke Brad AI
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
