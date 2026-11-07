import { useEffect, useState } from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

/**
 * Google reviews, read live from the Business Profile through /api/reviews (api/reviews.ts).
 *  - Reviews on the profile → rating summary + review cards.
 *  - No reviews yet       → a short "leave us a review" call to action.
 *  - API not configured   → nothing (also the case in `npm run dev`, which doesn't run /api).
 */

type Review = {
  author: string
  authorUrl: string | null
  photo: string | null
  rating: number
  when: string
  text: string
}

type ReviewsData = {
  configured: boolean
  error?: boolean
  rating?: number | null
  total?: number
  reviews?: Review[]
  reviewsUrl?: string | null
  writeReviewUrl?: string
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="flex gap-0.5 text-gold-500" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) =>
        value >= n ? (
          <FaStar key={n} size={size} aria-hidden="true" />
        ) : value >= n - 0.5 ? (
          <FaStarHalfAlt key={n} size={size} aria-hidden="true" />
        ) : (
          <FaRegStar key={n} size={size} aria-hidden="true" />
        ),
      )}
    </span>
  )
}

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [failed, setFailed] = useState(false)
  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-11 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-aqua-100 text-lg font-bold text-ocean-600">
      {name.trim().charAt(0).toUpperCase() || 'G'}
    </span>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [open, setOpen] = useState(false)
  const long = review.text.length > 260
  return (
    <article className="flex h-full flex-col gap-4 rounded-[22px] border border-line bg-white p-6 shadow-[0_12px_32px_-18px_rgb(10_42_92/0.25)] md:p-7">
      <header className="flex items-center gap-3">
        <Avatar name={review.author} photo={review.photo} />
        <div className="min-w-0 flex-1">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-bold text-navy-800 hover:text-ocean-600"
            >
              {review.author}
            </a>
          ) : (
            <span className="block truncate font-bold text-navy-800">{review.author}</span>
          )}
          {review.when && <span className="block text-sm text-muted">{review.when}</span>}
        </div>
        <FcGoogle size={22} aria-label="Google review" className="shrink-0" />
      </header>
      <Stars value={review.rating} />
      {review.text && (
        <div className="text-[15px] leading-relaxed text-ink">
          <p className={long && !open ? 'line-clamp-6' : ''}>{review.text}</p>
          {long && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="mt-2 text-sm font-semibold text-ocean-600 hover:underline"
            >
              {open ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </article>
  )
}

export function Reviews() {
  const [data, setData] = useState<ReviewsData | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/reviews', { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then((r) => (r.ok && r.headers.get('content-type')?.includes('application/json') ? r.json() : null))
      .then((d: ReviewsData | null) => setData(d ?? { configured: false }))
      .catch(() => {
        if (!ctrl.signal.aborted) setData({ configured: false })
      })
    return () => ctrl.abort()
  }, [])

  if (!data || !data.configured || !data.writeReviewUrl) return null

  const reviews = data.reviews ?? []

  // No reviews yet: invite customers to leave the first ones
  if (reviews.length === 0) {
    return (
      <section id="reviews" aria-label="Google reviews" className="bg-white py-14 md:py-20">
        <div className="container-page">
          <Reveal className="flex flex-col items-center gap-6 rounded-[28px] border border-line bg-aqua-50 px-6 py-10 text-center md:flex-row md:gap-8 md:px-12 md:text-left">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_10px_24px_-12px_rgb(10_42_92/0.35)]">
              <FcGoogle size={34} aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="font-display text-[26px] leading-tight font-bold text-navy-800 md:text-[32px]">
                Happy with your pool? Tell your neighbors.
              </h2>
              <p className="text-muted md:text-lg">
                A quick Google review helps other Colorado homeowners find reliable pool care — and means a lot to our
                local team.
              </p>
            </div>
            <ButtonLink href={data.writeReviewUrl} data-track="click_review" className="max-md:w-full">
              Leave a Google Review
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    )
  }

  const rating = data.rating ?? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const total = data.total || reviews.length

  return (
    <section id="reviews" className="bg-white py-16 md:py-28">
      <div className="container-page flex flex-col gap-10 md:gap-14">
        <SectionHeader
          eyebrow="Reviews"
          title="What Our Customers Say"
          text="Real reviews from homeowners across the Denver metro and the Front Range, straight from Google."
        />

        <Reveal className="flex flex-col items-center justify-between gap-6 rounded-[24px] border border-line bg-surface px-6 py-6 md:flex-row md:px-10">
          <div className="flex items-center gap-4">
            <FcGoogle size={40} aria-hidden="true" />
            <div>
              <span className="block text-sm font-semibold tracking-wide text-muted uppercase">Google Rating</span>
              <span className="flex items-center gap-3">
                <span className="font-display text-[34px] leading-none font-bold text-navy-800">{rating.toFixed(1)}</span>
                <Stars value={rating} size={20} />
              </span>
              <span className="block text-sm text-muted">
                Based on {total} review{total === 1 ? '' : 's'}
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {data.reviewsUrl && (
              <ButtonLink href={data.reviewsUrl} variant="outline-navy" size="sm" arrow={false}>
                See all on Google
              </ButtonLink>
            )}
            <ButtonLink href={data.writeReviewUrl} data-track="click_review" size="sm" arrow={false}>
              Write a Review
            </ButtonLink>
          </div>
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reviews.map((r, i) => (
            <Reveal as="li" key={`${r.author}-${i}`} delay={(i % 3) * 90}>
              <ReviewCard review={r} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
