import { images, reasons } from '../../data/site'
import { Icon } from '../Icon'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-surface py-16 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[500px_1fr] lg:gap-[72px]">
        <Reveal className="relative order-2 lg:order-1">
          <img
            src={images.equipment}
            alt="Pool equipment pad installed by Oasis Pools: heater, pumps, valves and cartridge filter"
            loading="lazy"
            className="aspect-[5/6] w-full rounded-[28px] object-cover max-lg:aspect-[4/3]"
          />
          <div className="absolute -bottom-6 left-4 flex animate-float items-center gap-3.5 rounded-[18px] bg-white py-4 pr-6 pl-4 shadow-lift md:-left-8">
            <span className="grid size-12 place-items-center rounded-[14px] bg-gold-300/30 text-gold-500">
              <Icon name="shield" size={22} />
            </span>
            <span>
              <span className="block text-lg font-bold text-navy-800">Equipment done right</span>
              <span className="block text-sm text-muted">Pumps, filters, heaters &amp; plumbing</span>
            </span>
          </div>
        </Reveal>

        <div className="order-1 flex flex-col gap-10 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow="Why Choose Us"
            title="Pool Care Done Right, Every Single Visit"
            text="We treat every pool like it’s our own. Our team focuses on residential pools, spas and hot tubs — with clear communication and results you can see."
          />
          <ul className="grid gap-x-7 gap-y-6 sm:grid-cols-2 md:gap-y-8">
            {reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={(i % 2) * 90} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-aqua-100 text-ocean-600 md:size-[52px]">
                  <Icon name={r.icon} size={24} />
                </span>
                <span>
                  <span className="block text-lg font-bold text-navy-800 md:text-xl">{r.title}</span>
                  <span className="block text-sm leading-relaxed text-muted">{r.text}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
