// Faint sugar-skull watermark, echoing the brand mark as background texture.
// Two skulls in opposite corners (top-right + bottom-left), very low opacity so
// they read as texture, never clutter. Decorative only (aria-hidden).
export default function SkullWatermark({ className = '' }: { readonly className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <img
        src="/images/skull-mark.webp"
        alt=""
        loading="lazy"
        className="absolute -right-16 -top-20 w-[clamp(220px,32vw,420px)] opacity-[0.04]"
      />
      <img
        src="/images/skull-mark.webp"
        alt=""
        loading="lazy"
        className="absolute -bottom-24 -left-20 w-[clamp(200px,28vw,380px)] rotate-12 opacity-[0.035]"
      />
    </div>
  )
}
