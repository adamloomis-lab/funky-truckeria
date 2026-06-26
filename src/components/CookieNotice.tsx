import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { Cookie, X } from 'lucide-react'

// Playful, on-brand cookie notice. Non-blocking bottom card (not a modal). Starts
// closed so SSR/prerender output matches the first client render (no hydration
// mismatch), then opens shortly after mount unless already acknowledged.
const KEY = 'cookie-consent'

export default function CookieNotice() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let answered = false
    try {
      const val = localStorage.getItem(KEY)
      answered = val === 'accepted' || val === 'declined'
    } catch {
      /* storage unavailable */
    }
    if (answered) return
    const t = setTimeout(() => setOpen(true), 700)
    return () => clearTimeout(t)
  }, [])

  const respond = (choice: 'accepted' | 'declined') => {
    setOpen(false)
    try {
      localStorage.setItem(KEY, choice)
    } catch {
      /* ignore */
    }
  }

  if (!open) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[70] sm:left-5 sm:right-auto sm:max-w-md"
    >
      <div className="rise relative overflow-hidden rounded-xl border border-line bg-card/95 p-5 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)] backdrop-blur-md">
        {/* marigold top accent bar */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-marigold" />
        <button
          type="button"
          onClick={() => respond('declined')}
          aria-label="Decline cookies and close"
          className="absolute right-3 top-3 text-ink-faint transition-colors hover:text-ink"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marigold/15 text-marigold">
            <Cookie size={22} />
          </span>
          <div className="pr-4">
            <h2 className="font-display text-[22px] uppercase tracking-[0.02em] text-ink">
              Cookies? We&rsquo;re more of a taco place.
            </h2>
            <p className="mt-2 text-body-md text-ink-soft">
              This site uses cookies to keep things running smoothly. We never sell your data.{' '}
              <Link href="/privacy" className="text-marigold underline underline-offset-2 hover:text-marigold-light">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="button"
                onClick={() => respond('accepted')}
                className="inline-flex items-center rounded bg-brick px-6 py-3 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-on-brick transition-colors hover:bg-brick-dark"
              >
                Dig In
              </button>
              <button
                type="button"
                onClick={() => respond('declined')}
                className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-faint transition-colors hover:text-ink"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
