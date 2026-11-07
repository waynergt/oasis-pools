/**
 * Vercel Function: GET /api/reviews
 *
 * Reads the Oasis Pools Google Business Profile through the Places API (New) and returns
 * the rating, review count and up to 5 reviews (the most Google returns).
 * The API key stays on the server; the browser only ever sees this endpoint.
 *
 * Environment variables (Vercel → Settings → Environment Variables, then Redeploy):
 *   GOOGLE_PLACES_API_KEY   key with "Places API (New)" enabled
 *   GOOGLE_PLACE_ID         Place ID of the Oasis Pools profile (starts with "ChIJ")
 *
 * Responses are cached by Vercel's CDN for 6 hours so Google is only called a few
 * times a day, which keeps usage inside Google's free monthly allowance.
 */

type PlaceReview = {
  rating?: number
  relativePublishTimeDescription?: string
  publishTime?: string
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string }
}

type PlaceDetails = {
  id?: string
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string }
  reviews?: PlaceReview[]
}

const FIELDS = 'id,rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews'

function json(body: unknown, status: number, cache: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  })
}

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!key || !placeId) {
    return json({ configured: false }, 200, 'public, s-maxage=300')
  }

  const writeReviewFallback = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
    })
    if (!res.ok) {
      console.error('Places API error', res.status, await res.text())
      // Still let visitors leave a review even if the details call fails
      return json({ configured: true, error: true, writeReviewUrl: writeReviewFallback }, 200, 'public, s-maxage=300')
    }

    const place = (await res.json()) as PlaceDetails
    const reviews = (place.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? 'Google user',
        authorUrl: r.authorAttribution?.uri ?? null,
        photo: r.authorAttribution?.photoUri ?? null,
        rating: r.rating ?? 5,
        when: r.relativePublishTimeDescription ?? '',
        text: r.text?.text ?? r.originalText?.text ?? '',
      }))
      .filter((r) => r.text.trim().length > 0 || r.rating > 0)

    return json(
      {
        configured: true,
        rating: place.rating ?? null,
        total: place.userRatingCount ?? 0,
        reviews,
        reviewsUrl: place.googleMapsLinks?.reviewsUri ?? place.googleMapsUri ?? null,
        writeReviewUrl: place.googleMapsLinks?.writeAReviewUri ?? writeReviewFallback,
      },
      200,
      'public, s-maxage=21600, stale-while-revalidate=86400',
    )
  } catch (err) {
    console.error('Places API request failed', err)
    return json({ configured: true, error: true, writeReviewUrl: writeReviewFallback }, 200, 'public, s-maxage=300')
  }
}
