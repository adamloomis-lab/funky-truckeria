import {
  company,
  openingHours,
  ratingSummary,
  menuGroups,
  type MenuGroup,
} from '../data/site'

// Production domain — now LIVE. Netlify's primary is the NON-www host (www
// 301-redirects to it), so canonicals, sitemap, OG/Twitter image URLs and schema
// all use non-www to point at the final 200 URL (no redirect for scrapers).
export const SITE_URL = 'https://thefunkytruckeria.com'

// Dedicated 1200x630 JPG share cards (photo + logo badge) for reliable, sharp
// previews across Facebook, X/Twitter, iMessage, LinkedIn, etc.
const OG_IMAGE = '/images/og-default.jpg'

export const abs = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

// Netlify serves pages with a trailing slash; keep canonical/sitemap URLs aligned.
export const pageUrl = (path: string) =>
  abs(path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`)

function openingHoursSpec() {
  return openingHours.map((o) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: o.days,
    opens: o.opens,
    closes: o.closes,
  }))
}

function aggregateRating() {
  return {
    '@type': 'AggregateRating',
    ratingValue: ratingSummary.value,
    reviewCount: String(ratingSummary.count),
    bestRating: '5',
    worstRating: '1',
  }
}

export function restaurantSchema() {
  const a = company.address
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name: company.name,
    url: SITE_URL,
    image: abs(OG_IMAGE),
    logo: abs('/images/logo-light.webp'),
    telephone: company.phone,
    email: company.email,
    priceRange: '$$',
    servesCuisine: ['Mexican', 'Tacos', 'Latin American', 'Street Food'],
    description: company.shortBlurb,
    slogan: company.tagline,
    hasMenu: pageUrl('/menu'),
    acceptsReservations: 'False',
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.geo.lat,
      longitude: company.geo.lng,
    },
    areaServed: [
      { '@type': 'City', name: 'Norton, OH' },
      { '@type': 'City', name: 'Barberton, OH' },
      { '@type': 'City', name: 'Wadsworth, OH' },
      { '@type': 'City', name: 'Akron, OH' },
      { '@type': 'AdministrativeArea', name: 'Summit County, OH' },
    ],
    openingHoursSpecification: openingHoursSpec(),
    aggregateRating: aggregateRating(),
    sameAs: [company.social.facebook, company.social.instagram, company.social.tripadvisor],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: company.name,
    publisher: { '@id': `${SITE_URL}/#restaurant` },
  }
}

// Extract a numeric price (first number) for schema Offers; undefined if none.
function parsePrice(price?: string): string | undefined {
  if (!price) return undefined
  const m = price.match(/(\d+(?:\.\d+)?)/)
  return m ? m[1] : undefined
}

function menuSectionSchema(group: MenuGroup) {
  return {
    '@type': 'MenuSection',
    name: group.title,
    ...(group.note ? { description: group.note } : {}),
    hasMenuItem: group.items.map((it) => {
      const price = parsePrice(it.price)
      return {
        '@type': 'MenuItem',
        name: it.name,
        ...(it.desc ? { description: it.desc } : {}),
        ...(price ? { offers: { '@type': 'Offer', price, priceCurrency: 'USD' } } : {}),
      }
    }),
  }
}

export function menuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/menu/#menu`,
    name: 'The Funky Truckeria Menu',
    url: pageUrl('/menu'),
    inLanguage: 'en-US',
    provider: { '@id': `${SITE_URL}/#restaurant` },
    hasMenuSection: menuGroups.map(menuSectionSchema),
  }
}

const FAQS = [
  {
    q: 'What are The Funky Truckeria’s hours?',
    a: 'We’re open Monday through Thursday 11am-8pm, Friday and Saturday 11am-9pm, and closed Sunday.',
  },
  {
    q: 'Where is The Funky Truckeria located?',
    a: 'We’re at 3200 Greenwich Rd, Suite 113, Norton, OH 44203, in Norton Plaza. There’s a spacious lot right out front.',
  },
  {
    q: 'Do you do carry-out and online ordering?',
    a: 'Yes. Order online through our Heartland ordering page or the Heartland app, or call us at (330) 208-0560 for carry-out.',
  },
  {
    q: 'Do you cater events and book the food truck?',
    a: 'We do. Our food trucks cater weddings, corporate events, festivals and private parties across Northeast Ohio. Call (330) 208-0560 to book.',
  },
  {
    q: 'Do you have vegetarian options?',
    a: 'Yes. Our crispy fried zucchini and buffalo cauliflower tacos are vegetarian, along with guacamole, salsa and street-corn sides.',
  },
]

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: pageUrl(it.path),
    })),
  }
}

export const faqs = FAQS

export type PageMeta = {
  title: string
  description: string
  canonical: string
  ogImage: string
  jsonLd: object[]
}

export function getPageMeta(rawPath: string): PageMeta {
  const path = rawPath !== '/' ? rawPath.replace(/\/$/, '') : '/'
  const ogImage = abs(OG_IMAGE)

  switch (path) {
    case '/':
      return {
        title: 'The Funky Truckeria | Award-Winning Tacos in Norton, OH',
        description: `${company.shortBlurb} Call ${company.phone}.`,
        canonical: pageUrl('/'),
        ogImage,
        jsonLd: [restaurantSchema(), websiteSchema(), faqSchema()],
      }
    case '/menu':
      return {
        title: 'Menu | The Funky Truckeria, Tacos, Burritos & More in Norton, OH',
        description:
          'Funky tacos from $5: Korean BBQ, Thai, Huli Huli, Baja fish, birria and more. Plus big 14" burritos, quesadillas, loaded nachos, chorizo funky balls and the salted turtle nacho sundae.',
        canonical: pageUrl('/menu'),
        ogImage: abs('/images/og-menu.jpg'),
        jsonLd: [
          restaurantSchema(),
          menuSchema(),
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Menu', path: '/menu' },
          ]),
        ],
      }
    case '/food-trucks':
      return {
        title: 'Food Trucks & Catering | The Funky Truckeria, Norton OH',
        description:
          'Book the Funky Truckeria food truck for your wedding, corporate event, festival or private party anywhere in Northeast Ohio. Award-winning street tacos, made fresh on site. Call (330) 208-0560.',
        canonical: pageUrl('/food-trucks'),
        ogImage: abs('/images/og-foodtrucks.jpg'),
        jsonLd: [
          restaurantSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Food Truck Catering',
            provider: { '@id': `${SITE_URL}/#restaurant` },
            areaServed: { '@type': 'AdministrativeArea', name: 'Northeast Ohio' },
            url: pageUrl('/food-trucks'),
          },
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Food Trucks & Catering', path: '/food-trucks' },
          ]),
        ],
      }
    case '/about':
      return {
        title: 'Our Story | The Funky Truckeria, Norton OH',
        description:
          'Two award-winning food-truck chefs slinging West Coast street tacos with worldly flavor from a hidden-gem taqueria in Norton, Ohio. Meet The Funky Truckeria.',
        canonical: pageUrl('/about'),
        ogImage,
        jsonLd: [
          restaurantSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: pageUrl('/about'),
            about: { '@id': `${SITE_URL}/#restaurant` },
          },
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Our Story', path: '/about' },
          ]),
        ],
      }
    case '/careers':
      return {
        title: 'Careers | Join The Funky Truckeria, Norton OH',
        description:
          'Join the crew at The Funky Truckeria. We’re hiring friendly, hard-working people who love great food. Apply online.',
        canonical: pageUrl('/careers'),
        ogImage,
        jsonLd: [
          restaurantSchema(),
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
          ]),
        ],
      }
    case '/contact':
      return {
        title: 'Contact & Hours | The Funky Truckeria, Norton OH',
        description: `Visit The Funky Truckeria at ${company.addressOneLine}. Hours, directions, parking, online ordering and contact details. Call ${company.phone}.`,
        canonical: pageUrl('/contact'),
        ogImage: abs('/images/og-contact.jpg'),
        jsonLd: [
          restaurantSchema(),
          faqSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: pageUrl('/contact'),
            about: { '@id': `${SITE_URL}/#restaurant` },
          },
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ],
      }
    case '/privacy':
      return {
        title: 'Privacy Policy | The Funky Truckeria',
        description:
          'How The Funky Truckeria collects, uses, and protects information submitted through this website.',
        canonical: pageUrl('/privacy'),
        ogImage,
        jsonLd: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy' }])],
      }
    case '/terms':
      return {
        title: 'Terms of Service | The Funky Truckeria',
        description: 'The terms that govern your use of The Funky Truckeria website.',
        canonical: pageUrl('/terms'),
        ogImage,
        jsonLd: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Terms of Service', path: '/terms' }])],
      }
    case '/accessibility':
      return {
        title: 'Accessibility Statement | The Funky Truckeria',
        description:
          'Our commitment to making The Funky Truckeria website accessible to everyone, and how to reach us about accessibility.',
        canonical: pageUrl('/accessibility'),
        ogImage,
        jsonLd: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Accessibility', path: '/accessibility' }])],
      }
    default:
      return {
        title: 'Page Not Found | The Funky Truckeria',
        description:
          "Sorry, we couldn't find that page. The Funky Truckeria serves award-winning artisanal tacos in Norton, Ohio.",
        canonical: pageUrl(path),
        ogImage,
        jsonLd: [restaurantSchema()],
      }
  }
}

export const ALL_ROUTES: string[] = [
  '/',
  '/menu',
  '/food-trucks',
  '/about',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/accessibility',
]
