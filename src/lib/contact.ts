import { business } from '../data/site'

const digits = (value: string) => value.replace(/\D/g, '')

/** True once the client's real number has been added to `business.phone`. */
export const hasPhone = digits(business.phone).length >= 10

/** "(720) 555-0123", or a placeholder while the number is pending. */
export function displayPhone(): string {
  const d = digits(business.phone).slice(-10)
  if (d.length !== 10) return '(XXX) XXX-XXXX'
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

/** Links fall back to the contact section until the number exists. */
export const telHref = hasPhone ? `tel:+1${digits(business.phone).slice(-10)}` : '#contact'
export const smsHref = hasPhone ? `sms:+1${digits(business.phone).slice(-10)}` : '#contact'

export const whatsappHref = (() => {
  const wa = digits(business.whatsapp) || (hasPhone ? `1${digits(business.phone).slice(-10)}` : '')
  if (!wa) return '#contact'
  const text = encodeURIComponent('Hi Oasis Pools! I would like a free estimate for my pool.')
  return `https://wa.me/${wa}?text=${text}`
})()

export const isExternal = (href: string) => href.startsWith('http')
