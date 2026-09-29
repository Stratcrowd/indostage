import Link from "next/link";

export function Mark({ className = "" }: { className?: string }) {
  // Stylised diya / lotus flame.
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <path
        d="M20 4c3.5 5 6 8.5 6 12.2A6 6 0 0 1 20 22a6 6 0 0 1-6-5.8C14 12.5 16.5 9 20 4Z"
        fill="currentColor"
      />
      <path
        d="M4 24c5 0 9.5 2.3 12 6.5M36 24c-5 0-9.5 2.3-12 6.5M8 30.5h24M12 35h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-center gap-2.5"
      aria-label="IndoStage home"
    >
      <Mark className="h-8 w-8 text-gold transition-transform duration-500 group-hover:-translate-y-0.5" />
      <span className="font-display text-[1.7rem] leading-none font-semibold tracking-tight">
        Indo<span className="text-gold">Stage</span>
      </span>
    </Link>
  );
}
