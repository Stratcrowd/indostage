import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, Check, CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { differentiators, values } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "IndoStage Creative & Production Pvt. Ltd. — custodians of India's cultural heritage, presenting classical music, Indian dance, folk art and concept-based performances to audiences worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="Our Story"
        title="About"
        accent="IndoStage"
        subtitle="A premier cultural and entertainment company dedicated to presenting India's rich artistic legacy to audiences across the world."
        image="/images/hero-dance-stage.webp"
      />

      {/* Who we are */}
      <section className="container-x grid gap-16 py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-32">
        <div>
          <SectionHeading kicker="Who We Are" title="Custodians of India's" accent="Cultural Heritage" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ivory/80" data-reveal>
            <p>
              IndoStage Creative &amp; Production Pvt. Ltd. is more than just an entertainment
              company—we are passionate custodians of India&apos;s magnificent cultural heritage.
              For over two decades, we have been at the forefront of presenting India&apos;s
              artistic excellence to discerning audiences worldwide.
            </p>
            <p className="text-muted">
              We curate, create, and celebrate the finest in Classical Music, Indian Dance, Folk
              Art, World Music, and Concept-Based Performances, bringing timeless traditions into
              contemporary global arenas with the reverence they deserve.
            </p>
            <p className="text-muted">
              Our productions are not mere performances—they are immersive journeys that transport
              audiences through centuries of artistic evolution, from the ancient courts of
              maharajas to the vibrant village squares, from sacred temple traditions to the
              grandest concert halls of the world.
            </p>
          </div>
        </div>
        <div className="relative" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
            <Image
              src="/images/dancer-portrait.webp"
              alt="Classical Indian dancer"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-4 rounded-2xl border border-line bg-maroon-deep/95 px-8 py-6 shadow-2xl backdrop-blur sm:-left-10">
            <p className="font-display text-5xl text-gold-soft">25+ Years</p>
            <p className="mt-1 max-w-[14rem] text-sm text-ivory/75">
              of celebrating Indian artistic excellence
            </p>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="border-y border-line bg-ink-2 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeading center kicker="Our Guiding Light" title="Vision &" accent="Mission" />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              {
                label: "Our Vision",
                text: "To become India's leading cultural production house that connects heritage with innovation, nurtures emerging talent from every corner of the nation, and delivers world-class artistic experiences on national and international platforms—making Indian culture a universal language of beauty and expression.",
              },
              {
                label: "Our Mission",
                text: "To ensure that India's music, dance, rhythm, and stories resonate across the world, while providing a dignified platform for artists from rural and underrepresented regions. We believe every voice deserves to be heard, every tradition deserves to be celebrated, and every artist deserves to shine.",
              },
            ].map((b, i) => (
              <article
                key={b.label}
                className="rounded-3xl border border-line bg-ink-3 p-10 sm:p-12"
                data-reveal
                style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
              >
                <h3 className="font-display text-4xl text-gold-soft">{b.label}</h3>
                <p className="mt-5 text-lg leading-relaxed text-ivory/80">{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-x py-24 lg:py-32">
        <SectionHeading
          kicker="What Drives Us"
          title="Our Core"
          accent="Values"
          intro="These principles guide every decision we make and every production we create."
        />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li
              key={v.title}
              className="bg-ink p-8 sm:p-10"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="font-display text-lg text-gold">0{i + 1}</span>
              <h3 className="mt-6 font-display text-3xl text-ivory">{v.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{v.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why us */}
      <section className="relative isolate overflow-hidden border-y border-line py-24 lg:py-32">
        <Image src="/images/grand-stage.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/70" />
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <SectionHeading kicker="Why Choose Us" title="What Sets IndoStage" accent="Apart" />
          <ul className="space-y-5" data-reveal>
            {differentiators.map((d) => (
              <li key={d} className="flex gap-4 border-b border-line pb-5 text-lg text-ivory/85">
                <Check />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Global vision */}
      <section className="container-x py-24 text-center lg:py-32">
        <SectionHeading center kicker="Our Global Vision" title="Taking Indian Artistry" accent="Beyond Borders" />
        <div className="mx-auto mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-ivory/80" data-reveal>
          <p>
            IndoStage aims to take Indian artistry beyond borders. We aspire to collaborate with
            international festivals, cultural organisations, Indian embassies, tourism boards, and
            global corporate houses to create impactful, memorable experiences on global stages.
          </p>
          <p className="text-muted">
            Our mission is to ensure that India&apos;s music, dance, rhythm, and stories resonate
            across the world—not as exotic curiosities, but as profound expressions of universal
            human experience that touch hearts and transform perspectives.
          </p>
        </div>
        <Link href="/contact" className="btn-gold mt-10" data-reveal>
          Partner With Us <Arrow />
        </Link>
      </section>

      <CtaBand />
    </>
  );
}
