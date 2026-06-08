import React, { FormEvent, useMemo, useState } from 'react';
import { BRAD_AI_CONTEXT, buildConsultationMessage, buildWhatsAppUrl } from '../lib/siteConfig';
import { ChatMessage } from '../types';

interface BradAiChatProps {
  variant?: 'page' | 'widget';
  onClose?: () => void;
}

const SUGGESTIONS = [
  'Bahan apa yang cocok untuk seragam lapangan?',
  'Bagaimana alur order di Bradwear?',
  'Apakah bisa kirim ke luar Jawa?',
  'Apa beda model PDH dan lapangan?',
];

const createInitialMessage = (): ChatMessage => ({
  id: 'assistant-welcome',
  role: 'assistant',
  content: 'Halo, saya Brad Ai. Saya bisa bantu jelaskan katalog, bahan, alur order, tracking, dan layanan Bradwear Indonesia.',
});

const BradAiChat: React.FC<BradAiChatProps> = ({ variant = 'page', onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([createInitialMessage()]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const contextPreview = useMemo(
    () => BRAD_AI_CONTEXT.map((section) => `${section.heading}: ${section.body}`).join('\n'),
    [],
  );

  const handleSend = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const optimisticMessages = [...messages, nextUserMessage];
    setMessages(optimisticMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/brad-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: optimisticMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Brad Ai sedang tidak tersedia.');
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: payload.answer || 'Maaf, saya belum menemukan jawaban yang tepat.',
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          status: 'error',
          content: 'Brad Ai belum bisa menjawab saat ini. Anda bisa lanjut konsultasi ke tim kami melalui WhatsApp agar dibantu langsung.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-[30px] border border-[var(--border-soft)] bg-white shadow-[0_20px_45px_rgba(15,23,42,0.12)] ${variant === 'widget' ? 'min-h-[540px]' : 'min-h-[620px]'}`}>
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-soft)] bg-[linear-gradient(135deg,#111827,#1f2937)] px-5 py-5 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Brad Ai</p>
          <h3 className="mt-1 text-xl font-black tracking-tight">Asisten AI untuk kebutuhan Bradwear</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
            Tanya soal bahan, model, cara order, tracking, layanan pelanggan, dan lokasi toko Bradwear Indonesia.
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white transition hover:bg-white/20"
            aria-label="Tutup Brad Ai"
          >
            ×
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 border-b border-[var(--border-soft)] bg-[var(--surface-subtle)] px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Pertanyaan cepat</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-left text-xs font-semibold text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#fff,#f8fafc)] px-5 py-5">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[92%] rounded-3xl px-4 py-3 shadow-sm ${
              message.role === 'user'
                ? 'ml-auto bg-[var(--brand-accent)] text-white'
                : message.status === 'error'
                  ? 'bg-amber-50 text-amber-900'
                  : 'border border-[var(--border-soft)] bg-white text-[var(--text-primary)]'
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
              {message.role === 'user' ? 'Anda' : 'Brad Ai'}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </article>
        ))}

        {messages.length === 1 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border-soft)] bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Konteks yang dipakai Brad Ai</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">{contextPreview}</p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[var(--border-soft)] bg-white px-5 py-4">
        <form onSubmit={handleSend} className="space-y-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tulis pertanyaan Anda seputar produk, bahan, cara order, pengiriman, atau layanan Bradwear..."
            rows={variant === 'widget' ? 3 : 4}
            className="w-full resize-none rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={buildWhatsAppUrl(buildConsultationMessage('order atau kebutuhan seragam custom'))}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--text-secondary)] underline decoration-[var(--border-soft)] underline-offset-4"
            >
              Butuh bantuan manusia? Konsultasi via WhatsApp
            </a>
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="rounded-full bg-[var(--brand-accent)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? 'Mengirim...' : 'Kirim ke Brad Ai'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BradAiChat;
