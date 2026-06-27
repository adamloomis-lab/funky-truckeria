import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { ShoppingBag, Truck, ArrowRight } from 'lucide-react'
import { company } from '../data/site'

// Desktop-only floating CTA pill, revealed once the visitor scrolls past the
// hero. A glowing, sheened chili-red capsule that reads as premium. On the
// Food Trucks page it routes to the booking form; everywhere else it sends to
// the Heartland online-order menu (the money action).
export default function StickyOrder() {
  const [show, setShow] = useState(false)
  const [location] = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero')
      const threshold =
        hero && hero.offsetHeight > 0
          ? hero.offsetTop + hero.offsetHeight - 80
          : window.innerHeight * 0.6
      setShow(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location])

  // Hide on Contact (the form is already there) and Careers (job application).
  if (location === '/contact' || location === '/careers') return null

  const bookTruck = location === '/food-trucks'

  const base =
    'group fixed bottom-8 right-8 z-40 hidden items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-br from-brick to-brick-dark px-7 py-4 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-on-brick shadow-[0_16px_44px_-8px_rgba(239,63,40,0.6)] ring-1 ring-white/15 transition-all duration-300 hover:scale-[1.04] lg:flex'
  const visibility = show
    ? 'pointer-events-auto translate-y-0 opacity-100'
    : 'pointer-events-none translate-y-5 opacity-0'

  const sheen = (
    <span
      aria-hidden="true"
      className="sheen-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:funky-sheen_1s_ease]"
    />
  )

  if (bookTruck) {
    return (
      <Link href="/food-trucks#book" className={`${base} ${visibility}`}>
        {sheen}
        <Truck size={18} /> Book the Truck
        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    )
  }

  return (
    <a
      href={company.orderOnline}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${visibility}`}
    >
      {sheen}
      <ShoppingBag size={18} /> Order Online
      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  )
}
