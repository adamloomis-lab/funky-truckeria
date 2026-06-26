import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Cross-fading hero slideshow of food shots. The first image is the prerendered
// LCP image (eager + high priority); the rest lazy-load and fade in on a timer.
// Honors prefers-reduced-motion by holding on the first image.
const HERO_IMAGES = [
  { src: '/images/carne-asada-taco.webp', alt: 'A carne asada street taco with pickled onion, greens and lime' },
  { src: '/images/korean-bbq-taco.webp', alt: 'Korean BBQ taco with crispy wonton strings and scallion' },
  { src: '/images/loaded-nachos.webp', alt: 'Loaded nachos with chicken, guacamole, crema and pico de gallo' },
  { src: '/images/bang-bang-shrimp-taco.webp', alt: 'Fried shrimp taco with sriracha aioli and sesame' },
  { src: '/images/mango-salsa-tacos.webp', alt: 'Tacos topped with fresh mango salsa, cilantro and lime' },
]

export default function HeroCarousel() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setActive((p) => (p + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [reduced])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={i === 0 ? img.alt : ''}
          fetchPriority={i === 0 ? 'high' : undefined}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
