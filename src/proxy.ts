import type { NextRequest } from "next/server";
import { askForLogin, isAdmin } from "@/lib/admin-auth";

// Ask for the admin login before any /admin page renders. The pages check it again themselves.
export function proxy(request: NextRequest) {
  if (!isAdmin(request.headers.get("authorization"))) return askForLogin();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
