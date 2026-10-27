/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional JSON endpoint for the quote form (Formspree, Web3Forms, own API…). */
  readonly VITE_FORM_ENDPOINT?: string
  /** Public site URL (custom domain). Defaults to the Vercel URL — see vite.config.ts. */
  readonly VITE_SITE_URL?: string
  /** Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX. Empty = analytics off. */
  readonly VITE_GA_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Public site URL without trailing slash, injected by vite.config.ts. */
declare const __SITE_URL__: string
