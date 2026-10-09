export type QuoteRequest = {
  name: string
  phone: string
  zip: string
  service: string
  message: string
}

/**
 * Sends the quote request.
 *
 * Set VITE_FORM_ENDPOINT in a `.env` file to any service that accepts a JSON
 * POST (Formspree, Getform, Web3Forms, your own API…). Example:
 *   VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
 *
 * Without it (local development) the request is only logged to the console.
 */
export async function submitQuote(data: QuoteRequest): Promise<void> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    console.info('[Oasis Pools] Quote request (no VITE_FORM_ENDPOINT set):', data)
    return
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...data, _subject: `New quote request — ${data.name}` }),
  })

  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}
