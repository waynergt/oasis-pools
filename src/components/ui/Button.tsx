import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import { isExternal } from '../../lib/contact'

type Variant = 'primary' | 'navy' | 'outline-light' | 'outline-navy'
type Size = 'md' | 'sm'

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua-400/40 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'gold-gradient text-navy-900 hover:-translate-y-0.5 hover:shadow-gold',
  navy: 'bg-navy-800 text-white hover:-translate-y-0.5 hover:bg-ocean-600 hover:shadow-[0_8px_20px_-6px_rgb(11_95_203/0.55)]',
  'outline-light': 'border-[1.5px] border-white/70 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20',
  'outline-navy': 'border-[1.5px] border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white',
}

const sizes: Record<Size, string> = {
  md: 'px-7 py-4 text-base',
  sm: 'px-5 py-3 text-[15px]',
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; full?: boolean; children: ReactNode }

function classes({ variant = 'primary', size = 'md', full }: Common, extra = '') {
  return [base, variants[variant], sizes[size], full ? 'w-full' : '', extra].join(' ')
}

function Arrow() {
  return (
    <Icon
      name="arrowRight"
      size={18}
      strokeWidth={2.4}
      className="transition-transform duration-200 group-hover:translate-x-1"
    />
  )
}

export function ButtonLink({
  variant,
  size,
  arrow = true,
  full,
  children,
  className = '',
  href = '#',
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = isExternal(href)
  return (
    <a
      href={href}
      className={classes({ variant, size, full, children }, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {arrow && <Arrow />}
    </a>
  )
}

export function Button({
  variant,
  size,
  arrow = true,
  full,
  children,
  className = '',
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, full, children }, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}
