"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryImage = { src: string; alt: string; w: number; h: number };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (d: number) => setActive((a) => (a === null ? a : (a + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {images.map((img, i) => (
          <li key={img.src} className="break-inside-avoid" data-reveal>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group block w-full overflow-hidden rounded-2xl border border-line"
              aria-label={`Open ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full transition duration-700 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={images[active].alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md"
          onClick={close}
        >
          <Image
            src={images[active].src}
            alt={images[active].alt}
            width={images[active].w}
            height={images[active].h}
            sizes="100vw"
            className="max-h-[85vh] w-auto rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" onClick={close} aria-label="Close" className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full border border-line text-2xl text-ivory hover:border-gold">
            ×
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image" className="absolute left-3 grid h-12 w-12 place-items-center rounded-full border border-line bg-ink/60 text-2xl text-ivory hover:border-gold sm:left-8">
            ‹
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image" className="absolute right-3 grid h-12 w-12 place-items-center rounded-full border border-line bg-ink/60 text-2xl text-ivory hover:border-gold sm:right-8">
            ›
          </button>
          <p className="absolute bottom-6 text-sm text-muted">
            {active + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
