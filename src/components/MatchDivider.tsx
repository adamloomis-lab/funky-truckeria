// Section divider: two thin hairlines running toward a centered row of three
// papel-picado diamonds in the brand's funky accent colors. `bg` matches the
// section above so the divider reads as a seamless transition. (Filename kept
// from the skeleton; this is the Funky Truckeria divider.)
export default function MatchDivider({ bg = 'bg-paper' }: { readonly bg?: string }) {
  return (
    <div className={bg} aria-hidden="true">
      <div className="container-x">
        <div className="flex items-center justify-center gap-4 py-3 md:py-5">
          <span className="h-px w-full max-w-[180px] bg-gradient-to-r from-transparent to-brick/40" />
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="h-2.5 w-2.5 rotate-45 bg-marigold" />
            <span className="h-2.5 w-2.5 rotate-45 bg-orange" />
            <span className="h-3 w-3 rotate-45 bg-magenta" />
            <span className="h-2.5 w-2.5 rotate-45 bg-purple-light" />
            <span className="h-2.5 w-2.5 rotate-45 bg-bluetip" />
          </div>
          <span className="h-px w-full max-w-[180px] bg-gradient-to-l from-transparent to-brick/40" />
        </div>
      </div>
    </div>
  )
}
