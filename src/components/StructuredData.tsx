import { business, mapCities, services, social } from '../data/site'
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
      'Pool cleaning, maintenance, repairs, acid washing, deck sealing and hot tub service for homes in Aurora, the Denver metro and the Front Range of Colorado.',
    address: { '@type': 'PostalAddress', addressLocality: 'Aurora', addressRegion: 'CO', addressCountry: 'US' },
    areaServed: mapCities.map((c) => ({ '@type': 'City', name: `${c.name}, CO` })),
    paymentAccepted: business.payments.join(', '),
    ...(hasPhone ? { telephone: `+1${business.phone.replace(/\D/g, '').slice(-10)}` } : {}),
    ...(business.email ? { email: business.email } : {}),
    sameAs: [social.instagram, social.facebook].filter(Boolean),
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
