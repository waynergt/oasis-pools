import type { QuoteOption } from '../data/site'

export type QuotePrefill = { service: QuoteOption; note?: string }

const EVENT = 'oasis:prefill-quote'

/**
 * Called by any "Get a quote" button: the quote form listens and pre-selects
 * the matching service, so the visitor doesn't have to pick it again.
 */
export function prefillQuote(detail: QuotePrefill) {
  window.dispatchEvent(new CustomEvent<QuotePrefill>(EVENT, { detail }))
}

export function onPrefillQuote(handler: (detail: QuotePrefill) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<QuotePrefill>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
