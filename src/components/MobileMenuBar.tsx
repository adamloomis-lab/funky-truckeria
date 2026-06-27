import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { UtensilsCrossed, ShoppingBag, Phone } from 'lucide-react'
import { company } from '../data/site'

// Elevated floating action capsule on mobile only. A blurred near-black bar
// that stands off the edge with a big shadow: a glassy secondary action and a
// glowing chili-red PRIMARY (Order Online, the money action). Slides up once
// you've scrolled past the hero, then tucks away near the footer so it never
// covers contact info. Starts hidden so SSR/first client render match.
export default function MobileMenuBar() {
  const [show, setShow] = useState(false)
  const [location] = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 520
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 140
      setShow(scrolled && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const onMenu = location === '/menu'
  const secondary =
    'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-cream/10 px-3 py-3.5 font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-cream transition-all active:scale-95'
  const primary =
    'group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-brick px-3 py-3.5 font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-on-brick animate-glow-pulse transition-all active:scale-95'

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 transition-transform duration-300 lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-[150%]'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex gap-2 rounded-2xl border border-cream/10 bg-paper/85 p-2 shadow-[0_16px_44px_-8px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        {onMenu ? (
          <a href={company.phoneHref} className={secondary} tabIndex={show ? 0 : -1}>
            <Phone size={16} className="text-brick-light" /> Call
          </a>
        ) : (
          <Link href="/menu" className={secondary} tabIndex={show ? 0 : -1}>
            <UtensilsCrossed size={16} className="text-brick-light" /> See the Menu
          </Link>
        )}
        <a
          href={company.orderOnline}
          target="_blank"
          rel="noopener noreferrer"
          className={primary}
          tabIndex={show ? 0 : -1}
        >
          <span
            aria-hidden="true"
            className="sheen-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:funky-sheen_0.9s_ease]"
          />
          <span className="relative inline-flex items-center gap-2">
            <ShoppingBag size={16} /> Order Online
          </span>
        </a>
      </div>
    </div>
  )
}
