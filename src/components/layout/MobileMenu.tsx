import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { business, navLinks } from '../../data/site'
import { displayPhone, telHref } from '../../lib/contact'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { Icon } from '../Icon'
import { Logo } from '../Logo'
import { ButtonLink } from '../ui/Button'
import { SocialLinks } from '../ui/SocialLinks'

const links = [
  ...navLinks.filter((l) => l.id !== 'about' && l.id !== 'contact'),
  { id: 'why-us', label: 'Why Choose Us' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 animate-fade-in bg-navy-900/50 backdrop-blur-sm" onClick={onClose} />

      <div
        id="mobile-menu"
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] animate-slide-in-right flex-col gap-6 overflow-y-auto bg-navy-900 px-6 pt-3.5 pb-10"
      >
        <div className="flex items-center justify-between">
          <a href="#top" onClick={onClose} className="rounded-xl bg-white px-3 py-1.5">
            <Logo className="h-10" />
          </a>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Icon name="x" size={22} />
          </button>
        </div>

        <ul className="flex flex-col">
          {links.map((link, i) => (
            <li key={link.id} className="animate-pop-in" style={{ animationDelay: `${80 + i * 45}ms` }}>
              <a
                href={`#${link.id}`}
                onClick={onClose}
                className="flex items-center justify-between border-b border-white/10 py-3.5 font-display text-[26px] font-semibold text-white transition-colors hover:text-gold-300"
              >
                {link.label}
                <Icon name="chevronRight" size={22} className="text-gold-300" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-5">
          <a href={telHref} onClick={onClose}>
            <span className="block text-sm text-white/70">Call or Text</span>
            <span className="font-display text-4xl font-bold text-gold-300">{displayPhone()}</span>
          </a>
          <ButtonLink href="#quote" onClick={onClose} full>
            Get a Free Quote
          </ButtonLink>
          <div className="flex items-center justify-between gap-4">
            <SocialLinks />
            <p className="text-right text-sm text-white/60">{business.payments.join(' · ')}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
