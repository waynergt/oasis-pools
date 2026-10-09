import { useState } from 'react'
import { services, type Service } from '../../data/site'
import { prefillQuote } from '../../lib/quoteEvents'
import { Icon } from '../Icon'
import { CheckItem } from '../ui/CheckItem'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { HealthCheck } from './HealthCheck'

function ServiceIcon({ service, small = false }: { service: Service; small?: boolean }) {
  return (
    <span
      className={`ocean-gradient grid shrink-0 place-items-center text-white shadow-[0_8px_18px_-6px_rgb(11_95_203/0.6)] ${
        small ? 'size-11 rounded-xl' : 'size-14 rounded-2xl'
      }`}
    >
      <Icon name={service.icon} size={small ? 22 : 26} />
    </span>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex h-full flex-col gap-5 rounded-[20px] border border-line bg-white p-7 pt-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-aqua-100 hover:shadow-lift">
      <div className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 w-fit">
        <ServiceIcon service={service} />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-2xl font-semibold text-navy-800">{service.title}</h3>
        <p className="text-sm font-medium text-muted">{service.subtitle}</p>
      </div>
      <hr className="border-line" />
      <ul className="flex flex-col gap-3">
        {service.items.map((item) => (
          <CheckItem key={item}>{item}</CheckItem>
        ))}
      </ul>
      <a
        href="#quote"
        onClick={() => prefillQuote({ service: service.quoteOption })}
        className="mt-auto inline-flex items-center gap-2 pt-2 text-[15px] font-semibold text-ocean-600 transition-colors hover:text-navy-800"
      >
        Get a quote
        <Icon name="arrowRight" size={16} strokeWidth={2.4} className="transition-transform group-hover:translate-x-1" />
      </a>
    </article>
  )
}

function ServiceAccordion() {
  const [open, setOpen] = useState(0)

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {services.map((service, i) => {
        const isOpen = open === i
        const panelId = `service-panel-${i}`
        return (
          <div
            key={service.title}
            className={`rounded-[18px] border transition-colors duration-300 ${
              isOpen ? 'border-aqua-100 bg-aqua-50' : 'border-line bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center gap-3.5 p-[18px] text-left"
            >
              <ServiceIcon service={service} small />
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-navy-800">{service.title}</span>
                <span className="block text-sm text-muted">{service.subtitle}</span>
              </span>
              <Icon
                name="chevronDown"
                size={22}
                className={`shrink-0 text-navy-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <ul className="flex flex-col gap-2.5 px-[18px] pb-5">
                  {service.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Services() {
  return (
    <section id="services" className="bg-white py-16 md:py-28">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHeader
          eyebrow="Our Services"
          title="Everything Your Pool Needs, In One Place"
          text="From routine cleaning to equipment repairs and seasonal care, we keep your pool clean, safe and running smoothly all year long."
        />

        <ServiceAccordion />

        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 90} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <HealthCheck />
      </div>
    </section>
  )
}
