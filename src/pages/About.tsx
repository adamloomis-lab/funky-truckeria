import { Trophy, ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import FactoryBackdrop from '../components/FactoryBackdrop'
import { storyHighlights, awards, company } from '../data/site'

export default function About() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="steel-panel brick-texture relative overflow-hidden">
        <FactoryBackdrop src="/images/food-truck-side-graphic.webp" />
        <div className="container-x relative z-10 pt-36 pb-20 text-center">
          <p className="eyebrow rise rise-1 text-marigold">Norton, Ohio · Tacos Chingones</p>
          <h1 className="rise rise-2 mx-auto mt-5 max-w-4xl font-display text-display-lg-mobile font-bold leading-[0.96] text-cream md:text-display-xl">
            It started
            <span className="block text-brick-light">on wheels.</span>
          </h1>
          <p className="rise rise-3 mx-auto mt-6 max-w-2xl text-body-lg text-cream-dim">
            Two award-winning food-truck chefs, a sombrero-sporting skeleton, and a stubborn belief that a
            taco can be the best thing you eat all week. Serving Norton since 2015. That's The Funky
            Truckeria.
          </p>
        </div>
      </section>

      {/* ---------- INTRO ---------- */}
      <section className="bg-paper py-24 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow">Where the Funk Comes From</p>
            <h2 className="mt-4 font-display text-headline-lg text-ink md:text-[40px]">
              Street-food chops, worldly taste.
            </h2>
            <span className="brick-rule mt-5 block w-[72px]" />
            <p className="mt-6 text-body-lg text-ink-soft">
              We cut our teeth on the Northeast Ohio festival circuit, slinging West Coast street tacos out
              of two food trucks. Customers kept asking where they could find us between events, so we
              planted roots in Norton Plaza, part of the {company.parentBrand} family.
            </p>
            <p className="mt-4 text-body-lg text-ink-soft">
              The result is a hidden gem that's "small but very nice and neat, not a normal Norton spot."
              About six tables, a cozy patio, a spacious lot, and a menu that travels from Korea to the
              Caribbean to Baja and back. Every taco is built fresh when you order it. Worth the wait.
            </p>
          </div>
          <div className="reveal overflow-hidden rounded-lg border border-line bg-card">
            <img
              src="/images/food-truck-event.webp"
              alt="The Funky Truckeria food truck serving a line of customers at an event"
              loading="lazy"
              className="w-full"
            />
            <p className="px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-ink-faint">
              The truck that started it all, out on the Northeast Ohio circuit.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- STORY HIGHLIGHTS (dark) ---------- */}
      <section className="steel-panel brick-texture py-24 md:py-28">
        <div className="container-x">
          <img
            src="/images/logo-color.webp"
            alt="The Funky Truckeria, celebrating 10 years, est. 2015"
            loading="lazy"
            className="reveal mx-auto mb-8 h-40 w-40 rounded-full ring-1 ring-line-dark md:h-48 md:w-48"
          />
          <SectionHeading tone="dark" eyebrow="Celebrating 10 Years · Est. 2015" title="How we got here" accent="text-bluetip-light" />
          <div className="reveal-group mt-14 grid gap-7 md:grid-cols-3">
            {storyHighlights.map((s) => (
              <div key={s.title} className="rounded-lg border border-line-dark bg-steel-2/70 p-8">
                <span className="font-display text-[14px] uppercase tracking-[0.18em] text-marigold">
                  {s.label}
                </span>
                <h3 className="mt-2 font-display text-headline-sm text-cream">{s.title}</h3>
                <p className="mt-2.5 text-body-md text-cream-dim">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AWARDS ---------- */}
      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Recognition"
            title="Voted the best, more than once"
            accent="text-magenta-light"
            intro="We're proud of the love from our community and the local press."
          />
          <div className="reveal-group mt-12 grid gap-6 sm:grid-cols-3">
            {awards.map((a) => (
              <div
                key={a}
                className="flex flex-col items-center gap-3 rounded-lg border border-line bg-card p-8 text-center"
              >
                <Trophy size={28} className="text-marigold" />
                <span className="font-display text-headline-sm uppercase tracking-[0.04em] text-ink">
                  {a}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- LEGACY / CTA TEASER ---------- */}
      <section className="bg-paper py-24 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal overflow-hidden rounded-lg border border-line bg-card">
            <img
              src="/images/patio.webp"
              alt="The Funky Truckeria's outdoor patio in Norton Plaza with picnic tables, shade sails and string lights"
              loading="lazy"
              className="w-full"
            />
          </div>
          <div className="reveal">
            <p className="eyebrow">Still Rolling</p>
            <h2 className="mt-4 font-display text-headline-lg text-ink md:text-[40px]">
              Come find the hidden gem.
            </h2>
            <span className="brick-rule mt-5 block w-[72px]" />
            <p className="mt-6 text-body-lg text-ink-soft">
              Pull into Norton Plaza for lunch or dinner, grab a patio seat, and taste what all the fuss is
              about. Or book the trucks and we'll bring the funk to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/menu">
                See the Menu <ArrowRight size={16} />
              </Button>
              <Button href="/food-trucks" variant="outline">
                Food Trucks & Catering
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-brick">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-14 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-headline-md text-on-brick">Hungry for the funk?</h2>
            <p className="mt-2 max-w-xl text-body-md text-on-brick/85">
              Find us at {company.address.street}, {company.address.city}. Open Monday through Saturday.
            </p>
          </div>
          <Button href="/menu" variant="cream">
            Explore the Menu
          </Button>
        </div>
      </section>
    </>
  )
}
