import type { Metadata } from "next";
import Image from "next/image";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Arrow, Divider, PageHero, SectionHeading } from "@/components/ui";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shivachatrapati Varasa Shauryacha — A Grand Historical Musical",
  description:
    "“The Legacy of Bravery” — an epic musical saga of Chhatrapati Shivaji Maharaj and Maratha valor, featuring over 50 artists and live musicians. Coming to Mumbai, Pune, and Nagpur.",
  alternates: { canonical: "/shivachatrapati" },
  openGraph: { images: ["/images/shiva-hero.webp"] },
};

const gallery: GalleryImage[] = [
  { src: "/images/shiva-g1.webp", alt: "Shivachatrapati performance — gallery image 1", w: 1600, h: 1200 },
  { src: "/images/shiva-g2.webp", alt: "Shivachatrapati performance — gallery image 2", w: 1079, h: 608 },
  { src: "/images/shiva-g4.webp", alt: "Shivachatrapati cast and audience", w: 1200, h: 1600 },
  { src: "/images/shiva-g3.webp", alt: "Shivachatrapati performance — gallery image 3", w: 1079, h: 608 },
  { src: "/images/shiva-g6.webp", alt: "Shivachatrapati performance — gallery image 4", w: 1079, h: 604 },
  { src: "/images/shiva-2.webp", alt: "Shivachatrapati performance still", w: 1079, h: 608 },
];

const ticketsLink = whatsappLink(
  "Hi IndoStage! I'd like to book tickets for Shivachatrapati Varasa Shauryacha. Please share the show dates.",
);

export default function ShivachatrapatiPage() {
  return (
    <>
      <PageHero
        kicker="A Grand Historical Musical"
        title="Shivachatrapati"
        accent="Varasa Shauryacha"
        subtitle="“The Legacy of Bravery” — An Epic Saga of Maratha Valor"
        image="/images/shiva-hero.webp"
      >
        <div className="mt-10 flex flex-wrap gap-4" data-reveal>
          <a href={ticketsLink} target="_blank" rel="noopener noreferrer" className="btn-gold">
            Book Tickets Now <Arrow />
          </a>
          <a href="#gallery" className="btn-ghost">
            View Gallery
          </a>
        </div>
      </PageHero>

      <section className="container-x grid gap-16 py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-32">
        <div>
          <SectionHeading kicker="Relive History" title="An Epic Saga of" accent="Maratha Valor" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ivory/80" data-reveal>
            <p>
              &ldquo;Shivachatrapati Varasa Shauryacha&rdquo; is a magnificent musical drama that
              brings to life the inspiring journey of Chhatrapati Shivaji Maharaj. Through powerful
              storytelling, stirring music, and spectacular performances, we celebrate the courage,
              wisdom, and indomitable spirit of the great Maratha warrior.
            </p>
            <p className="text-muted">
              Witness the grandeur of the Maratha empire, the strategic brilliance of its battles,
              and the cultural renaissance that defined an era. This production uses
              state-of-the-art stagecraft to transport you back in time.
            </p>
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2" data-reveal>
            <div className="rounded-2xl border border-line bg-ink-2 p-6">
              <dt className="font-display text-2xl text-gold-soft">World-Class Production</dt>
              <dd className="mt-2 text-sm text-muted">Featuring over 50 artists and live musicians.</dd>
            </div>
            <div className="rounded-2xl border border-line bg-ink-2 p-6">
              <dt className="font-display text-2xl text-gold-soft">Touring Across India</dt>
              <dd className="mt-2 text-sm text-muted">Coming to Mumbai, Pune, and Nagpur soon.</dd>
            </div>
          </dl>
        </div>
        <div className="grid gap-4" data-reveal>
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-line">
            <Image src="/images/shiva-1.webp" alt="Performance still 1" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-line">
            <Image src="/images/shiva-2.webp" alt="Performance still 2" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section id="gallery" className="border-y border-line bg-ink-2 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading
            center
            kicker="Glimpses of Glory"
            title="From the"
            accent="Stage"
            intro="Capturing the essence of the performance — the emotions, the energy, and the grandeur."
          />
          <div className="mt-16">
            <Gallery images={gallery} />
          </div>
        </div>
      </section>

      <section className="container-x py-24 text-center lg:py-32">
        <Divider />
        <h2 className="h-display mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl" data-reveal>
          Experience the Legacy <em className="text-gold-grad">Live</em>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ivory/80" data-reveal>
          Don&apos;t miss this opportunity to witness history unfold on stage. Secure your seats
          for an unforgettable evening.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal>
          <a href={ticketsLink} target="_blank" rel="noopener noreferrer" className="btn-gold">
            Check Show Dates <Arrow />
          </a>
        </div>
      </section>
    </>
  );
}
