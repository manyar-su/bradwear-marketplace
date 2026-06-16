import React, { FormEvent, useState } from 'react';
import { buildConsultationMessage, buildWhatsAppUrl } from '../lib/siteConfig';
import { getBradAiLocalAnswer } from '../lib/bradAiLocal';
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
  content: 'Halo, saya Brodi. Saya siap membantu penjelasan katalog, bahan, alur pemesanan, tracking, dan layanan Bradwear Indonesia.',
});

const WHATSAPP_URL_PATTERN = /whatsapp:\/\/send\?[^\s]+/i;

const parseMessageContent = (content: string) => {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let whatsappHref: string | undefined;
  const visibleParagraphs: string[] = [];

  paragraphs.forEach((paragraph) => {
    const match = paragraph.match(WHATSAPP_URL_PATTERN);
    if (!match) {
      visibleParagraphs.push(paragraph);
      return;
    }

    whatsappHref ??= match[0];

    const stripped = paragraph
      .replace(WHATSAPP_URL_PATTERN, '')
      .replace(/\s*:\s*$/, '')
      .trim();

    if (!stripped) return;
    if (/^(jika anda ingin dibantu lebih lanjut|whatsapp konsultasi bradwear)/i.test(stripped)) return;

    visibleParagraphs.push(stripped);
  });

  return {
    body: visibleParagraphs.join('\n\n').trim(),
    whatsappHref,
  };
};

const BradAiChat: React.FC<BradAiChatProps> = ({ variant = 'page', onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([createInitialMessage()]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

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

      const rawPayload = await response.text();
      let payload: { answer?: string; error?: string } = {};

      try {
        payload = rawPayload ? JSON.parse(rawPayload) : {};
      } catch {
        payload = {};
      }

      if (!response.ok) {
        throw new Error(payload?.error || 'Brodi sedang tidak tersedia.');
      }

      const answer = payload.answer?.trim() || getBradAiLocalAnswer(optimisticMessages);

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: answer,
        },
      ]);
    } catch {
      const fallbackAnswer = getBradAiLocalAnswer(optimisticMessages);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: fallbackAnswer,
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
          <h3 className="mt-1 text-lg font-black tracking-tight md:text-xl">Konsultasi awal bersama Brodi</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
            Bahan, model, alur pemesanan, tracking, dan lokasi workshop Bradwear.
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
        className={`border-b border-[var(--border-soft)] bg-[var(--surface-subtle)] ${
          variant === 'widget' ? 'px-4 py-3 md:px-5' : 'px-4 py-4 md:px-5'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSuggestionsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-3.5 py-3 text-left transition hover:border-[var(--brand-accent)]"
          aria-expanded={isSuggestionsOpen}
          aria-controls="brodi-quick-prompts"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Pesan cepat</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">Pilih pertanyaan singkat yang paling relevan</p>
          </div>
          <span
            className={`text-lg font-black leading-none text-[var(--brand-accent-strong)] transition-transform ${
              isSuggestionsOpen ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </button>

        <div
          id="brodi-quick-prompts"
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isSuggestionsOpen ? 'max-h-72 pt-3 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => {
                  setInput(suggestion.prompt);
                  setIsSuggestionsOpen(false);
                }}
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-base)] px-3.5 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent-strong)]"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {suggestion.label}
                </span>
                <span className="mt-1 block text-sm leading-snug text-[var(--text-primary)]">{suggestion.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,var(--surface-base),var(--surface-subtle))] ${
          variant === 'widget' ? 'px-4 py-3.5 md:px-5 md:py-4' : 'px-4 py-4 md:px-5 md:py-5'
        }`}
      >
        {messages.map((message) => {
          const parsedMessage = message.role === 'assistant' ? parseMessageContent(message.content) : null;
          const visibleContent = parsedMessage ? parsedMessage.body : message.content;

          return (
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
              {visibleContent ? <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{visibleContent}</p> : null}
              {parsedMessage?.whatsappHref ? (
                <a
                  href={parsedMessage.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-cta mt-3 inline-flex rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
                >
                  Kirim pesan
                </a>
              ) : null}
            </article>
          );
        })}

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
