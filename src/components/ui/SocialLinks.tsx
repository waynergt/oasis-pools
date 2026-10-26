import type { IconType } from 'react-icons'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { social } from '../../data/site'
import { whatsappHref } from '../../lib/contact'

type Item = { label: string; href: string; Icon: IconType; hover: string }

/** Only networks with a link are shown (Facebook stays hidden until `social.facebook` is filled in). */
export const socialItems: Item[] = (
  [
    { label: 'Instagram', href: social.instagram, Icon: FaInstagram, hover: 'hover:bg-[#E1306C]' },
    { label: 'Facebook', href: social.facebook, Icon: FaFacebookF, hover: 'hover:bg-[#1877F2]' },
    { label: 'WhatsApp', href: whatsappHref, Icon: FaWhatsapp, hover: 'hover:bg-[#25D366]' },
  ] satisfies Item[]
).filter((i) => i.href && i.href !== '#contact')

type Props = {
  /** "dark" = on navy backgrounds, "light" = on white backgrounds. */
  tone?: 'dark' | 'light'
  size?: 'sm' | 'md'
  className?: string
}

export function SocialLinks({ tone = 'dark', size = 'md', className = '' }: Props) {
  const box = size === 'sm' ? 'size-8' : 'size-11'
  const icon = size === 'sm' ? 15 : 19
  const colors =
    tone === 'dark'
      ? 'bg-white/10 text-white ring-1 ring-white/15 hover:ring-transparent'
      : 'bg-aqua-50 text-navy-800 hover:text-white'

  return (
    <ul className={`flex items-center gap-2.5 ${className}`}>
      {socialItems.map(({ label, href, Icon, hover }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Oasis Pools on ${label}`}
            title={label}
            className={`grid ${box} place-items-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:text-white ${colors} ${hover}`}
          >
            <Icon size={icon} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}
