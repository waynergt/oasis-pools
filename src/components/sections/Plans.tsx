import { useEffect, useRef, useState } from 'react'
import { frequencies, plans, type Frequency, type Plan } from '../../data/site'
import { prefillQuote } from '../../lib/quoteEvents'
import { ButtonLink } from '../ui/Button'
import { CheckItem } from '../ui/CheckItem'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

function FrequencyToggle({ value, onChange }: { value: Frequency; onChange: (f: Frequency) => void }) {
  const index = frequencies.findIndex((f) => f.id === value)
  return (
    <div
      role="radiogroup"
      aria-label="Visit frequency"
      className="relative grid w-full max-w-[380px] grid-cols-3 rounded-full border border-line bg-white p-1.5"
    >
      {/* sliding pill */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1.5 left-1.5 w-[calc((100%-12px)/3)] rounded-full bg-navy-800 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {frequencies.map((f) => {
        const active = f.id === value
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(f.id)}
            className={`relative z-10 rounded-full py-2.5 text-[15px] font-semibold transition-colors duration-300 ${
              active ? 'text-white' : 'text-muted hover:text-navy-800'
            }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

function PlanCard({ plan, frequency }: { plan: Plan; frequency: Frequency }) {
  const dark = !!plan.featured
  const price = plan.price[frequency]
  const freqLabel = frequencies.find((f) => f.id === frequency)!.label

  return (
    <article
      className={`flex h-full flex-col gap-5 rounded-[24px] p-6 transition-all duration-300 md:p-9 ${
        dark
          ? 'bg-navy-800 text-white shadow-[0_28px_56px_-16px_rgb(5_26_59/0.55)] lg:-my-4 lg:py-12'
          : 'border border-line bg-white hover:-translate-y-1 hover:shadow-lift'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className={`font-display text-[28px] font-semibold ${dark ? 'text-white' : 'text-navy-800'}`}>
          {plan.name}
        </h3>
        {dark && (
          <span className="gold-gradient rounded-full px-3 py-1.5 text-[11px] font-extrabold tracking-[0.14em] text-navy-900 uppercase">
            Most Popular
          </span>
        )}
      </div>

      <p className={dark ? 'text-white/80' : 'text-muted'}>{plan.description}</p>

      <div className="flex items-baseline gap-2">
        {/* key forces a small re-animation when the frequency changes */}
        <span
          key={frequency}
          className={`animate-pop-in font-display text-5xl leading-none font-bold tracking-tight ${
            dark ? 'text-gold-300' : 'text-navy-800'
          }`}
        >
          {price === null ? '$XX' : `$${price}`}
        </span>
        <span className={dark ? 'text-white/80' : 'text-muted'}>/ visit · {freqLabel.toLowerCase()}</span>
      </div>

      <hr className={dark ? 'border-white/15' : 'border-line'} />

      <ul className="flex flex-1 flex-col gap-3.5">
        {plan.features.map((f) => (
          <CheckItem key={f} dark={dark}>
            {f}
          </CheckItem>
        ))}
      </ul>

      <ButtonLink
        href="#quote"
        variant={dark ? 'primary' : 'outline-navy'}
        full
        onClick={() =>
          prefillQuote({
            service: 'Weekly / Biweekly / Monthly Maintenance',
            note: `I'm interested in the ${plan.name} plan (${freqLabel.toLowerCase()} visits).`,
          })
        }
      >
        Choose {plan.name}
      </ButtonLink>
    </article>
  )
}

export function Plans() {
  const [frequency, setFrequency] = useState<Frequency>('weekly')
  const scroller = useRef<HTMLDivElement>(null)
  const featuredIndex = Math.max(0, plans.findIndex((p) => p.featured))
  const [slide, setSlide] = useState(featuredIndex)

  // On phones, start the carousel on the featured plan.
  useEffect(() => {
    const el = scroller.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const card = el.children[featuredIndex] as HTMLElement | undefined
    if (card) el.scrollLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2
  }, [featuredIndex])

  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setSlide(best)
  }

  const goTo = (i: number) => {
    const el = scroller.current
    const card = el?.children[i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <section id="plans" className="bg-surface py-16 md:py-28">
      <div className="container-page flex flex-col items-center gap-8 md:gap-10">
        <SectionHeader
          eyebrow="Maintenance Plans"
          title="Choose the Care Your Pool Needs"
          text="Pick the level of care and the visit frequency that fits your pool. Not sure where to start? Book a free Pool Health Check."
        />

        <Reveal className="flex w-full justify-center">
          <FrequencyToggle value={frequency} onChange={setFrequency} />
        </Reveal>

        <div
          ref={scroller}
          onScroll={onScroll}
          className="no-scrollbar -mx-6 flex w-[calc(100%+48px)] snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 py-6 md:mx-0 md:grid md:w-full md:snap-none md:grid-cols-3 md:items-stretch md:gap-6 md:overflow-visible md:px-0"
        >
          {plans.map((plan, i) => (
            <Reveal
              key={plan.name}
              delay={i * 100}
              className="w-[82%] shrink-0 snap-center md:w-auto"
            >
              <PlanCard plan={plan} frequency={frequency} />
            </Reveal>
          ))}
        </div>

        {/* carousel dots (phones only) */}
        <div className="-mt-4 flex items-center gap-2 md:hidden" aria-label="Plans carousel">
          {plans.map((plan, i) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${plan.name} plan`}
              aria-current={slide === i}
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === i ? 'w-6 bg-navy-800' : 'w-2 bg-line-strong'
              }`}
            />
          ))}
        </div>

        <p className="text-center text-sm font-medium text-muted">
          Pricing depends on pool size and condition — your final price is confirmed with a free estimate.
        </p>
      </div>
    </section>
  )
}
