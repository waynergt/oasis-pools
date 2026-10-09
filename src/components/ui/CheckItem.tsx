import type { ReactNode } from 'react'
import { Icon } from '../Icon'

export function CheckItem({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-[1px] grid size-[22px] shrink-0 place-items-center rounded-full ${
          dark ? 'bg-gold-300/20 text-gold-300' : 'bg-aqua-100 text-ocean-600'
        }`}
      >
        <Icon name="check" size={13} strokeWidth={3} />
      </span>
      <span className={`text-[15px] leading-relaxed md:text-base ${dark ? 'text-white' : 'text-muted'}`}>
        {children}
      </span>
    </li>
  )
}
