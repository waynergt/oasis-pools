import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { quoteOptions } from '../../data/site'
import { onPrefillQuote } from '../../lib/quoteEvents'
import { submitQuote, type QuoteRequest } from '../../lib/submitQuote'
import { track } from '../../lib/analytics'
import { Icon } from '../Icon'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

type Errors = Partial<Record<keyof QuoteRequest, string>>

const empty: QuoteRequest = { name: '', phone: '', zip: '', service: '', message: '' }

function validate(v: QuoteRequest): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (v.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a valid phone number.'
  if (!/^\d{5}$/.test(v.zip.trim())) e.zip = 'Please enter a 5-digit ZIP code.'
  if (!v.service) e.service = 'Please choose an option.'
  return e
}

/** Formats as the user types: (720) 555-0123 */
function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

const inputBase =
  'w-full rounded-xl border bg-surface px-[18px] py-4 text-base text-ink placeholder:text-muted/70 transition-all duration-200 outline-none focus:border-ocean-600 focus:bg-white focus:ring-4 focus:ring-aqua-400/20'

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[15px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="animate-fade-in text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function QuoteForm() {
  const id = useId()
  const [values, setValues] = useState<QuoteRequest>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [highlight, setHighlight] = useState(false)
  const honeypot = useRef<HTMLInputElement>(null)

  // Buttons like "Choose Complete" pre-fill the form
  useEffect(
    () =>
      onPrefillQuote(({ service, note }) => {
        setValues((v) => ({ ...v, service, message: note ?? v.message }))
        setErrors((e) => ({ ...e, service: undefined }))
        setHighlight(true)
        window.setTimeout(() => setHighlight(false), 1600)
      }),
    [],
  )

  const set = (key: keyof QuoteRequest) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (honeypot.current?.value) return // bot
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitQuote(values)
      track('generate_lead', { service: values.service })
      setStatus('sent')
      setValues(empty)
    } catch {
      setStatus('error')
    }
  }

  const err = (k: keyof QuoteRequest) =>
    errors[k] ? `border-red-400 focus:border-red-500 focus:ring-red-400/20` : 'border-line-strong'
  const aria = (k: keyof QuoteRequest) => ({
    'aria-invalid': !!errors[k] || undefined,
    'aria-describedby': errors[k] ? `${id}-${k}-error` : undefined,
  })

  return (
    <>
      <form
        id="quote"
        noValidate
        onSubmit={onSubmit}
        className={`flex scroll-mt-28 flex-col gap-5 rounded-[28px] border bg-white p-6 shadow-[0_24px_60px_-20px_rgb(10_42_92/0.2)] transition-all duration-500 md:p-12 ${
          highlight ? 'border-gold-300 ring-4 ring-gold-300/40' : 'border-line'
        }`}
      >
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-[28px] font-semibold text-navy-800">Get Your Free Quote</h3>
          <p className="text-muted">Tell us about your pool and we’ll get back to you with a free estimate.</p>
        </div>

        <Field label="Full name" htmlFor={`${id}-name`} error={errors.name}>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            placeholder="John Smith"
            value={values.name}
            onChange={(e) => set('name')(e.target.value)}
            className={`${inputBase} ${err('name')}`}
            {...aria('name')}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
          <Field label="Phone" htmlFor={`${id}-phone`} error={errors.phone}>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(303) 555-0123"
              value={values.phone}
              onChange={(e) => set('phone')(formatPhone(e.target.value))}
              className={`${inputBase} ${err('phone')}`}
              {...aria('phone')}
            />
          </Field>
          <Field label="ZIP code" htmlFor={`${id}-zip`} error={errors.zip}>
            <input
              id={`${id}-zip`}
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="80012"
              maxLength={5}
              value={values.zip}
              onChange={(e) => set('zip')(e.target.value.replace(/\D/g, ''))}
              className={`${inputBase} ${err('zip')}`}
              {...aria('zip')}
            />
          </Field>
        </div>

        <Field label="What does your pool need?" htmlFor={`${id}-service`} error={errors.service}>
          <div className="relative">
            <select
              id={`${id}-service`}
              name="service"
              value={values.service}
              onChange={(e) => set('service')(e.target.value)}
              className={`${inputBase} ${err('service')} cursor-pointer appearance-none pr-12 ${
                values.service ? '' : 'text-muted/70'
              }`}
              {...aria('service')}
            >
              <option value="" disabled>
                Select a service…
              </option>
              {quoteOptions.map((o) => (
                <option key={o} value={o} className="text-ink">
                  {o}
                </option>
              ))}
            </select>
            <Icon
              name="chevronDown"
              size={20}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted"
            />
          </div>
        </Field>

        <Field label="Tell us more (optional)" htmlFor={`${id}-message`}>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            placeholder="Pool size, current condition, best time to call…"
            value={values.message}
            onChange={(e) => set('message')(e.target.value)}
            className={`${inputBase} border-line-strong resize-y`}
          />
        </Field>

        {/* Hidden field that only bots fill in */}
        <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        {status === 'error' && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            Something went wrong sending your request. Please try again or call us directly.
          </p>
        )}

        <Button type="submit" full disabled={status === 'sending'} arrow={status !== 'sending'}>
          {status === 'sending' ? (
            <>
              <Icon name="loader" size={18} strokeWidth={2.6} className="animate-spin" />
              Sending…
            </>
          ) : (
            'Get My Free Quote'
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-sm font-medium text-muted">
          <Icon name="lock" size={14} />
          Your information is never shared.
        </p>
      </form>

      <Modal open={status === 'sent'} onClose={() => setStatus('idle')} labelledBy="quote-sent-title" variant="sheet">
        <div className="flex flex-col items-center gap-4 bg-white px-7 pt-10 pb-10 text-center md:rounded-[28px] md:px-12 md:pt-12 max-md:rounded-t-[28px]">
          <span className="grid size-20 animate-pop-in place-items-center rounded-full bg-aqua-100 text-ocean-600">
            <Icon name="check" size={40} strokeWidth={2.6} />
          </span>
          <h2 id="quote-sent-title" className="font-display text-[32px] font-bold text-navy-800 md:text-[40px]">
            Thank you!
          </h2>
          <p className="text-muted md:text-lg">
            We received your request. Oasis Pools will contact you shortly with your free estimate.
          </p>
          <Button variant="navy" arrow={false} onClick={() => setStatus('idle')} className="mt-2 max-md:w-full">
            Back to site
          </Button>
        </div>
      </Modal>
    </>
  )
}
