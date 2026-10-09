import { business, services } from '../../data/site'
import { displayPhone, telHref } from '../../lib/contact'
import { Logo } from '../Logo'

const company = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Work', href: '#our-work' },
  { label: 'Maintenance Plans', href: '#plans' },
  { label: 'Free Pool Health Check', href: '#services' },
]

const linkClass = 'text-white/70 transition-colors hover:text-gold-300'

export function Footer() {
  return (
    <footer className="bg-navy-900 pt-16 pb-28 text-white md:pt-20 md:pb-8">
      <div className="container-page flex flex-col gap-12 md:gap-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[380px_1fr_1fr_1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <a href="#top" className="rounded-2xl bg-white px-4 py-3 transition-transform hover:scale-[1.03]">
              <Logo className="h-16" />
            </a>
            <p className="font-display text-2xl font-bold text-gold-300 italic">{business.tagline}.</p>
            <p className="text-white/70">
              Professional pool cleaning, maintenance and repairs for homes across Colorado.
            </p>
          </div>

          <nav aria-label="Services">
            <h3 className="mb-4 text-lg font-bold">Services</h3>
            <ul className="flex flex-col gap-3.5">
              {services.map((s) => (
                <li key={s.title}>
                  <a href="#services" className={linkClass}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="mb-4 text-lg font-bold">Company</h3>
            <ul className="flex flex-col gap-3.5">
              {company.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a href={telHref} className={linkClass}>
                  {displayPhone()}
                </a>
              </li>
              <li>
                {business.email ? (
                  <a href={`mailto:${business.email}`} className={linkClass}>
                    {business.email}
                  </a>
                ) : (
                  <span className="text-white/70">Email — coming soon</span>
                )}
              </li>
              <li className="text-white/70">Serving all of Colorado</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-white/12 pt-6 text-sm text-white/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} {business.legalName}. All rights reserved.
          </p>
          <p>{business.payments.join(' · ')}</p>
        </div>
      </div>
    </footer>
  )
}
