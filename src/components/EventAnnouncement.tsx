"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { crossing } from "@/lib/site";
import { Arrow } from "./ui";

const STORAGE_KEY = "indostage:announce:ravi-chary-crossing-2026";

// Site-wide popup for the upcoming show. Hidden on the event page itself, after the visitor
// dismisses it, and once the show day is over.
export function EventAnnouncement() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === crossing.href || Date.now() > Date.parse(crossing.endISO)) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {}
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close announcement"
        onClick={dismiss}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="announce-title"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-ink-2 shadow-2xl"
      >
        <div className="relative aspect-[1200/630]">
          <Image src="/images/crossing/share.jpg" alt="" fill sizes="512px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-ivory transition hover:bg-ink hover:text-gold"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="px-6 pt-2 pb-7 sm:px-8">
          <p className="kicker">Upcoming · IndoStage presents</p>
          <h2 id="announce-title" className="h-display mt-3 text-4xl sm:text-5xl">
            Ravi Chary <em className="text-gold-grad">Crossing</em>
          </h2>
          <p className="mt-3 text-ivory/80">
            {crossing.dateLabel} · {crossing.time}
            <br />
            {crossing.venue}, {crossing.area}
          </p>
          <p className="mt-3 font-semibold tracking-[0.2em] text-gold uppercase">{crossing.entry}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={crossing.href} onClick={dismiss} className="btn-gold">
              View the Event <Arrow />
            </Link>
            <button type="button" onClick={dismiss} className="btn-ghost">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
