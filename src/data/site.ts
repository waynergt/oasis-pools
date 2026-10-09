/**
 * All business info and page copy lives here, so updates from the client
 * (phone, email, prices, photos) are a one-file change.
 *
 * TODO (pending from client):
 *  - phone / WhatsApp number and email
 *  - plan prices
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
  /** Digits only, US format. Leave empty until the client confirms it. */
  phone: '',
  /** WhatsApp number in international format without "+" (e.g. 17205550123). Empty = use phone. */
  whatsapp: '',
  email: '',
  serviceArea: 'Aurora, Denver & all of Colorado',
  payments: ['Cash', 'Zelle', 'Bank Transfer', 'Check'],
}

export const images = {
  hero: heroImg,
  equipment: equipmentWallImg,
}

export type NavLink = { id: string; label: string }

export const navLinks: NavLink[] = [
  { id: 'services', label: 'Services' },
  { id: 'plans', label: 'Plans' },
  { id: 'our-work', label: 'Our Work' },
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
  'Repair (pump, filter, plumbing, leak…)',
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
    title: 'Repairs',
    subtitle: 'Fast, reliable fixes for your equipment',
    quoteOption: 'Repair (pump, filter, plumbing, leak…)',
    items: [
      'Pump Repair & Replacement',
      'Filter Repair & Replacement',
      'Plumbing, Pipes & Valves',
      'Leak Detection',
      'Equipment Troubleshooting',
      'Pool Lights & Electrical',
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
      'Salt System Maintenance',
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
  /** Price per visit for each frequency. `null` = not confirmed yet (shows $XX). */
  price: Record<Frequency, number | null>
  features: string[]
}

export const plans: Plan[] = [
  {
    name: 'Basic',
    description: 'Essential chemistry & surface care',
    price: { weekly: null, biweekly: null, monthly: null },
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
    price: { weekly: null, biweekly: null, monthly: null },
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
    price: { weekly: null, biweekly: null, monthly: null },
    features: [
      'Everything in Complete',
      'Filter cleaning included',
      'Hot tub / spa care included',
      'Priority scheduling',
      'Discount on repairs & seasonal services',
    ],
  },
]

export type GalleryItem = { src: string; caption: string; alt: string }

export const gallery: GalleryItem[] = [
  { src: infinityImg, caption: 'Infinity Pool Care', alt: 'Modern infinity-edge pool with clear water' },
  { src: fountainImg, caption: 'Water Features', alt: 'Pool with arching deck jet fountains' },
  { src: poolSpaImg, caption: 'Pool & Spa Service', alt: 'Freeform pool and attached spa with flagstone deck' },
  { src: spaImg, caption: 'Spa Cleaning', alt: 'Crystal-clear spa with jets running' },
  { src: kidneyImg, caption: 'Weekly Maintenance', alt: 'Kidney-shaped pool with brick coping' },
  { src: tiledImg, caption: 'Tile & Waterline', alt: 'Freshly cleaned pool with blue waterline tile' },
  { src: equipmentPumpsImg, caption: 'Equipment Installs', alt: 'New pool pumps, filter and plumbing installed' },
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
