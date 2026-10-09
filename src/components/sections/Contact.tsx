import { business } from '../../data/site'
import { displayPhone, smsHref, telHref, whatsappHref } from '../../lib/contact'
import { Icon, type IconName } from '../Icon'
import { Reveal } from '../ui/Reveal'
import { QuoteForm } from './QuoteForm'

const quickActions: { icon: IconName; label: string; href: string }[] = [
  { icon: 'phone', label: 'Call', href: telHref },
  { icon: 'message', label: 'Text', href: smsHref },
  { icon: 'whatsapp', label: 'WhatsApp', href: whatsappHref },
]

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
              Call or text us today for a free estimate. We come to you — anywhere in Colorado.
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
                  {...(a.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-[14px] border border-white/25 bg-white/10 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:bg-white/15 md:flex-row md:gap-2 md:text-[15px]"
                >
                  <Icon name={a.icon} size={18} className="text-gold-300" />
                  {a.label}
                </a>
              ))}
            </div>

            <hr className="border-white/15" />

            <ul className="flex flex-col gap-4">
              {(
                [
                  ['pin', 'Service Area', business.serviceArea],
                  ['truck', 'We Come to You', 'Mobile service — no storefront needed'],
                ] as const
              ).map(([icon, title, text]) => (
                <li key={title} className="flex items-center gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300">
                    <Icon name={icon} size={20} />
                  </span>
                  <span>
                    <span className="block text-lg font-bold">{title}</span>
                    <span className="block text-sm text-white/75">{text}</span>
                  </span>
                </li>
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
