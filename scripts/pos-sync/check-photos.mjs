import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const MAP = JSON.parse(readFileSync('scripts/pos-sync/pos-map.json', 'utf8'))

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
let payload = null
page.on('response', async (r) => {
  if (payload) return
  if (r.url().includes('/initial_data') && r.request().method() === 'POST' && r.status() === 200) {
    try { const j = await r.json(); if (j?.payload?.setup?.setup?.setupMenuItems) payload = j } catch {}
  }
})
await page.goto(MAP.orderUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
for (let i = 0; i < 60 && !payload; i++) await page.waitForTimeout(500)
await browser.close()
if (!payload) { console.error('no feed'); process.exit(1) }

const items = payload.payload.setup.setup.setupMenuItems
const byName = {}
for (const it of Object.values(items)) byName[it.defaultName] = it

// Coverage across OUR mapped items
let have = 0, miss = []
const posNames = []
for (const [ours, spec] of Object.entries(MAP.items)) {
  const names = Array.isArray(spec.pos) ? spec.pos : [spec.pos]
  const it = byName[names[0]]
  const img = it?.imageUrl || ''
  if (img) { have++; posNames.push([ours, img]) } else miss.push(ours)
}
console.log(`MAPPED ITEMS WITH PHOTOS: ${have}/${Object.keys(MAP.items).length}`)
console.log('\nMISSING PHOTOS:', miss.join(', ') || '(none)')
console.log('\nSAMPLE URLS:')
for (const [n, u] of posNames.slice(0, 12)) console.log(' -', n, '->', u)
