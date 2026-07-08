/*
 * POS price sync, mirrors live Heartland/MobileBytes online-ordering prices onto
 * the website menu. Writes src/data/pos-prices.json (keyed by our item name);
 * src/data/site.ts overlays it over the hand-coded defaults. Curated content
 * (names, descriptions, order, styling) is never touched, only prices.
 *
 *   node scripts/pos-sync/sync.mjs            # fetch live, write if valid
 *   node scripts/pos-sync/sync.mjs --dry      # print what would change, write nothing
 *
 * Exit codes: 0 ok (file written), 2 anomaly/abort (nothing written), 1 fatal.
 * See docs/POS-SYNC.md.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const MAP = JSON.parse(readFileSync(join(HERE, 'pos-map.json'), 'utf8'))
const OUT = join(ROOT, 'src', 'data', 'pos-prices.json')
const DRY = process.argv.includes('--dry')

// If more than this share of mapped items can't be found in the feed, something
// structural changed, abort rather than publish a half-empty menu.
const MAX_MISSING_RATIO = 0.25

const money = (n) => Number(n).toFixed(2)

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
      if (
        resp.url().includes('/initial_data') &&
        resp.request().method() === 'POST' &&
        resp.status() === 200
      ) {
        try {
          const j = await resp.json()
          if (j?.payload?.setup?.setup?.setupMenuItems) payload = j
        } catch {
          /* ignore */
        }
      }
    })
    // The page never reaches networkidle (analytics keep polling), so load the
    // DOM and then wait for the initial_data response our listener captures.
    await page.goto(MAP.orderUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
    for (let i = 0; i < 60 && !payload; i++) await page.waitForTimeout(500)
    if (!payload) throw new Error('initial_data feed not captured (page blocked or changed?)')
    return payload.payload.setup.setup.setupMenuItems
  } finally {
    await browser.close()
  }
}

// Build a lookup: POS defaultName -> { base, sizes: { sizeName: price } }
function indexPos(items) {
  const idx = {}
  for (const it of Object.values(items)) {
    const sizes = {}
    for (const s of it.sizes || []) sizes[s.sizeInfo?.defaultName ?? '?'] = s.price
    idx[it.defaultName] = { base: it.basePrice, sizes }
  }
  return idx
}

function pizzaValue(pos) {
  const out = {}
  for (const [label, key] of Object.entries(MAP.sizeLabels)) {
    if (pos.sizes[label] != null) out[key] = money(pos.sizes[label])
  }
  // Order keys 10,12,14,16,gf for stable, readable diffs.
  const ordered = {}
  for (const k of ['10', '12', '14', '16', 'gf']) if (out[k] != null) ordered[k] = out[k]
  return Object.keys(ordered).length ? ordered : null
}

function singleValue(pos) {
  if (pos.base && pos.base > 0) return money(pos.base)
  const vals = Object.values(pos.sizes)
  return vals.length ? money(vals[0]) : null
}

function twoSizeValue(pos) {
  const sm = pos.sizes['Small'] ?? pos.sizes['SM']
  const lg = pos.sizes['Large'] ?? pos.sizes['LG']
  if (sm == null || lg == null) return null
  return `Small ${money(sm)} · Large ${money(lg)}`
}

function build(idx) {
  const result = {}
  const missing = []
  const zero = []
  for (const [ourName, spec] of Object.entries(MAP.items)) {
    if (spec.type === 'combo') {
      const parts = spec.pos.map((p) => idx[p])
      if (parts.some((p) => !p)) { missing.push(ourName); continue }
      const nums = parts.map((p) => singleValue(p))
      if (nums.some((v) => v == null || Number(v) <= 0)) { zero.push(ourName); continue }
      result[ourName] = spec.fmt.replace(/\{(\d+)\}/g, (_, i) => nums[Number(i)])
      continue
    }
    const pos = idx[spec.pos]
    if (!pos) { missing.push(ourName); continue }
    let val
    if (spec.type === 'pizza') val = pizzaValue(pos)
    else if (spec.type === 'twoSize') val = twoSizeValue(pos)
    else val = singleValue(pos)
    if (val == null || (typeof val === 'string' && Number(val) <= 0 && !/[A-Za-z·]/.test(val))) {
      zero.push(ourName)
      continue
    }
    result[ourName] = val
  }
  return { result, missing, zero }
}

// Sorted-key JSON for stable git diffs.
function stableStringify(obj) {
  const keys = Object.keys(obj).sort()
  const lines = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(obj[k])}`)
  return `{\n${lines.join(',\n')}\n}\n`
}

function diff(oldObj, newObj) {
  const changes = []
  for (const k of Object.keys(newObj)) {
    const a = JSON.stringify(oldObj[k])
    const b = JSON.stringify(newObj[k])
    if (a !== b) changes.push(`  ${k}: ${oldObj[k] === undefined ? '(default)' : a} -> ${b}`)
  }
  return changes
}

async function main() {
  console.log('• Fetching live POS menu…')
  const items = await fetchPosMenu()
  console.log(`• Got ${Object.keys(items).length} POS items`)
  const idx = indexPos(items)
  const { result, missing, zero } = build(idx)

  const mappedTotal = Object.keys(MAP.items).length
  if (missing.length) console.warn(`⚠ Not found in feed (${missing.length}): ${missing.join(', ')}`)
  if (zero.length) console.warn(`⚠ Skipped (no/zero price) (${zero.length}): ${zero.join(', ')}`)

  if (missing.length / mappedTotal > MAX_MISSING_RATIO) {
    console.error(
      `✗ ABORT: ${missing.length}/${mappedTotal} mapped items missing from the feed (> ${MAX_MISSING_RATIO * 100}%). ` +
        `The POS menu structure likely changed; not publishing. Review scripts/pos-sync/pos-map.json.`,
    )
    process.exit(2)
  }

  let prev = {}
  try { prev = JSON.parse(readFileSync(OUT, 'utf8')) } catch { /* first run */ }
  const changes = diff(prev, result)

  if (changes.length) {
    console.log(`\n${changes.length} price change(s):`)
    console.log(changes.join('\n'))
  } else {
    console.log('• No price changes.')
  }

  if (DRY) { console.log('\n(dry run, nothing written)'); return }
  writeFileSync(OUT, stableStringify(result))
  console.log(`\n✓ Wrote ${OUT} (${Object.keys(result).length} items synced).`)
}

main().catch((err) => {
  console.error('✗ Fatal:', err.message)
  process.exit(1)
})
