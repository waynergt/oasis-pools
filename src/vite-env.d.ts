/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional JSON endpoint for the quote form (Formspree, Web3Forms, own API…). */
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
