import crypto from 'node:crypto';

export type RequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: Record<string, unknown>;
  socket?: {
    remoteAddress?: string;
  };
};

export type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string | string[]) => void;
};

type RateLimitConfig = {
  windowMs: number;
  max: number;
};

type BruteForceConfig = {
  windowMs: number;
  maxFailures: number;
  blockMs: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

type BruteForceState = {
  count: number;
  resetAt: number;
  blockedUntil: number;
};

type SessionPayload = {
  sub: string;
  name: string;
  role: 'admin';
  iat: number;
  exp: number;
};

const rateLimitBuckets = new Map<string, Map<string, RateLimitState>>();
const bruteForceBuckets = new Map<string, Map<string, BruteForceState>>();

const API_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Referrer-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const base64UrlEncode = (value: string | Buffer) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf-8');
};

const getBucket = <T>(collection: Map<string, Map<string, T>>, bucket: string) => {
  const existing = collection.get(bucket);
  if (existing) {
    return existing;
  }

  const created = new Map<string, T>();
  collection.set(bucket, created);
  return created;
};

export const getHeader = (req: RequestLike, key: string) => {
  const header = req.headers?.[key] ?? req.headers?.[key.toLowerCase()] ?? req.headers?.[key.toUpperCase()];
  return Array.isArray(header) ? header[0] : header;
};

export const applyApiSecurityHeaders = (res: ResponseLike) => {
  Object.entries(API_HEADERS).forEach(([key, value]) => res.setHeader(key, value));
};

export const jsonError = (
  res: ResponseLike,
  statusCode: number,
  error: string,
  extra: Record<string, unknown> = {},
) => {
  applyApiSecurityHeaders(res);
  res.status(statusCode).json({ error, ...extra });
};

export const extractClientIp = (req: RequestLike) => {
  const forwardedFor = getHeader(req, 'x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return (
    getHeader(req, 'x-real-ip') ||
    getHeader(req, 'cf-connecting-ip') ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

export const requireSameOrigin = (req: RequestLike, res: ResponseLike) => {
  const origin = getHeader(req, 'origin');
  if (!origin) {
    return true;
  }

  const host = getHeader(req, 'x-forwarded-host') || getHeader(req, 'host');
  if (!host) {
    jsonError(res, 403, 'Origin request tidak valid.');
    return false;
  }

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== host) {
      jsonError(res, 403, 'Origin request tidak diizinkan.');
      return false;
    }
  } catch {
    jsonError(res, 403, 'Origin request tidak valid.');
    return false;
  }

  return true;
};

export const takeRateLimit = (bucket: string, key: string, config: RateLimitConfig) => {
  const now = Date.now();
  const scopedBucket = getBucket(rateLimitBuckets, bucket);
  const current = scopedBucket.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + config.windowMs };
    scopedBucket.set(key, next);
    return {
      allowed: true,
      limit: config.max,
      remaining: Math.max(config.max - next.count, 0),
      retryAfter: Math.ceil(config.windowMs / 1000),
    };
  }

  current.count += 1;
  scopedBucket.set(key, current);

  return {
    allowed: current.count <= config.max,
    limit: config.max,
    remaining: Math.max(config.max - current.count, 0),
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
};

export const getBruteForceStatus = (bucket: string, key: string, config: BruteForceConfig) => {
  const now = Date.now();
  const scopedBucket = getBucket(bruteForceBuckets, bucket);
  const current = scopedBucket.get(key);

  if (!current) {
    return { blocked: false, retryAfter: 0 };
  }

  if (current.blockedUntil > now) {
    return {
      blocked: true,
      retryAfter: Math.max(1, Math.ceil((current.blockedUntil - now) / 1000)),
    };
  }

  if (current.resetAt <= now) {
    scopedBucket.delete(key);
  }

  return { blocked: false, retryAfter: 0 };
};

export const registerBruteForceFailure = (bucket: string, key: string, config: BruteForceConfig) => {
  const now = Date.now();
  const scopedBucket = getBucket(bruteForceBuckets, bucket);
  const current = scopedBucket.get(key);

  if (!current || current.resetAt <= now) {
    const next: BruteForceState = {
      count: 1,
      resetAt: now + config.windowMs,
      blockedUntil: 0,
    };
    scopedBucket.set(key, next);
    return {
      blocked: false,
      retryAfter: 0,
      remaining: Math.max(config.maxFailures - next.count, 0),
    };
  }

  current.count += 1;
  if (current.count >= config.maxFailures) {
    current.blockedUntil = now + config.blockMs;
  }
  scopedBucket.set(key, current);

  return {
    blocked: current.blockedUntil > now,
    retryAfter: current.blockedUntil > now ? Math.max(1, Math.ceil((current.blockedUntil - now) / 1000)) : 0,
    remaining: Math.max(config.maxFailures - current.count, 0),
  };
};

export const clearBruteForceFailures = (bucket: string, key: string) => {
  getBucket(bruteForceBuckets, bucket).delete(key);
};

export const setRateLimitHeaders = (
  res: ResponseLike,
  info: { limit: number; remaining: number; retryAfter: number },
) => {
  res.setHeader('X-RateLimit-Limit', String(info.limit));
  res.setHeader('X-RateLimit-Remaining', String(info.remaining));
  res.setHeader('Retry-After', String(info.retryAfter));
};

export const parseCookies = (req: RequestLike) => {
  const raw = getHeader(req, 'cookie');
  if (!raw) {
    return {};
  }

  return raw.split(';').reduce<Record<string, string>>((accumulator, item) => {
    const separatorIndex = item.indexOf('=');
    if (separatorIndex < 0) {
      return accumulator;
    }

    const key = item.slice(0, separatorIndex).trim();
    const value = item.slice(separatorIndex + 1).trim();
    if (key) {
      accumulator[key] = decodeURIComponent(value);
    }
    return accumulator;
  }, {});
};

export const serializeCookie = (
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
  } = {},
) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (typeof options.maxAge === 'number') {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  parts.push(`Path=${options.path || '/'}`);
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);

  if (options.httpOnly !== false) {
    parts.push('HttpOnly');
  }

  if (options.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
};

export const getAdminSessionCookieName = () =>
  process.env.NODE_ENV === 'production' ? '__Host-brad_admin_session' : 'brad_admin_session';

export const getSessionCookieOptions = (maxAgeSeconds: number) => ({
  path: '/',
  httpOnly: true,
  sameSite: 'Strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: maxAgeSeconds,
});

export const timingSafeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

export const createSignedSessionToken = (
  payload: Omit<SessionPayload, 'iat' | 'exp'>,
  secret: string,
  maxAgeSeconds: number,
) => {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = base64UrlEncode(crypto.createHmac('sha256', secret).update(encodedPayload).digest());
  return `${encodedPayload}.${signature}`;
};

export const verifySignedSessionToken = (token: string, secret: string) => {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = base64UrlEncode(crypto.createHmac('sha256', secret).update(encodedPayload).digest());
  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export const normalizeIdentifier = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase().slice(0, 128) : '';
