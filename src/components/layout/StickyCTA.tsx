import { FaWhatsapp } from 'react-icons/fa'
import { telHref, whatsappHref } from '../../lib/contact'
import { useScrolled } from '../../hooks/useScrolled'
import { Icon } from '../Icon'
import { ButtonLink } from '../ui/Button'

/** Fixed "Call / WhatsApp / Free Quote" bar on phones. Slides in after the visitor starts scrolling. */
export function StickyCTA() {
  const show = useScrolled(420)
  const tab = show ? 0 : -1

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-line bg-white/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgb(5_26_59/0.12)] backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <ButtonLink href={telHref} variant="navy" size="sm" arrow={false} full tabIndex={tab}>
        <Icon name="phone" size={18} />
        Call
      </ButtonLink>
      {whatsappHref !== '#contact' && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          tabIndex={tab}
          className="grid aspect-square shrink-0 place-items-center rounded-full bg-[#25D366] px-3 text-white transition-transform active:scale-95"
        >
          <FaWhatsapp size={24} aria-hidden="true" />
        </a>
      )}
      <ButtonLink href="#quote" size="sm" arrow={false} full tabIndex={tab}>
        Free Quote
      </ButtonLink>
    </div>
  )
}
