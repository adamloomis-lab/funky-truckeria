import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import { Phone, Heart, Briefcase, PartyPopper, Music, ChevronDown, Check } from 'lucide-react'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import FactoryBackdrop from '../components/FactoryBackdrop'
import { company, featurePillars } from '../data/site'

const services = [
  {
    icon: Heart,
    title: 'Weddings',
    blurb: 'Late-night tacos your guests will still be talking about. We pull the lit-up truck right up to the party.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Events',
    blurb: 'Team lunches, client appreciation, grand openings — fresh, fast and a whole lot more fun than catering trays.',
  },
  {
    icon: Music,
    title: 'Festivals & Markets',
    blurb: 'You already know us from the festival circuit. Book the funk for your next community event.',
  },
  {
    icon: PartyPopper,
    title: 'Private Parties',
    blurb: 'Birthdays, graduations, backyard blowouts — turn your celebration up a notch with build-your-own tacos.',
  },
]

const eventGallery = [
  { src: '/images/food-truck-event.webp', alt: 'The Funky Truckeria food truck serving guests at an event' },
  { src: '/images/wedding-food-truck.webp', alt: 'A bride at the lit-up Funky Truckeria truck during a private party' },
  { src: '/images/catering-buffet.webp', alt: 'An outdoor catering buffet line with chafing trays and fresh toppings' },
  { src: '/images/ahi-tuna-wonton-crisps.webp', alt: 'Seared ahi tuna on crispy wonton crisps from a catering spread' },
]

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')

export default function FoodTrucks() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [firstName, setFirstName] = useState('')
  const formCardRef = useRef<HTMLDivElement>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form) as never) as Record<string, string>
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'foodtruck', ...data }),
      })
      if (!res.ok) throw new Error()
      setFirstName((data.name || '').trim().split(/\s+/)[0] || '')
      setSent(true)
      form.reset()
      requestAnimationFrame(() =>
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    } catch {
      setError(true)
    }
  }

  const field =
    'w-full rounded border border-line bg-card px-4 py-3.5 text-body-md text-ink placeholder:text-ink-faint focus:border-brick focus-visible:outline-none focus:ring-1 focus:ring-brick/40'

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="steel-panel brick-texture relative flex min-h-[60vh] items-center overflow-hidden">
        <FactoryBackdrop src="/images/food-truck-event.webp" opacity={0.3} />
        <div className="container-x relative z-10 pt-28 text-center">
          <p className="eyebrow rise rise-1 text-marigold">Food Trucks & Catering · Northeast Ohio</p>
          <h1 className="rise rise-2 mx-auto mt-5 max-w-3xl font-display text-display-lg-mobile font-bold text-cream md:text-display-lg">
            Bring the funk to your event.
          </h1>
          <p className="rise rise-3 mx-auto mt-6 max-w-2xl text-body-lg text-cream/85">
            It started on wheels, and the trucks still roll. We'll bring award-winning street tacos — built
            fresh on site — to weddings, corporate events, festivals and private parties all across
            Northeast Ohio.
          </p>
          <div className="rise rise-4 mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#book" variant="cream">
              Request the Truck
            </Button>
            <Button href={company.phoneHref} variant="ghost">
              <Phone size={16} /> {company.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section className="bg-paper py-24 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="What We Cater" title="From our truck to your party" accent="text-magenta-light" />
          <div className="reveal-group mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="rounded-lg border border-line bg-card p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brick/12 text-brick">
                  <s.icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-headline-sm text-ink">{s.title}</h3>
                <p className="mt-2.5 text-body-md text-ink-soft">{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EVENT GALLERY ---------- */}
      <section className="bg-paper-2 py-20 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="On the Road"
            title="The truck in the wild"
            accent="text-bluetip-light"
            intro="From festival lines to wedding receptions, here's the funk out and about."
          />
          <div className="reveal-group mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {eventGallery.map((g) => (
              <div key={g.src} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY US (dark) ---------- */}
      <section className="steel-panel brick-texture py-24 md:py-28">
        <div className="container-x">
          <SectionHeading tone="dark" eyebrow="Why The Funky Truckeria" title="The most memorable thing at the party" accent="text-marigold" />
          <div className="reveal-group mt-14 grid gap-7 md:grid-cols-3">
            {featurePillars.map((p) => (
              <div key={p.title} className="rounded-lg border border-line-dark bg-steel-2/70 p-8">
                <h3 className="font-display text-headline-sm text-cream">{p.title}</h3>
                <p className="mt-2.5 text-body-md text-cream-dim">{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BOOKING FORM ---------- */}
      <section id="book" className="scroll-mt-24 bg-paper py-24 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow text-magenta-light">Book the Truck</p>
            <h2 className="mt-4 font-display text-headline-lg text-ink md:text-[40px]">
              Tell us about your event.
            </h2>
            <span className="brick-rule mt-5 block w-[72px]" />
            <p className="mt-6 text-body-lg text-ink-soft">
              Send us the details and we'll get back to you with availability and a quote. For the fastest
              response, give us a call at{' '}
              <a href={company.phoneHref} className="text-brick-light hover:underline">
                {company.phone}
              </a>
              .
            </p>
            <ul className="mt-8 space-y-3 text-body-md text-ink-soft">
              <li className="flex gap-3">
                <Check size={20} className="mt-0.5 shrink-0 text-bluetip" /> We travel across Northeast Ohio
              </li>
              <li className="flex gap-3">
                <Check size={20} className="mt-0.5 shrink-0 text-bluetip" /> Every taco built fresh, on site
              </li>
              <li className="flex gap-3">
                <Check size={20} className="mt-0.5 shrink-0 text-bluetip" /> Weddings, corporate, festivals & private parties
              </li>
              <li className="flex gap-3">
                <Check size={20} className="mt-0.5 shrink-0 text-bluetip" /> Please book 1–2 weeks ahead when you can
              </li>
            </ul>
          </div>

          <div className="reveal">
            <div ref={formCardRef} className="scroll-mt-28 rounded-lg border border-line bg-card p-8 md:p-10">
              {sent ? (
                <div className="flex flex-col items-center gap-4 rounded-lg border border-brick/40 bg-brick/5 px-6 py-14 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brick text-on-brick">
                    <Check size={28} />
                  </span>
                  <p className="font-display text-headline-md text-ink">
                    Thanks{firstName ? `, ${firstName}` : ''}!
                  </p>
                  <p className="text-body-md text-ink-soft">
                    Your event request is on its way to The Funky Truckeria. We'll get back to you with
                    availability and a quote. For a faster reply, call {company.phone}.
                  </p>
                </div>
              ) : (
                <form
                  name="foodtruck"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={onSubmit}
                  className="space-y-4"
                >
                  <input type="hidden" name="form-name" value="foodtruck" />
                  <p className="hidden">
                    <label>
                      Don’t fill this out: <input name="bot-field" />
                    </label>
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={field} type="text" name="name" placeholder="Name" required />
                    <input className={field} type="tel" name="phone" placeholder="Phone" required />
                  </div>
                  <input className={field} type="email" name="email" placeholder="Email" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <select name="event-type" defaultValue="" required className={`${field} appearance-none pr-11`}>
                        <option value="" disabled>
                          Event type
                        </option>
                        <option>Wedding</option>
                        <option>Corporate Event</option>
                        <option>Festival / Public Event</option>
                        <option>Private Party</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" />
                    </div>
                    <input className={field} type="date" name="event-date" aria-label="Event date" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={field} type="text" name="location" placeholder="Event location / city" />
                    <div className="relative">
                      <select name="guests" defaultValue="" className={`${field} appearance-none pr-11`}>
                        <option value="" disabled>
                          Estimated guests
                        </option>
                        <option>Under 25</option>
                        <option>25–50</option>
                        <option>50–100</option>
                        <option>100–200</option>
                        <option>200+</option>
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" />
                    </div>
                  </div>
                  <textarea
                    className={field}
                    name="message"
                    rows={4}
                    placeholder="Tell us about your event — what you're celebrating, timing, anything special…"
                    required
                  />
                  {error && (
                    <p className="text-body-md text-error">
                      Oops, there was an error sending your request. Please try again, or call {company.phone}.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded bg-brick px-8 py-4 font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-on-brick transition-colors hover:bg-brick-dark"
                  >
                    Request a Quote
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-brick">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-14 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-headline-md text-on-brick">Prefer to talk it through?</h2>
            <p className="mt-2 max-w-xl text-body-md text-on-brick/85">
              Give us a call and we'll help you plan menus, headcount and timing.
            </p>
          </div>
          <Button href={company.phoneHref} variant="cream">
            <Phone size={18} /> {company.phone}
          </Button>
        </div>
      </section>
    </>
  )
}
