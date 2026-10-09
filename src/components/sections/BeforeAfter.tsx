import { useState } from 'react'
import { beforeAfter, type BeforeAfterPair } from '../../data/site'
import { Icon } from '../Icon'
import { Reveal } from '../ui/Reveal'

/** Drag (or use the keyboard) to compare the before and after photos. */
function CompareSlider({ pair }: { pair: BeforeAfterPair | null }) {
  const [pos, setPos] = useState(50)

  const layer = (side: 'before' | 'after') =>
    pair ? (
      <img src={pair[side]} alt={`${pair.label} — ${side}`} className="absolute inset-0 size-full object-cover" draggable={false} />
    ) : (
      // Placeholder until the client sends real photos
      <div
        className={`absolute inset-0 grid place-items-center ${
          side === 'before'
            ? 'bg-[linear-gradient(135deg,#6b8454,#4f6b3b)]'
            : 'bg-[linear-gradient(135deg,var(--color-aqua-400),var(--color-ocean-600))]'
        }`}
      >
        <Icon name="image" size={32} className="text-white/60" />
      </div>
    )

  return (
    <div className="relative aspect-[620/340] w-full touch-none overflow-hidden rounded-[20px] select-none">
      {layer('after')}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {layer('before')}
      </div>

      {/* handle */}
      <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-800 shadow-[0_6px_16px_rgb(0_0_0/0.25)]">
          <Icon name="chevronsLeftRight" size={22} strokeWidth={2.4} />
        </span>
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-navy-900/70 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-white">
        BEFORE
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-navy-900/70 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-white">
        AFTER
      </span>

      {/* Native range input = drag, touch and keyboard support for free */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}

export function BeforeAfter() {
  const pair = beforeAfter[0] ?? null
  // Until real photos arrive, the block is only shown while developing.
  if (!pair && !import.meta.env.DEV) return null

  return (
    <Reveal>
      <div className="grid items-center gap-8 rounded-[24px] bg-aqua-50 p-6 md:p-10 md:pl-12 lg:grid-cols-[1fr_620px] lg:gap-12">
        <div className="flex flex-col gap-4">
          <span className="eyebrow text-ocean-600">Before &amp; After</span>
          <h3 className="font-display text-[28px] font-semibold text-navy-800">See the Oasis Difference</h3>
          <p className="text-muted">
            Green pool to crystal clear. Dirty filter to spotless. Stained deck to sealed and fresh. Drag the slider
            to compare real transformations.
          </p>
          {!pair && (
            <p className="w-fit rounded-lg bg-gold-300/30 px-3 py-1.5 text-sm font-medium text-navy-800">
              Placeholder — waiting for client before/after photos (hidden in production)
            </p>
          )}
        </div>
        <CompareSlider pair={pair} />
      </div>
    </Reveal>
  )
}
