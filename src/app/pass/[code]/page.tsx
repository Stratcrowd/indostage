import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { Arrow } from "@/components/ui";
import { MetaPixel } from "@/components/MetaPixel";
import { crossing, site } from "@/lib/site";
import { getPass, maskPhone } from "@/lib/passes";
import { tierInfo } from "@/lib/passes-config";
import { passTheme } from "@/lib/pass-theme";

// Each pass is personal: keep it out of search results.
export const metadata: Metadata = { title: "Your Pass — Ravi Chary Crossing", robots: { index: false, follow: false } };

export default async function PassTicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const pass = await getPass(decodeURIComponent(code).toUpperCase());
  if (!pass) notFound();

  const t = passTheme[pass.tier];
  const info = tierInfo[pass.tier];
  const url = `${site.url}/pass/${pass.code}`;
  const qr = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0c0806", light: "#f5ecdc" } });
  const share = `https://wa.me/?text=${encodeURIComponent(
    `${t.invite ? "My invitation" : "My free pass"} for Ravi Chary Crossing (18 Oct, ${crossing.venue}): ${url}`,
  )}`;
  const isNew = sp.new === "1";
  const admits = `${pass.passes} ${pass.passes === 1 ? "person" : "people"}`;

  return (
    <section className="grain relative isolate overflow-hidden pt-32 pb-24 sm:pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(107,26,26,0.55),transparent_60%)]" />
      <div className="container-x max-w-xl">
        <p role="status" className="text-center text-lg text-ivory/90">
          {t.invite
            ? "Your invitation to Ravi Chary Crossing"
            : isNew
              ? "You're in! Your free pass is booked."
              : sp.existing === "1"
                ? "This number already has a pass. Here it is."
                : "Your free pass"}
        </p>

        <article
          className="relative mt-6 overflow-hidden rounded-3xl border-2 shadow-2xl"
          style={{ background: t.bg, borderColor: t.frame }}
        >
          {t.innerFrame && (
            <div aria-hidden className="pointer-events-none absolute inset-2 rounded-[20px] border" style={{ borderColor: t.innerFrame }} />
          )}

          <div className="relative border-b border-dashed px-6 pt-8 pb-6 text-center sm:px-8" style={{ borderColor: `${t.frame}66` }}>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: t.accent }}>
              {t.kicker}
            </p>
            {t.badge && (
              <p
                className="mx-auto mt-4 inline-block rounded-full border-2 px-6 py-1 font-display text-3xl font-semibold tracking-[0.35em]"
                style={{ borderColor: t.frame, color: t.accent }}
              >
                {t.badge}
              </p>
            )}
            <h1 className="h-display mt-4 text-4xl sm:text-5xl">
              Ravi Chary <em className="text-gold-grad">Crossing</em>
            </h1>
            <p className="mt-3 text-ivory/80">
              {crossing.dateLabel} · {crossing.time}
              <br />
              {crossing.venue}, {crossing.area}
            </p>
          </div>

          {t.invite ? (
            <div className="relative px-6 py-7 text-center sm:px-8">
              <p className="font-display text-lg text-ivory/70 italic">IndoStage cordially invites</p>
              <p className="mt-2 font-display text-3xl text-ivory sm:text-4xl">{pass.name}</p>
              {pass.title && <p className="mt-1 text-sm tracking-wide text-ivory/70">{pass.title}</p>}
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ivory/70">
                to an evening of Indo-jazz with Ravi Chary and ensemble, with special guest {crossing.guest.name}, in memory of{" "}
                {crossing.tribute.name}.
              </p>
              <div className="mt-6 flex items-center justify-center gap-6">
                <div
                  className="w-32 overflow-hidden rounded-xl border-4 border-ivory bg-ivory [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                  aria-label={`QR code for pass ${pass.code}`}
                  role="img"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
                <dl className="space-y-3 text-left">
                  <div>
                    <dt className="text-xs tracking-[0.2em] text-muted uppercase">Admits</dt>
                    <dd className="font-display text-2xl" style={{ color: t.accent }}>
                      {admits}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs tracking-[0.2em] text-muted uppercase">Pass No.</dt>
                    <dd className="font-mono tracking-wider" style={{ color: t.accent }}>
                      {pass.code}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 px-6 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs tracking-[0.2em] text-muted uppercase">Name</dt>
                  <dd className="font-display text-2xl text-ivory">{pass.name}</dd>
                </div>
                <div className="flex gap-8">
                  <div>
                    <dt className="text-xs tracking-[0.2em] text-muted uppercase">Admits</dt>
                    <dd className="font-display text-3xl text-gold-soft">{admits}</dd>
                  </div>
                  {pass.phone && (
                    <div>
                      <dt className="text-xs tracking-[0.2em] text-muted uppercase">Mobile</dt>
                      <dd className="mt-1.5 text-ivory/80">{maskPhone(pass.phone)}</dd>
                    </div>
                  )}
                </div>
                <div>
                  <dt className="text-xs tracking-[0.2em] text-muted uppercase">Pass No.</dt>
                  <dd className="font-mono text-xl tracking-wider text-gold">{pass.code}</dd>
                </div>
              </dl>
              <div
                className="mx-auto w-44 overflow-hidden rounded-xl border-4 border-ivory bg-ivory sm:w-40 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                aria-label={`QR code for pass ${pass.code}`}
                role="img"
                dangerouslySetInnerHTML={{ __html: qr }}
              />
            </div>
          )}

          <p className="relative px-6 py-3 text-center text-sm text-ivory/85" style={{ background: t.band }}>
            {info.seating} · Show this pass at the entrance
          </p>
        </article>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a href={`/pass/${pass.code}/image`} download className="btn-gold justify-center">
            Download Pass
          </a>
          <a href={share} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center">
            Save to WhatsApp
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Bookmark this page to open your pass again. Questions? Call{" "}
          <a href={crossing.enquiryHref} className="text-gold">
            {crossing.enquiry}
          </a>
          .
        </p>
        <p className="mt-8 text-center">
          <Link href={crossing.href} className="inline-flex items-center gap-2 text-gold-soft hover:text-gold">
            About the concert <Arrow />
          </Link>
        </p>
      </div>
      {!t.invite && <MetaPixel event={isNew ? "Lead" : undefined} value={pass.passes} />}
    </section>
  );
}
