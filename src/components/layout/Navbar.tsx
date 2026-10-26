import { useCallback, useState } from 'react'
import { business, navLinks } from '../../data/site'
import { displayPhone, telHref } from '../../lib/contact'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { Icon } from '../Icon'
import { Logo } from '../Logo'
import { ButtonLink } from '../ui/Button'
import { MobileMenu } from './MobileMenu'

const sectionIds = navLinks.map((l) => l.id)

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const scrolled = useScrolled(40)
  const active = useActiveSection(sectionIds)

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'border-transparent shadow-[0_8px_30px_-12px_rgb(10_42_92/0.25)]' : 'border-line'
        }`}
      >
        <nav
          aria-label="Main"
          className={`container-page flex items-center justify-between transition-[padding] duration-300 ${
            scrolled ? 'py-2' : 'py-3 md:py-4'
          }`}
        >
          <a href="#top" aria-label={`${business.name} — back to top`} className="shrink-0">
            <Logo
              className={`transition-[height] duration-300 ${scrolled ? 'h-11 md:h-[60px]' : 'h-12 md:h-[76px]'}`}
            />
          </a>

          <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`relative py-2 text-[15px] font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold-500 after:transition-transform after:duration-300 hover:text-ocean-600 ${
                    active === link.id ? 'text-ocean-600 after:scale-x-100' : 'text-ink after:scale-x-0'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 md:gap-6">
            <a href={telHref} className="group hidden items-center gap-2.5 md:flex">
              <span className="grid size-10 place-items-center rounded-full bg-aqua-50 text-ocean-600 transition-colors group-hover:bg-ocean-600 group-hover:text-white">
                <Icon name="phone" size={18} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-medium text-muted">Call or Text</span>
                <span className="block text-lg font-bold text-navy-800">{displayPhone()}</span>
              </span>
            </a>

            <span className="hidden sm:block">
              <ButtonLink href="#quote" variant="navy" size="sm" arrow={false}>
                Free Quote
              </ButtonLink>
            </span>

            <a
              href={telHref}
              aria-label="Call us"
              className="grid size-11 place-items-center rounded-xl bg-aqua-50 text-ocean-600 md:hidden"
            >
              <Icon name="phone" size={20} />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-xl bg-navy-800 text-white transition-colors hover:bg-ocean-600 lg:hidden"
            >
              <Icon name="menu" size={22} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
