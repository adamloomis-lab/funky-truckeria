import { useState, useRef } from 'react'
import type { FormEvent } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Car,
  ShoppingBag,
  MessageCircle,
  Truck,
  PartyPopper,
  Briefcase,
} from 'lucide-react'
import { company } from '../data/site'
import { faqs } from '../lib/seo'
import HoursList from '../components/HoursList'
import OpenNow from '../components/OpenNow'
import FactoryBackdrop from '../components/FactoryBackdrop'
import {
  FloatField,
  IconCardSelect,
  CrossLinkCard,
  SheenSubmit,
  SuccessCheck,
  type IconCardOption,
} from '../components/FluidField'

// Subject values are identical to the previous <select> options so the Netlify
// "contact" form submissions read exactly the same.
const subjectOptions: IconCardOption[] = [
  { value: 'General Question', label: 'General Question', icon: MessageCircle },
  { value: 'Food Truck / Catering', label: 'Food Truck / Catering', icon: Truck },
  { value: 'Private Event', label: 'Private Event', icon: PartyPopper },
  { value: 'Feedback', label: 'Feedback', icon: MessageCircle },
]

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectInvalid, setSubjectInvalid] = useState(false)
  const formCardRef = useRef<HTMLDivElement>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    if (!subject) {
      setSubjectInvalid(true)
      return
    }
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form) as never) as Record<string, string>
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...data }),
      })
      if (!res.ok) throw new Error()
      setFirstName((data.name || '').trim().split(/\s+/)[0] || '')
      setSent(true)
      form.reset()
      setSubject('')
      requestAnimationFrame(() =>
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      )
    } catch {
      setError(true)
    }
  }

  return (
    <>
      {/* ---------- HEADER ---------- */}
      <section className="steel-panel brick-texture relative overflow-hidden">
        <FactoryBackdrop src="/images/patio.webp" />
        <div className="container-x relative z-10 pt-36 pb-16 text-center">
          <p className="eyebrow text-marigold">Find Us in Norton Plaza</p>
          <h1 className="mt-4 font-display text-display-lg-mobile font-bold text-cream md:text-display-lg">
            Visit &amp; Contact
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg text-cream-dim">
            Stop in for tacos, order online for pickup, book the food truck, or just send us a note. We'll
            get right back to you.
          </p>
        </div>
      </section>

      {/* ---------- DETAILS + FORM ---------- */}
      <section className="bg-paper py-24 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          {/* Details */}
          <div className="reveal">
            <p className="eyebrow">Our Location</p>
            <h2 className="mt-4 font-display text-headline-lg text-ink">Norton Plaza</h2>
            <span className="brick-rule mt-5 block w-[72px]" />

            <ul className="mt-8 space-y-5 text-body-md">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="mt-0.5 shrink-0 text-brick" />
                <a href={company.mapsDir} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-brick">
                  {company.addressOneLine}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={20} className="mt-0.5 shrink-0 text-brick" />
                <span className="text-ink-soft">
                  <a href={company.phoneHref} className="hover:text-brick">{company.phone}</a>
                  {' · '}
                  <a href={company.phone2Href} className="hover:text-brick">{company.phone2}</a>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={20} className="mt-0.5 shrink-0 text-brick" />
                <a href={`mailto:${company.email}`} className="break-all text-ink-soft hover:text-brick">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Car size={20} className="mt-0.5 shrink-0 text-brick" />
                <span className="text-ink-soft">{company.parking}</span>
              </li>
              <li className="flex items-start gap-4">
                <ShoppingBag size={20} className="mt-0.5 shrink-0 text-brick" />
                <span className="text-ink-soft">
                  <a href={company.orderOnline} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                    Order pickup online (Heartland)
                  </a>
                  {' · '}
                  <a href={company.uberEats} target="_blank" rel="noopener noreferrer" className="hover:text-brick">
                    Delivery on Uber Eats
                  </a>
                </span>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              <a
                href={company.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded border border-line text-ink-soft transition-colors hover:border-brick hover:text-brick"
                aria-label="The Funky Truckeria on Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded border border-line text-ink-soft transition-colors hover:border-brick hover:text-brick"
                aria-label="The Funky Truckeria on Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>

            <div className="mt-10 rounded-lg border border-line bg-card p-7">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-brick" />
                <h3 className="font-display text-headline-sm text-ink">Hours</h3>
              </div>
              <div className="mt-3"><OpenNow tone="light" /></div>
              <HoursList className="mt-4 -mx-2" />
            </div>
          </div>

          {/* Form */}
          <div className="reveal">
            <div ref={formCardRef} className="scroll-mt-28 rounded-lg border border-line bg-card p-8 md:p-10">
              <p className="eyebrow">Send a Message</p>
              <h2 className="mt-4 font-display text-headline-md text-ink">Get in Touch</h2>

              {sent ? (
                <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-brick/40 bg-brick/5 px-6 py-12 text-center">
                  <SuccessCheck />
                  <p className="font-display text-headline-md text-ink">
                    Thank You{firstName ? `, ${firstName}` : ''}!
                  </p>
                  <p className="text-body-md text-ink-soft">
                    Your message is on its way to The Funky Truckeria. We'll get back to you as soon as we
                    can. For a faster reply, give us a call at{' '}
                    <a href={company.phoneHref} className="font-semibold text-brick-light hover:underline">
                      {company.phone}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={onSubmit}
                  className="mt-7 space-y-4"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don’t fill this out: <input name="bot-field" />
                    </label>
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FloatField idPrefix="contact" name="name" label="Name" required autoComplete="name" />
                    <FloatField idPrefix="contact" name="phone" label="Phone" type="tel" autoComplete="tel" />
                  </div>
                  <FloatField idPrefix="contact" name="email" label="Email" type="email" required autoComplete="email" />
                  <IconCardSelect
                    name="subject"
                    legend="What can we help with?"
                    options={subjectOptions}
                    value={subject}
                    onChange={(v) => {
                      setSubject(v)
                      setSubjectInvalid(false)
                    }}
                    required
                    invalid={subjectInvalid}
                  >
                    <CrossLinkCard href="/careers" label="Join our team" icon={Briefcase} />
                  </IconCardSelect>
                  <FloatField
                    idPrefix="contact"
                    name="message"
                    label="Tell us about your event, question or feedback"
                    textarea
                    rows={5}
                    required
                  />
                  {error && (
                    <p className="text-body-md text-error">
                      Oops, there was an error sending your message. Please try again later, or call{' '}
                      {company.phone}.
                    </p>
                  )}
                  <SheenSubmit>Send Message</SheenSubmit>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-paper-2 py-20 md:py-24">
        <div className="container-x max-w-3xl">
          <h2 className="text-center font-display text-headline-lg text-ink">Good to Know</h2>
          <span className="brick-rule mx-auto mt-5 block w-[72px]" />
          <dl className="mt-10 divide-y divide-line">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-display text-headline-sm text-ink">{f.q}</dt>
                <dd className="mt-2 text-body-md text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- MAP ---------- */}
      <section className="border-t border-line">
        <iframe
          title="The Funky Truckeria location, 3200 Greenwich Rd, Norton, OH"
          src={company.mapsEmbed}
          className="h-[460px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <p className="bg-steel py-3 text-center text-label-sm uppercase tracking-[0.16em] text-cream-faint">
          Serving Norton, Barberton, Wadsworth, Akron &amp; Summit County, Ohio
        </p>
      </section>
    </>
  )
}
