import { business, services, social } from '../../data/site'
import { displayPhone, mailHref, telHref, whatsappHref } from '../../lib/contact'
import { Logo } from '../Logo'
import { SocialLinks } from '../ui/SocialLinks'

const company = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Work', href: '#our-work' },
  { label: 'Maintenance Plans', href: '#plans' },
  { label: 'Service Area', href: '#service-area' },
  { label: 'Free Pool Health Check', href: '#services' },
]

const linkClass = 'text-white/70 transition-colors hover:text-gold-300'

export function Footer() {
  return (
    <footer className="bg-navy-900 pt-16 pb-28 text-white md:pt-20 md:pb-8">
      <div className="container-page flex flex-col gap-12 md:gap-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[360px_1fr_1fr_1.15fr] lg:gap-14">
          <div className="flex flex-col items-start gap-5">
            <a href="#top" className="rounded-2xl bg-white px-4 py-3 transition-transform hover:scale-[1.03]">
              <Logo className="h-16" />
            </a>
            <p className="font-display text-2xl font-bold text-gold-300 italic">{business.tagline}.</p>
            <p className="text-white/70">
              Professional pool cleaning, maintenance and repairs for homes across the Denver metro and the Front Range.
            </p>
            <SocialLinks />
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
                  Call or text {displayPhone()}
                </a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {displayPhone()}
                </a>
              </li>
              {business.email && (
                <li>
                  <a href={mailHref} className={`${linkClass} break-all`}>
                    {business.email}
                  </a>
                </li>
              )}
              {social.instagram && (
                <li>
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Instagram {social.instagramHandle}
                  </a>
                </li>
              )}
              <li className="text-white/70">Based in {business.baseCity}</li>
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
