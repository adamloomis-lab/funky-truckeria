// All site content for The Funky Truckeria. Single source of truth consumed by
// pages, components, and the SEO/JSON-LD layer.
//
// PRICES and item PHOTOS are overlaid from pos-prices.json / pos-photos.json
// (auto-synced nightly from the Heartland POS by scripts/pos-sync). The
// hand-coded values below are the fallback, so the site always renders even if
// a sync hasn't run.
import posPricesRaw from './pos-prices.json'
import posPhotosRaw from './pos-photos.json'

const posPrices = posPricesRaw as Record<string, string>
const posPhotos = posPhotosRaw as Record<string, string>

export const company = {
  name: 'The Funky Truckeria',
  shortName: 'Funky Truckeria',
  tagline: 'Tacos Chingones',
  // Longer descriptor used in hero / meta.
  shortBlurb:
    'Award-winning artisanal tacos with worldly influences and a Southern California flair: Korean BBQ, Thai, Huli Huli, Baja fish and more, built fresh to order at a hidden-gem taqueria in Norton, Ohio.',
  phone: '(330) 208-0560',
  phoneHref: 'tel:+13302080560',
  phone2: '(330) 400-4397',
  phone2Href: 'tel:+13304004397',
  email: 'thefunkytruckeria@gmail.com',
  address: {
    street: '3200 Greenwich Rd, Suite 113',
    city: 'Norton',
    state: 'OH',
    zip: '44203',
  },
  addressOneLine: '3200 Greenwich Rd, Suite 113, Norton, OH 44203',
  geo: { lat: 41.0298, lng: -81.6376 },
  mapsDir:
    'https://www.google.com/maps/dir/?api=1&destination=The+Funky+Truckeria+3200+Greenwich+Rd+Norton+OH+44203',
  mapsEmbed:
    'https://www.google.com/maps?q=3200+Greenwich+Rd+Norton+OH+44203&output=embed',
  // Google Places id, powers the live reviews function.
  placeId: 'ChIJGYsWY67TMIgRCu6MiC7TcWw',
  orderOnline: 'https://order.spoton.com/BL-771B-ECB0-23DC',
  uberEats: 'https://www.ubereats.com/store/the-funky-truckeria-norton-oh/Mycr6kZbXM2J2chFzBKgVQ',
  social: {
    facebook: 'https://www.facebook.com/funkytruckeria',
    instagram: 'https://www.instagram.com/funkytruckeria',
    tripadvisor:
      'https://www.tripadvisor.com/Restaurant_Review-g50500-The_Funky_Truckeria-Norton_Ohio.html',
  },
  parking: "There's a spacious lot right out front in Norton Plaza. Easy in, easy out.",
  parentBrand: 'Wholly Frijoles Mexican Street Foods',
} as const

// ---------------------------------------------------------------------------
// Hours. Mon–Thu 11a–8p, Fri–Sat 11a–9p, closed Sun. dow matches Date.getDay().
// ---------------------------------------------------------------------------
export const hours = [
  { day: 'Sunday', short: 'Sun', dow: 0, time: 'Closed' },
  { day: 'Monday', short: 'Mon', dow: 1, time: '11:00 am - 8:00 pm' },
  { day: 'Tuesday', short: 'Tue', dow: 2, time: '11:00 am - 8:00 pm' },
  { day: 'Wednesday', short: 'Wed', dow: 3, time: '11:00 am - 8:00 pm' },
  { day: 'Thursday', short: 'Thu', dow: 4, time: '11:00 am - 8:00 pm' },
  { day: 'Friday', short: 'Fri', dow: 5, time: '11:00 am - 9:00 pm' },
  { day: 'Saturday', short: 'Sat', dow: 6, time: '11:00 am - 9:00 pm' },
]

export const hoursCompact = [
  { day: 'Mon - Thu', time: '11a - 8p' },
  { day: 'Fri - Sat', time: '11a - 9p' },
  { day: 'Sunday', time: 'Closed' },
]

// Schema.org openingHoursSpecification
export const openingHours = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '11:00', closes: '20:00' },
  { days: ['Friday', 'Saturday'], opens: '11:00', closes: '21:00' },
]

// Awards & recognition (verbatim from the owner's reputation brief).
export const awards = [
  'Best Taco, Cleveland.com',
  "Best Mexican, Akron's Beacon's Best",
  "Best Chef Akron, Akron's Beacon's Best",
]

export const featurePillars = [
  {
    title: 'Worldly Flavors',
    blurb:
      'Korean BBQ, Thai peanut, Caribbean jerk, Huli Huli, Baja fish. West Coast street tacos with influences from all over the map.',
  },
  {
    title: 'Built Fresh to Order',
    blurb:
      'Every taco is made the moment you order it. That’s why it’s worth the wait, and why it tastes the way it does.',
  },
  {
    title: 'Award-Winning & Local',
    blurb:
      "Voted Best Taco by Cleveland.com and Best Mexican by Akron's Beacon's Best. A Norton hidden gem worth the drive.",
  },
]

// ---------------------------------------------------------------------------
// MENU — transcribed verbatim from the in-house menu. Prices as printed.
// `tag` drives a small colored chip (veg / hot). Protein choices are folded
// into `desc` so the menu card stays simple. For à-la-carte tacos, `price`
// shows "single / 3-pack".
// ---------------------------------------------------------------------------
export type MenuItem = { name: string; price?: string; desc?: string; tag?: 'veg' | 'hot'; photo?: string }
export type MenuGroup = { title: string; note?: string; items: MenuItem[] }

// Display order top-to-bottom; the Menu page lays these out as a masonry and
// rotates an accent color per card.
const menuGroupsRaw: MenuGroup[] = [
  {
    title: '3 Taco Plates',
    note: 'All three taco specials must be the same protein. No mixing.',
    items: [
      {
        name: '3 Birria Quesa Tacos w/ Consomé',
        price: '$17.50',
        desc: 'Three 6" corn tortillas, birria beef with Monterey cheese, grilled and topped with diced onions, cilantro & lime. Served with birria consomé (broth) to dip.',
      },
      {
        name: '3 Mexican Street Tacos',
        price: '$13',
        desc: 'Three 6" corn tortillas, grilled meat, avocado salsa verde, diced onions, cilantro & lime. Pick one: honey jalapeño chicken, tequila lime chicken, chorizo, habanero pork, asada steak, or birria (+$3).',
      },
      {
        name: '3 El Gringo Gordo Tacos',
        price: '$14',
        desc: 'Three 6" quick-fried corn tortillas stuffed with your choice of meat, poblano crema, shredded lettuce & Monterey cheese. Pick one: honey jalapeño chicken, tequila lime chicken, chorizo, habanero pork, or asada steak.',
      },
    ],
  },
  {
    title: 'Funky Tacos',
    note: 'No mixing types on the 3-taco price. Single / 3-pack prices shown.',
    items: [
      { name: 'Crispy Fried Avocado', price: '$5 / $14', tag: 'veg', desc: 'Flour tortilla, feathered cabbage, crispy fried avocado, poblano crema, queso fresco, crispy fried onions, cilantro & lime.' },
      { name: 'Buffalo Cauliflower', price: '$5 / $14', tag: 'veg', desc: 'Flour tortilla, lettuce, fried cauliflower, Monterey, buffalo sauce, ranch, pico de gallo, queso fresco, cilantro, lime.' },
      { name: 'Tequila Lime Chicken', price: '$5 / $14', desc: 'Flour tortilla, grilled chicken, feathered cabbage, poblano crema, pico de gallo, queso fresco, cilantro, lime.' },
      { name: 'Jerk Chicken', price: '$5 / $14', desc: 'Flour tortilla, feathered cabbage, grilled jerk chicken, jerk sauce, mango pico de gallo, cilantro, lime.' },
      { name: 'Thai Chicken', price: '$5 / $14', desc: 'Flour tortilla, feathered cabbage, grilled Thai chicken, peanut sauce, spicy peanuts, cilantro, lime.' },
      { name: 'Honey Jalapeño Chicken', price: '$5 / $14', desc: 'Corn tortilla, grilled chicken, feathered cabbage, jalapeño aioli, mango pico de gallo, cilantro, lime.' },
      { name: 'Huli Huli Chicken', price: '$5 / $14', desc: 'Flour tortilla, feathered cabbage, grilled Huli Huli chicken, island sauce, mango pico de gallo, diced pineapple, cilantro & lime.' },
      { name: 'Korean BBQ Chicken', price: '$5 / $14', desc: 'Flour tortilla, feathered cabbage, grilled Korean BBQ chicken, Asian sauce, carrots, sesame seed, cilantro & lime.' },
      { name: 'Korean Hot Honey Fried Chicken', price: '$5 / $14', desc: 'Flour tortilla, feathered cabbage, Korean hot honey chicken, Asian sauce, green onions, sesame seed.' },
      { name: 'Fried Buffalo Chicken', price: '$5 / $14', desc: 'Flour tortilla, lettuce, fried buffalo chicken, Monterey, buffalo sauce, ranch, pico de gallo, queso fresco, cilantro, lime.' },
      { name: 'Pollo Diablo', price: '$6 / $17', tag: 'hot', desc: '*Extremely hot.* Flour tortilla, feathered cabbage, grilled diablo chicken, avocado salsa verde, queso fresco, cilantro & lime.' },
      { name: 'Carne Asada Steak', price: '$5.50 / $15.50', desc: 'Flour tortilla, grilled asada steak, feathered cabbage, poblano crema, pico de gallo, queso fresco, cilantro & lime.' },
      { name: 'Chimichurri Asada Steak', price: '$5.50 / $15.50', desc: 'Corn tortilla, grilled Angus steak, fresh arugula, chimichurri sauce, pickled onion, queso fresco, cilantro, lime.' },
      { name: 'Korean BBQ Steak', price: '$5.50 / $15.50', desc: 'Flour tortilla, feathered cabbage, BBQ Angus steak, Asian sauce, carrots, sesame seed, cilantro, lime.' },
      { name: 'Blackened Mahi Mahi Fish', price: '$5.50 / $15.50', desc: 'Flour tortilla, feathered cabbage, blackened mahi mahi, poblano crema, avocado sauce, pico de gallo, queso fresco, cilantro & lime.' },
      { name: 'Island Fried Shrimp', price: '$5.50 / $15.50', desc: 'Flour tortilla, feathered cabbage, crispy shrimp, island sauce, mango pico de gallo, cilantro, lime.' },
      { name: 'Honey Jalapeño Grilled Shrimp', price: '$5.50 / $15.50', desc: 'Flour tortilla, grilled shrimp, feathered cabbage, jalapeño aioli, mango pico de gallo, cilantro, lime.' },
      { name: 'Korean Hot Honey Fried Shrimp', price: '$5.50 / $15.50', desc: 'Flour tortilla, feathered cabbage, Korean hot honey shrimp, Asian sauce, green onions, sesame seed.' },
      { name: 'Al Pastor', price: '$5 / $14', desc: 'Corn tortilla, grilled al pastor pork loin, diced pineapple, diced onions, avocado salsa verde, cilantro, lime.' },
      { name: 'Habanero Pork Loin', price: '$5 / $14', desc: 'Flour tortilla, grilled habanero pork loin, poblano sauce, crispy fried onions, avocado, cilantro & lime.' },
      { name: 'Chorizo & Goat Cheese', price: '$5 / $14', desc: 'Corn tortilla, chorizo, poblano crema, avocado, crispy fried onions, goat cheese, cilantro, lime.' },
      { name: 'Chicharron', price: '$6 / $17', desc: 'Corn tortilla, crispy fried pork belly & skin, avocado sauce, avocado salsa verde, crispy fried onions, queso fresco, cilantro, lime.' },
      { name: 'Korean BBQ Pork Belly', price: '$6 / $17', desc: 'Flour tortilla, feathered cabbage, crispy sous vide pork belly, Asian sauce, carrots, sesame seed, cilantro, lime.' },
    ],
  },
  {
    title: 'Bowls & Burritos',
    note: 'Every one comes as a 32oz bowl or a 12" burrito. Your protein sets the price.',
    items: [
      {
        name: 'Korean BBQ Bowl or Burrito',
        price: '$13 to $16',
        desc: 'Korean fried rice, grilled cabbage, carrots, green onions, sesame seed, Asian sauce, cilantro, lime. Pick: Korean BBQ chicken, steak, grilled shrimp, or pork belly.',
      },
      {
        name: 'Thai Bowl or Burrito',
        price: '$13 to $16',
        desc: 'Thai fried rice, grilled cabbage, green onions, spicy peanuts, peanut sauce, cilantro, lime. Pick: chicken, grilled shrimp, or pork belly.',
      },
      {
        name: 'Buffalo Bowl or Burrito',
        price: '$13 to $15',
        desc: 'Buffalo fried rice, black beans, Monterey cheese, lettuce, buffalo sauce, ranch, pico de gallo, queso fresco, cilantro, lime. Pick: fried chicken, fried cauliflower, or fried shrimp.',
      },
      {
        name: 'Jerk Bowl or Burrito',
        price: '$13 to $15',
        desc: 'Jerk fried rice, black beans, feathered cabbage, jerk sauce, mango pico de gallo, cilantro, lime. Pick: chicken or grilled shrimp.',
      },
      {
        name: 'Huli Huli Bowl or Burrito',
        price: '$13 to $15',
        desc: 'Huli Huli fried rice, feathered cabbage, island sauce, mango pico de gallo, pineapple, cilantro, lime. Pick: chicken or grilled shrimp.',
      },
      {
        name: 'Big Birria Burrito',
        price: '$17',
        desc: '14" flour tortilla, half pound of birria beef, rice, beans, melted queso Chihuahua, diced onions, cilantro, avocado salsa verde & queso sauce, grilled mission-style and served with a bowl of consomé for dipping.',
      },
      {
        name: '6 Person Taco Dinner',
        price: '$80',
        desc: 'Taco night for the whole crew: 1.5 lb each of two meat choices, beans, rice, 12 corn and 12 flour tortillas, shredded cheese, lettuce, pico de gallo, cilantro & limes.',
      },
    ],
  },
  {
    title: '12" Quesadillas',
    items: [
      {
        name: 'Funky Quesadilla',
        price: '$12',
        desc: 'Comes with pico de gallo & poblano crema. Pick: tequila lime chicken, chorizo, buffalo cauliflower, habanero pork loin, asada steak, or grilled shrimp. Birria +$2.',
      },
    ],
  },
  {
    title: 'Nachos',
    items: [
      {
        name: 'Funky Nachos',
        price: '$12',
        desc: 'Fresh corn tortilla chips, queso sauce, beans, poblano crema, avocado salsa verde, pico de gallo, cilantro. Pick: tequila lime chicken, chorizo, buffalo cauliflower, habanero pork loin, asada steak, grilled shrimp, or birria (+$2).',
      },
    ],
  },
  {
    title: 'Chorizo Funky Balls',
    items: [
      { name: '3 Pack', price: '$7', desc: 'Deep-fried risotto balls filled with chorizo, goat cheese & Monterey, topped with poblano crema, queso fresco & cilantro.' },
      { name: '6 Pack', price: '$13', desc: 'A half-dozen of our signature funky balls.' },
    ],
  },
  {
    title: 'Chips & Dips',
    note: '6 oz.',
    items: [
      { name: 'Pico de Gallo', price: '$5', tag: 'veg' },
      { name: 'Salsa', price: '$5', tag: 'veg' },
      { name: 'Queso', price: '$6' },
      { name: 'Guacamole', price: '$7', tag: 'veg' },
      { name: 'Mango Pico de Gallo', price: '$7', tag: 'veg' },
      { name: 'Buffalo Chicken Queso', price: '$8' },
    ],
  },
  {
    title: 'Kids Meal',
    note: 'Kids under 10 only. Includes a fountain drink.',
    items: [
      {
        name: 'Kids Taco Meal',
        price: '$7.50',
        desc: 'Two tacos: cheese only, two chicken & cheese, or two steak & cheese.',
      },
    ],
  },
  {
    title: 'Salted Turtle Nacho Sundae',
    items: [
      { name: 'Small', price: '$7', desc: 'Cinnamon-sugar flour tortilla chips, vanilla ice cream, caramel, chocolate sauce, whipped cream, pecans, cherries & salt.' },
      { name: 'Large', price: '$12', desc: 'The full funky sundae. Share it, or don’t.' },
    ],
  },
]

// POS overlay: live register prices + item photos over the hand-coded defaults.
export const menuGroups: MenuGroup[] = menuGroupsRaw.map((g) => ({
  ...g,
  items: g.items.map((it) => ({
    ...it,
    price: posPrices[it.name] ?? it.price,
    photo: posPhotos[it.name] ?? it.photo,
  })),
}))

// ---------------------------------------------------------------------------
// Ratings & testimonials. Per-platform stats and quotes are from the owner's
// reputation brief (May 2026). Quotes are genuine but were supplied without
// reviewer names, so they're attributed to their source platform.
// ---------------------------------------------------------------------------
export const ratingSummary = { value: '4.6', count: 187 }

export const ratings = [
  { platform: 'Google', value: '4.6', detail: 'out of 5 stars' },
  { platform: 'TripAdvisor', value: '4.5', detail: '#3 of 17 in Norton · 42 reviews' },
  { platform: 'Facebook', value: '98%', detail: 'recommend · 885 reviews' },
]

export const reviews = [
  {
    source: 'Google review',
    quote:
      "Oh so good! I can't get over how good Funky Truckeria is. The tacos have such an amazing combination of flavors and textures. They're just out of this world!",
  },
  {
    source: 'Google review',
    quote:
      'Hidden gem and delicious! The staff was so nice and threw in extra chips and queso for the short wait.',
  },
  {
    source: 'TripAdvisor review',
    quote:
      'These are definitely not Taco Bell tacos. The Truckeria goes so far beyond the typical: Thai tacos, Korean tacos, even octopus and mahi mahi.',
  },
  {
    source: 'Google review',
    quote: 'This is my favorite place for tacos. The staff is very friendly. Better than the tacos I’ve had in Mexico.',
  },
]

// ---------------------------------------------------------------------------
// Our story — how the Truckeria came to be. Drawn from the owner's brief;
// verify dates/details with the owner before publishing.
// ---------------------------------------------------------------------------
export const storyHighlights = [
  {
    label: 'On Wheels',
    title: 'Two Food Trucks',
    body: 'It started on wheels. Two award-winning food-truck chefs slinging tacos at festivals and events across Northeast Ohio. One truck still wears our sombrero-sporting skeleton.',
  },
  {
    label: 'Norton Plaza',
    title: 'A Hidden Gem',
    body: '“Small but very nice and neat, not a normal Norton spot.” We planted roots in Norton Plaza with about six tables, a cozy patio, and a whole lot of flavor.',
  },
  {
    label: 'The Mission',
    title: 'Tacos Chingones',
    body: 'West Coast street tacos with worldly influences (Korean, Thai, Caribbean, Baja) built fresh to order. Quality first, every single time.',
  },
]

// ---------------------------------------------------------------------------
// Food photo gallery (owner-supplied, optimized to WebP). alt text doubles as
// on-site captions.
// ---------------------------------------------------------------------------
export const gallery = [
  { src: '/images/carne-asada-taco.webp', alt: 'Overhead carne asada taco with pickled onion, arugula and lime' },
  { src: '/images/loaded-nachos.webp', alt: 'Loaded nachos with chicken, guacamole, crema and pico de gallo' },
  { src: '/images/street-corn-elote.webp', alt: 'Mexican street corn (elote) on a stick with cotija, crema and chili' },
  { src: '/images/korean-bbq-taco.webp', alt: 'Korean BBQ taco with crispy wonton strings and scallion' },
  { src: '/images/fish-tacos.webp', alt: 'Crispy Baja fish tacos with lime wedges' },
  { src: '/images/bang-bang-shrimp-taco.webp', alt: 'Fried shrimp taco with sriracha aioli and sesame' },
  { src: '/images/chicken-burrito.webp', alt: 'A big 14-inch grilled chicken Funky burrito sliced open' },
  { src: '/images/churros.webp', alt: 'Cinnamon-sugar churros with caramel dipping sauce' },
]
