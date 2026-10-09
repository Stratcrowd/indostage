import { askForLogin, isAdmin } from "@/lib/admin-auth";
import { allPasses } from "@/lib/passes";

// Booking list as CSV (opens in Excel / Google Sheets). Same login as /admin: any username,
// password = PASSES_ADMIN_PASSWORD from Vercel.
export async function GET(request: Request) {
  if (!isAdmin(request.headers.get("authorization"))) return askForLogin();

  const rows = await allPasses();
  // Quote every cell, and stop Excel treating a name like "=SUM(...)" as a formula.
  const cell = (v: unknown) => `"${String(v ?? "").replace(/^[=+\-@]/, "'$&").replace(/"/g, '""')}"`;
  const total = rows.reduce((n, r) => n + Number(r.passes), 0);
  const csv = [
    ["Pass No.", "Name", "WhatsApp", "Email", "Passes", "Source", "Booked at (IST)"].map(cell).join(","),
    ...rows.map((r) =>
      [r.code, r.name, r.phone, r.email, r.passes, r.source, new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })]
        .map(cell)
        .join(","),
    ),
    ["TOTAL", `${rows.length} bookings`, "", "", total, "", ""].map(cell).join(","),
  ].join("\r\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ravi-chary-crossing-passes.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
