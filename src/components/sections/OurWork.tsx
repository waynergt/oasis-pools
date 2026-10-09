import { useCallback, useEffect, useState } from 'react'
import { gallery } from '../../data/site'
import { Icon } from '../Icon'
import { Modal } from '../ui/Modal'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { BeforeAfter } from './BeforeAfter'

/** Bento layout on large screens: first and last photos span two columns. */
const span = (i: number) => (i === 0 || i === gallery.length - 1 ? 'lg:col-span-2' : '')

function Lightbox({ index, onClose, onMove }: { index: number | null; onClose: () => void; onMove: (d: number) => void }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onMove])

  const item = index === null ? null : gallery[index]

  return (
    <Modal open={item !== null} onClose={onClose} labelledBy="lightbox-caption" variant="bare" className="max-w-5xl">
      {item && index !== null && (
        <figure className="relative">
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className="max-h-[78svh] w-full animate-fade-in rounded-2xl object-contain"
          />
          <figcaption id="lightbox-caption" className="mt-4 flex items-center justify-between text-white">
            <span className="text-lg font-semibold">{item.caption}</span>
            <span className="text-sm text-white/70">
              {index + 1} / {gallery.length}
            </span>
          </figcaption>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-3 -right-3 grid size-11 place-items-center rounded-full bg-white text-navy-800 shadow-lg transition-transform hover:scale-110"
          >
            <Icon name="x" size={22} />
          </button>
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onMove(d)}
              aria-label={d < 0 ? 'Previous photo' : 'Next photo'}
              className={`absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-800 shadow-lg transition-transform hover:scale-110 ${
                d < 0 ? 'left-3' : 'right-3'
              }`}
            >
              <Icon name={d < 0 ? 'chevronLeft' : 'chevronRight'} size={24} />
            </button>
          ))}
        </figure>
      )}
    </Modal>
  )
}

export function OurWork() {
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const move = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + gallery.length) % gallery.length)),
    [],
  )

  return (
    <section id="our-work" className="bg-white py-16 md:py-28">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHeader
          eyebrow="Our Work"
          title="Real Pools. Real Results."
          text="A look at some of the pools, spas and equipment our team has cleaned, repaired and maintained."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {gallery.map((item, i) => (
            <Reveal
              key={item.src}
              delay={(i % 3) * 90}
              className={`${span(i)} ${i >= 4 && !showAll ? 'max-md:hidden' : ''}`}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View photo: ${item.caption}`}
                className="group relative block aspect-[11/10] w-full overflow-hidden rounded-2xl bg-aqua-100 md:aspect-auto md:h-[300px] md:rounded-[20px]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-800 backdrop-blur md:bottom-4 md:left-4 md:px-3.5 md:py-2 md:text-[15px]">
                  {item.caption}
                </span>
                <span className="absolute top-3 right-3 hidden size-10 scale-75 place-items-center rounded-full bg-white/90 text-navy-800 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 md:grid">
                  <Icon name="expand" size={18} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {gallery.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="-mt-4 inline-flex items-center justify-center gap-2 self-center font-semibold text-ocean-600 md:hidden"
          >
            {showAll ? 'Show less' : `View all ${gallery.length} projects`}
            <Icon name="chevronDown" size={18} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        )}

        <BeforeAfter />
      </div>

      <Lightbox index={open} onClose={close} onMove={move} />
    </section>
  )
}
