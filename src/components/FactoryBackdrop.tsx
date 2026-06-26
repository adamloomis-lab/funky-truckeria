import type { CSSProperties } from 'react'

// Faded, blended old-factory photo behind a hero. Visible but melted into the
// charcoal base via low opacity + luminosity blend + a steel gradient scrim.
// Drifts on scroll (.parallax). Decorative only (aria-hidden).
export default function FactoryBackdrop({
  src,
  opacity = 0.24,
}: {
  readonly src: string
  readonly opacity?: number
}) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ opacity, ['--p-amt' as keyof CSSProperties]: '52px' } as CSSProperties}
        className="parallax pointer-events-none absolute inset-x-0 -top-[14%] h-[128%] w-full object-cover mix-blend-luminosity"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-steel/55 via-steel/30 to-steel/85" />
    </>
  )
}
