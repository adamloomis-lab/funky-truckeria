import { useEffect, useState } from 'react'
import { ShoppingBag, ArrowRight, Thermometer } from 'lucide-react'
import { Link } from 'wouter'
import { computeStatus, type Status } from '../lib/openStatus'
import { fetchNortonWeather, isCozyWeather, type Weather } from '../lib/weather'
import { company } from '../data/site'

// "Tonight at the Truckeria", a contextual band under the home hero that reads
// the restaurant's live clock + Norton weather and greets visitors differently
// by the moment: griddle's-hot, last call, doors-open-at, or back-on-{day}.
// Client-only (renders nothing until mounted), so it's never stale.

type Copy = { kicker: string; headline: string; body: string; cta: 'order' | 'menu' }

function copyFor(s: Status, w: Weather | null): Copy {
  // Cozy weather while the kitchen's open beats every other message.
  if (w && isCozyWeather(w) && (s.kind === 'open' || s.kind === 'closing')) {
    return {
      kicker: 'Taco weather',
      headline: `${w.temp}° and ${w.label.toLowerCase()} in Norton`,
      body: `Sounds like a night for tacos, not cooking. Kitchen's open 'til ${s.closes}.`,
      cta: 'order',
    }
  }
  if (s.kind === 'closing') {
    return {
      kicker: 'Last call',
      headline: `Kitchen closes at ${s.closes}`,
      body: 'Still time to get an order in, built fresh like always.',
      cta: 'order',
    }
  }
  if (s.kind === 'open') {
    return {
      kicker: 'Tonight at the Truckeria',
      headline: `The griddle's hot 'til ${s.closes}`,
      body: 'Order online for pickup, every taco is built the moment you order it.',
      cta: 'order',
    }
  }
  if (s.opensDay === null) {
    return {
      kicker: 'Coming up today',
      headline: `Doors open at ${s.opens}`,
      body: 'Browse the menu now, we’ll see you soon.',
      cta: 'menu',
    }
  }
  return {
    kicker: 'That’s a wrap',
    headline: `Back ${s.opensDay} at ${s.opens}`,
    body: 'The griddle’s resting. Plan your next taco run tonight.',
    cta: 'menu',
  }
}

export default function TonightBand() {
  const [status, setStatus] = useState<Status | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    setStatus(computeStatus())
    const t = setInterval(() => setStatus(computeStatus()), 60_000)
    fetchNortonWeather().then(setWeather)
    return () => clearInterval(t)
  }, [])

  if (!status) return null
  const c = copyFor(status, weather)

  return (
    <section className="steel-panel brick-texture border-y-4 border-brick" aria-label="Tonight at the Funky Truckeria">
      <div className="container-x flex flex-col items-start gap-5 py-8 md:flex-row md:items-center md:justify-between md:py-9">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="eyebrow text-marigold">{c.kicker}</p>
            {weather && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 px-3 py-1 text-label-sm uppercase tracking-[0.16em] text-cream/75">
                <Thermometer size={12} className="text-marigold" aria-hidden="true" />
                Norton right now: {weather.temp}° · {weather.label}
              </span>
            )}
          </div>
          <h2 className="mt-2 font-display text-2xl uppercase text-cream md:text-3xl">{c.headline}</h2>
          <p className="mt-2 max-w-2xl font-body text-body-md normal-case tracking-normal text-cream/80">{c.body}</p>
        </div>
        {c.cta === 'order' ? (
          <a
            href={company.orderOnline}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-brick px-7 py-4 text-label-lg font-bold uppercase tracking-[0.14em] text-on-brick transition-colors hover:bg-brick-dark"
          >
            <ShoppingBag size={16} /> Order Online
          </a>
        ) : (
          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center gap-2 rounded border border-cream/35 px-7 py-4 text-label-lg font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:border-cream/70 hover:bg-cream/8"
          >
            See the Menu <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  )
}
