import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import {
  Clock,
  HeartHandshake,
  HandCoins,
  Utensils,
  Flame,
  ChefHat,
  Droplets,
  ConciergeBell,
  MoreHorizontal,
  Sun,
  Sunrise,
  CalendarRange,
} from 'lucide-react'
import { company } from '../data/site'
import FactoryBackdrop from '../components/FactoryBackdrop'
import {
  FloatField,
  IconCardSelect,
  SheenSubmit,
  SuccessCheck,
  type IconCardOption,
} from '../components/FluidField'

const perks = [
  { icon: HeartHandshake, title: 'Tight-Knit Crew', blurb: 'A small, scrappy team that has each other’s backs, shift after shift.' },
  { icon: Clock, title: 'Sundays Off', blurb: 'We’re open Monday through Saturday and closed Sundays, so you get your weekends back.' },
  { icon: HandCoins, title: 'Honest Pay & Tips', blurb: 'Competitive pay, a busy lunch and dinner rush, and a loyal local following that tips well.' },
]

// Values identical to the previous selects so the Netlify "application" form
// submissions read exactly the same.
const positionOptions: IconCardOption[] = [
  { value: 'Server / Waitstaff', label: 'Server / Waitstaff', icon: Utensils },
  { value: 'Line Cook', label: 'Line Cook', icon: Flame },
  { value: 'Prep Cook', label: 'Prep Cook', icon: ChefHat },
  { value: 'Dishwasher', label: 'Dishwasher', icon: Droplets },
  { value: 'Host / Counter', label: 'Host / Counter', icon: ConciergeBell },
  { value: 'Anything available', label: 'Anything available', icon: MoreHorizontal },
]

const availabilityOptions: IconCardOption[] = [
  { value: 'Full-time', label: 'Full-time', icon: Sun },
  { value: 'Part-time', label: 'Part-time', icon: Sunrise },
  { value: 'Either', label: 'Either', icon: CalendarRange },
]

export default function Careers() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [position, setPosition] = useState('')
  const [availability, setAvailability] = useState('')
  const [picksInvalid, setPicksInvalid] = useState(false)
  const formCardRef = useRef<HTMLDivElement>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    if (!position || !availability) {
      setPicksInvalid(true)
      return
    }
    const form = e.currentTarget
    const fd = new FormData(form)
    const nameVal = String(fd.get('name') || '')
    try {
      // Multipart submit so an attached resume file uploads to Netlify.
      const res = await fetch('/', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      setFirstName(nameVal.trim().split(/\s+/)[0] || '')
      setSent(true)
      form.reset()
      setPosition('')
      setAvailability('')
      requestAnimationFrame(() =>
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    } catch {
      setError(true)
    }
  }

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="steel-panel brick-texture relative overflow-hidden">
        <FactoryBackdrop src="/images/food-truck-logo-closeup.webp" />
        <div className="container-x relative z-10 pt-36 pb-16 text-center">
          <p className="eyebrow text-marigold">Now Hiring in Norton</p>
          <h1 className="mt-4 font-display text-display-lg-mobile font-bold text-cream md:text-display-lg">
            Join the crew.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg text-cream-dim">
            We&rsquo;re always looking for friendly, hard-working people who love great food to help us
            sling the funkiest tacos in Northeast Ohio. Fill out the quick application below and we&rsquo;ll
            be in touch.
          </p>
        </div>
      </section>

      {/* ---------- WHY WORK HERE ---------- */}
      <section className="bg-paper py-20 md:py-24">
        <div className="container-x">
          <div className="reveal-group grid gap-10 sm:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title}>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brick/12 text-brick">
                  <p.icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-headline-sm text-ink">{p.title}</h3>
                <p className="mt-2 text-body-md text-ink-soft">{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- APPLICATION ---------- */}
      <section className="bg-paper-2 py-20 md:py-24">
        <div className="container-x max-w-2xl">
          <div ref={formCardRef} className="scroll-mt-28 rounded-lg border border-line bg-card p-8 md:p-10">
            <p className="eyebrow">Apply Online</p>
            <h2 className="mt-4 font-display text-headline-md text-ink">Tell us about yourself</h2>

            {sent ? (
              <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-brick/40 bg-brick/5 px-6 py-12 text-center">
                <SuccessCheck />
                <p className="font-display text-headline-md text-ink">
                  Thank You{firstName ? `, ${firstName}` : ''}!
                </p>
                <p className="text-body-md text-ink-soft">
                  {firstName ? `${firstName}, we` : 'We'}&rsquo;ve got your application and we&rsquo;ll
                  review it soon. If it looks like a fit, we&rsquo;ll reach out to set up a time to chat.
                  Questions? Call us at{' '}
                  <a href={company.phoneHref} className="font-semibold text-brick-light hover:underline">
                    {company.phone}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form
                name="application"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                encType="multipart/form-data"
                onSubmit={onSubmit}
                className="mt-7 space-y-4"
              >
                <input type="hidden" name="form-name" value="application" />
                <p className="hidden">
                  <label>
                    Don’t fill this out: <input name="bot-field" />
                  </label>
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatField idPrefix="app" name="name" label="Full name" required autoComplete="name" />
                  <FloatField idPrefix="app" name="phone" label="Phone" type="tel" required autoComplete="tel" />
                </div>
                <FloatField idPrefix="app" name="email" label="Email" type="email" required autoComplete="email" />
                <IconCardSelect
                  name="position"
                  legend="Position of interest"
                  options={positionOptions}
                  value={position}
                  onChange={(v) => {
                    setPosition(v)
                    setPicksInvalid(false)
                  }}
                  required
                  invalid={picksInvalid && !position}
                  cols={3}
                />
                <IconCardSelect
                  name="availability"
                  legend="Availability"
                  options={availabilityOptions}
                  value={availability}
                  onChange={(v) => {
                    setAvailability(v)
                    setPicksInvalid(false)
                  }}
                  required
                  invalid={picksInvalid && !availability}
                  cols={3}
                />
                <FloatField
                  idPrefix="app"
                  name="experience"
                  label="Tell us a little about your experience and when you can start"
                  textarea
                  rows={4}
                />
                <div>
                  <label className="mb-2 block text-[13px] uppercase tracking-[0.14em] text-ink-faint">
                    Resume (optional, PDF or Word)
                  </label>
                  <input
                    className="w-full rounded border border-line bg-card px-4 py-3 text-body-md text-ink-soft file:mr-4 file:rounded file:border-0 file:bg-brick file:px-4 file:py-2 file:font-display file:text-[12px] file:uppercase file:tracking-[0.14em] file:text-on-brick hover:file:bg-brick-dark"
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                {error && (
                  <p className="text-body-md text-error">
                    Oops, something went wrong sending your application. Please try again, or call us at{' '}
                    {company.phone}.
                  </p>
                )}
                <SheenSubmit>Submit Application</SheenSubmit>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
