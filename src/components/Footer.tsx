import Link from "next/link";
import { Logo } from "./Logo";
import { nav, services, site } from "@/lib/site";

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => url);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] lg:py-20">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 font-display text-xl text-gold-soft italic">
            {site.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {site.description}
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line px-4 py-2 text-xs text-ivory/80 hover:border-gold hover:text-gold"
                  >
                    {socialLabels[key]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterCol title="Quick Links">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="hover:text-gold">
                {n.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Our Services">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services#${s.slug}`} className="hover:text-gold">
                {s.title}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Contact Us">
          <li>
            <span className="block text-xs tracking-widest text-muted uppercase">Email</span>
            <a href={`mailto:${site.email}`} className="hover:text-gold">
              {site.email}
            </a>
          </li>
          <li>
            <span className="block text-xs tracking-widest text-muted uppercase">Phone</span>
            <a href={site.phoneHref} className="hover:text-gold">
              {site.phone}
            </a>
          </li>
          <li>
            <span className="block text-xs tracking-widest text-muted uppercase">Location</span>
            {site.location}
          </li>
          <li>
            <span className="block text-xs tracking-widest text-muted uppercase">Founder</span>
            {site.founder}
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} All rights reserved.
          </p>
          <p>
            Crafted with passion for Indian culture · Designed and managed by{" "}
            <a
              href={site.credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory/80 hover:text-gold"
            >
              {site.credit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-5 text-xs font-semibold tracking-[0.28em] text-gold uppercase">
        {title}
      </h2>
      <ul className="space-y-3 text-sm text-ivory/85">{children}</ul>
    </div>
  );
}
