import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "bradwear_marketplace_session";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/checkout")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*"],
};

