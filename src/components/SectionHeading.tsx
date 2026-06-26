import type { ReactNode } from 'react'

// Section heading. `tone="dark"` is for use on steel/dark sections (cream type);
// default light tone is for parchment sections (ink type).
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  tone = 'light',
  accent = '',
  className = '',
}: {
  readonly eyebrow?: string
  readonly title: ReactNode
  readonly intro?: ReactNode
  readonly align?: 'center' | 'left'
  readonly tone?: 'light' | 'dark'
  // Optional eyebrow color (a text-* utility), e.g. "text-marigold". Rotates the
  // accent per section so color cycles through the brand palette as you scroll.
  readonly accent?: string
  readonly className?: string
}) {
  const centered = align === 'center'
  const titleColor = tone === 'dark' ? 'text-cream' : 'text-ink'
  const introColor = tone === 'dark' ? 'text-cream-dim' : 'text-ink-soft'
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && <p className={`eyebrow ${accent}`}>{eyebrow}</p>}
      <h2 className={`mt-4 font-display text-headline-lg md:text-[44px] ${titleColor}`}>{title}</h2>
      <span className={`brick-rule mt-5 ${centered ? 'mx-auto block w-[72px]' : ''}`} />
      {intro && <p className={`mt-5 text-body-lg ${introColor}`}>{intro}</p>}
    </div>
  )
}
