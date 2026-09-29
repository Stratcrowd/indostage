import type { Metadata } from "next";
import { Check, PageHero } from "@/components/ui";
import { ContactForm } from "./ContactForm";
import { reachOutReasons, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with IndoStage to bring world-class Indian cultural performances to your event, festival, or platform.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { label: "Email Us", value: site.email, note: "We respond within 24-48 hours", href: `mailto:${site.email}` },
  { label: "Call Us", value: site.phone, note: "Monday to Saturday, 10am - 7pm IST", href: site.phoneHref },
  { label: "WhatsApp", value: site.phone, note: "Quickest way to reach us", href: whatsappLink("Hi IndoStage!") },
  { label: "Visit Us", value: site.location, note: "By appointment only" },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service } = await searchParams;

  return (
    <>
      <PageHero
        kicker="Let's Create Together"
        title="Get In"
        accent="Touch"
        subtitle="Ready to bring world-class Indian cultural performances to your audience? We'd love to hear from you."
        image="/images/grand-stage.webp"
      />

      <section className="container-x grid gap-14 py-24 lg:grid-cols-[1fr_1.3fr] lg:py-32">
        <div>
          <p className="kicker" data-reveal>Reach Out</p>
          <h2 className="h-display mt-5 text-4xl sm:text-5xl" data-reveal>
            We&apos;re Here to <em className="text-gold-grad">Listen</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted" data-reveal>
            Whether you&apos;re planning a grand cultural festival, seeking artistic collaboration,
            or simply want to learn more about what we do—we welcome your message. Every inquiry
            receives our personal attention.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" data-reveal>
            {channels.map((c) => {
              const body = (
                <>
                  <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">{c.label}</span>
                  <span className="mt-2 block break-words text-lg text-ivory">{c.value}</span>
                  <span className="mt-1 block text-sm text-muted">{c.note}</span>
                </>
              );
              return (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="block h-full rounded-2xl border border-line bg-ink-2 p-6 transition hover:border-gold/50"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="h-full rounded-2xl border border-line bg-ink-2 p-6">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 rounded-2xl border border-line p-6" data-reveal>
            <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">Leadership</p>
            <p className="mt-3 text-ivory/85">Founder: {site.founder}</p>
            <p className="mt-1 text-ivory/85">Script Writers: Gopal Awati &amp; Pravin Joshi</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-ink-2 p-7 sm:p-12" data-reveal>
          <h2 className="font-display text-4xl text-ivory">Send a Message</h2>
          <p className="mt-2 mb-8 text-muted">Fill out the form below and we&apos;ll be in touch shortly.</p>
          <ContactForm defaultService={typeof service === "string" ? service : undefined} />
        </div>
      </section>

      <section className="border-t border-line bg-ink-2 py-20">
        <div className="container-x">
          <h2 className="h-display text-center text-4xl sm:text-5xl" data-reveal>
            Reach Out If You&apos;re<span className="text-gold">…</span>
          </h2>
          <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {reachOutReasons.map((r) => (
              <li key={r} className="flex gap-3 rounded-2xl border border-line bg-ink p-5 text-ivory/85">
                <Check />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
