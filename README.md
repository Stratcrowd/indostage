# IndoStage website

Official site for **IndoStage Creative & Production Pvt. Ltd.**: www.indostage.in

Built with Next.js (App Router), React and Tailwind CSS. Every page except the contact page is pre-rendered, so Google can read it.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build check
```

## Where to edit things

| What | File |
| --- | --- |
| Phone, email, WhatsApp, social links, team, services text | `src/lib/site.ts` |
| Page content | `src/app/<page>/page.tsx` |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Images | `public/images/` (WebP) |
| Share image for WhatsApp/LinkedIn | `src/app/opengraph-image.jpg` (regenerate with `node scripts/make-og.mjs`) |

Social icons appear in the footer as soon as you fill in their URLs under `site.social` in `src/lib/site.ts`.

## Contact form email

The form sends through [Resend](https://resend.com), which has a free tier. Until a key is added, the form asks visitors to email or WhatsApp instead.

1. Create a Resend account and verify the `indostage.in` domain (Resend shows the DNS records to add).
2. In Vercel → Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY`: your Resend key
   - `CONTACT_FROM`: e.g. `IndoStage Website <website@indostage.in>`
   - `CONTACT_TO` (optional): defaults to `pradnya@indostage.in`
3. Redeploy.

See `.env.example`. Never commit real keys.

## Deploy (GitHub → Vercel)

1. **GitHub Desktop** → File → Add local repository → select this folder → **Publish repository** (keep it private if you like).
2. **vercel.com** → Add New → Project → import that GitHub repo. It detects Next.js automatically, so just click Deploy.
3. Check the `*.vercel.app` preview URL.
4. In the Vercel project, open Settings → Domains → add `indostage.in` and `www.indostage.in`. If the old site is on another Vercel project, remove the domains from that project first.
5. From now on, every push to GitHub redeploys automatically.
