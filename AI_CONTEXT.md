# AI Context: IndoStage Website Rebuild

Hand-off notes for any AI assistant or developer picking up this project. Summary of the working session from 29 Sep to 4 Oct 2026.

## Owner rules (must follow)

- **Nothing goes to the cloud unless the owner asks.** No cloud syncing, no connectors, no MCP deploy tools, no auto-uploads.
- Work happens **locally in this folder**. GitHub and Vercel are handled only through the owner's **own local Chrome / GitHub Desktop**, and only on explicit request.
- Never enter passwords or API keys on the owner's behalf. The owner adds secrets (e.g. `RESEND_API_KEY`) in Vercel themselves.
- Keep all site copy **exactly as on the original live site** (including both "5 Years Experience" on Home and "25+ Years" on About, which the owner chose to keep).

## Project

- **Business:** IndoStage Creative & Production Pvt. Ltd. Indian cultural and entertainment production house (classical, folk, fusion, corporate events, film, training). Founder: Pradnya Kale. Contact: pradnya@indostage.in, +91 836 984 5536, Maharashtra.
- **Domain:** indostage.in / www.indostage.in, on Vercel. The old site was a Replit-built Vite + React single-page app.
- **Folder:** `E:\codes projects\GIT_desktop\Indostage new website`

## Problems found on the old live site

1. `/team` returned a 404 ("Did you forget to add the page to the router?"), and the footer linked to it.
2. Share preview (OG/Twitter) tags pointed to Replit's image and `@replit`.
3. The social links pointed to bare facebook.com, instagram.com, linkedin.com and whatsapp.com.
4. The hero image was an 8.6 MB PNG; the site's images totalled about 17 MB.
5. There was no meta description, and every page had the same title.
6. It was a client-only SPA, so crawlers got an almost empty 1.6 KB HTML page.
7. Inconsistencies: "5 Years" vs "25+ Years" / "two decades"; "Varsa" (nav) vs "Varasa" (page); the footer logo rendered as just "Indo".

## What was built

- **Stack:** Next.js 16.3 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript. Next 16 has breaking changes, so read `node_modules/next/dist/docs/` before coding (see `AGENTS.md`).
- **Pages:** `/`, `/about`, `/services` (anchors `#classical #folk #fusion #corporate #film #training`), `/shivachatrapati`, `/team`, `/contact`, plus a custom 404. All pre-rendered except `/contact`, which is dynamic because it reads `?service=`.
- **SEO:** per-page metadata, canonical URLs, `sitemap.ts`, `robots.ts`, Organization JSON-LD, and a generated `opengraph-image.jpg` / `twitter-image.jpg` (from `scripts/make-og.mjs`).
- **Images:** every image from the old site (including the Cloudinary hero and the ibb.co show photos) was downloaded once and converted to WebP in `public/images/`, about 2.5 MB in total. No external image hosts remain.
- **Design:** dark "theatre" theme (ink black, maroon, gold), with Cormorant Garamond for display text and Manrope for body text. Includes scroll-reveal animation (`RevealObserver` plus `data-reveal`), a count-up stats row, an art-form marquee, a mobile menu, and a show gallery that opens full screen.
- **WhatsApp:** `https://wa.me/918369845536` with pre-filled messages (floating button, Book Tickets, and the service enquiries).
- **Contact form:** a server action in `src/app/contact/actions.ts` that sends through the Resend REST API. It validates input, includes a honeypot field, and escapes HTML. Without `RESEND_API_KEY` it shows a fallback message asking the visitor to email or WhatsApp instead. Environment variables are listed in `.env.example`.
- **Team page:** shows names and roles only (Pradnya Kale, Founder; Gopal Awati and Pravin Joshi, Script Writers) with initials avatars. No invented bios.

## Key files

| Purpose | Path |
| --- | --- |
| All content (contact, nav, stats, services, values, team) | `src/lib/site.ts` |
| Theme tokens and utilities | `src/app/globals.css` |
| Root layout, metadata, JSON-LD | `src/app/layout.tsx` |
| Shared UI (PageHero, SectionHeading, CtaBand, etc.) | `src/components/ui.tsx` |
| Header / mobile nav | `src/components/Header.tsx` (the mobile panel sits outside `<header>` because the header's backdrop-filter breaks fixed positioning) |
| Deploy and setup steps | `README.md` |

## Verification done

- `npm run build` and `eslint` pass with no errors.
- Desktop (1440px) and mobile (390px) were checked with full-page screenshots of every page, using headless Edge.
- No horizontal scroll on mobile, all images load, the mobile menu opens correctly, form validation works, and `?service=` pre-selects the service.
- A hydration warning in dev comes from the ClickUp browser extension, not from the site. `<body>` has `suppressHydrationWarning`.

## Still to do (owner)

- [ ] Publish the repo to GitHub, import it into Vercel, and move the `indostage.in` domains from the old Vercel project to the new one.
- [ ] Add a Resend account and API key in Vercel (verify the domain in Resend and set `CONTACT_FROM`).
- [ ] Add real social profile URLs in `site.social` (`src/lib/site.ts`). They are hidden while empty.
- [ ] Optional: team photos and bios, and a decision on the "Varsa" vs "Varasa" spelling.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
