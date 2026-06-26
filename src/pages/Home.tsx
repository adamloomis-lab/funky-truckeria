import { Phone, Clock, ArrowRight, Star, MapPin, Globe, Flame, Award, Truck } from 'lucide-react'
import Button from '../components/Button'
import Logo from '../components/Logo'
import SectionHeading from '../components/SectionHeading'
import MatchDivider from '../components/MatchDivider'
import SkullWatermark from '../components/SkullWatermark'
import HeroCarousel from '../components/HeroCarousel'
import Marquee from '../components/Marquee'
import {
  company,
  featurePillars,
  reviews,
  ratings,
  ratingSummary,
  gallery,
} from '../data/site'

// Icons paired to featurePillars (Worldly Flavors / Built Fresh / Award-Winning).
const pillarIcons = [Globe, Flame, Award]

// Scrolling ticker phrases — awards, the Taco Tuesday special, and flavors.
const tickerItems = [
  'Voted Best Taco — Cleveland.com',
  "Best Mexican — Akron's Beacon's Best",
  '$1 Off All Tacos Every Tuesday',
  'Best Chef Akron',
  'Tacos Chingones',
  'Korean BBQ · Thai · Huli Huli · Baja',
  'Celebrating 10 Years',
]

const signatures = [
  {
    name: 'Korean BBQ Steak',
    desc: 'Kimchi slaw, BBQ Angus steak, Asian sauce, sesame and cilantro on a warm flour tortilla. One of the worldly tacos that put us on the map.',
    img: '/images/korean-bbq-taco.webp',
  },
  {
    name: 'Baja Fish & Bang-Bang Shrimp',
    desc: 'Crispy seasonal fish or fried shrimp, feathered cabbage, poblano crema, avocado and pico. West-coast street style, Norton-made.',
    img: '/images/fish-tacos.webp',
  },
  {
    name: 'Loaded Funky Nachos',
    desc: 'Fresh corn chips, queso, beans, poblano crema, avocado salsa verde and pico — pile on birria, chorizo or asada steak.',
    img: '/images/loaded-nachos.webp',
  },
]

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-12">
        <HeroCarousel />
        <div className="smoke-overlay absolute inset-0" />
        <div className="container-x relative z-10 pt-28 pb-16">
          <div className="max-w-2xl">
            <p className="eyebrow rise rise-1 text-marigold">Norton, Ohio · Tacos Chingones</p>
            <h1 className="rise rise-2 mt-5 font-display text-display-lg-mobile font-bold leading-[0.96] text-cream md:text-display-xl">
              Mexican Street Food.
              <span className="block text-brick-light">Global Flavor.</span>
            </h1>
            <h2 className="rise rise-3 mt-6 max-w-xl font-body text-body-lg font-normal normal-case tracking-normal text-cream/85">
              Tacos, burritos, nachos, and more, built fresh the second you order.
            </h2>
            <div className="rise rise-4 mt-9 flex flex-col gap-4 sm:flex-row">
              <Button href={company.orderOnline} external>
                Order Online
              </Button>
              <Button href="/menu" variant="ghost">
                See the Menu <ArrowRight size={16} />
              </Button>
            </div>
            <div className="rise rise-5 mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-label-lg uppercase tracking-[0.16em] text-cream/75">
              <span className="inline-flex items-center gap-2">
                <Clock size={15} className="text-marigold" /> Mon–Sat · Lunch & Dinner
              </span>
              <span className="inline-flex items-center gap-2">
                <Star size={15} className="fill-marigold text-marigold" /> {ratingSummary.value}★ on Google
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-marigold" /> Norton Plaza
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- AWARD / SPECIALS MARQUEE ---------- */}
      <section className="border-y-2 border-steel bg-marigold py-3.5 text-steel">
        <Marquee items={tickerItems} label="Awards and specials" />
      </section>

      {/* ---------- MISSION ---------- */}
      <section className="relative overflow-hidden bg-paper py-24 md:py-28">
        <SkullWatermark />
        <div className="container-x relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="reveal">
              <p className="eyebrow text-bluetip-light">Not Your Average Taco</p>
              <h2 className="mt-4 max-w-xl font-display text-headline-lg text-ink md:text-[44px]">
                Worldly flavor, slung from a hidden gem.
              </h2>
              <span className="brick-rule mt-5 block w-[72px]" />
              <p className="mt-6 max-w-xl text-body-lg text-ink-soft">
                Two award-winning food-truck chefs, one tiny taqueria tucked into Norton Plaza, and a menu
                that runs from Korean BBQ and Thai peanut to Caribbean jerk, Huli Huli and Baja fish. These
                are definitely not Taco Bell tacos.
              </p>
              <p className="mt-4 max-w-xl text-body-lg text-ink-soft">
                Every order is built fresh the moment you place it. {company.parking}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/menu">
                  Browse the Menu <ArrowRight size={16} />
                </Button>
                <Button href="/about" variant="outline">
                  Our Story
                </Button>
              </div>
            </div>

            {/* Framed photo with an offset accent frame for a gallery feel */}
            <div className="reveal relative mx-auto w-full max-w-md lg:mr-0">
              <div
                aria-hidden="true"
                className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-lg border-2 border-marigold/55 sm:block"
              />
              <img
                src="/images/street-corn-elote.webp"
                alt="Mexican street corn (elote) on a stick with cotija, crema and chili"
                loading="lazy"
                className="relative aspect-[4/5] w-full rounded-lg object-cover shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]"
              />
              <span className="absolute bottom-3 left-3 right-3 rounded bg-steel/85 px-4 py-2 text-center font-display text-[13px] uppercase tracking-[0.16em] text-cream backdrop-blur-sm">
                Built fresh to order
              </span>
            </div>
          </div>

          {/* Values — clean icon row */}
          <div className="reveal-group mt-20 grid gap-x-10 gap-y-12 border-t border-line pt-14 sm:grid-cols-3">
            {featurePillars.map((p, i) => {
              const Icon = pillarIcons[i]
              return (
                <div key={p.title}>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brick/12 text-brick">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-headline-sm text-ink">{p.title}</h3>
                  <p className="mt-2 text-body-md text-ink-soft">{p.blurb}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <MatchDivider bg="bg-paper" />

      {/* ---------- SIGNATURE DISHES ---------- */}
      <section className="bg-paper-2 py-24 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Crowd Favorites"
            title="A few funky standouts"
            accent="text-magenta-light"
            intro="Seventeen funky tacos, big 14-inch burritos, quesadillas, loaded nachos and more — here's a taste."
          />
          <div className="reveal-group mt-14 grid gap-7 md:grid-cols-3">
            {signatures.map((s) => (
              <article
                key={s.name}
                className="group overflow-hidden rounded-lg border border-line bg-card shadow-[0_18px_45px_-30px_rgba(0,0,0,0.6)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-headline-sm text-ink">{s.name}</h3>
                  <p className="mt-2 text-body-md text-ink-soft">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/menu">See the Full Menu</Button>
          </div>
        </div>
      </section>

      {/* ---------- TACO TUESDAY ---------- */}
      <section className="relative overflow-hidden bg-paper-2 py-20 md:py-24">
        <SkullWatermark />
        <div className="container-x relative z-10">
          <div className="grid items-center gap-10 overflow-hidden rounded-2xl border border-line bg-card p-5 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)] md:p-8 lg:grid-cols-2 lg:gap-12">
            <div className="overflow-hidden rounded-xl border border-line-dark">
              <img
                src="/images/taco-tuesday.webp"
                alt="Taco Tuesday at The Funky Truckeria — $1 off all tacos every Tuesday"
                loading="lazy"
                className="w-full"
              />
            </div>
            <div className="lg:pr-6">
              <p className="eyebrow text-marigold">Every Tuesday</p>
              <h2 className="mt-4 font-display text-headline-lg text-ink md:text-[44px]">
                It&rsquo;s Taco Tuesday.
              </h2>
              <span className="brick-rule mt-5 block w-[72px]" />
              <p className="mt-6 text-body-lg text-ink-soft">
                <strong className="font-semibold text-ink">$1 off all tacos</strong>, every single Tuesday.
                Same funky fusion flavors — Korean BBQ, Thai, Baja fish, birria and more — for a little
                less. Fresh tortillas, bold sauces, street-style attitude. Always funky.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={company.orderOnline} external>
                  Order Pickup
                </Button>
                <Button href="/menu" variant="outline">
                  See the Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOD TRUCK TEASER (dark) ---------- */}
      <section className="steel-panel brick-texture relative overflow-hidden py-24 md:py-28">
        <img
          src="/images/food-truck-event.webp"
          alt=""
          aria-hidden="true"
          className="parallax pointer-events-none absolute inset-x-0 top-0 h-[120%] w-full object-cover opacity-[0.14] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-steel/50 via-transparent to-steel/80" />
        <div className="container-x relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="reveal overflow-hidden rounded-lg border border-line-dark">
              <img
                src="/images/food-truck-event.webp"
                alt="The Funky Truckeria food truck serving a line of customers at an event"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="reveal">
              <p className="eyebrow text-marigold">It Started on Wheels</p>
              <h2 className="mt-4 font-display text-headline-lg text-cream md:text-[44px]">
                Bring the funk to your event.
              </h2>
              <span className="brick-rule mt-5 block w-[72px]" />
              <p className="mt-6 max-w-xl text-body-lg text-cream-dim">
                Before the brick-and-mortar, there were two food trucks slinging tacos across Northeast
                Ohio — and they still roll. Book us for weddings, corporate events, festivals and private
                parties, and we'll bring the whole funky operation to you.
              </p>
              <div className="mt-8">
                <Button href="/food-trucks" variant="ghost">
                  <Truck size={16} className="text-marigold" /> Food Trucks & Catering
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- GALLERY STRIP ---------- */}
      <section className="bg-paper py-24 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Straight From the Kitchen"
            title="Eat with your eyes first"
            accent="text-bluetip-light"
            intro="Bold flavors, big portions, and the kind of food locals drive across town for."
          />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.slice(0, 8).map((g) => (
            <div key={g.src} className="group relative aspect-square overflow-hidden rounded">
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      <MatchDivider bg="bg-paper" />

      {/* ---------- REVIEWS ---------- */}
      <section className="relative overflow-hidden bg-paper-2 py-24 md:py-28">
        <SkullWatermark />
        <div className="container-x relative z-10">
          <SectionHeading eyebrow="Voted Best Taco in NE Ohio" title="People keep coming back" accent="text-marigold" />

          {/* Per-platform rating badges */}
          <div className="reveal-group mt-10 flex flex-wrap justify-center gap-4">
            {ratings.map((r) => (
              <div
                key={r.platform}
                className="flex items-center gap-3 rounded-lg border border-line bg-card px-5 py-3"
              >
                <span className="font-display text-[28px] leading-none text-brick-light">{r.value}</span>
                <span className="text-left">
                  <span className="block font-display text-[15px] uppercase tracking-[0.08em] text-ink">
                    {r.platform}
                  </span>
                  <span className="block text-[12px] text-ink-faint">{r.detail}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="reveal-group mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((r, i) => (
              <figure key={i} className="rounded-lg border border-line bg-card p-7">
                <div className="flex gap-0.5 text-marigold">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={15} className="fill-marigold text-marigold" />
                  ))}
                </div>
                <blockquote className="mt-4 text-body-md text-ink-soft">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 font-display text-sm uppercase tracking-[0.14em] text-brick-light">
                  {r.source}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href={company.social.facebook} variant="outline" external>
              See More on Facebook
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- CTA BAND ---------- */}
      <section className="bg-brick">
        <div className="container-x flex flex-col items-center justify-between gap-8 py-14 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-6">
            <Logo color className="hidden h-24 shrink-0 sm:block" />
            <div>
              <h2 className="font-display text-headline-md text-on-brick">Hungry yet?</h2>
              <p className="mt-2 max-w-xl text-body-md text-on-brick/85">
                Order online for pickup, or give us a call — we'll have your funky tacos ready when you are.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={company.orderOnline}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded bg-cream px-8 py-4 font-body text-[14px] font-semibold uppercase tracking-[0.14em] text-steel transition-colors hover:bg-cream-dim"
            >
              Order Online
            </a>
            <a
              href={company.phoneHref}
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded border border-cream/40 px-8 py-4 font-body text-[14px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-cream/10"
            >
              <Phone size={18} /> {company.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
