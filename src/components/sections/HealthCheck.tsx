import { healthCheckItems } from '../../data/site'
import { prefillQuote } from '../../lib/quoteEvents'
import { Icon } from '../Icon'
import { ButtonLink } from '../ui/Button'
import { CheckItem } from '../ui/CheckItem'
import { Reveal } from '../ui/Reveal'

export function HealthCheck() {
  return (
    <Reveal>
      <div className="relative isolate overflow-hidden rounded-[24px] bg-[linear-gradient(110deg,var(--color-navy-800)_0%,var(--color-ocean-600)_60%,var(--color-aqua-400)_100%)] p-7 text-white md:rounded-[28px] md:p-14 md:pl-16">
        {/* decorative ring */}
        <span className="pointer-events-none absolute -top-36 -right-24 -z-10 size-[420px] animate-float rounded-full border-[60px] border-white/[0.08]" />

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_430px] lg:gap-14">
          <div className="flex flex-col items-start gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-300/20 px-3.5 py-1.5 text-gold-300">
              <Icon name="clipboard" size={15} strokeWidth={2.2} />
              <span className="eyebrow">New customer offer</span>
            </span>
            <h2 className="font-display text-[32px] leading-[1.15] font-bold md:text-[46px]">Free Pool Health Check</h2>
            <p className="text-base leading-relaxed text-white/90 md:text-[19px]">
              Not sure what your pool needs? We’ll inspect your water, equipment and surfaces, then give you an
              honest report and a clear quote — no pressure, no commitment.
            </p>
            <ButtonLink
              href="#quote"
              onClick={() => prefillQuote({ service: 'Free Pool Health Check' })}
              className="max-sm:w-full"
            >
              Book My Free Check
            </ButtonLink>
          </div>

          <div className="rounded-[20px] bg-white p-7 text-ink shadow-[0_20px_40px_-10px_rgb(5_20_51/0.35)] md:p-8">
            <h3 className="mb-4 text-xl font-bold text-navy-800">What we inspect</h3>
            <ul className="flex flex-col gap-3.5">
              {healthCheckItems.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
