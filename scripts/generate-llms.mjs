/*
 * Build-time /llms.txt generator (AEO standard). Runs after prerender and
 * derives everything from the ALREADY-BUILT site, dist/index.html JSON-LD
 * (Restaurant + FAQPage), dist/menu/index.html JSON-LD (full priced Menu),
 * and dist/sitemap.xml, so the file can never drift from the site. Because
 * menu prices flow from the POS-synced data into the JSON-LD, every nightly
 * price sync refreshes llms.txt too.
 *
 * Fails the build if the restaurant or menu schema is missing (guardrail,
 * same spirit as check-seo.mjs).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

function jsonLdNodes(html) {
  const nodes = []
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  let m
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1])
      nodes.push(...(Array.isArray(parsed) ? parsed : parsed['@graph'] ?? [parsed]))
    } catch {
      /* skip malformed */
    }
  }
  return nodes
}

const typeOf = (n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type'] ?? ''])

const home = readFileSync(join(DIST, 'index.html'), 'utf8')
const menuHtml = readFileSync(join(DIST, 'menu', 'index.html'), 'utf8')
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')

const homeNodes = jsonLdNodes(home)
const restaurant = homeNodes.find((n) => typeOf(n).some((t) => /Restaurant|Pizzeria/.test(t)))
const faq = homeNodes.find((n) => typeOf(n).includes('FAQPage'))
const menu = jsonLdNodes(menuHtml).find((n) => typeOf(n).includes('Menu'))

if (!restaurant) throw new Error('[llms] Restaurant schema missing from dist/index.html')
if (!menu?.hasMenuSection?.length) throw new Error('[llms] Menu schema missing from dist/menu/index.html')

// ---- business facts ---------------------------------------------------
const a = restaurant.address ?? {}
const rating = restaurant.aggregateRating
const hoursLines = (restaurant.openingHoursSpecification ?? [])
  .map((o) => `${[].concat(o.dayOfWeek).join(', ')}: ${o.opens}-${o.closes}`)
  .join(' | ')
const area = [].concat(restaurant.areaServed ?? []).map((x) => x.name).filter(Boolean).join(', ')
const orderUrl = restaurant.potentialAction?.target ?? restaurant.hasMenu ?? ''

// ---- menu -------------------------------------------------------------
function itemLine(it) {
  const offers = [].concat(it.offers ?? []).filter(Boolean)
  let price = ''
  if (offers.length > 1) {
    price = offers.map((o) => `${o.name ?? ''} $${o.price}`.trim()).join(' | ')
  } else if (offers.length === 1) {
    price = `$${offers[0].price}`
  }
  const desc = it.description ? ` (${String(it.description).replace(/\s+/g, ' ').trim()})` : ''
  return `- ${it.name}${price ? `: ${price}` : ''}${desc}`
}

const menuBlocks = menu.hasMenuSection
  .map((sec) => {
    const items = (sec.hasMenuItem ?? []).map(itemLine).join('\n')
    return `### ${sec.name}\n${items}`
  })
  .join('\n\n')

// ---- pages ------------------------------------------------------------
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

// ---- faq --------------------------------------------------------------
const faqLines = (faq?.mainEntity ?? [])
  .map((q) => `- ${q.name} ${q.acceptedAnswer?.text ?? ''}`)
  .join('\n')

const out = `# ${restaurant.name}

> ${restaurant.description ?? ''}

## Business facts
- Business: ${restaurant.name}${restaurant.slogan ? ` ("${restaurant.slogan}")` : ''}${restaurant.foundingDate ? `\n- Established: ${restaurant.foundingDate}` : ''}
- Address: ${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}
- Phone: ${restaurant.telephone}
- Cuisine: ${[].concat(restaurant.servesCuisine ?? []).join(', ')}
- Service area: ${area}
${rating ? `- Rating: ${rating.ratingValue} stars (${rating.reviewCount} Google reviews)` : ''}
- Hours: ${hoursLines}
- Order online: ${orderUrl}

## Menu (prices sync daily from the restaurant's register)
${menuBlocks}

## Key pages
${pages.map((p) => `- ${p}`).join('\n')}

## Common questions
${faqLines}

## Contact
Call ${restaurant.telephone}${orderUrl ? ` or order online at ${orderUrl}` : ''}
`

writeFileSync(join(DIST, 'llms.txt'), out)
console.log(`[llms] OK: wrote dist/llms.txt (${out.length} chars, ${menu.hasMenuSection.length} menu sections)`)
