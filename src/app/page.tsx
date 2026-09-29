import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { Arrow, CtaBand, Divider, SectionHeading } from "@/components/ui";
import { services, site, stats } from "@/lib/site";

const artForms = [
  "Bharatanatyam",
  "Kathak",
  "Hindustani",
  "Carnatic",
  "Lavani",
  "Gondhal",
  "Powada",
  "Koli",
  "Odissi",
  "Sitar Symphony",
  "Kuchipudi",
  "Banjara",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32">
        <Image
          src="/images/hero-dancer.webp"
          alt="Classical Indian dancer performing on a lit stage"
          fill
          priority
          sizes="100vw"
          className="-z-20 animate-slow-zoom object-cover object-[60%_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />

        <div className="container-x pb-14 sm:pb-20">
          <p className="kicker" data-reveal>
            Presenting India&apos;s Artistic Legacy
          </p>
          <h1
            className="h-display mt-6 max-w-5xl text-[3.4rem] sm:text-8xl lg:text-[8.5rem]"
            data-reveal
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          >
            Where Indian Heritage Meets{" "}
            <em className="text-gold-grad">Global Stages</em>
          </h1>
          <p
            className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/80"
            data-reveal
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            {site.description}
          </p>
          <div
            className="mt-10 flex flex-wrap gap-4"
            data-reveal
            style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
          >
            <Link href="/contact" className="btn-gold">
              Begin Your Journey <Arrow />
            </Link>
            <Link href="/services" className="btn-ghost">
              Explore Our Art
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 border-t border-line pt-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-3 ${i > 0 ? "sm:border-l sm:border-line sm:pl-8" : ""}`}
              >
                <dd className="font-display text-5xl text-gold-soft sm:text-6xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-1 text-[0.65rem] font-semibold tracking-[0.14em] text-muted uppercase sm:text-[0.7rem] sm:tracking-[0.25em]">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Art-form marquee */}
      <div className="overflow-hidden border-y border-line bg-maroon-deep/40 py-5" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...artForms, ...artForms].map((a, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-2xl text-ivory/70 italic">
              {a} <span className="text-sm text-gold not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <section className="container-x grid items-center gap-16 py-24 lg:grid-cols-2 lg:py-32">
        <div className="relative mx-auto w-full max-w-lg" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-3xl border border-line">
            <Image
              src="/images/dancer-portrait.webp"
              alt="Bharatanatyam dancer in a classical pose"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-4 -bottom-10 w-1/2 overflow-hidden rounded-2xl border-4 border-ink shadow-2xl sm:-right-10">
            <Image
              src="/images/vocalist.webp"
              alt="Classical vocalist performing"
              width={600}
              height={400}
              sizes="25vw"
              className="aspect-[4/3] object-cover"
            />
          </div>
        </div>
        <div>
          <SectionHeading kicker="Our Purpose" title="Bridging Heritage &" accent="Innovation" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ivory/80" data-reveal>
            <p>
              At IndoStage, we believe that India&apos;s artistic traditions are not relics of the
              past, but living, breathing expressions of human creativity that deserve to be
              celebrated on the world&apos;s grandest stages.
            </p>
            <p className="text-muted">
              Our vision is to become India&apos;s leading cultural production house—one that
              connects heritage with innovation, nurtures emerging talent from every corner of the
              nation, and delivers world-class artistic experiences that transcend borders and
              touch hearts.
            </p>
          </div>
          <Link href="/about" className="btn-ghost mt-10" data-reveal>
            Discover Our Story <Arrow />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="relative border-y border-line bg-ink-2 py-24 lg:py-32">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              kicker="What We Offer"
              title="Our Artistic"
              accent="Services"
              intro="From intimate recitals to grand productions, we curate experiences that celebrate the full spectrum of India's cultural magnificence."
            />
            <Link href="/services" className="btn-ghost shrink-0" data-reveal>
              View All Services <Arrow />
            </Link>
          </div>

          <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li
                key={s.slug}
                data-reveal
                style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
              >
                <Link
                  href={`/services#${s.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-ink-3 transition duration-500 hover:-translate-y-1 hover:border-gold/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-3 to-transparent" />
                    <span className="absolute top-4 left-5 font-display text-lg text-gold-soft">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-display text-3xl leading-tight text-ivory">{s.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                      Learn more
                      <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured production */}
      <section className="container-x py-24 lg:py-32">
        <div
          className="grain relative isolate grid overflow-hidden rounded-[2rem] border border-line lg:grid-cols-2"
          data-reveal
        >
          <div className="relative min-h-80 lg:min-h-[34rem]">
            <Image
              src="/images/shiva-hero.webp"
              alt="Stage scene from Shivachatrapati Varasa Shauryacha"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-transparent to-transparent lg:bg-gradient-to-l" />
          </div>
          <div className="flex flex-col justify-center bg-maroon-deep p-8 sm:p-14">
            <p className="kicker">Featured Production · A Grand Historical Musical</p>
            <h2 className="h-display mt-5 text-5xl sm:text-6xl">
              Shivachatrapati <em className="text-gold-grad">Varasa Shauryacha</em>
            </h2>
            <p className="mt-4 font-display text-xl text-gold-soft italic">
              &ldquo;The Legacy of Bravery&rdquo; — An Epic Saga of Maratha Valor
            </p>
            <p className="mt-6 leading-relaxed text-ivory/80">
              A magnificent musical drama that brings to life the inspiring journey of Chhatrapati
              Shivaji Maharaj. Featuring over 50 artists and live musicians — coming to Mumbai,
              Pune, and Nagpur soon.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shivachatrapati" className="btn-gold">
                Discover the Show <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global aspirations */}
      <section className="relative isolate overflow-hidden border-y border-line py-24 lg:py-32">
        <Image
          src="/images/mandala.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 -z-10 bg-radial from-transparent to-ink" />
        <div className="container-x text-center">
          <SectionHeading
            center
            kicker="Global Aspirations"
            title="Taking Indian Artistry"
            accent="Beyond Borders"
            intro="We aspire to collaborate with international festivals, cultural organisations, Indian embassies, tourism boards, and global corporate houses to create impactful, memorable experiences on world stages."
          />
          <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3" data-reveal>
            {[
              "International Festivals",
              "Cultural Organisations",
              "Indian Embassies",
              "Tourism Boards",
              "Global Corporate Houses",
            ].map((p) => (
              <li key={p} className="rounded-full border border-line bg-ink/60 px-5 py-2.5 text-sm text-ivory/85 backdrop-blur">
                {p}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-gold mt-12" data-reveal>
            Partner With Us <Arrow />
          </Link>
        </div>
      </section>

      {/* Commitment */}
      <section className="container-x grid gap-14 py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-32">
        <div>
          <SectionHeading kicker="Our Commitment" title="Promoting New &" accent="Rural Talent" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ivory/80" data-reveal>
            <p>
              At the heart of IndoStage lies an unwavering commitment to discovering, nurturing,
              and promoting talented artists from rural and underrepresented regions of India.
            </p>
            <p className="text-muted">
              We offer them a dignified platform, professional grooming, and opportunities to
              perform on national as well as international stages—transforming their dreams into
              reality.
            </p>
          </div>
        </div>
        <figure
          className="relative rounded-[2rem] border border-line bg-gradient-to-br from-ink-3 to-maroon-deep/60 p-10 sm:p-14"
          data-reveal
        >
          <span className="absolute -top-8 left-8 font-display text-[9rem] leading-none text-gold/30" aria-hidden>
            &ldquo;
          </span>
          <blockquote className="relative font-display text-3xl leading-snug text-ivory sm:text-4xl">
            Indian culture grows when every artist is heard—and we are here to make their voice
            reach the world.
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <Divider />
          </figcaption>
        </figure>
      </section>

      <CtaBand />
    </>
  );
}
