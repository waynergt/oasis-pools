import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: ReactNode
  text?: ReactNode
  align?: 'center' | 'left'
  dark?: boolean
}

export function SectionHeader({ eyebrow, title, text, align = 'center', dark = false }: Props) {
  const center = align === 'center'
  return (
    <Reveal className={`flex flex-col gap-4 ${center ? 'items-center text-center' : 'items-start text-left'}`}>
      <span className={`eyebrow ${dark ? 'text-gold-300' : 'text-ocean-600'}`}>{eyebrow}</span>
      <h2
        className={`font-display text-[32px] leading-[1.15] font-bold tracking-[-0.01em] md:text-[46px] ${
          dark ? 'text-white' : 'text-navy-800'
        } ${center ? 'max-w-[900px]' : ''}`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`text-base leading-relaxed md:text-[19px] ${dark ? 'text-white/80' : 'text-muted'} ${
            center ? 'max-w-[700px]' : ''
          }`}
        >
          {text}
        </p>
      )}
    </Reveal>
  )
}
