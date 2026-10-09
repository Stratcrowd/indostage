import Image from "next/image";
import { crossing } from "@/lib/site";

// Sections shared by the Ravi Chary Crossing event page and the free-pass page.

export function PartnerLogos() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-ivory px-6 py-8 sm:flex-row sm:gap-12">
      <div className="relative h-16 w-56 sm:h-20 sm:w-64">
        <Image src="/images/crossing/logo-indostage.webp" alt="IndoStage Creation & Production Pvt. Ltd." fill sizes="256px" className="object-contain" />
      </div>
      <span className="font-display text-lg text-[#7a5a45] italic">in association with</span>
      {/* The academy mark is taller than the IndoStage wordmark, so its box is taller for equal visual weight. */}
      <div className="relative h-20 w-56 sm:h-24 sm:w-64">
        <Image src="/images/crossing/logo-swar-sanskruti.webp" alt={crossing.academy} fill sizes="256px" className="object-contain" />
      </div>
    </div>
  );
}

export function SpecialGuest({ className = "" }: { className?: string }) {
  const g = crossing.guest;
  return (
    <div className={`flex items-center gap-5 rounded-3xl border border-gold/40 bg-ink/60 p-4 sm:gap-8 sm:p-6 ${className}`} data-reveal>
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-full border border-gold/60 sm:w-36">
        <Image src={g.image} alt={`${g.name}, ${g.role}`} fill sizes="144px" className="object-cover" style={{ objectPosition: g.pos }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.25em] text-saffron uppercase">Special Guest</p>
        <h3 className="mt-2 font-display text-3xl text-ivory sm:text-4xl">{g.name}</h3>
        <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-gold uppercase">{g.role}</p>
      </div>
    </div>
  );
}

export function Tribute() {
  const t = crossing.tribute;
  return (
    <section className="border-y border-line bg-ink-2 py-20 lg:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <figure className="relative mx-auto w-full max-w-sm" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold/40">
            <Image src={t.image} alt={`${t.name} at the tabla`} fill sizes="(max-width: 1024px) 90vw, 400px" className="object-cover sepia-[.35]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-center">
              <p className="font-display text-2xl text-ivory">{t.name}</p>
              <p className="mt-1 text-sm tracking-[0.3em] text-gold-soft">{t.years}</p>
            </figcaption>
          </div>
        </figure>

        <div data-reveal>
          <p className="kicker">{t.centenary} · {t.years}</p>
          <h2 className="h-display mt-5 text-4xl sm:text-5xl">
            A Tribute in <em className="text-gold-grad">His Centenary Year</em>
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ivory/80">
            <p>
              Ravi Chary Crossing is held in remembrance of {t.name}, Ravi Chary&apos;s father and first guru, born on{" "}
              {t.born}. This year marks his birth centenary.
            </p>
            <p>
              A celebrated tabla guru of Goa, he taught at the Goa College of Music and across the state, built
              music circles and festivals, and shaped generations of musicians, among them his son, sitar maestro
              Pt. Ravindra (Ravi) Chary.
            </p>
            <p className="text-muted">
              Among his honours: felicitated by the President of India, Shri Giani Zail Singh (1986), and the Gan
              Tapasvini Mogubai Kurdikar Puraskar (1997).
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="relative aspect-[7/5] w-40 shrink-0 overflow-hidden rounded-xl border border-line sm:w-48">
              <Image src={t.felicitation} alt={`${t.name} being felicitated by President Giani Zail Singh`} fill sizes="192px" className="object-cover" />
            </div>
            <p className="text-sm text-muted">Felicitated by the President of India, Shri Giani Zail Singh.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
