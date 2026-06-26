import { Star } from 'lucide-react'

// Infinite horizontal ticker of short phrases (awards, specials, flavors), each
// separated by a star. Pure CSS (see .marquee in index.css) — no JS, SSR-safe,
// pauses on hover, and holds still for reduced-motion. Text color is inherited
// from the parent band; the star uses the brand chili accent.
export default function Marquee({
  items,
  label = 'Highlights',
  className = '',
}: {
  readonly items: string[]
  readonly label?: string
  readonly className?: string
}) {
  const Group = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((text, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-[20px] uppercase tracking-[0.03em] md:px-9 md:text-[24px]">
            {text}
          </span>
          <Star size={15} className="shrink-0 fill-brick text-brick" aria-hidden="true" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee ${className}`} role="region" aria-label={label}>
      {/* Accessible, static list for screen readers (the animated copy is hidden). */}
      <ul className="sr-only">
        {items.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ul>
      <div className="marquee__track" aria-hidden="true">
        <Group />
        <Group hidden />
      </div>
    </div>
  )
}
