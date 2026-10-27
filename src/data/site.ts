/**
 * All business info and page copy lives here, so updates from the client
 * (phone, email, prices, photos) are a one-file change.
 *
 * TODO (pending from client):
 *  - Facebook page link (fill in social.facebook)
 *  - real before & after photos
 */
import type { IconName } from '../components/Icon'

import heroImg from '../assets/img/hero-rock-slide.webp'
import infinityImg from '../assets/img/infinity-pool.webp'
import fountainImg from '../assets/img/fountain-pool.webp'
import poolSpaImg from '../assets/img/pool-and-spa.webp'
import spaImg from '../assets/img/spa-jets.webp'
import kidneyImg from '../assets/img/kidney-pool.webp'
import tiledImg from '../assets/img/tiled-pool.webp'
import equipmentWallImg from '../assets/img/equipment-wall.webp'
import equipmentPumpsImg from '../assets/img/equipment-pumps.webp'

export const business = {
  name: 'Oasis Pools',
  legalName: 'Oasis Pools LLC',
  tagline: 'Excellence in Every Drop',
  /** US phone, any format. */
  phone: '(720) 331-8723',
  /** WhatsApp number in international format without "+". Empty = use phone. */
  whatsapp: '17203318723',
  email: 'oasispools97@gmail.com',
  /** Where the business is based (no storefront: mobile service). */
  baseCity: 'Aurora, CO',
  serviceArea: 'Aurora, the Denver Metro & the Front Range',
  payments: ['Cash', 'Zelle', 'Bank Transfer', 'Check'],
}

/** Social profiles. Leave a link empty to hide its icon everywhere. */
export const social = {
  instagram: 'https://www.instagram.com/oasis_pools1/',
  instagramHandle: '@oasis_pools1',
  facebook: '', // pending from client
}

export const images = {
  hero: heroImg,
  equipment: equipmentWallImg,
  /**
   * Optional real video for the hero (e.g. '/hero-water.mp4' placed in /public).
   * Empty = animated water effect drawn in the browser (no video file needed).
   */
  heroVideo: '',
}

export type NavLink = { id: string; label: string }

export const navLinks: NavLink[] = [
  { id: 'services', label: 'Services' },
  { id: 'plans', label: 'Plans' },
  { id: 'our-work', label: 'Our Work' },
  { id: 'service-area', label: 'Service Area' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const trustItems: { icon: IconName; title: string; text: string }[] = [
  { icon: 'tag', title: 'Free Estimates', text: 'No-cost quote for every job' },
  { icon: 'calendar', title: 'Flexible Scheduling', text: 'Weekly, biweekly or monthly' },
  { icon: 'home', title: 'Residential Specialists', text: 'Pools, spas & hot tubs' },
  { icon: 'shield', title: 'Honest Pricing', text: 'Clear quotes, no surprises' },
]

/** Options for the "What does your pool need?" select in the quote form. */
export const quoteOptions = [
  'Free Pool Health Check',
  'Weekly / Biweekly / Monthly Maintenance',
  'Repair (pump, filter, skimmer, plumbing…)',
  'Leak Detection',
  'Heater Repair or Installation',
  'Gas Line Work',
  'Pool Opening or Closing',
  'Green Pool / Algae Removal',
  'Acid Washing',
  'Deck Sealing',
  'Hot Tub & Spa Service',
  'Something else',
] as const

export type QuoteOption = (typeof quoteOptions)[number]

export type Service = {
  icon: IconName
  title: string
  subtitle: string
  items: string[]
  /** Option pre-selected in the quote form when this card's "Get a quote" is clicked. */
  quoteOption: QuoteOption
}

export const services: Service[] = [
  {
    icon: 'droplet',
    title: 'Pool Maintenance',
    subtitle: 'Weekly, biweekly or monthly visits',
    quoteOption: 'Weekly / Biweekly / Monthly Maintenance',
    items: [
      'Chemical Balancing',
      'Cleaning & Vacuuming',
      'Skimming & Brushing',
      'Filter Cleaning',
      'Equipment Inspection',
    ],
  },
  {
    icon: 'wrench',
    title: 'Repairs & Leak Detection',
    subtitle: 'Fast, reliable fixes that last',
    quoteOption: 'Repair (pump, filter, skimmer, plumbing…)',
    items: [
      'Pump Repair & Replacement',
      'Filter Repair & Replacement',
      'Skimmer Repair & Replacement',
      'Pool Plumbing & Pipe Repairs',
      'Leak Detection & Repair',
      'Skimmer Leak Detection',
    ],
  },
  {
    icon: 'flame',
    title: 'Equipment & Installations',
    subtitle: 'Heaters, gas lines, lights & more',
    quoteOption: 'Heater Repair or Installation',
    items: [
      'Pool & Spa Heater Repair & Installation',
      'Gas Line Installation & Repair',
      'Pool Lights & Electrical',
      'Salt System Maintenance',
      'Equipment Troubleshooting',
    ],
  },
  {
    icon: 'snowflake',
    title: 'Seasonal & Specialty',
    subtitle: 'Opening, closing & deep care',
    quoteOption: 'Pool Opening or Closing',
    items: [
      'Pool Opening',
      'Closing & Winterization',
      'Green Pool & Algae Removal',
      'Deep & Post-Storm Cleaning',
      'Acid Washing',
      'Deck Sealing (Deck-O-Seal)',
    ],
  },
  {
    icon: 'waves',
    title: 'Hot Tub & Spa',
    subtitle: 'Relax — we handle the rest',
    quoteOption: 'Hot Tub & Spa Service',
    items: ['Spa & Hot Tub Cleaning', 'Chemical Maintenance', 'Filter Service', 'Equipment Inspection'],
  },
]

export const healthCheckItems = [
  'Water chemistry & balance test',
  'Pump, filter & heater inspection',
  'Leak & plumbing check',
  'Tile, surface & waterline review',
  'Written recommendations & quote',
]

export type Frequency = 'weekly' | 'biweekly' | 'monthly'

export const frequencies: { id: Frequency; label: string }[] = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Biweekly' },
  { id: 'monthly', label: 'Monthly' },
]

export type Plan = {
  name: string
  description: string
  featured?: boolean
  features: string[]
}

export const plans: Plan[] = [
  {
    name: 'Basic',
    description: 'Essential chemistry & surface care',
    features: [
      'Water testing & chemical balancing',
      'Skimming surface debris',
      'Emptying skimmer & pump baskets',
      'Service report after every visit',
    ],
  },
  {
    name: 'Complete',
    description: 'Full-service cleaning, visit after visit',
    featured: true,
    features: [
      'Everything in Basic',
      'Brushing walls, steps & tile line',
      'Vacuuming the pool floor',
      'Filter check & pressure monitoring',
      'Equipment inspection',
    ],
  },
  {
    name: 'Premium',
    description: 'Hands-off, total pool care',
    features: [
      'Everything in Complete',
      'Filter cleaning included',
      'Hot tub / spa care included',
      'Priority scheduling',
      'Discount on repairs & seasonal services',
    ],
  },
]

export type GalleryItem = {
  src: string
  caption: string
  alt: string
  /** Spans two columns on large screens. */
  wide?: boolean
}

export const gallery: GalleryItem[] = [
  { src: infinityImg, caption: 'Infinity Pool Care', alt: 'Modern infinity-edge pool with clear water', wide: true },
  { src: fountainImg, caption: 'Water Features', alt: 'Pool with arching deck jet fountains' },
  { src: poolSpaImg, caption: 'Pool & Spa Service', alt: 'Freeform pool and attached spa with flagstone deck' },
  { src: spaImg, caption: 'Spa Cleaning', alt: 'Crystal-clear spa with jets running' },
  { src: kidneyImg, caption: 'Weekly Maintenance', alt: 'Kidney-shaped pool with brick coping' },
  { src: tiledImg, caption: 'Tile & Waterline', alt: 'Freshly cleaned pool with blue waterline tile' },
  { src: heroImg, caption: 'Rock Waterfall Pool', alt: 'Pool with natural rock waterfall, slide and attached spa' },
  { src: equipmentPumpsImg, caption: 'Equipment Installs', alt: 'New pool pumps, filter and plumbing installed' },
]

/**
 * Cities on the Service Area map (from the coverage map the client sent).
 * tier: 'base' = home base pin, 'major' = always labeled, 'minor' = label hidden on phones.
 * label: which side of the dot the name goes on (pre-tuned so names don't overlap).
 */
export type MapCity = {
  name: string
  lat: number
  lng: number
  tier: 'base' | 'major' | 'minor'
  group: 'metro' | 'north' | 'south' | 'east'
  label: 'left' | 'right' | 'top' | 'bottom'
}

export const mapCities: MapCity[] = [
  { name: 'Aurora', lat: 39.7294, lng: -104.8319, tier: 'base', group: 'metro', label: 'right' },
  { name: 'Denver', lat: 39.7392, lng: -104.9903, tier: 'major', group: 'metro', label: 'bottom' },
  { name: 'Lakewood', lat: 39.7047, lng: -105.0814, tier: 'major', group: 'metro', label: 'left' },
  { name: 'Arvada', lat: 39.8028, lng: -105.0875, tier: 'major', group: 'metro', label: 'right' },
  { name: 'Westminster', lat: 39.8367, lng: -105.0372, tier: 'minor', group: 'metro', label: 'right' },
  { name: 'Thornton', lat: 39.868, lng: -104.9719, tier: 'major', group: 'metro', label: 'right' },
  { name: 'Commerce City', lat: 39.8083, lng: -104.9339, tier: 'minor', group: 'metro', label: 'right' },
  { name: 'Broomfield', lat: 39.9205, lng: -105.0867, tier: 'minor', group: 'metro', label: 'right' },
  { name: 'Littleton', lat: 39.6133, lng: -105.0166, tier: 'major', group: 'metro', label: 'right' },
  { name: 'Centennial', lat: 39.5807, lng: -104.8772, tier: 'major', group: 'metro', label: 'right' },
  { name: 'Highlands Ranch', lat: 39.5539, lng: -104.9694, tier: 'minor', group: 'metro', label: 'right' },
  { name: 'Ken Caryl', lat: 39.5753, lng: -105.1125, tier: 'minor', group: 'metro', label: 'right' },
  { name: 'Golden', lat: 39.7555, lng: -105.2211, tier: 'major', group: 'metro', label: 'right' },
  { name: 'Morrison', lat: 39.6536, lng: -105.1911, tier: 'minor', group: 'metro', label: 'right' },
  { name: 'Evergreen', lat: 39.6333, lng: -105.3172, tier: 'minor', group: 'metro', label: 'top' },
  { name: 'Fort Collins', lat: 40.5853, lng: -105.0844, tier: 'major', group: 'north', label: 'right' },
  { name: 'Wellington', lat: 40.7036, lng: -105.0086, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Windsor', lat: 40.4775, lng: -104.9014, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Loveland', lat: 40.3978, lng: -105.075, tier: 'major', group: 'north', label: 'right' },
  { name: 'Greeley', lat: 40.4233, lng: -104.7091, tier: 'major', group: 'north', label: 'right' },
  { name: 'Johnstown', lat: 40.3369, lng: -104.9122, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Berthoud', lat: 40.3083, lng: -105.0811, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Mead', lat: 40.2333, lng: -104.9986, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Platteville', lat: 40.215, lng: -104.8228, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Longmont', lat: 40.1672, lng: -105.1019, tier: 'major', group: 'north', label: 'right' },
  { name: 'Lyons', lat: 40.2247, lng: -105.2714, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Frederick', lat: 40.0992, lng: -104.9372, tier: 'minor', group: 'north', label: 'left' },
  { name: 'Fort Lupton', lat: 40.0847, lng: -104.813, tier: 'minor', group: 'north', label: 'top' },
  { name: 'Erie', lat: 40.0503, lng: -105.05, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Gunbarrel', lat: 40.0633, lng: -105.1714, tier: 'minor', group: 'north', label: 'left' },
  { name: 'Boulder', lat: 40.015, lng: -105.2705, tier: 'major', group: 'north', label: 'right' },
  { name: 'Brighton', lat: 39.9853, lng: -104.8205, tier: 'major', group: 'north', label: 'left' },
  { name: 'Lochbuie', lat: 40.0072, lng: -104.7161, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Hudson', lat: 40.0739, lng: -104.6433, tier: 'minor', group: 'north', label: 'right' },
  { name: 'Parker', lat: 39.5186, lng: -104.7614, tier: 'major', group: 'south', label: 'right' },
  { name: 'Castle Pines', lat: 39.4717, lng: -104.8961, tier: 'minor', group: 'south', label: 'right' },
  { name: 'The Pinery', lat: 39.4553, lng: -104.7347, tier: 'minor', group: 'south', label: 'bottom' },
  { name: 'Roxborough Park', lat: 39.4639, lng: -105.0853, tier: 'minor', group: 'south', label: 'left' },
  { name: 'Sedalia', lat: 39.4372, lng: -104.9611, tier: 'minor', group: 'south', label: 'right' },
  { name: 'Castle Rock', lat: 39.3722, lng: -104.8561, tier: 'major', group: 'south', label: 'left' },
  { name: 'Franktown', lat: 39.3886, lng: -104.7514, tier: 'minor', group: 'south', label: 'right' },
  { name: 'Bennett', lat: 39.7586, lng: -104.4275, tier: 'major', group: 'east', label: 'right' },
  { name: 'Strasburg', lat: 39.7383, lng: -104.3233, tier: 'minor', group: 'east', label: 'bottom' },
]

/** Headings for the city lists next to the map. */
export const areaGroups: { id: MapCity['group']; title: string }[] = [
  { id: 'metro', title: 'Denver Metro & Foothills' },
  { id: 'north', title: 'Northern Colorado & Boulder County' },
  { id: 'south', title: 'Douglas County' },
  { id: 'east', title: 'East of Aurora' },
]

export type BeforeAfterPair = { before: string; after: string; label: string }

/** Add real pairs here when the client sends them. Empty = placeholder (dev only). */
export const beforeAfter: BeforeAfterPair[] = []

export const reasons: { icon: IconName; title: string; text: string }[] = [
  { icon: 'clock', title: 'Reliable Service', text: 'We show up when we say we will — every visit.' },
  { icon: 'receipt', title: 'Honest Pricing', text: 'Clear quotes with no hidden fees.' },
  { icon: 'award', title: 'Professional Work', text: 'Trained, detail-oriented and fully equipped.' },
  { icon: 'calendar', title: 'Flexible Scheduling', text: 'Weekly, biweekly or monthly — your call.' },
  { icon: 'home', title: 'Residential Specialists', text: 'Focused on home pools, spas & hot tubs.' },
  { icon: 'tag', title: 'Free Estimates', text: 'Know the cost before any work begins.' },
]

export const values: { icon: IconName; title: string; text: string }[] = [
  { icon: 'star', title: 'Quality', text: 'Every visit done to a high standard.' },
  { icon: 'shield', title: 'Responsibility', text: 'We own our work and our schedule.' },
  { icon: 'heart', title: 'Honesty', text: 'Straight answers and fair quotes.' },
  { icon: 'users', title: 'Personal Attention', text: 'Real people who know your pool.' },
]
