import { FaWhatsapp } from 'react-icons/fa'
import { whatsappHref } from '../../lib/contact'
import { useScrolled } from '../../hooks/useScrolled'

/** Floating WhatsApp bubble (tablet & desktop). On phones WhatsApp lives in the sticky bottom bar. */
export function WhatsAppButton() {
  const show = useScrolled(300)
  if (whatsappHref === '#contact') return null

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Oasis Pools on WhatsApp"
      tabIndex={show ? 0 : -1}
      className={`group fixed right-6 bottom-6 z-40 hidden items-center gap-3 transition-all duration-300 md:flex ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 opacity-0 shadow-lift transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        Chat on WhatsApp
      </span>
      <span className="relative grid size-[60px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgb(37_211_102/0.7)] transition-transform duration-200 group-hover:scale-110">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.4s]" />
        <FaWhatsapp size={32} aria-hidden="true" className="relative" />
      </span>
    </a>
  )
}
