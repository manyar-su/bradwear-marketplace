import {
  RequestLike,
  ResponseLike,
  applyApiSecurityHeaders,
  clearBruteForceFailures,
  createSignedSessionToken,
  extractClientIp,
  getAdminSessionCookieName,
  getBruteForceStatus,
  getSessionCookieOptions,
  jsonError,
  normalizeIdentifier,
  parseCookies,
  registerBruteForceFailure,
  requireSameOrigin,
  serializeCookie,
  timingSafeEqual,
  verifySignedSessionToken,
} from '../_lib/security';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const LOGIN_BUCKET = 'admin-login';
const LOGIN_POLICY = {
  windowMs: 15 * 60 * 1000,
  maxFailures: 5,
  blockMs: 30 * 60 * 1000,
};

const getAdminConfig = () => {
  const loginId = process.env.ADMIN_LOGIN_ID?.trim().toLowerCase();
  const password = process.env.ADMIN_LOGIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const displayName = process.env.ADMIN_DISPLAY_NAME?.trim() || 'Admin';

  return {
    configured: Boolean(loginId && password && sessionSecret),
    loginId: loginId || '',
    password: password || '',
    sessionSecret: sessionSecret || '',
    displayName,
  };
};

const getSessionFromRequest = (req: RequestLike) => {
  const config = getAdminConfig();
  if (!config.configured) {
    return null;
  }

  const cookies = parseCookies(req);
  const token = cookies[getAdminSessionCookieName()];
  if (!token) {
    return null;
  }

  return verifySignedSessionToken(token, config.sessionSecret);
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  applyApiSecurityHeaders(res);

  const config = getAdminConfig();
  const cookieName = getAdminSessionCookieName();

  if (req.method === 'GET') {
    const session = getSessionFromRequest(req);
    res.status(200).json({
      authenticated: Boolean(session),
      configured: config.configured,
      user: session ? { id: session.sub, name: session.name, role: session.role } : null,
    });
    return;
  }

  if (req.method === 'DELETE') {
    if (!requireSameOrigin(req, res)) {
      return;
    }

    res.setHeader(
      'Set-Cookie',
      serializeCookie(cookieName, '', {
        ...getSessionCookieOptions(0),
        maxAge: 0,
      }),
    );
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== 'POST') {
    jsonError(res, 405, 'Method not allowed');
    return;
  }

  if (!requireSameOrigin(req, res)) {
    return;
  }

  if (!config.configured) {
    jsonError(res, 503, 'Akses admin belum dikonfigurasi di server.');
    return;
  }

  const loginId = normalizeIdentifier((req.body as { loginId?: unknown } | undefined)?.loginId);
  const password = typeof (req.body as { password?: unknown } | undefined)?.password === 'string'
    ? ((req.body as { password?: string }).password || '').slice(0, 256)
    : '';

  if (!loginId || !password) {
    jsonError(res, 400, 'Login ID dan password wajib diisi.');
    return;
  }

  const requestKey = `${extractClientIp(req)}:${loginId}`;
  const blocked = getBruteForceStatus(LOGIN_BUCKET, requestKey, LOGIN_POLICY);
  if (blocked.blocked) {
    res.setHeader('Retry-After', String(blocked.retryAfter));
    jsonError(res, 429, 'Terlalu banyak percobaan login. Coba lagi nanti.', {
      retryAfter: blocked.retryAfter,
    });
    return;
  }

  const isValid =
    timingSafeEqual(loginId, config.loginId) &&
    timingSafeEqual(password, config.password);

  if (!isValid) {
    const failure = registerBruteForceFailure(LOGIN_BUCKET, requestKey, LOGIN_POLICY);
    if (failure.blocked) {
      res.setHeader('Retry-After', String(failure.retryAfter));
      jsonError(res, 429, 'Terlalu banyak percobaan login. Coba lagi nanti.', {
        retryAfter: failure.retryAfter,
      });
      return;
    }

    jsonError(res, 401, 'ID atau password salah.');
    return;
  }

  clearBruteForceFailures(LOGIN_BUCKET, requestKey);

  const token = createSignedSessionToken(
    {
      sub: 'admin',
      name: config.displayName,
      role: 'admin',
    },
    config.sessionSecret,
    SESSION_MAX_AGE_SECONDS,
  );

  res.setHeader('Set-Cookie', serializeCookie(cookieName, token, getSessionCookieOptions(SESSION_MAX_AGE_SECONDS)));
  res.status(200).json({
    authenticated: true,
    user: {
      id: 'admin',
      name: config.displayName,
      role: 'admin',
    },
  });
}
