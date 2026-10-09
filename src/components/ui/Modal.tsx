import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

type ModalProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  /** "center" = dialog card, "sheet" = slides up from the bottom on phones. */
  variant?: 'center' | 'sheet' | 'bare'
  className?: string
}

export function Modal({ open, onClose, labelledBy, children, variant = 'center', className = '' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [open])

  if (!open) return null

  const layout =
    variant === 'sheet'
      ? 'items-end md:items-center'
      : variant === 'bare'
        ? 'items-center p-4 md:p-10'
        : 'items-center p-5'

  const panel =
    variant === 'sheet'
      ? 'w-full animate-slide-up rounded-t-[28px] md:max-w-[520px] md:animate-pop-in md:rounded-[28px]'
      : variant === 'bare'
        ? 'w-full animate-pop-in'
        : 'w-full max-w-[520px] animate-pop-in rounded-[28px]'

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex justify-center bg-navy-900/60 backdrop-blur-sm animate-fade-in ${layout}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`outline-none ${panel} ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
