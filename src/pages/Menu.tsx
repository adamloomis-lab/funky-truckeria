import { Phone, Leaf, Flame } from 'lucide-react'
import Button from '../components/Button'
import TacoEstimator from '../components/TacoEstimator'
import FactoryBackdrop from '../components/FactoryBackdrop'
import SkullWatermark from '../components/SkullWatermark'
import { company, menuGroups, type MenuGroup } from '../data/site'

// Rotating funky accent for each category chip. [bg, text] — text picked for
// contrast against each accent.
const chipStyles = [
  'bg-brick text-on-brick',
  'bg-marigold text-steel',
  'bg-bluetip text-steel',
  'bg-magenta text-on-brick',
  'bg-purple text-cream',
  'bg-orange text-steel',
  'bg-lime text-steel',
]

function Tag({ tag }: { readonly tag: 'veg' | 'hot' }) {
  if (tag === 'veg') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-lime">
        <Leaf size={11} /> Veg
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brick/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brick-light">
      <Flame size={11} /> Hot
    </span>
  )
}

function MenuGroupCard({ group, accent }: { readonly group: MenuGroup; readonly accent: string }) {
  return (
    <div className="break-inside-avoid rounded-lg border border-line bg-card p-6 md:p-7">
      <h3
        className={`inline-block rounded px-4 py-2 font-display text-[21px] uppercase tracking-[0.04em] ${accent}`}
      >
        {group.title}
      </h3>
      {group.note && <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">{group.note}</p>}
      <ul className="mt-4 divide-y divide-line/70">
        {group.items.map((it) => (
          <li key={it.name} className="py-3 first:pt-0">
            <div className="flex items-start gap-3">
              {it.photo && (
                <img
                  src={it.photo}
                  alt={it.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="mt-0.5 h-14 w-14 shrink-0 rounded-md border border-line object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex flex-wrap items-center gap-2 font-display text-[18px] uppercase tracking-[0.02em] text-ink">
                    {it.name}
                    {it.tag && <Tag tag={it.tag} />}
                  </span>
                  {it.price && (
                    <span className="shrink-0 font-display text-[18px] text-brick-light">{it.price}</span>
                  )}
                </div>
                {it.desc && <p className="mt-1 text-body-md text-ink-soft">{it.desc}</p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Menu() {
  return (
    <>
      {/* ---------- HEADER ---------- */}
      <section className="steel-panel brick-texture relative overflow-hidden">
        <FactoryBackdrop src="/images/food-truck-side-graphic.webp" />
        <div className="container-x relative z-10 pt-36 pb-16 text-center">
          <p className="eyebrow text-marigold">Dine-In · Carry-Out · Online Ordering</p>
          <h1 className="mt-4 font-display text-display-lg-mobile font-bold text-cream md:text-display-lg">
            The Menu
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg text-cream-dim">
            More than twenty funky tacos from $5, big 14&quot; burritos, quesadillas, loaded nachos and the famous
            salted turtle nacho sundae. Order online for pickup or call{' '}
            <a href={company.phoneHref} className="text-brick-light hover:underline">
              {company.phone}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={company.orderOnline} variant="cream" external>
              Order Pickup
            </Button>
            <Button href={company.uberEats} variant="ghost" external>
              Delivery on Uber Eats
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- MENU ---------- */}
      <section className="relative overflow-hidden bg-paper py-20 md:py-24">
        <SkullWatermark />
        <div className="container-x relative z-10">
          <div className="reveal mb-8">
            <TacoEstimator />
          </div>
          <div className="reveal-group columns-1 gap-7 md:columns-2 lg:columns-3 [&>*]:mb-7">
            {menuGroups.map((g, i) => (
              <MenuGroupCard key={g.title} group={g} accent={chipStyles[i % chipStyles.length]} />
            ))}
          </div>
          <p className="mt-10 text-center text-[13px] text-ink-faint">
            *Eating raw or undercooked meats can greatly increase your chance of food-borne illness. Prices
            subject to change.
          </p>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-brick">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-headline-md text-on-brick">Ready when you are.</h2>
            <p className="mt-2 text-body-md text-on-brick/85">
              Order online for pickup, or call ahead and we'll have it hot and waiting.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={company.orderOnline} variant="cream" external>
              Order Pickup
            </Button>
            <Button href={company.uberEats} variant="ghost" external>
              Uber Eats Delivery
            </Button>
            <a
              href={company.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded border border-cream/40 px-8 py-4 font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream/10"
            >
              <Phone size={18} /> {company.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
