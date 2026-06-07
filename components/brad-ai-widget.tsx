"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { BRAD_AI_QUICK_PROMPTS, getWhatsAppHref } from "@/lib/site-content";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function BradAiWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo, saya Brad AI. Saya bisa bantu jawab pertanyaan seputar pemesanan kemeja, seragam kantor, seragam dinas, seragam komunitas, bahan, dan estimasi awal.",
    },
  ]);

  const suggestedPrompts = useMemo(() => BRAD_AI_QUICK_PROMPTS.slice(0, 4), []);

  async function sendMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
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
            "Maaf, Brad AI belum bisa merespons sekarang. Silakan lanjutkan konsultasi via WhatsApp.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Terjadi gangguan saat menghubungi Brad AI. Untuk respon lebih cepat, silakan lanjut konsultasi ke WhatsApp tim Bradwear.",
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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.14)]">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 px-5 py-4 text-white">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Brad AI</p>
              <p className="text-xs text-white/70">Asisten untuk seragam custom dan konsultasi awal</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 bg-neutral-50 px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
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

            <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
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
                placeholder="Tanyakan kebutuhan seragam kantor, seragam dinas, bahan, harga, atau cara order..."
                className="min-h-[90px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Kirim ke Brad AI
                </button>
                <a
                  href={getWhatsAppHref()}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
                >
                  WhatsApp
                </a>
              </div>
            </form>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Estimasi dari Brad AI bersifat indikatif.</span>
              <Link href="/brad-ai" className="font-semibold text-emerald-700">
                Buka halaman penuh
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <a
          href={getWhatsAppHref()}
          className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm md:inline-flex"
        >
          Konsultasi WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 rounded-full bg-neutral-950 px-5 py-4 text-sm font-bold text-white shadow-[0_20px_48px_rgba(0,0,0,0.18)]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400 text-neutral-950">
            {open ? <MessageCircle className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
          </span>
          Tanya Brad AI
        </button>
      </div>
    </div>
  );
}
