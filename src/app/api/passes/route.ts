import { currentAdmin } from "@/lib/admin-auth";
import { allPasses } from "@/lib/passes";
import { isTier, tierInfo } from "@/lib/passes-config";

// Booking list as CSV (opens in Excel / Google Sheets). Needs the /admin login.
export async function GET(request: Request) {
  if (!(await currentAdmin())) return Response.redirect(new URL("/admin/login", request.url), 303);

  const rows = await allPasses();
  // Quote every cell, and stop Excel treating a name like "=SUM(...)" as a formula.
  const cell = (v: unknown) => `"${String(v ?? "").replace(/^[=+\-@]/, "'$&").replace(/"/g, '""')}"`;
  const total = rows.reduce((n, r) => n + Number(r.passes), 0);
  const csv = [
    ["Pass No.", "Type", "Name", "Designation", "WhatsApp", "Email", "Admits", "Source", "Booked at (IST)"].map(cell).join(","),
    ...rows.map((r) =>
      [r.code, isTier(r.tier) ? tierInfo[r.tier].short : r.tier, r.name, r.title, r.phone, r.email, r.passes, r.source, new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })]
        .map(cell)
        .join(","),
    ),
    ["TOTAL", "", `${rows.length} passes`, "", "", "", total, "", ""].map(cell).join(","),
  ].join("\r\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ravi-chary-crossing-passes.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
