import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, Check, CtaBand, PageHero } from "@/components/ui";
import { services, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Classical music & dance, folk performances, fusion concerts, corporate & public events, film & media production, and training workshops by IndoStage.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="What We Offer"
        title="Our"
        accent="Services"
        subtitle="Comprehensive cultural production services celebrating the full spectrum of India's artistic magnificence."
        image="/images/grand-stage.webp"
      >
        <nav aria-label="Services" className="mt-10 flex flex-wrap gap-2" data-reveal>
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-line bg-ink/50 px-4 py-2 text-sm text-ivory/85 backdrop-blur transition hover:border-gold hover:text-gold"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-x divide-y divide-line">
        {services.map((s, i) => (
          <section
            key={s.slug}
            id={s.slug}
            aria-labelledby={`${s.slug}-title`}
            className="grid gap-12 py-24 lg:grid-cols-2 lg:gap-20 lg:py-28"
          >
            <div className={`lg:sticky lg:top-28 lg:self-start ${i % 2 ? "lg:order-2" : ""}`} data-reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-5 left-6 font-display text-7xl text-ivory/90 drop-shadow-lg">
                  0{i + 1}
                </span>
              </div>
            </div>
            <div>
              <p className="kicker" data-reveal>
                {s.kicker}
              </p>
              <h2 id={`${s.slug}-title`} className="h-display mt-5 text-4xl sm:text-6xl" data-reveal>
                {s.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ivory/80" data-reveal>
                {s.intro}
              </p>
              <div className="mt-10 rounded-3xl border border-line bg-ink-2 p-8" data-reveal>
                <h3 className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">
                  What We Offer
                </h3>
                <ul className="mt-6 space-y-4">
                  {s.offers.map((o) => (
                    <li key={o} className="flex gap-3 text-ivory/85">
                      <Check />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-8 border-l-2 border-gold/60 pl-5 font-display text-xl leading-relaxed text-gold-soft italic" data-reveal>
                {s.closing}
              </p>
              <div className="mt-8 flex flex-wrap gap-4" data-reveal>
                <Link href={`/contact?service=${s.slug}`} className="btn-gold">
                  Enquire Now <Arrow />
                </Link>
                <a
                  href={whatsappLink(`Hi IndoStage, I'm interested in ${s.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CtaBand
        text="Let us bring the magnificence of Indian culture to your event, project, or platform. We'd love to discuss how we can collaborate."
        cta="Get In Touch"
      />
    </>
  );
}
