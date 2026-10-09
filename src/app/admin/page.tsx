import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin-auth";
import { allPasses, passLimit, passesConfigured } from "@/lib/passes";
import { isTier, tierInfo, type Tier } from "@/lib/passes-config";
import { crossing, site } from "@/lib/site";
import { IssuePassForm } from "./IssuePassForm";
import { logout } from "./login/actions";

export const metadata: Metadata = {
  title: "Admin — Passes",
  robots: { index: false, follow: false },
};

type Row = {
  code: string;
  tier: Tier;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  passes: number;
  source: string | null;
  created_at: string;
};

const ist = (d: string) =>
  new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

const tierBadge: Record<Tier, string> = {
  vvip: "border-[#f0c86a] bg-[#f0c86a] text-ink",
  vip: "border-[#e0b25c] bg-maroon text-gold-soft",
  general: "border-line text-muted",
};

// IndoStage admin: every pass for Ravi Chary Crossing, and the form to issue VVIP / VIP
// invitations. Login at /admin/login.
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string; tier?: string }> }) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const tierFilter = isTier(sp.tier) ? sp.tier : null;

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

  const sum = (rs: Row[]) => rs.reduce((n, r) => n + Number(r.passes), 0);
  const byTier = (t: Tier) => rows.filter((r) => r.tier === t);
  const general = sum(byTier("general"));
  const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
  const todayRows = byTier("general").filter((r) => new Date(r.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) === today);
  const shown = rows
    .filter((r) => !tierFilter || r.tier === tierFilter)
    .filter((r) => !q || [r.name, r.title, r.phone, r.email, r.code, r.source].some((v) => v?.toLowerCase().includes(q)));

  const stats: [string, string | number, string][] = [
    ["General seats", `${general} / ${passLimit()}`, `${Math.max(0, passLimit() - general)} left · ${byTier("general").length} bookings`],
    ["Booked today", sum(todayRows), `${todayRows.length} general bookings`],
    ["VVIP", sum(byTier("vvip")), `${byTier("vvip").length} invitations`],
    ["VIP", sum(byTier("vip")), `${byTier("vip").length} invitations`],
  ];
  const tabs: [string, Tier | null][] = [["All", null], ["VVIP", "vvip"], ["VIP", "vip"], ["General", "general"]];
  const tabHref = (t: Tier | null) => {
    const p = new URLSearchParams();
    if (t) p.set("tier", t);
    if (q) p.set("q", q);
    return `/admin${p.size ? `?${p}` : ""}`;
  };

  return (
    <section className="container-x pt-32 pb-24">
      <p className="kicker">IndoStage Admin</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="h-display text-4xl sm:text-5xl">Passes</h1>
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
            {stats.map(([label, value, note]) => (
              <div key={label} className="bg-ink-2 px-5 py-4">
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">{label}</dt>
                <dd className="mt-1 font-display text-3xl text-gold-soft">{value}</dd>
                <dd className="text-xs text-muted">{note}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 font-display text-3xl text-ivory">Create a Pass</h2>
          <p className="mt-1 mb-5 text-sm text-muted">VVIP and VIP invitations, or a general pass for someone who asks by phone.</p>
          <IssuePassForm siteUrl={site.url} event={`${crossing.title}, ${crossing.dateLabel}, ${crossing.time}, ${crossing.venue}, ${crossing.area}`} />

          <h2 className="mt-14 font-display text-3xl text-ivory">All Passes</h2>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {tabs.map(([label, t]) => (
              <Link
                key={label}
                href={tabHref(t)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${tierFilter === t ? "border-gold bg-gold text-ink" : "border-line text-ivory/80 hover:border-gold"}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <form className="mt-4 flex gap-3">
            {tierFilter && <input type="hidden" name="tier" value={tierFilter} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, designation, number, email or pass no."
              className="w-full max-w-md rounded-xl border border-line bg-ink px-4 py-3 text-ivory outline-none placeholder:text-muted/60 focus:border-gold"
            />
            <button className="btn-ghost !px-5 !py-2.5">Search</button>
          </form>
          {(q || tierFilter) && (
            <p className="mt-3 text-sm text-muted">
              Showing {shown.length} of {rows.length}.{" "}
              <Link href="/admin" className="text-gold">
                Clear
              </Link>
            </p>
          )}

          <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-ink-2 text-xs tracking-[0.15em] text-muted uppercase">
                <tr>
                  {["Created", "Type", "Name", "WhatsApp", "Email", "Admits", "Pass no.", "Source"].map((h) => (
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
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tierBadge[r.tier] ?? tierBadge.general}`}>
                        {tierInfo[r.tier]?.short ?? r.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.name}
                      {r.title && <span className="block text-xs text-muted">{r.title}</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.phone ? (
                        <a
                          href={`https://wa.me/${r.phone.startsWith("+") ? r.phone.slice(1) : `91${r.phone}`}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:underline"
                        >
                          {r.phone}
                        </a>
                      ) : (
                        "—"
                      )}
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
                    <td colSpan={8} className="px-4 py-10 text-center text-muted">
                      {q || tierFilter ? "No passes match." : "No passes yet."}
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
