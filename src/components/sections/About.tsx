import { values } from '../../data/site'
import { Icon } from '../Icon'
import { Reveal } from '../ui/Reveal'

export function About() {
  return (
    <section id="about" className="relative isolate overflow-hidden bg-navy-800 py-16 text-white md:py-28">
      <span className="pointer-events-none absolute -top-64 -right-48 -z-10 size-[700px] rounded-full bg-[radial-gradient(circle,rgb(29_182_234/0.35),transparent_70%)]" />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_520px] lg:gap-20">
        <Reveal className="flex flex-col gap-6">
          <span className="eyebrow text-gold-300">About Oasis Pools</span>
          <h2 className="font-display text-[32px] leading-[1.15] font-bold md:text-[46px]">
            Built on Quality, Honesty &amp; Care
          </h2>
          <p className="text-base leading-relaxed text-white/85 md:text-[19px]">
            Oasis Pools LLC provides professional pool maintenance, cleaning and repair services with quality,
            responsibility and personalized attention. We keep every pool clean, safe and in excellent condition —
            making life easier for our customers and taking care of every detail.
          </p>
          <blockquote className="border-l-[3px] border-gold-300 pl-5 font-display text-lg leading-relaxed text-white/95 italic md:text-xl">
            “Our vision is to become a leading name in pool service in Colorado — recognized for quality,
            professionalism and honesty, and for building lasting relationships as we grow with our community.”
          </blockquote>
        </Reveal>

        <ul className="grid grid-cols-2 gap-3 md:gap-5">
          {values.map((v, i) => (
            <Reveal
              as="li"
              key={v.title}
              delay={i * 90}
              className="flex flex-col gap-3.5 rounded-[20px] border border-white/12 bg-white/[0.06] p-5 transition-colors duration-300 hover:bg-white/10 md:p-6"
            >
              <span className="grid size-12 place-items-center rounded-[14px] bg-gold-300/15 text-gold-300">
                <Icon name={v.icon} size={22} />
              </span>
              <span className="text-lg font-bold md:text-xl">{v.title}</span>
              <span className="text-sm leading-relaxed text-white/70">{v.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
