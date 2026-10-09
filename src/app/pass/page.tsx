import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { PartnerLogos, SpecialGuest, Tribute } from "@/components/Crossing";
import { MetaPixel } from "@/components/MetaPixel";
import { Arrow } from "@/components/ui";
import { crossing } from "@/lib/site";
import { MAX_PER_BOOKING, passLimit, passesConfigured, passesTaken, showIsOver } from "@/lib/passes";
import { PassForm } from "./PassForm";

const description = `Book your free pass for Ravi Chary Crossing: ${crossing.dateLabel}, ${crossing.time}, ${crossing.venue}, ${crossing.area}.`;

export const metadata: Metadata = {
  title: "Free Passes — Ravi Chary Crossing, 18 October 2026",
  description,
  alternates: { canonical: "/pass" },
  openGraph: {
    title: "Get your free pass — Ravi Chary Crossing",
    description,
    images: [{ url: "/images/crossing/share.jpg", width: 1200, height: 630 }],
  },
};

export default async function PassPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const sp = await searchParams;
  const param = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) ?? "";
  // utm_source / utm_campaign from the ad link, stored with each booking.
  const source = [param("utm_source"), param("utm_campaign")].filter(Boolean).join(" / ");

  let left: number | null = null;
  if (passesConfigured()) {
    try {
      left = Math.max(0, passLimit() - (await passesTaken()));
    } catch (e) {
      console.error("[pass] could not read pass count", e);
    }
  }
  const closed = showIsOver() || left === 0;
  const fewLeft = left !== null && left > 0 && left <= passLimit() * 0.2;

  const steps = [
    "Enter your name and WhatsApp number.",
    "Your pass with a QR code appears instantly. Download it or take a screenshot.",
    "Show the pass at the entrance on 18 October.",
  ];

  return (
    <>
    <section className="grain relative isolate overflow-hidden pt-24 pb-16 sm:pt-36 sm:pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(107,26,26,0.55),transparent_60%)]" />
      {/* Mobile: short heading, one-line event details, then the form. Desktop: heading + details left, form right. */}
      <div className="container-x grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-x-12">
        <div className="min-w-0 lg:col-start-1">
          <p className="kicker">Free entry · Passes required</p>
          <h1 className="h-display mt-3 text-4xl sm:mt-5 sm:text-7xl">
            Get Your <em className="text-gold-grad">Free Pass</em>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ivory/80 sm:hidden">
            {crossing.dateLabel.replace(" 2026", "")} · {crossing.time}
            <br />
            {crossing.venue}, {crossing.area}
          </p>
          <p className="mt-6 hidden max-w-xl text-lg leading-relaxed text-ivory/80 sm:block">
            <Link href={crossing.href} className="text-gold-soft underline decoration-gold/40 underline-offset-4 hover:text-gold">
              Ravi Chary Crossing
            </Link>
            : Indian roots, jazz freedom. Five musicians and special guest {crossing.guest.name}, in memory of
            Late Pt. Prabhakar Chari in his Janma Shatabdi (birth-centenary) year.
          </p>
        </div>

        <div className="order-last hidden min-w-0 sm:block lg:order-none lg:col-start-1">

          <dl className="grid max-w-xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {[
              [crossing.dateLabel, crossing.time],
              [crossing.venue, crossing.area],
            ].map(([big, small]) => (
              <div key={big} className="bg-ink-2/90 px-5 py-4">
                <dt className="font-display text-xl text-gold-soft">{big}</dt>
                <dd className="mt-1 text-sm text-muted">{small}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex max-w-xl gap-3">
            {crossing.artists.map((a) => (
              <li key={a.name} className="min-w-0 flex-1 text-center">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border border-gold/50">
                  <Image src={a.image} alt={a.name} fill sizes="96px" className="object-cover" style={{ objectPosition: a.pos }} />
                </div>
                <p className="mt-2 truncate text-xs text-ivory/80">{a.name}</p>
              </li>
            ))}
          </ul>

          <ol className="mt-10 max-w-xl space-y-3 text-ivory/80">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/60 text-sm text-gold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div id="book" className="min-w-0 scroll-mt-24 rounded-3xl border border-line bg-ink-2/90 p-5 shadow-2xl sm:p-8 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {closed ? (
            <div className="py-6 text-center">
              <p className="font-display text-4xl text-gold-soft">Passes are closed</p>
              <p className="mt-4 text-ivory/80">
                All free passes have been booked. For enquiries call{" "}
                <a href={crossing.enquiryHref} className="text-gold">
                  {crossing.enquiry}
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl text-ivory sm:text-3xl">Book your passes</h2>
              <p className="mt-2 text-sm text-muted">
                Up to {MAX_PER_BOOKING} passes per WhatsApp number.{" "}
                {fewLeft ? <span className="text-saffron">Only {left} passes left.</span> : "Limited passes available."}
              </p>
              <div className="mt-6">
                <PassForm source={source} />
              </div>
            </>
          )}
        </div>
      </div>
      <MetaPixel />
    </section>

    {/* Landing-page detail below the form: line-up, the tribute, how passes work. */}
    <section className="container-x py-20 lg:py-28">
      <p className="kicker justify-center text-center">The Artists</p>
      <h2 className="h-display mt-5 text-center text-4xl sm:text-5xl">
        Five Musicians. <em className="text-gold-grad">One Conversation.</em>
      </h2>
      <ul className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-x-4 gap-y-8">
        {crossing.artists.map((a) => (
          // Flex-wrap, not grid, so a short last row stays centred.
          <li key={a.name} className="w-[calc(50%-0.5rem)] text-center sm:w-[calc(33.333%-0.7rem)] lg:w-[calc(20%-0.8rem)]">
            <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-full border border-gold/50">
              <Image src={a.image} alt={`${a.name}, ${a.role}`} fill sizes="160px" className="object-cover" style={{ objectPosition: a.pos }} />
            </div>
            <p className="mt-3 font-display text-xl text-ivory">{a.name}</p>
            <p className="mt-0.5 text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">{a.role}</p>
          </li>
        ))}
      </ul>
      <SpecialGuest className="mx-auto mt-10 max-w-xl" />
    </section>

    <Tribute />

    <section className="container-x py-20 text-center lg:py-28">
      <h2 className="h-display text-4xl sm:text-5xl">
        How Free Passes <em className="text-gold-grad">Work</em>
      </h2>
      <ol className="mx-auto mt-10 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s} className="rounded-2xl border border-line bg-ink-2/90 p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 font-display text-xl text-gold">{i + 1}</span>
            <p className="mt-4 text-ivory/80">{s}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-6 max-w-2xl text-sm text-muted">
        Entry is free. Up to {MAX_PER_BOOKING} passes per WhatsApp number. Questions? Call or WhatsApp{" "}
        <a href={crossing.enquiryHref} className="text-gold">
          {crossing.enquiry}
        </a>
        .
      </p>
      {!closed && (
        <a href="#book" className="btn-gold mt-10">
          Get My Free Pass <Arrow />
        </a>
      )}
      <div className="mx-auto mt-16 max-w-4xl">
        <p className="mb-5 text-sm tracking-wide text-muted">Presented by IndoStage in association with {crossing.academy}</p>
        <PartnerLogos />
      </div>
    </section>
    </>
  );
}
