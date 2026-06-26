import { Link } from 'wouter'

// The Funky Truckeria sugar-skull badge. `logo-light` (white linework) reads on
// the dark theme; `logo-dark` (black linework) is for light surfaces. The badge
// is intricate, so at nav/footer sizes we pair it with a text wordmark for
// instant legibility. `className` controls the badge height.
export default function Logo({
  onDark = false,
  withWordmark = false,
  color = false,
  className = 'h-12',
}: {
  readonly onDark?: boolean
  readonly withWordmark?: boolean
  // Use the full-color sugar-skull mark (on black) cropped to a circle. Reads on
  // any background, so it works in both nav states (over hero + solid on scroll).
  readonly color?: boolean
  readonly className?: string
}) {
  const src = color ? '/images/logo-color.webp' : onDark ? '/images/logo-light.webp' : '/images/logo-dark.webp'
  return (
    <Link
      href="/"
      aria-label="The Funky Truckeria, home"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <img
        src={src}
        alt="The Funky Truckeria"
        width={208}
        height={208}
        className={`h-full w-auto shrink-0 ${color ? 'rounded-full' : ''}`}
      />
      {withWordmark && (
        <span className="flex flex-col justify-center leading-none">
          <span
            className={`font-display text-[21px] tracking-[0.05em] ${onDark ? 'text-cream' : 'text-ink'}`}
          >
            The Funky Truckeria
          </span>
          <span className="mt-0.5 font-display text-[11px] tracking-[0.34em] text-brick">
            Tacos Chingones
          </span>
        </span>
      )}
    </Link>
  )
}
