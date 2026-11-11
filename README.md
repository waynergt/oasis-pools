# Oasis Pools — Landing Page

Landing page for **Oasis Pools LLC** (pool service in Aurora, Denver & all of Colorado).
Built with **Vite + React + TypeScript + Tailwind CSS v4**, following the approved Figma mockup.

## Requirements

- Node.js **20.19+** or **22.12+** (check with `node -v`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run build`     | Type-checks, builds and prerenders the site into `dist/` |
| `npm run preview`   | Serves the production build locally           |
| `npm run typecheck` | Type-check only                               |

## Where to change things

Almost everything the client may ask to change lives in **`src/data/site.ts`**:

- `business.phone`, `business.whatsapp`, `business.email` — every Call / Text / WhatsApp / Email button,
  the navbar, contact card, footer and Google structured data read from here.
- `social.instagram`, `social.facebook` — social icons (top bar, footer, menu, contact). An empty link hides
  its icon, so Facebook appears automatically once its URL is added.
- `plans` — plan names and what each includes (no prices on purpose: every plan is quoted for free).
- `services`, `reasons`, `values`, `healthCheckItems` — page copy.
- `gallery` — photos for **Our Work** (files in `src/assets/img/`). `wide: true` makes a photo span two columns.
- `mapCities`, `areaGroups` — cities on the Service Area map (Denver metro & Front Range, home base Aurora) and the grouped city lists next to it.
- `images.heroVideo` — optional. The hero shows animated pool water drawn in the browser (WebGL, no file
  needed). To use a real video instead, put e.g. `hero-water.mp4` in `public/` and set
  `heroVideo: '/hero-water.mp4'`. If a browser can't run WebGL, the hero photo is shown instead.
- `beforeAfter` — add `{ before, after, label }` pairs when the client sends photos. While empty, the
  Before & After block only shows in `npm run dev` and is hidden in the production build.

Design tokens (colors, fonts, animations) are in `src/index.css` under `@theme`
(same values as the Figma variables). Example: `bg-navy-800`, `text-gold-300`, `text-muted`.

## Quote form

The form validates name, phone (US), ZIP and service, then shows the "Thank you!" message.
To actually receive the requests, create a `.env` file (see `.env.example`) with a JSON endpoint,
for example a free [Formspree](https://formspree.io) form:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
```

Without it, requests are only logged in the browser console (useful for development).

## SEO & analytics

Environment variables (Vercel → Settings → Environment Variables, then **Redeploy**):

| Variable             | What it does                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| `VITE_FORM_ENDPOINT` | Formspree URL that receives the quote form                                   |
| `VITE_SITE_URL`      | Public URL. Default `https://www.oasispoolsdenver.com` (only set it to override) |
| `VITE_GA_ID`         | Optional. Overrides the GA4 ID (default `G-RXH9QL4T1L`, only tracks on the live domain) |

`VITE_SITE_URL` feeds the canonical URL, share-image tags, structured data, and the generated
`/sitemap.xml` and `/robots.txt` (see `vite.config.ts`). Analytics events are documented in
`src/lib/analytics.ts` (`generate_lead`, `click_call`, `click_whatsapp`, …).

## Prerendered HTML (SEO)

`npm run build` also renders the page to static HTML (`src/entry-server.tsx` + `scripts/prerender.mjs`) and writes
it into `dist/index.html`. Search engines, AI assistants and link previews get the full content without running
JavaScript; in the browser React attaches to that HTML (`hydrateRoot` in `src/main.tsx`). `npm run dev` is unchanged.

Anything that touches `window`/`document` must stay inside `useEffect` (or event handlers) so the build-time render works.

## Google reviews

The **Reviews** section (`src/components/sections/Reviews.tsx`) reads the Google Business Profile live through
a Vercel Function (`api/reviews.ts`) that calls the Places API (New). The API key never reaches the browser.

| Variable (Vercel only, no `VITE_` prefix) | What it is |
| ----------------------------------------- | ---------- |
| `GOOGLE_PLACES_API_KEY` | Google Cloud API key with **Places API (New)** enabled |
| `GOOGLE_PLACE_ID`       | Place ID of the Oasis Pools profile (starts with `ChIJ`) |

- No reviews on the profile yet → shows a "Leave a Google Review" call to action.
- Reviews on the profile → Google rating, count and up to 5 reviews (Google's limit), linking to all reviews.
- Variables not set, or `npm run dev` (which doesn't run `/api`) → the section is hidden.
- Responses are cached 6 h on Vercel's CDN, so Google is only called a few times a day.

## Project structure

```
api/reviews.ts            ← Vercel Function: Google reviews (Places API)
scripts/prerender.mjs     ← build step: writes the rendered page into dist/index.html
src/
  main.tsx / entry-server.tsx ← browser entry (hydrate) / build-time render
  data/site.ts            ← business info & all page copy
  lib/                    ← contact links, form submit, quote pre-fill events
  hooks/                  ← active section, scroll state, body scroll lock
  components/
    layout/               ← TopBar, Navbar, MobileMenu, Footer, StickyCTA
    layout/WhatsAppButton ← floating WhatsApp bubble (tablet/desktop)
    sections/             ← Hero, Services (+HealthCheck), Plans, OurWork (+BeforeAfter),
                            WhyChooseUs, Reviews, About, ServiceArea (Colorado map), Contact (+QuoteForm)
    ui/                   ← Button, Reveal (scroll animation), Modal, SectionHeader, CheckItem,
                            SocialLinks, PoolWater (animated hero water)
```

## Pending from the client

- [x] Phone / WhatsApp number and email
- [x] Instagram
- [ ] Facebook page link
- [x] Quote form endpoint (Formspree, `VITE_FORM_ENDPOINT` set in Vercel)
- [ ] Real before & after photos
- [ ] Confirm the Pool Health Check is free and the content of each plan
- [x] Domain: oasispoolsdenver.com (Cloudflare DNS → Vercel). `oasis-pools-six.vercel.app` redirects to it via `vercel.json`
