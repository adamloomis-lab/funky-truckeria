import type { ReactNode } from 'react'
import { Link } from 'wouter'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

// Shared "fluid" form controls for The Funky Truckeria, tuned for the dark card
// surface: floating-label fields (chili-red center-out underline + focus glow),
// single-select icon cards, a sheened brand submit, and the drawn thank-you
// checkmark. Used by the Contact, Careers, and Food Trucks forms.

interface FloatFieldProps {
  name: string
  label: string
  type?: string
  required?: boolean
  textarea?: boolean
  rows?: number
  idPrefix?: string
  autoComplete?: string
  defaultValue?: string
}

// Floating-label text / textarea field. Uncontrolled so each form keeps using
// native FormData on submit (preserves the existing Netlify backends).
export function FloatField({
  name,
  label,
  type = 'text',
  required,
  textarea,
  rows = 5,
  idPrefix = 'f',
  autoComplete,
}: FloatFieldProps) {
  const id = `${idPrefix}-${name}`
  return (
    <div className="float-field group">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder=" "
          className="float-input resize-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          required={required}
          placeholder=" "
          autoComplete={autoComplete}
          className="float-input"
        />
      )}
      <label htmlFor={id} className="float-label">
        {label}
        {required && <span className="ml-1 text-brick">*</span>}
      </label>
      <span aria-hidden="true" className="float-underline" />
    </div>
  )
}

export interface IconCardOption {
  value: string
  label: string
  icon: LucideIcon
}

interface IconCardSelectProps {
  name: string
  legend: string
  options: IconCardOption[]
  value: string
  onChange: (value: string) => void
  required?: boolean
  invalid?: boolean
  cols?: 2 | 3
  children?: ReactNode
}

// Single-select icon cards. The chosen value is mirrored into a hidden input of
// the same `name`, so FormData/Netlify see an identical value to the old select.
export function IconCardSelect({
  name,
  legend,
  options,
  value,
  onChange,
  required,
  invalid,
  cols = 2,
  children,
}: IconCardSelectProps) {
  const grid = cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
  return (
    <fieldset>
      <legend
        className={`mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.18em] ${
          invalid ? 'text-error' : 'text-ink-faint'
        }`}
      >
        {legend}
        {required && <span className="ml-1 text-brick">*</span>}
        {invalid && <span className="ml-2 normal-case tracking-normal text-error">Please pick one</span>}
      </legend>
      <input type="hidden" name={name} value={value} />
      <div className={`grid grid-cols-2 gap-2.5 ${grid}`}>
        {options.map((opt) => {
          const active = opt.value === value
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left transition-all active:scale-[0.98] ${
                active
                  ? 'border-brick bg-brick text-on-brick shadow-[0_10px_26px_-12px_rgba(239,63,40,0.7)]'
                  : 'border-line bg-paper-2 text-ink-soft hover:border-brick/50 hover:text-ink'
              }`}
            >
              <Icon size={18} className={active ? 'text-on-brick' : 'text-brick'} />
              <span className="text-[13px] font-semibold leading-tight">{opt.label}</span>
            </button>
          )
        })}
        {children}
      </div>
    </fieldset>
  )
}

interface CrossLinkCardProps {
  href: string
  label: string
  icon: LucideIcon
}

// Dashed "cross-link" card that lives inside an icon-card grid and routes away
// (e.g. Contact -> Careers) instead of selecting a value.
export function CrossLinkCard({ href, label, icon: Icon }: CrossLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-lg border border-dashed border-bluetip/60 bg-paper-2 px-3.5 py-3 text-left text-ink-soft transition-all hover:border-bluetip hover:text-ink active:scale-[0.98]"
    >
      <Icon size={18} className="text-bluetip" />
      <span className="text-[13px] font-semibold leading-tight">{label}</span>
      <ArrowRight
        size={15}
        className="ml-auto text-bluetip transition-transform group-hover:translate-x-1"
      />
    </Link>
  )
}

interface SheenSubmitProps {
  children: ReactNode
}

// Brand chili-red submit with a one-shot sheen sweep on hover.
export function SheenSubmit({ children }: SheenSubmitProps) {
  return (
    <button
      type="submit"
      className="group relative w-full overflow-hidden rounded bg-brick px-8 py-4 font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-on-brick transition-colors hover:bg-brick-dark"
    >
      <span
        aria-hidden="true"
        className="sheen-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:funky-sheen_0.9s_ease]"
      />
      <span className="relative inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}

// Animated drawn checkmark for the personalized thank-you state.
export function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="h-14 w-14" aria-hidden="true">
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-brick)"
        strokeWidth="3"
        strokeDasharray="151"
        strokeDashoffset="151"
        style={{ animation: 'draw-check 0.6s ease forwards' }}
      />
      <path
        d="M15 27 l7 7 l15 -16"
        fill="none"
        stroke="var(--color-brick)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="40"
        strokeDashoffset="40"
        style={{ animation: 'draw-check 0.4s 0.5s ease forwards' }}
      />
    </svg>
  )
}
