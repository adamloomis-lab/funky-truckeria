import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { UtensilsCrossed, ShoppingBag, Phone } from 'lucide-react'
import { company } from '../data/site'

// Sticky bottom action bar on mobile only. Slides up once you've scrolled past
// the hero, then tucks away near the footer so it never covers contact info.
// Starts hidden so SSR/first client render match (no hydration mismatch).
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
    'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded border border-brick/60 px-3 py-3.5 font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-cream'
  const primary =
    'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded bg-brick px-3 py-3.5 font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-on-brick'

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex gap-2 border-t border-line bg-paper/95 px-3 py-3 backdrop-blur-md shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.7)]">
        {onMenu ? (
          <a href={company.phoneHref} className={secondary}>
            <Phone size={16} /> Call
          </a>
        ) : (
          <Link href="/menu" className={secondary} tabIndex={show ? 0 : -1}>
            <UtensilsCrossed size={16} /> See the Menu
          </Link>
        )}
        <a
          href={company.orderOnline}
          target="_blank"
          rel="noopener noreferrer"
          className={primary}
          tabIndex={show ? 0 : -1}
        >
          <ShoppingBag size={16} /> Order Online
        </a>
      </div>
    </div>
  )
}
