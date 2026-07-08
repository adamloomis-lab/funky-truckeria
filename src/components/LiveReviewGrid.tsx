import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { company, reviews as staticReviews } from '../data/site'

// Live Google reviews grid. The curated quotes from site.ts render at SSR
// (guaranteed content + SEO), then on mount we fetch /api/reviews (Places API,
// merged most-relevant + newest) and swap in fresh reviews with real author
// names. Tops up with the curated set so the grid never shrinks below 4.

type Card = { quote: string; source: string; when?: string }

interface LiveReview { author: string; rating: number | null; text: string; when: string }
interface ReviewsResponse { configured?: boolean; found?: boolean; rating?: number | null; total?: number | null; reviews?: LiveReview[] }

const initialCards: Card[] = staticReviews.map((r) => ({ quote: r.quote, source: r.source }))

export default function LiveReviewGrid({
  onSummary,
}: {
  readonly onSummary?: (rating: number, total: number) => void
}) {
  const [cards, setCards] = useState<Card[]>(initialCards)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/reviews?id=${encodeURIComponent(company.placeId)}`)
      .then((r) => r.json())
      .then((d: ReviewsResponse) => {
        if (cancelled || !d || d.configured === false || !d.found) return
        if (d.reviews && d.reviews.length) {
          const live: Card[] = d.reviews
            .filter((r) => (r.rating ?? 5) >= 4 && r.text.length > 30)
            .slice(0, 8)
            .map((r) => ({ quote: r.text, source: r.author, when: r.when }))
          const merged = [...live]
          for (const c of initialCards) {
            if (merged.length >= 8) break
            merged.push(c)
          }
          if (merged.length >= 4) setCards(merged.slice(0, merged.length >= 8 ? 8 : 4))
        }
        if (typeof d.rating === 'number' && typeof d.total === 'number' && onSummary) {
          onSummary(d.rating, d.total)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [onSummary])

  return (
    <div className="reveal-group mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((r, i) => (
        <figure key={i} className="rounded-lg border border-line bg-card p-7">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-0.5 text-marigold">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={15} className="fill-marigold text-marigold" />
              ))}
            </div>
            {r.when && <span className="text-[11px] text-ink-faint">{r.when}</span>}
          </div>
          <blockquote className="mt-4 line-clamp-6 text-body-md text-ink-soft">&ldquo;{r.quote}&rdquo;</blockquote>
          <figcaption className="mt-4 font-display text-sm uppercase tracking-[0.14em] text-brick-light">
            {r.source}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
