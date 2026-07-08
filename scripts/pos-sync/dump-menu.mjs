import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
const MAP = JSON.parse(readFileSync(new URL('./pos-map.json', import.meta.url), 'utf8'))
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
const items = Object.values(payload.payload.setup.setup.setupMenuItems)
const byCat = {}
for (const it of items) (byCat[it.categoryName || '?'] ??= []).push(it)
for (const cat of Object.keys(byCat).sort()) {
  console.log(`\n===== ${cat} (${byCat[cat].length}) =====`)
  for (const it of byCat[cat].sort((a,b)=>(a.sort||0)-(b.sort||0))) {
    const sizes = (it.sizes||[]).map(s=>`${s.sizeInfo?.defaultName} $${s.price}`).join(' | ')
    console.log(`  - ${it.defaultName} :: ${sizes || (it.basePrice ? '$'+it.basePrice : '(no price)')}`)
  }
}
console.log(`\nTOTAL: ${items.length} items; with photos: ${items.filter(i=>i.imageUrl).length}`)
