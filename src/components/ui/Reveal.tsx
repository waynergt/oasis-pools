import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'

type RevealProps = {
  children: ReactNode
  /** Delay in ms, handy for staggering cards. */
  delay?: number
  as?: 'div' | 'li'
  className?: string
}

/** Fades & slides its content in the first time it scrolls into view. */
export function Reveal({ children, delay = 0, as = 'div', className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const props = {
    className: `reveal ${visible ? 'is-visible' : ''} ${className}`,
    style: { '--reveal-delay': `${delay}ms` } as CSSProperties,
  }

  return as === 'li' ? (
    <li ref={ref as RefObject<HTMLLIElement | null>} {...props}>
      {children}
    </li>
  ) : (
    <div ref={ref as RefObject<HTMLDivElement | null>} {...props}>
      {children}
    </div>
  )
}
