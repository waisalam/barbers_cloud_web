import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE     = "barberscloud_admin_session";
const LOGIN_PATH  = "/admin/login";

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_SESSION_SECRET;
  if (!raw && process.env.NODE_ENV === "production") {
    // In production, refuse to start with a missing secret
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return new TextEncoder().encode(raw ?? "dev-only-secret-min-32-chars-not-prod!!");
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "ADMIN") throw new Error("role mismatch");
    // Valid session — let the request through
    return NextResponse.next();
  } catch {
    // Invalid / expired token — clear cookie and redirect
    const res = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    res.cookies.delete(COOKIE);
    return res;
  }
}

// Only run on protected admin dashboard routes
export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
