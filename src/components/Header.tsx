"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line bg-ink/85 py-3 backdrop-blur-xl"
          : "bg-gradient-to-b from-ink/70 to-transparent py-5"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-6">
        <Logo onClick={() => setOpen(false)} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-gold"
                      : "text-ivory/80 hover:text-ivory"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn-gold hidden !px-5 !py-2.5 sm:inline-flex">
            Book a Show
          </Link>
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`absolute h-px w-5 bg-ivory transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute h-px w-5 bg-ivory transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute h-px w-5 bg-ivory transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </div>
    </header>

    {/* Rendered outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
    <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-ink pt-[72px] transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex h-full flex-col pt-8 pb-28">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
                className={`border-b border-line transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline justify-between py-4 font-display text-3xl ${
                    isActive(item.href) ? "text-gold" : "text-ivory"
                  }`}
                >
                  {item.label}
                  <span className="font-sans text-xs text-muted">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-gold mt-auto"
          >
            Book a Show
          </Link>
        </nav>
      </div>
    </>
  );
}
