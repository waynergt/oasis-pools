import { business, services } from '../data/site'
import { hasPhone } from '../lib/contact'

/** LocalBusiness schema so Google understands the service area and offer. */
export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    additionalType: 'https://schema.org/HomeAndConstructionBusiness',
    name: business.legalName,
    slogan: business.tagline,
    description:
      'Pool cleaning, maintenance, repairs, acid washing, deck sealing and hot tub service for homes in Aurora, Denver and across Colorado.',
    areaServed: [
      { '@type': 'City', name: 'Aurora, CO' },
      { '@type': 'City', name: 'Denver, CO' },
      { '@type': 'State', name: 'Colorado' },
    ],
    paymentAccepted: business.payments.join(', '),
    ...(hasPhone ? { telephone: `+1${business.phone.replace(/\D/g, '').slice(-10)}` } : {}),
    ...(business.email ? { email: business.email } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pool services',
      itemListElement: services.flatMap((s) =>
        s.items.map((item) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: item } })),
      ),
    },
  }

  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
