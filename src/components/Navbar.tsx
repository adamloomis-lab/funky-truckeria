import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Menu, Phone } from 'lucide-react'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { company } from '../data/site'
import { useScrolled } from '../hooks/useScrolled'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Food Trucks', href: '/food-trucks' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [location] = useLocation()
  const scrolled = useScrolled(40)

  // Solid dark bar once scrolled (or menu open); translucent over the hero.
  const solid = scrolled || open

  const linkBase = 'font-body text-[13px] font-semibold uppercase tracking-[0.16em] transition-colors'
  const linkColor = solid ? 'text-ink-soft hover:text-brick' : 'text-cream hover:text-cream/70'

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        solid
          ? 'border-b border-line bg-paper/95 backdrop-blur-md'
          : 'border-b border-transparent bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg focus:text-gray-900"
      >
        Skip to content
      </a>
      <nav className="container-x flex h-24 items-center justify-between sm:h-20">
        <Logo color className="h-20 sm:h-16" />

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const active = l.href === location
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`${linkBase} ${active ? 'text-brick' : linkColor}`}
              >
                {l.label}
              </Link>
            )
          })}
          <a
            href={company.phoneHref}
            className={`inline-flex items-center gap-2 ${linkBase} ${
              solid ? 'text-ink hover:text-brick' : 'text-cream hover:text-cream/70'
            }`}
          >
            <Phone size={15} className="text-brick" /> {company.phone}
          </a>
          <a
            href={company.orderOnline}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded bg-brick px-6 py-3 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-on-brick transition-colors hover:bg-brick-dark"
          >
            Order Online
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={solid ? 'text-ink lg:hidden' : 'text-cream lg:hidden'}
          aria-label="Open menu"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <Menu size={28} />
        </button>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={links} activePath={location} />
    </header>
  )
}
