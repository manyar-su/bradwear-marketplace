import React, { FormEvent, useState } from 'react';
import { buildConsultationMessage, buildWhatsAppUrl } from '../lib/siteConfig';
import { ChatMessage } from '../types';

interface BradAiChatProps {
  variant?: 'page' | 'widget';
  onClose?: () => void;
}

const SUGGESTIONS = [
  {
    label: 'Bahan lapangan',
    prompt: 'Bahan apa yang cocok untuk seragam lapangan?',
  },
  {
    label: 'Alur order',
    prompt: 'Bagaimana alur order di Bradwear?',
  },
  {
    label: 'Kirim luar Jawa',
    prompt: 'Apakah bisa kirim ke luar Jawa?',
  },
  {
    label: 'Beda PDH',
    prompt: 'Apa beda model PDH dan lapangan?',
  },
];

const createInitialMessage = (): ChatMessage => ({
  id: 'assistant-welcome',
  role: 'assistant',
  content: 'Halo, saya Brodi. Saya bisa bantu jelaskan katalog, bahan, alur order, tracking, dan layanan Bradwear Indonesia.',
});

const BradAiChat: React.FC<BradAiChatProps> = ({ variant = 'page', onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([createInitialMessage()]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

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
        throw new Error(payload?.error || 'Brodi sedang tidak tersedia.');
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: payload.answer || 'Maaf, saya belum menemukan jawaban yang tepat.',
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          status: 'error',
          content: 'Brodi belum bisa menjawab saat ini. Anda bisa lanjut konsultasi ke tim kami melalui WhatsApp agar dibantu langsung.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface-base)] shadow-[0_20px_45px_rgba(15,23,42,0.12)] ${
        variant === 'widget' ? 'min-h-0 max-h-full' : 'min-h-[600px]'
      }`}
    >
      <div
        className={`flex items-start justify-between gap-4 border-b border-[var(--border-soft)] bg-[linear-gradient(135deg,#10210c,#1d3913)] text-white ${
          variant === 'widget' ? 'px-4 py-3.5 md:px-5 md:py-4' : 'px-4 py-4 md:px-5 md:py-5'
        }`}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b7f39a]">Brodi</p>
          <h3 className="mt-1 text-lg font-black tracking-tight md:text-xl">Tanya Brodi</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
            Bahan, model, order, tracking, dan workshop Bradwear.
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white transition hover:bg-white/20"
            aria-label="Tutup Brodi"
          >
            X
          </button>
        ) : null}
      </div>

      <div
        className={`grid gap-2 border-b border-[var(--border-soft)] bg-[var(--surface-subtle)] ${
          variant === 'widget' ? 'px-4 py-3 md:px-5' : 'px-4 py-4 md:px-5'
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Cepat</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => setInput(suggestion.prompt)}
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-base)] px-3 py-2 text-left text-[11px] font-semibold text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,var(--surface-base),var(--surface-subtle))] ${
          variant === 'widget' ? 'px-4 py-3.5 md:px-5 md:py-4' : 'px-4 py-4 md:px-5 md:py-5'
        }`}
      >
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[94%] rounded-[24px] px-4 py-3 shadow-sm ${
              message.role === 'user'
                ? 'ml-auto bg-[var(--brand-accent)] text-white'
                : message.status === 'error'
                  ? 'bg-amber-50 text-amber-900'
                  : 'border border-[var(--border-soft)] bg-[var(--surface-base)] text-[var(--text-primary)]'
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
              {message.role === 'user' ? 'Anda' : 'Brodi'}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </article>
        ))}

        {isSending ? (
          <article className="max-w-[88%] rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-3 text-[var(--text-secondary)] shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">Brodi</p>
            <p className="mt-2 text-sm leading-relaxed">Sedang menyiapkan jawaban...</p>
          </article>
        ) : null}
      </div>

      <div className="border-t border-[var(--border-soft)] bg-[var(--surface-base)] px-4 py-4 md:px-5">
        <form onSubmit={handleSend} className="space-y-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tulis pertanyaan tentang bahan, model, order, atau tracking..."
            rows={variant === 'widget' ? 2 : 4}
            className="w-full resize-none rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-accent)] focus:bg-white"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={buildWhatsAppUrl(buildConsultationMessage('order atau kebutuhan seragam custom'))}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--text-secondary)] underline decoration-[var(--border-soft)] underline-offset-4"
            >
              Butuh bantuan manusia? WhatsApp
            </a>
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="brand-cta rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? 'Mengirim...' : 'Kirim ke Brodi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BradAiChat;
