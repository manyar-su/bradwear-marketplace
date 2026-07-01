import { scanColorCode } from '../lib/colorScan';
import {
  RequestLike,
  ResponseLike,
  applyApiSecurityHeaders,
  extractClientIp,
  jsonError,
  requireContentLengthLimit,
  requireJsonRequest,
  requireSameOrigin,
  setRateLimitHeaders,
  takeRateLimit,
} from './_lib/security';

const SCAN_COLOR_RATE_LIMIT = {
  windowMs: 60 * 1000,
  max: 8,
};

const MAX_IMAGE_PAYLOAD_LENGTH = 6_000_000;

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

  if (!requireJsonRequest(req, res)) {
    return;
  }

  if (!requireContentLengthLimit(req, res, MAX_IMAGE_PAYLOAD_LENGTH + 10_000)) {
    return;
  }

  const rateLimit = takeRateLimit('scan-color', extractClientIp(req), SCAN_COLOR_RATE_LIMIT);
  setRateLimitHeaders(res, rateLimit);
  if (!rateLimit.allowed) {
    jsonError(res, 429, 'Terlalu banyak percobaan scan warna. Coba lagi sebentar.', {
      retryAfter: rateLimit.retryAfter,
    });
    return;
  }

  const image = req.body?.image;
  if (!image) {
    jsonError(res, 400, 'Payload image wajib diisi.');
    return;
  }

  if (typeof image !== 'string' || image.length > MAX_IMAGE_PAYLOAD_LENGTH) {
    jsonError(res, 413, 'Payload gambar terlalu besar atau tidak valid.');
    return;
  }

  try {
    const code = await scanColorCode(image);
    res.status(200).json({ code });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OCR kode warna gagal diproses.';
    jsonError(res, 500, message);
  }
}
