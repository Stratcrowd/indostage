import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-cookie";

// Send visitors without a login cookie to the admin login page. This only checks that a cookie
// exists; the pages and /api/passes verify the session against the database themselves.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return;
  if (!request.cookies.has(SESSION_COOKIE)) return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
