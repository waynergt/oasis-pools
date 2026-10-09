import { business, images, trustItems } from '../../data/site'
import { telHref } from '../../lib/contact'
import { Icon } from '../Icon'
import { ButtonLink } from '../ui/Button'

export function Hero() {
  return (
    <section aria-label="Introduction" className="relative isolate overflow-hidden bg-navy-900 text-white">
      {/* Background photo with a slow zoom */}
      <img
        src={images.hero}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full origin-center animate-[hero-zoom_18s_ease-out_both] object-cover object-[60%_center]"
      />
      {/* Readability overlays (same as the mockup) */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(6_26_58/0.94)_0%,rgb(6_26_58/0.62)_55%,rgb(6_26_58/0.08)_100%)] max-md:bg-[linear-gradient(180deg,rgb(6_26_58/0.6)_0%,rgb(6_26_58/0.92)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-navy-900/75 to-transparent" />

      <div className="container-page flex min-h-[calc(100svh-81px)] flex-col justify-between gap-10 pt-14 pb-8 md:min-h-[690px] md:pt-28 md:pb-12">
        <div className="flex max-w-[700px] flex-col gap-6 md:gap-7">
          <p className="flex animate-pop-in items-center gap-3 text-gold-300">
            <span className="h-0.5 w-6 bg-gold-300 md:w-9" />
            <span className="eyebrow">{business.tagline}</span>
          </p>

          <h1
            className="animate-pop-in font-display text-[40px] leading-[1.1] font-bold tracking-[-0.015em] md:text-[64px] md:leading-[1.08]"
            style={{ animationDelay: '80ms' }}
          >
            Professional Pool Care <em className="text-gold-300">You Can Count On</em>
          </h1>

          <p
            className="max-w-[620px] animate-pop-in text-base leading-relaxed text-white/90 md:text-[19px]"
            style={{ animationDelay: '160ms' }}
          >
            Reliable pool cleaning, maintenance &amp; repairs for homes in Aurora, Denver and across Colorado — so
            you can simply enjoy your pool.
          </p>

          <div
            className="flex animate-pop-in flex-col gap-3 sm:flex-row sm:gap-4"
            style={{ animationDelay: '240ms' }}
          >
            <ButtonLink href="#quote">Get a Free Quote</ButtonLink>
            <ButtonLink href={telHref} variant="outline-light" arrow={false}>
              <Icon name="phone" size={18} />
              Call or Text Us
            </ButtonLink>
          </div>
        </div>

        {/* Glass trust panel */}
        <ul
          className="grid animate-pop-in grid-cols-2 gap-2.5 rounded-[20px] md:border md:border-white/20 md:bg-white/10 md:p-7 md:backdrop-blur-xl lg:grid-cols-4 lg:gap-6"
          style={{ animationDelay: '360ms' }}
        >
          {trustItems.map((item) => (
            <li
              key={item.title}
              className="flex items-center gap-2.5 rounded-[14px] border border-white/20 bg-white/10 p-3 backdrop-blur-md md:gap-3.5 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-300/20 text-gold-300 md:size-12">
                <Icon name={item.icon} size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-tight font-bold md:text-xl">{item.title}</span>
                <span className="hidden text-sm text-white/75 md:block">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
