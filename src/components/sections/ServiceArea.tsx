import { areaGroups, business, mapCities, type MapCity } from '../../data/site'
import { telHref } from '../../lib/contact'
import { prefillQuote } from '../../lib/quoteEvents'
import { Icon } from '../Icon'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

/* ------------------------------------------------------------------
   Regional map: Denver metro & Front Range, drawn as SVG.
   Simple equirectangular projection (accurate enough at this scale);
   longitude is scaled by cos(40°) so distances look right.
   ------------------------------------------------------------------ */
const S = 700 // px per degree of latitude
const TOP = 40.78
const LEFT = -105.4
const K = Math.cos((40 * Math.PI) / 180)
const W = Math.round((-104.22 - LEFT) * S * K) // 633
const H = Math.round((TOP - 39.3) * S) // 1036

type Pt = [number, number] // [x, y]
const project = (lat: number, lng: number): Pt => [(lng - LEFT) * S * K, (TOP - lat) * S]
const line = (coords: [number, number][]) =>
  coords.map(([lat, lng], i) => `${i ? 'L' : 'M'}${project(lat, lng).map((v) => v.toFixed(1)).join(' ')}`).join(' ')

/* Main highways, simplified (lat, lng) */
const highways: { id: string; label: string; path: [number, number][]; shield: [number, number] }[] = [
  { id: 'I-25', label: '25', shield: [40.52, -104.985], path: [[40.8, -104.99], [40.4, -104.985], [40.1, -104.985], [39.92, -104.99], [39.78, -105.0], [39.7, -104.99], [39.62, -104.93], [39.55, -104.88], [39.45, -104.875], [39.3, -104.86]] },
  { id: 'I-70', label: '70', shield: [39.765, -104.55], path: [[39.7, -105.4], [39.71, -105.28], [39.74, -105.19], [39.78, -105.07], [39.78, -104.9], [39.77, -104.75], [39.76, -104.5], [39.74, -104.22]] },
  { id: 'I-76', label: '76', shield: [40.15, -104.56], path: [[39.79, -105.02], [39.83, -104.92], [39.92, -104.85], [39.99, -104.79], [40.07, -104.66], [40.2, -104.45], [40.3, -104.22]] },
  { id: 'E-470', label: '470', shield: [39.63, -104.72], path: [[39.545, -104.87], [39.53, -104.77], [39.6, -104.72], [39.76, -104.72], [39.87, -104.73], [39.94, -104.86], [39.95, -104.99], [39.97, -105.07]] },
  { id: 'C-470', label: '', shield: [39.565, -105.07], path: [[39.545, -104.87], [39.56, -104.99], [39.57, -105.1], [39.63, -105.17], [39.72, -105.2], [39.76, -105.2]] },
  { id: 'US-34', label: '34', shield: [40.405, -104.83], path: [[40.39, -105.3], [40.405, -105.07], [40.41, -104.9], [40.42, -104.7], [40.43, -104.45]] },
]

/* Convex hull (monotone chain) of the cities, then a padded, smoothed outline = service zone */
function serviceZonePath(points: Pt[], pad: number) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Pt[] = []
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper: Pt[] = []
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop()
    upper.push(p)
  }
  const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)]
  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length
  const padded: Pt[] = hull.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy) || 1
    return [x + ((x - cx) / d) * pad, y + ((y - cy) / d) * pad]
  })
  // closed Catmull-Rom spline -> cubic Béziers for a soft, organic edge
  const n = padded.length
  let d = `M${padded[0][0].toFixed(1)} ${padded[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = padded[(i - 1 + n) % n]
    const p1 = padded[i]
    const p2 = padded[(i + 1) % n]
    const p3 = padded[(i + 2) % n]
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return `${d} Z`
}

const label = (city: MapCity, [x, y]: Pt) => {
  const g = city.tier === 'base' ? 18 : 12
  switch (city.label) {
    case 'left':
      return { x: x - g, y: y + 5, anchor: 'end' as const }
    case 'top':
      return { x, y: y - g, anchor: 'middle' as const }
    case 'bottom':
      return { x, y: y + g + 13, anchor: 'middle' as const }
    default:
      return { x: x + g, y: y + 5, anchor: 'start' as const }
  }
}

const textStyle = (stroke = 5) => ({
  fontFamily: 'var(--font-sans)',
  paintOrder: 'stroke' as const,
  stroke: '#eef8fd',
  strokeWidth: stroke,
  strokeLinejoin: 'round' as const,
})

/* Decorative peaks along the foothills (west edge) */
const peaks: Pt[] = [
  [40.62, -105.3], [40.45, -105.33], [40.3, -105.32], [40.12, -105.34], [39.93, -105.33], [39.82, -105.34],
  [39.55, -105.3], [39.45, -105.24], [39.35, -105.18], [40.55, -105.22], [39.68, -105.37],
].map(([lat, lng]) => project(lat, lng))

function FrontRangeMap() {
  const pts = mapCities.map((c) => project(c.lat, c.lng))
  const zone = serviceZonePath(pts, 34)
  const base = mapCities.find((c) => c.tier === 'base')
  const basePt = base ? project(base.lat, base.lng) : null
  const airport = project(39.8561, -104.6737)
  const mile10 = (10 / 69) * S // 10 miles in px

  return (
    <svg viewBox={`-10 -10 ${W + 20} ${H + 20}`} role="img" aria-labelledby="map-title map-desc" className="h-auto w-full">
      <title id="map-title">Oasis Pools service area map</title>
      <desc id="map-desc">
        Based in {business.baseCity}. Service area covers the Denver metro and the Front Range, including{' '}
        {mapCities.filter((c) => c.tier !== 'base').map((c) => c.name).join(', ')}.
      </desc>

      <defs>
        <linearGradient id="sa-land" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfe7dd" />
          <stop offset="0.22" stopColor="#e3f1ea" />
          <stop offset="1" stopColor="#f1f7f3" />
        </linearGradient>
        <radialGradient id="sa-glow">
          <stop offset="0" stopColor="#1db6ea" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1db6ea" stopOpacity="0" />
        </radialGradient>
        <clipPath id="sa-clip">
          <rect width={W} height={H} rx="18" />
        </clipPath>
      </defs>

      <g clipPath="url(#sa-clip)">
        {/* land + foothills */}
        <rect width={W} height={H} fill="url(#sa-land)" />
        <g fill="none" stroke="#2f6b55" strokeOpacity="0.28" strokeWidth="2.2" strokeLinejoin="round">
          {peaks.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x - 15} ${y + 10} L${x - 4} ${y - 7} L${x + 2} ${y} L${x + 8} ${y - 11} L${x + 21} ${y + 10}`} />
          ))}
        </g>
        <text
          x="22"
          y={H / 2 + 120}
          transform={`rotate(-90 22 ${H / 2 + 120})`}
          className="fill-[#2f6b55]/45 text-[15px] font-bold tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          ROCKY MOUNTAIN FOOTHILLS
        </text>

        {/* service zone */}
        <path d={zone} fill="#1db6ea" fillOpacity="0.13" stroke="#0b5fcb" strokeWidth="3" strokeDasharray="10 8" strokeLinejoin="round" />
        {basePt && <circle cx={basePt[0]} cy={basePt[1]} r="210" fill="url(#sa-glow)" />}

        {/* highways */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {highways.map((h) => (
            <g key={h.id}>
              <path d={line(h.path)} stroke="#ffffff" strokeWidth="7" />
              <path d={line(h.path)} stroke="#a9b8c9" strokeWidth="3" />
            </g>
          ))}
        </g>
        {highways.filter((h) => h.label).map((h) => {
          const [x, y] = project(...h.shield)
          const w = h.label.length > 2 ? 34 : 26
          return (
            <g key={`${h.id}-shield`} aria-hidden="true">
              <rect x={x - w / 2} y={y - 11} width={w} height="22" rx="6" fill="#0a2a5c" stroke="#fff" strokeWidth="2" />
              <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-[13px] font-extrabold" style={{ fontFamily: 'var(--font-sans)' }}>
                {h.label}
              </text>
            </g>
          )
        })}

        {/* Denver International Airport */}
        <g transform={`translate(${airport[0] - 11} ${airport[1] - 11})`} aria-hidden="true">
          <rect width="22" height="22" rx="6" fill="#52627a" />
          <path d="M11 4.5v13M6 11l5-2.5 5 2.5M8.5 16.5 11 15l2.5 1.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x={airport[0] + 16} y={airport[1] + 5} className="fill-muted text-[13px] font-semibold" style={textStyle(4)}>
          DEN
        </text>

        {/* cities */}
        {mapCities
          .filter((c) => c.tier !== 'base')
          .map((city) => {
            const p = project(city.lat, city.lng)
            const l = label(city, p)
            const major = city.tier === 'major'
            return (
              <g key={city.name}>
                <circle cx={p[0]} cy={p[1]} r={major ? 6.5 : 4.5} fill="#fff" stroke="#0b5fcb" strokeWidth={major ? 3.5 : 3} />
                <text
                  x={l.x}
                  y={l.y}
                  textAnchor={l.anchor}
                  className={
                    major
                      ? 'fill-navy-800 text-[17px] font-bold max-md:text-[24px]'
                      : 'fill-navy-800/80 text-[14px] font-semibold max-md:hidden'
                  }
                  style={textStyle(major ? 5 : 4)}
                >
                  {city.name}
                </text>
              </g>
            )
          })}

        {/* home base */}
        {base && basePt && (
          <g>
            <circle cx={basePt[0]} cy={basePt[1]} r="13" fill="#d39a17" opacity="0.4">
              <animate attributeName="r" values="13;36;13" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx={basePt[0]} cy={basePt[1]} r="13" fill="#f3c95b" stroke="#061a3a" strokeWidth="4" />
            <circle cx={basePt[0]} cy={basePt[1]} r="4.5" fill="#061a3a" />
            {(() => {
              const l = label(base, basePt)
              return (
                <>
                  <text x={l.x} y={l.y + 1} textAnchor={l.anchor} className="fill-navy-900 text-[23px] font-extrabold max-md:text-[30px]" style={textStyle(6)}>
                    {base.name}
                  </text>
                  <text x={l.x} y={l.y + 22} textAnchor={l.anchor} className="fill-gold-500 text-[13px] font-extrabold tracking-[0.12em] max-md:text-[18px] max-md:translate-y-[6px]" style={textStyle(4)}>
                    HOME BASE
                  </text>
                </>
              )
            })()}
          </g>
        )}

        {/* compass + scale */}
        <g transform={`translate(${W - 46} 46)`} aria-hidden="true">
          <circle r="22" fill="#fff" stroke="#c9d3e0" strokeWidth="1.5" />
          <path d="M0 -14 L6 4 L0 0 L-6 4 Z" fill="#0a2a5c" />
          <text y="17" textAnchor="middle" className="fill-navy-800 text-[11px] font-extrabold" style={{ fontFamily: 'var(--font-sans)' }}>
            N
          </text>
        </g>
        <g transform={`translate(${W - 30 - mile10} ${H - 34})`} aria-hidden="true">
          <path d={`M0 0 H${mile10}`} stroke="#0a2a5c" strokeWidth="3" />
          <path d={`M0 -6 V6 M${mile10} -6 V6`} stroke="#0a2a5c" strokeWidth="2" />
          <text x={mile10 / 2} y="-10" textAnchor="middle" className="fill-navy-800 text-[12px] font-bold" style={textStyle(3)}>
            10 miles
          </text>
        </g>
      </g>
      <rect width={W} height={H} rx="18" fill="none" stroke="#c9d3e0" strokeWidth="2" />
    </svg>
  )
}

export function ServiceArea() {
  return (
    <section id="service-area" className="overflow-hidden bg-surface py-16 md:py-28">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-14">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28">
          <SectionHeader
            align="left"
            eyebrow="Service Area"
            title="Serving the Denver Metro & the Front Range"
            text="Based in Aurora, our team covers the Denver metro and the Front Range — from Fort Collins and Greeley down to Castle Rock, and east to Bennett and Strasburg. No storefront needed: we come to you."
          />

          <Reveal className="flex flex-col gap-5">
            {areaGroups.map((g) => {
              const cities = mapCities.filter((c) => c.group === g.id)
              return (
                <div key={g.id} className="flex flex-col gap-2.5">
                  <h3 className="text-sm font-extrabold tracking-[0.08em] text-navy-800 uppercase">{g.title}</h3>
                  <ul className="flex flex-wrap gap-1.5" aria-label={g.title}>
                    {cities.map((c) => (
                      <li
                        key={c.name}
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                          c.tier === 'base'
                            ? 'bg-gold-300 text-navy-900'
                            : 'border border-line bg-white text-navy-800'
                        }`}
                      >
                        {c.tier === 'base' && <Icon name="pin" size={13} />}
                        {c.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </Reveal>

          <Reveal className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 md:p-6">
            <p className="flex items-center gap-3 font-semibold text-navy-800">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-aqua-100 text-ocean-600">
                <Icon name="map" size={22} />
              </span>
              Don’t see your city? Just ask — we may still be able to help.
            </p>
            <div className="flex gap-2.5 [&>a]:flex-1 sm:[&>a]:flex-none">
              <ButtonLink href={telHref} variant="outline-navy" size="sm" arrow={false}>
                <Icon name="phone" size={17} />
                Call
              </ButtonLink>
              <ButtonLink href="#quote" size="sm" onClick={() => prefillQuote({ service: 'Free Pool Health Check' })}>
                Free Quote
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <figure className="rounded-[28px] border border-line bg-white p-3 shadow-card md:p-5">
            <FrontRangeMap />
            <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 px-1 text-sm font-medium text-muted">
              <span className="flex items-center gap-2">
                <span className="size-3.5 rounded-full border-[3px] border-navy-900 bg-gold-300" />
                Home base: Aurora
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full border-[3px] border-ocean-600 bg-white" />
                Cities we serve
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-5 rounded-sm border-2 border-dashed border-ocean-600 bg-aqua-100" />
                Service zone
              </span>
              <a
                href="https://www.google.com/maps/place/Aurora,+CO"
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
