import type { ReactNode } from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { business, social } from '../../data/site'
import { displayPhone, isExternal, mailHref, smsHref, telHref, whatsappHref } from '../../lib/contact'
import { Icon } from '../Icon'
import { Reveal } from '../ui/Reveal'
import { QuoteForm } from './QuoteForm'

const quickActions: { icon: ReactNode; label: string; href: string }[] = [
  { icon: <Icon name="phone" size={18} />, label: 'Call', href: telHref },
  { icon: <Icon name="message" size={18} />, label: 'Text', href: smsHref },
  { icon: <FaWhatsapp size={19} aria-hidden="true" />, label: 'WhatsApp', href: whatsappHref },
]

const ext = (href: string) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

type InfoRow = { icon: ReactNode; title: string; text: string; href?: string }

const infoRows: InfoRow[] = [
  { icon: <Icon name="pin" size={20} />, title: 'Service Area', text: business.serviceArea, href: '#service-area' },
  { icon: <Icon name="truck" size={20} />, title: 'We Come to You', text: 'Mobile service — no storefront needed' },
  ...(business.email ? [{ icon: <Icon name="mail" size={20} />, title: 'Email', text: business.email, href: mailHref }] : []),
  ...(social.instagram
    ? [{ icon: <FaInstagram size={20} aria-hidden="true" />, title: 'Instagram', text: social.instagramHandle, href: social.instagram }]
    : []),
]

function Row({ row }: { row: InfoRow }) {
  const body = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300 transition-colors group-hover:bg-gold-300 group-hover:text-navy-900">
        {row.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-bold">{row.title}</span>
        <span className="block truncate text-sm text-white/75">{row.text}</span>
      </span>
    </>
  )
  return (
    <li>
      {row.href ? (
        <a href={row.href} {...ext(row.href)} className="group flex items-center gap-3.5">
          {body}
        </a>
      ) : (
        <span className="flex items-center gap-3.5">{body}</span>
      )}
    </li>
  )
}

export function Contact() {
  return (
    <section id="contact" className="bg-white py-16 md:py-28">
      <div className="container-page grid gap-6 lg:grid-cols-[520px_1fr] lg:gap-8">
        <Reveal className="h-full">
          <div className="relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-[24px] bg-[linear-gradient(150deg,var(--color-navy-900),var(--color-ocean-600))] p-6 text-white md:rounded-[28px] md:p-12">
            <span className="pointer-events-none absolute -right-20 -bottom-24 -z-10 size-72 rounded-full border-[48px] border-white/[0.06]" />

            <span className="eyebrow text-gold-300">Contact Us</span>
            <h2 className="font-display text-[32px] leading-[1.15] font-bold md:text-[46px]">Need Pool Service?</h2>
            <p className="text-white/85 md:text-[19px]">
              Call, text or WhatsApp us today for a free estimate. We come to you — anywhere in Colorado.
            </p>

            <a href={telHref} className="group w-fit">
              <span className="block text-sm text-white/70">Call or Text</span>
              <span className="font-display text-[32px] font-bold text-gold-300 transition-colors group-hover:text-white md:text-4xl">
                {displayPhone()}
              </span>
            </a>

            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  {...ext(a.href)}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-[14px] border py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 md:flex-row md:gap-2 md:text-[15px] ${
                    a.label === 'WhatsApp'
                      ? 'border-transparent bg-[#25D366] text-white hover:bg-[#1ebe5a]'
                      : 'border-white/25 bg-white/10 hover:border-gold-300 hover:bg-white/15 [&>svg]:text-gold-300'
                  }`}
                >
                  {a.icon}
                  {a.label}
                </a>
              ))}
            </div>

            <hr className="border-white/15" />

            <ul className="flex flex-col gap-4">
              {infoRows.map((row) => (
                <Row key={row.title} row={row} />
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-3">
              <p className="flex items-center gap-2 text-sm text-white/80">
                <Icon name="card" size={16} className="text-gold-300" />
                Payment methods we accept
              </p>
              <ul className="flex flex-wrap gap-2">
                {business.payments.map((p) => (
                  <li key={p} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-navy-800">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  )
}
