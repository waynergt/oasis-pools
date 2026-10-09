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
| `npm run build`     | Type-checks and builds the site into `dist/`  |
| `npm run preview`   | Serves the production build locally           |
| `npm run typecheck` | Type-check only                               |

## Where to change things

Almost everything the client may ask to change lives in **`src/data/site.ts`**:

- `business.phone`, `business.whatsapp`, `business.email` — once filled in, every Call / Text / WhatsApp
  button, the navbar, contact card, footer and Google structured data update automatically.
- `plans[].price` — prices per visit for weekly / biweekly / monthly (`null` shows `$XX`).
- `services`, `reasons`, `values`, `healthCheckItems` — page copy.
- `gallery` — photos for **Our Work** (files in `src/assets/img/`).
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

## Project structure

```
src/
  data/site.ts            ← business info & all page copy
  lib/                    ← contact links, form submit, quote pre-fill events
  hooks/                  ← active section, scroll state, body scroll lock
  components/
    layout/               ← TopBar, Navbar, MobileMenu, Footer, StickyCTA
    sections/             ← Hero, Services (+HealthCheck), Plans, OurWork (+BeforeAfter),
                            WhyChooseUs, About, Contact (+QuoteForm)
    ui/                   ← Button, Reveal (scroll animation), Modal, SectionHeader, CheckItem
```

## Pending from the client

- [ ] Phone / WhatsApp number and email
- [ ] Plan prices
- [ ] Real before & after photos
- [ ] Confirm the Pool Health Check is free and the content of each plan
- [ ] Domain / hosting (the `dist/` folder deploys as-is to Netlify, Vercel, Cloudflare Pages…)
