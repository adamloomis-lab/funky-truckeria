import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { X, Phone, MapPin, Clock, ArrowRight, Facebook, Instagram, ShoppingBag } from 'lucide-react'
import { company, hoursCompact } from '../data/site'

export interface MobileMenuProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly links: ReadonlyArray<{ label: string; href: string }>
  readonly activePath: string
}

// Full-screen, high-trust mobile navigation. Backdrop-blurred near-black panel
// slides in from the right with a chili-red glow, staggered link entrance, and
// prominent Order / Call CTAs. Scroll-locked, aria-modal, closes on Escape.
export default function MobileMenu({ open, onClose, links, activePath }: MobileMenuProps) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKey)
      const id = requestAnimationFrame(() => setShown(true))
      return () => {
        cancelAnimationFrame(id)
        window.removeEventListener('keydown', onKey)
        document.body.style.overflow = ''
      }
    }
    setShown(false)
    document.body.style.overflow = ''
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        className={`relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-paper-2 text-cream shadow-[0_0_60px_rgba(239,63,40,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="brick-texture pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative flex min-h-full flex-col px-7 pb-10 pt-6">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={onClose} aria-label="The Funky Truckeria, home">
              <img src="/images/logo-color.webp" alt="The Funky Truckeria" className="h-14 w-auto rounded-full" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:bg-cream/10"
            >
              <X size={24} />
            </button>
          </div>

          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brick px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-on-brick">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" /> Award-Winning Tacos
          </span>

          <nav className="mt-6 flex flex-col">
            {links.map((l, i) => {
              const active = l.href === activePath
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between border-b border-line py-4 font-display text-[26px] uppercase transition-all duration-500 hover:text-brick-light ${
                    active ? 'text-brick' : 'text-cream/90'
                  } ${shown ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
                  style={{ transitionDelay: `${120 + i * 70}ms` }}
                >
                  {l.label}
                  <ArrowRight
                    size={20}
                    className="text-cream/30 transition-all group-hover:translate-x-1 group-hover:text-brick-light"
                  />
                </Link>
              )
            })}
          </nav>

          <div
            className={`mt-8 flex flex-col gap-3 transition-all duration-500 ${
              shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${120 + links.length * 70 + 60}ms` }}
          >
            <a
              href={company.orderOnline}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-lg bg-brick px-6 py-4 font-body text-[13px] font-bold uppercase tracking-[0.16em] text-on-brick shadow-[0_12px_30px_-10px_rgba(239,63,40,0.7)]"
            >
              <ShoppingBag size={18} /> Order Online
            </a>
            <a
              href={company.phoneHref}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-cream/70 px-6 py-4 font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-paper"
            >
              <Phone size={18} /> Call {company.phone}
            </a>
          </div>

          <div className="mt-auto space-y-3 pt-10 font-body text-body-md text-cream/70">
            <a
              href={company.mapsDir}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-cream"
            >
              <MapPin size={18} className="shrink-0 text-brick-light" /> {company.addressOneLine}
            </a>
            <p className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-brick-light" />
              <span>
                {hoursCompact.map((h) => `${h.day} ${h.time}`).join(' · ')}
              </span>
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href={company.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="The Funky Truckeria on Facebook"
                className="text-brick-light hover:text-cream"
              >
                <Facebook size={20} />
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="The Funky Truckeria on Instagram"
                className="text-brick-light hover:text-cream"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
