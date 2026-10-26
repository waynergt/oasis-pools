import { mapCities, serviceAreas, type MapCity } from '../../data/site'
import { telHref } from '../../lib/contact'
import { prefillQuote } from '../../lib/quoteEvents'
import { Icon } from '../Icon'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

/* Colorado spans 37°N–41°N and 102.05°W–109.05°W, so a simple linear projection is accurate enough.
   Width is scaled by cos(39°) so the state keeps its real proportions. */
const W = 680
const H = 500
const project = (c: Pick<MapCity, 'lat' | 'lng'>) => ({
  x: ((c.lng + 109.05) / 7) * W,
  y: ((41 - c.lat) / 4) * H,
})
const xAt = (lng: number) => ((lng + 109.05) / 7) * W

/* Little peaks for the Rocky Mountains (decorative). */
const peaks: [number, number][] = [
  [150, 110], [205, 80], [250, 120], [300, 95], [335, 140], [190, 160], [300, 210],
  [345, 245], [220, 250], [160, 300], [270, 300], [330, 330], [205, 370], [290, 390],
  [130, 395], [350, 410], [250, 440], [95, 340],
]

const labelPos = (city: MapCity, x: number, y: number) => {
  // offsets tuned for 17px labels
  switch (city.label) {
    case 'left':
      return { x: x - 13, y: y + 7, anchor: 'end' as const }
    case 'top':
      return { x, y: y - 15, anchor: 'middle' as const }
    case 'bottom':
      return { x, y: y + 28, anchor: 'middle' as const }
    default:
      return { x: x + 13, y: y + 7, anchor: 'start' as const }
  }
}

function ColoradoMap() {
  const base = mapCities.filter((c) => c.base)
  const hub = base.length
    ? project({ lat: base.reduce((s, c) => s + c.lat, 0) / base.length, lng: base.reduce((s, c) => s + c.lng, 0) / base.length })
    : project({ lat: 39.73, lng: -104.9 })

  return (
    <svg
      viewBox="-46 -40 772 590"
      role="img"
      aria-labelledby="co-map-title co-map-desc"
      className="h-auto w-full overflow-visible"
    >
      <title id="co-map-title">Oasis Pools service area map</title>
      <desc id="co-map-desc">
        Map of Colorado. Home base in the Aurora and Denver metro area, with service across the whole state including{' '}
        {mapCities.filter((c) => !c.base).map((c) => c.name).join(', ')}.
      </desc>

      <defs>
        <linearGradient id="co-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6f1fb" />
          <stop offset="1" stopColor="#a9def5" />
        </linearGradient>
        <radialGradient id="co-glow">
          <stop offset="0" stopColor="#1db6ea" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1db6ea" stopOpacity="0" />
        </radialGradient>
        <pattern id="co-grid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="#0b5fcb" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
        <clipPath id="co-clip">
          <rect width={W} height={H} rx="10" />
        </clipPath>
      </defs>

      {/* Neighbor states (context) */}
      <g className="fill-muted/60 text-[15px] font-bold tracking-[0.25em] max-md:text-[22px]" style={{ fontFamily: 'var(--font-sans)' }}>
        <text x={xAt(-104.05) / 2} y={-18} textAnchor="middle">WYOMING</text>
        <text x={(xAt(-104.05) + W) / 2} y={-18} textAnchor="middle">NEBRASKA</text>
        <text x={W + 22} y={H / 2 + 40} textAnchor="middle" transform={`rotate(90 ${W + 22} ${H / 2 + 40})`}>KANSAS</text>
        <text x={xAt(-103) / 2} y={H + 30} textAnchor="middle">NEW MEXICO</text>
        <text x={(xAt(-103) + W) / 2} y={H + 30} textAnchor="middle">OKLAHOMA</text>
        <text x={-22} y={H / 2} textAnchor="middle" transform={`rotate(-90 -22 ${H / 2})`}>UTAH</text>
      </g>

      {/* The state — the whole thing is the service area */}
      <rect width={W} height={H} rx="10" fill="url(#co-fill)" />
      <g clipPath="url(#co-clip)">
        <rect width={W} height={H} fill="url(#co-grid)" />
        <circle cx={hub.x} cy={hub.y} r="230" fill="url(#co-glow)" />
        <g fill="none" stroke="#0a2a5c" strokeOpacity="0.16" strokeWidth="2" strokeLinejoin="round">
          {peaks.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x - 13} ${y + 9} L${x - 3} ${y - 6} L${x + 2} ${y} L${x + 7} ${y - 9} L${x + 18} ${y + 9}`} />
          ))}
        </g>
        <text
          x="215"
          y="352"
          textAnchor="middle"
          className="fill-navy-800/10 font-display text-[44px] font-bold tracking-[0.18em]"
        >
          COLORADO
        </text>
      </g>
      <rect width={W} height={H} rx="10" fill="none" stroke="#0b5fcb" strokeWidth="3" />

      {/* Cities */}
      {mapCities
        .filter((c) => !c.base)
        .map((city) => {
          const { x, y } = project(city)
          const l = labelPos(city, x, y)
          return (
            <g key={city.name}>
              <circle cx={x} cy={y} r="7" fill="#fff" stroke="#0b5fcb" strokeWidth="3.5" />
              <text
                x={l.x}
                y={l.y}
                textAnchor={l.anchor}
                className={`fill-navy-800 text-[20px] font-semibold max-md:text-[30px] ${city.minor ? 'max-md:hidden' : ''}`}
                style={{ fontFamily: 'var(--font-sans)', paintOrder: 'stroke', stroke: '#d6f1fb', strokeWidth: 4 }}
              >
                {city.name}
              </text>
            </g>
          )
        })}

      {/* Home base: one pin for the Aurora–Denver metro (the two cities are only ~8 miles apart) */}
      <g>
        <circle cx={hub.x} cy={hub.y} r="11" fill="#d39a17" opacity="0.4">
          <animate attributeName="r" values="11;30;11" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx={hub.x} cy={hub.y} r="11" fill="#f3c95b" stroke="#061a3a" strokeWidth="3.5" />
        <circle cx={hub.x} cy={hub.y} r="3.5" fill="#061a3a" />
        <text
          x={hub.x + 18}
          y={hub.y + 7}
          className="fill-navy-900 text-[24px] font-extrabold max-md:text-[34px]"
          style={{ fontFamily: 'var(--font-sans)', paintOrder: 'stroke', stroke: '#d6f1fb', strokeWidth: 6 }}
        >
          {base.map((c) => c.name).reverse().join(' & ') || 'Aurora & Denver'}
        </text>
      </g>
    </svg>
  )
}

export function ServiceArea() {
  return (
    <section id="service-area" className="overflow-hidden bg-surface py-16 md:py-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_660px] lg:gap-12">
        <div className="flex flex-col gap-8">
          <SectionHeader
            align="left"
            eyebrow="Service Area"
            title="Proudly Serving All of Colorado"
            text="Centered in the Aurora–Denver metro, our team travels to homes across the state — from the Front Range to the Western Slope. No storefront needed: we come to you."
          />

          <Reveal>
            <ul className="flex flex-wrap gap-2" aria-label="Areas we serve">
              {serviceAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-navy-800"
                >
                  <Icon name="pin" size={14} className="text-ocean-600" />
                  {area}
                </li>
              ))}
              <li className="flex items-center rounded-full bg-navy-800 px-3.5 py-2 text-sm font-semibold text-white">
                + all of Colorado
              </li>
            </ul>
          </Reveal>

          <Reveal className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 md:p-6">
            <p className="flex items-center gap-3 font-semibold text-navy-800">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-aqua-100 text-ocean-600">
                <Icon name="map" size={22} />
              </span>
              Not sure if we cover your area? Just ask.
            </p>
            <div className="flex gap-2.5 [&>a]:flex-1 sm:[&>a]:flex-none">
              <ButtonLink href={telHref} variant="outline-navy" size="sm" arrow={false}>
                <Icon name="phone" size={17} />
                Call
              </ButtonLink>
              <ButtonLink
                href="#quote"
                size="sm"
                onClick={() => prefillQuote({ service: 'Free Pool Health Check' })}
              >
                Free Quote
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <figure className="rounded-[28px] border border-line bg-white p-4 shadow-card md:p-6">
            <ColoradoMap />
            <figcaption className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm font-medium text-muted">
              <span className="flex items-center gap-2">
                <span className="size-3.5 rounded-full border-[3px] border-navy-900 bg-gold-300" />
                Home base: Aurora &amp; Denver
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full border-[3px] border-ocean-600 bg-white" />
                Cities we serve
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-5 rounded-sm border-2 border-ocean-600 bg-aqua-100" />
                Service area: all of Colorado
              </span>
              <a
                href="https://www.google.com/maps/place/Colorado"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 font-semibold text-ocean-600 transition-colors hover:text-navy-800"
              >
                Open in Google Maps
                <Icon name="external" size={14} />
              </a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
