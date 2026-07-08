/*
 * POS price + photo sync, mirrors live Heartland/MobileBytes online-ordering
 * data onto the website menu. Writes:
 *   src/data/pos-prices.json  (ourName -> display price string)
 *   src/data/pos-photos.json  (ourName -> POS item photo URL)
 * src/data/site.ts overlays both over the hand-coded defaults, so curated
 * content (names, descriptions, order, styling) is never touched.
 *
 *   node scripts/pos-sync/sync.mjs            # fetch live, write if valid
 *   node scripts/pos-sync/sync.mjs --dry      # print what would change
 *
 * Exit codes: 0 ok, 2 anomaly/abort (nothing written), 1 fatal.
 * Reference implementation: ~/Sites/branch-pizza (see docs/POS-SYNC.md there).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const MAP = JSON.parse(readFileSync(join(HERE, 'pos-map.json'), 'utf8'))
const OUT_PRICES = join(ROOT, 'src', 'data', 'pos-prices.json')
const OUT_PHOTOS = join(ROOT, 'src', 'data', 'pos-photos.json')
const DRY = process.argv.includes('--dry')

const MAX_MISSING_RATIO = 0.25

// Site-style money: "$5", "$5.50", "$17.50" (no trailing .00).
const money = (n) => {
  const v = Number(n)
  return Number.isInteger(v) ? `$${v}` : `$${v.toFixed(2)}`
}

async function fetchPosMenu() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    })
    let payload = null
    page.on('response', async (resp) => {
      if (payload) return
      if (resp.url().includes('/initial_data') && resp.request().method() === 'POST' && resp.status() === 200) {
        try {
          const j = await resp.json()
          if (j?.payload?.setup?.setup?.setupMenuItems) payload = j
        } catch {
          /* ignore */
        }
      }
    })
    // Page never reaches networkidle (analytics polling); wait for the capture.
    await page.goto(MAP.orderUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
    for (let i = 0; i < 60 && !payload; i++) await page.waitForTimeout(500)
    if (!payload) throw new Error('initial_data feed not captured (page blocked or changed?)')
    return payload.payload.setup.setup.setupMenuItems
  } finally {
    await browser.close()
  }
}

// POS defaultName -> { base, sizes: { sizeName: price }, photo }
function indexPos(items) {
  const idx = {}
  for (const it of Object.values(items)) {
    const sizes = {}
    for (const s of it.sizes || []) sizes[s.sizeInfo?.defaultName ?? '?'] = s.price
    idx[it.defaultName] = { base: it.basePrice, sizes, photo: it.imageUrl || '' }
  }
  return idx
}

function singleValue(pos) {
  if (pos.base && pos.base > 0) return money(pos.base)
  const vals = Object.values(pos.sizes).filter((v) => v > 0)
  return vals.length ? money(vals[0]) : null
}

// "Single $5 | 3 Pack $14" -> "$5 / $14"
function duoValue(pos) {
  const [a, b] = MAP.duoSizes
  const va = pos.sizes[a]
  const vb = pos.sizes[b]
  if (va == null || vb == null || va <= 0 || vb <= 0) return null
  return `${money(va)} / ${money(vb)}`
}

// Protein-priced items -> "$13 to $16" (or "$13" when all equal).
function rangeValue(pos) {
  const vals = Object.values(pos.sizes).filter((v) => v > 0)
  if (!vals.length) return null
  const lo = Math.min(...vals)
  const hi = Math.max(...vals)
  return lo === hi ? money(lo) : `${money(lo)} to ${money(hi)}`
}

function sizePickValue(pos, sizeName) {
  const v = pos.sizes[sizeName]
  return v && v > 0 ? money(v) : null
}

function build(idx) {
  const prices = {}
  const photos = {}
  const missing = []
  const zero = []
  for (const [ourName, spec] of Object.entries(MAP.items)) {
    const pos = idx[spec.pos]
    if (!pos) { missing.push(ourName); continue }
    let val
    if (spec.type === 'duo') val = duoValue(pos)
    else if (spec.type === 'range') val = rangeValue(pos)
    else if (spec.type === 'sizePick') val = sizePickValue(pos, spec.size)
    else val = singleValue(pos)
    if (val == null) { zero.push(ourName); continue }
    prices[ourName] = val
    if (pos.photo) photos[ourName] = pos.photo
  }
  return { prices, photos, missing, zero }
}

function stableStringify(obj) {
  const keys = Object.keys(obj).sort()
  return `{\n${keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(obj[k])}`).join(',\n')}\n}\n`
}

function diff(oldObj, newObj, label) {
  const changes = []
  const all = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
  for (const k of all) {
    if (JSON.stringify(oldObj[k]) !== JSON.stringify(newObj[k])) {
      changes.push(`  [${label}] ${k}: ${oldObj[k] === undefined ? '(default)' : JSON.stringify(oldObj[k])} -> ${JSON.stringify(newObj[k]) ?? '(removed)'}`)
    }
  }
  return changes
}

async function main() {
  console.log('• Fetching live POS menu…')
  const items = await fetchPosMenu()
  console.log(`• Got ${Object.keys(items).length} POS items`)
  const idx = indexPos(items)
  const { prices, photos, missing, zero } = build(idx)

  const mappedTotal = Object.keys(MAP.items).length
  if (missing.length) console.warn(`⚠ Not found in feed (${missing.length}): ${missing.join(', ')}`)
  if (zero.length) console.warn(`⚠ Skipped (no/zero price) (${zero.length}): ${zero.join(', ')}`)
  if (missing.length / mappedTotal > MAX_MISSING_RATIO) {
    console.error(`✗ ABORT: ${missing.length}/${mappedTotal} mapped items missing (>25%). POS menu structure likely changed; not publishing.`)
    process.exit(2)
  }

  let prevPrices = {}
  let prevPhotos = {}
  try { prevPrices = JSON.parse(readFileSync(OUT_PRICES, 'utf8')) } catch { /* first run */ }
  try { prevPhotos = JSON.parse(readFileSync(OUT_PHOTOS, 'utf8')) } catch { /* first run */ }
  const changes = [...diff(prevPrices, prices, 'price'), ...diff(prevPhotos, photos, 'photo')]

  if (changes.length) {
    console.log(`\n${changes.length} change(s):`)
    console.log(changes.join('\n'))
  } else {
    console.log('• No changes.')
  }

  if (DRY) { console.log('\n(dry run, nothing written)'); return }
  writeFileSync(OUT_PRICES, stableStringify(prices))
  writeFileSync(OUT_PHOTOS, stableStringify(photos))
  console.log(`\n✓ Wrote pos-prices.json (${Object.keys(prices).length}) + pos-photos.json (${Object.keys(photos).length})`)
}

main().catch((err) => {
  console.error('✗ Fatal:', err.message)
  process.exit(1)
})
