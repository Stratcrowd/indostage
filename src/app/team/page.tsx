import type { Metadata } from "next";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { Mark } from "@/components/Logo";
import { team } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the people behind IndoStage — founder Pradnya Kale and script writers Gopal Awati and Pravin Joshi.",
  alternates: { canonical: "/team" },
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

export default function TeamPage() {
  return (
    <>
      <PageHero
        kicker="The People Behind the Stage"
        title="Our"
        accent="Team"
        subtitle="The creative minds bringing India's artistic legacy to audiences across the world."
        image="/images/svc-folk.webp"
      />

      <section className="container-x py-24 lg:py-32">
        <SectionHeading center kicker="Leadership & Creative" title="Meet the" accent="Team" />
        <ul className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li
              key={m.name}
              className="group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-10 text-center transition duration-500 hover:border-gold/50"
              data-reveal
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <Mark className="absolute -top-6 -right-6 h-32 w-32 text-gold/[0.05]" />
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-maroon to-maroon-deep font-display text-4xl text-gold-soft transition duration-500 group-hover:scale-105">
                {initials(m.name)}
              </div>
              <h2 className="mt-7 font-display text-3xl text-ivory">{m.name}</h2>
              <p className="mt-2 text-xs font-semibold tracking-[0.28em] text-gold uppercase">
                {m.role}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title="Join Our Artist Network"
        text="We are always looking to discover talented artists — especially from rural and underrepresented regions of India. Reach out and let your voice be heard."
        cta="Showcase Your Talent"
      />
    </>
  );
}
