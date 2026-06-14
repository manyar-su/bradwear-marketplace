import { BradAiMessage, getBradAiAnswer } from '../lib/bradAi';
import {
  RequestLike,
  ResponseLike,
  applyApiSecurityHeaders,
  extractClientIp,
  jsonError,
  requireSameOrigin,
  setRateLimitHeaders,
  takeRateLimit,
} from './_lib/security';

const BRAD_AI_RATE_LIMIT = {
  windowMs: 60 * 1000,
  max: 12,
};

const MAX_MESSAGES = 24;
const MAX_TOTAL_CHARACTERS = 12000;

export default async function handler(req: RequestLike, res: ResponseLike) {
  applyApiSecurityHeaders(res);
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    jsonError(res, 405, 'Method not allowed');
    return;
  }

  if (!requireSameOrigin(req, res)) {
    return;
  }

  const rateLimit = takeRateLimit('brad-ai', extractClientIp(req), BRAD_AI_RATE_LIMIT);
  setRateLimitHeaders(res, rateLimit);
  if (!rateLimit.allowed) {
    jsonError(res, 429, 'Terlalu banyak permintaan ke Brodi. Coba lagi sebentar.', {
      retryAfter: rateLimit.retryAfter,
    });
    return;
  }

  const messages = (req.body?.messages ?? []) as BradAiMessage[];
  if (!Array.isArray(messages) || messages.length === 0) {
    jsonError(res, 400, 'Payload messages wajib diisi.');
    return;
  }

  if (messages.length > MAX_MESSAGES) {
    jsonError(res, 413, 'Jumlah pesan terlalu besar.');
    return;
  }

  const normalizedMessages = messages
    .filter((message) => typeof message?.content === 'string' && typeof message?.role === 'string')
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content.trim().slice(0, 4000),
    }))
    .filter((message) => message.content.length > 0);

  const totalCharacters = normalizedMessages.reduce((sum, message) => sum + message.content.length, 0);
  if (normalizedMessages.length === 0 || totalCharacters > MAX_TOTAL_CHARACTERS) {
    jsonError(res, 413, 'Payload percakapan terlalu besar.');
    return;
  }

  try {
    const answer = await getBradAiAnswer(normalizedMessages);
    res.status(200).json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Brad Ai gagal memproses permintaan.';
    jsonError(res, 500, message);
  }
}
