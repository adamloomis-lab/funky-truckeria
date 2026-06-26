import { Link } from 'wouter'
import type { ReactNode } from 'react'

type Variant = 'brick' | 'outline' | 'ghost' | 'cream'

const base =
  'inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.16em] text-[13px] px-8 py-4 rounded transition-all active:scale-[0.98]'

const variants: Record<Variant, string> = {
  // Primary CTA
  brick: 'bg-brick text-on-brick hover:bg-brick-dark shadow-[0_10px_30px_-12px_rgba(176,58,40,0.7)]',
  // Outline with cream text (readable on the dark theme); fills brick on hover
  outline: 'border border-brick/70 text-cream hover:border-brick hover:bg-brick hover:text-on-brick',
  // Light outline on dark surfaces
  ghost: 'border border-cream/30 text-cream hover:border-cream/70 hover:bg-cream/8',
  // Solid cream on dark surfaces
  cream: 'bg-cream text-steel hover:bg-cream-dim',
}

interface Props {
  readonly href: string
  readonly variant?: Variant
  readonly children: ReactNode
  readonly className?: string
  readonly external?: boolean
}

export default function Button({ href, variant = 'brick', children, className = '', external }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`
  if (href.startsWith('/') && !external) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}
