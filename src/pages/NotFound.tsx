import Button from '../components/Button'
import FactoryBackdrop from '../components/FactoryBackdrop'

export default function NotFound() {
  return (
    <section className="steel-panel brick-texture relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 pt-20 text-center">
      <FactoryBackdrop src="/images/food-truck-side-graphic.webp" />
      <div className="relative z-10">
        <p className="eyebrow text-marigold">404</p>
        <h1 className="mt-4 font-display text-display-lg-mobile font-bold text-cream md:text-display-lg">
          This page is off the menu
        </h1>
        <p className="mx-auto mt-5 max-w-md text-body-lg text-cream-dim">
          We couldn&rsquo;t find the page you were looking for. Let&rsquo;s get you back to the tacos.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/">Back Home</Button>
          <Button href="/menu" variant="ghost">
            See the Menu
          </Button>
        </div>
      </div>
    </section>
  )
}
