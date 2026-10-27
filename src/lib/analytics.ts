/**
 * Google Analytics 4 (only loads when VITE_GA_ID is set, e.g. in Vercel → Environment Variables).
 *
 * Events sent (visible in GA4 → Reports → Engagement → Events; mark the first ones as "key events"):
 *  - generate_lead   quote form sent successfully (param: service)
 *  - click_call      tap on any phone link
 *  - click_text      tap on any SMS link
 *  - click_whatsapp  tap on any WhatsApp link
 *  - click_email     tap on the email link
 *  - click_social    tap on Instagram / Facebook
 */
type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

const GA_ID = import.meta.env.VITE_GA_ID?.trim()

export function track(event: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', event, params)
}

function linkEvent(href: string): string | null {
  if (href.startsWith('tel:')) return 'click_call'
  if (href.startsWith('sms:')) return 'click_text'
  if (href.startsWith('mailto:')) return 'click_email'
  if (href.includes('wa.me/') || href.includes('whatsapp.com')) return 'click_whatsapp'
  if (href.includes('instagram.com') || href.includes('facebook.com')) return 'click_social'
  return null
}

export function initAnalytics() {
  if (!GA_ID || typeof window === 'undefined' || window.gtag) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  // gtag must push the `arguments` object itself
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)

  // One listener for every contact link on the page (navbar, hero, contact card, footer, sticky bar…)
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const event = linkEvent(a.getAttribute('href') || '')
      if (event) track(event, { link_text: a.textContent?.trim().slice(0, 60) || a.getAttribute('aria-label') || '' })
    },
    { capture: true },
  )
}
