import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PartnerLogos, SpecialGuest, Tribute } from "@/components/Crossing";
import { Arrow, Divider, SectionHeading } from "@/components/ui";
import { crossing, site } from "@/lib/site";

const description =
  "Indian roots meet jazz freedom. Ravi Chary (sitar), Ojas Adhiya (tabla), Gino Banks (drums), Sangeet Haldipur (keyboards) and Sheldon D’Silva (bass), with special guest Merlin D’Souza, live at Ravindra Natya Mandir, Mumbai, on Sunday 18 October 2026 at 8:45 PM. A tribute to Late Pt. Prabhakar Chari in his birth-centenary year. Free entry.";

export const metadata: Metadata = {
  title: "Ravi Chary Crossing — Live, 18 October 2026",
  description,
  alternates: { canonical: crossing.href },
  openGraph: {
    title: "Ravi Chary Crossing — 18 October 2026, Ravindra Natya Mandir",
    description,
    images: [{ url: "/images/crossing/share.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Ravi Chary Crossing — 18 October 2026",
    description,
    images: ["/images/crossing/share.jpg"],
  },
};

const enquiryWhatsapp = `${crossing.enquiryWhatsapp}?text=${encodeURIComponent(
  "Hi! I'd like to know more about Ravi Chary Crossing on 18 October.",
)}`;

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  name: crossing.title,
  description,
  startDate: crossing.startISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  isAccessibleForFree: true,
  image: [`${site.url}/images/crossing/share.jpg`],
  location: {
    "@type": "Place",
    name: crossing.venue,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Prabhadevi, Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
  },
  performer: [...crossing.artists, crossing.guest].map((a) => ({ "@type": "Person", name: a.name })),
  organizer: [
    { "@type": "Organization", name: site.legalName, url: site.url },
    { "@type": "Organization", name: crossing.academy },
  ],
};

function Facts({ className = "" }: { className?: string }) {
  const items = [
    [crossing.dateLabel, crossing.time],
    [crossing.venue, crossing.area],
    [crossing.entry, "Free pass required"],
  ];
  return (
    <dl className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 ${className}`}>
      {items.map(([big, small]) => (
        <div key={big} className="bg-ink-2/90 px-6 py-5">
          <dt className="font-display text-2xl text-gold-soft">{big}</dt>
          <dd className="mt-1 text-sm tracking-wide text-muted">{small}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function RaviCharyCrossingPage() {
  return (
    <>
      <section className="grain relative isolate overflow-hidden pt-36 pb-20 sm:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(107,26,26,0.55),transparent_60%)]" />
        <div className="container-x">
          <p className="kicker" data-reveal>
            IndoStage presents · Sounds that connect
          </p>
          <h1
            className="h-display mt-6 max-w-4xl text-5xl sm:text-7xl lg:text-8xl"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Ravi Chary <em className="text-gold-grad">Crossing</em>
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80"
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            Indian roots. Jazz freedom. Classical roots, contemporary expression: five musicians in
            one musical conversation, live in Mumbai.
          </p>
          <Facts className="mt-10 max-w-4xl" />
          <div className="mt-10 flex flex-wrap gap-4" data-reveal>
            <Link href={crossing.passHref} className="btn-gold">
              Get Free Passes <Arrow />
            </Link>
            <a href="#lineup" className="btn-ghost">
              Meet the Artists
            </a>
          </div>
        </div>
      </section>

      <section id="lineup" className="border-y border-line bg-ink-2 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading
            center
            kicker="The Artists"
            title="Five Musicians."
            accent="One Conversation."
            intro="Sitar, tabla, drums, keyboards and bass, each with an equal voice on stage."
          />
          <ul className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {crossing.artists.map((a, i) => (
              <li
                key={a.name}
                className={`group ${i === 4 ? "col-span-2 mx-auto w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:col-span-1 md:mx-0 md:w-full" : ""}`}
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
                  <Image
                    src={a.image}
                    alt={`${a.name}, ${a.role}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: a.pos }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                </div>
                <h3 className="mt-4 font-display text-2xl text-ivory">{a.name}</h3>
                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-gold uppercase">{a.role}</p>
              </li>
            ))}
          </ul>
          <SpecialGuest className="mx-auto mt-10 max-w-xl" />
        </div>
      </section>

      <section className="container-x grid gap-12 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <SectionHeading kicker="The Idea" title="Where Traditions" accent="Cross" />
        <div className="space-y-5 text-lg leading-relaxed text-ivory/80" data-reveal>
          <p>
            Crossing is an Indo-jazz and world-music concert where Indian melody meets jazz
            instinct. The sitar steps outside a single boundary and into a live conversation with
            tabla, drums, keyboards and bass, moving between composition and improvisation.
          </p>
          <p className="text-muted">
            The evening is dedicated to the memory of Late Pt. Prabhakar Chari, Ravi Chary&apos;s
            father and guru, in his Janma Shatabdi (birth-centenary) year.
          </p>
        </div>
      </section>

      <Tribute />

      <section className="container-x pb-24 text-center lg:pb-32">
        <Divider />
        <h2 className="h-display mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl" data-reveal>
          See You on <em className="text-gold-grad">18 October</em>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ivory/80" data-reveal>
          {crossing.time} at {crossing.venue}, {crossing.area}. Entry is free with a pass: book yours in a few seconds.
        </p>
        <Facts className="mx-auto mt-10 max-w-4xl text-left" />
        <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal>
          <Link href={crossing.passHref} className="btn-gold">
            Get Free Passes <Arrow />
          </Link>
          <a href={enquiryWhatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Enquire on WhatsApp
          </a>
        </div>
        <div className="mx-auto mt-16 max-w-4xl" data-reveal>
          <p className="mb-5 text-sm tracking-wide text-muted">
            Presented by IndoStage in association with {crossing.academy}
          </p>
          <PartnerLogos />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
    </>
  );
}
