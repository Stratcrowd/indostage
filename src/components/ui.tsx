import Image from "next/image";
import Link from "next/link";
import { Mark } from "./Logo";

export function PageHero({
  kicker,
  title,
  accent,
  subtitle,
  image,
  children,
}: {
  kicker: string;
  title: string;
  accent?: string;
  subtitle?: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative isolate flex min-h-[72vh] items-end overflow-hidden pt-36 pb-20 sm:pb-24">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 animate-slow-zoom object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 to-transparent" />
      <div className="container-x">
        <p className="kicker" data-reveal>
          {kicker}
        </p>
        <h1
          className="h-display mt-6 max-w-4xl text-5xl sm:text-7xl lg:text-8xl"
          data-reveal
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
        >
          {title} {accent && <em className="text-gold-grad">{accent}</em>}
        </h1>
        {subtitle && (
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80"
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  accent,
  intro,
  center = false,
}: {
  kicker: string;
  title: string;
  accent?: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} data-reveal>
      <p className={`kicker ${center ? "justify-center" : ""}`}>{kicker}</p>
      <h2 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
        {title} {accent && <em className="text-gold-grad">{accent}</em>}
      </h2>
      {intro && <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 text-gold/70" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
      <Mark className="h-5 w-5" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}

export function CtaBand({
  title = "Ready to Create Something Extraordinary?",
  text = "Whether you're planning a cultural event, seeking artistic collaboration, or looking to showcase your talent, we'd love to hear from you.",
  cta = "Start a Conversation",
}: {
  title?: string;
  text?: string;
  cta?: string;
}) {
  return (
    <section className="container-x py-24">
      <div
        className="grain relative isolate overflow-hidden rounded-[2rem] border border-line px-6 py-16 text-center sm:px-16 sm:py-24"
        data-reveal
      >
        <Image
          src="/images/grand-stage.webp"
          alt=""
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="-z-20 object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-maroon-deep/95 via-ink/85 to-ink/95" />
        <Divider />
        <h2 className="h-display mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ivory/80">{text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-gold">
            {cta} <Arrow />
          </Link>
          <Link href="/services" className="btn-ghost">
            Explore Our Art
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 flex-none text-gold" fill="none" aria-hidden>
      <path d="M4 10.5 8 14.5 16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
