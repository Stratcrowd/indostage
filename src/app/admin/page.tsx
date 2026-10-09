import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin-auth";
import { allPasses, passLimit, passesConfigured } from "@/lib/passes";
import { logout } from "./login/actions";

export const metadata: Metadata = {
  title: "Admin — Free Pass Bookings",
  robots: { index: false, follow: false },
};

type Row = { code: string; name: string; phone: string; email: string | null; passes: number; source: string | null; created_at: string };

const ist = (d: string) =>
  new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// IndoStage admin: every free-pass booking for Ravi Chary Crossing. Login at /admin/login.
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const q = ((await searchParams).q ?? "").trim().toLowerCase();
  let rows: Row[] = [];
  let error = "";
  if (!passesConfigured()) error = "The database is not connected (DATABASE_URL is missing in Vercel).";
  else {
    try {
      rows = ((await allPasses()) as Row[]).reverse(); // newest first
    } catch (e) {
      console.error("[admin] could not load bookings", e);
      error = "Could not load bookings. Try again in a minute.";
    }
  }

  const total = rows.reduce((n, r) => n + Number(r.passes), 0);
  const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
  const todayRows = rows.filter((r) => new Date(r.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) === today);
  const shown = q
    ? rows.filter((r) => [r.name, r.phone, r.email, r.code, r.source].some((v) => v?.toLowerCase().includes(q)))
    : rows;

  const stats = [
    ["Bookings", rows.length],
    ["Passes booked", total],
    ["Passes left", Math.max(0, passLimit() - total)],
    ["Booked today", `${todayRows.length} · ${todayRows.reduce((n, r) => n + Number(r.passes), 0)} passes`],
  ];

  return (
    <section className="container-x pt-32 pb-24">
      <p className="kicker">IndoStage Admin</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="h-display text-4xl sm:text-5xl">Free Pass Bookings</h1>
        <div className="flex flex-wrap items-center gap-3">
          <a href="/api/passes" className="btn-gold !px-5 !py-2.5">
            Download Excel / CSV
          </a>
          <form action={logout}>
            <button className="btn-ghost !px-5 !py-2.5">Log Out</button>
          </form>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">Ravi Chary Crossing · 18 October 2026 · Logged in as {admin}</p>

      {error ? (
        <p className="mt-8 rounded-xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-ivory">{error}</p>
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="bg-ink-2 px-5 py-4">
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">{label}</dt>
                <dd className="mt-1 font-display text-3xl text-gold-soft">{value}</dd>
              </div>
            ))}
          </dl>

          <form className="mt-8 flex gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, number, email or pass no."
              className="w-full max-w-md rounded-xl border border-line bg-ink px-4 py-3 text-ivory outline-none placeholder:text-muted/60 focus:border-gold"
            />
            <button className="btn-ghost !px-5 !py-2.5">Search</button>
          </form>
          {q && (
            <p className="mt-3 text-sm text-muted">
              {shown.length} of {rows.length} bookings match “{q}”.{" "}
              <a href="/admin" className="text-gold">
                Clear
              </a>
            </p>
          )}

          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-ink-2 text-xs tracking-[0.15em] text-muted uppercase">
                <tr>
                  {["Booked", "Name", "WhatsApp", "Email", "Passes", "Pass no.", "Source"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((r) => (
                  <tr key={r.code} className="text-ivory/90">
                    <td className="px-4 py-3 whitespace-nowrap text-muted">{ist(r.created_at)}</td>
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`https://wa.me/${r.phone.startsWith("+") ? r.phone.slice(1) : `91${r.phone}`}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:underline"
                      >
                        {r.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-ivory/70">{r.email ?? "—"}</td>
                    <td className="px-4 py-3 font-display text-lg text-gold-soft">{r.passes}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <a href={`/pass/${r.code}`} target="_blank" className="hover:text-gold">
                        {r.code}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{r.source || "Website"}</td>
                  </tr>
                ))}
                {!shown.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted">
                      {q ? "No bookings match your search." : "No bookings yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
