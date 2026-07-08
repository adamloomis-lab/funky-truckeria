import { useMemo, useState } from 'react'
import { Calculator, Plus, Minus, Trash2, ShoppingBag, ChevronDown, Copy, Check } from 'lucide-react'
import { company, menuGroups } from '../data/site'

// "Build your taco run", an interactive calculator on the menu page. Pick a
// taco, single or 3-pack, quantity, stack an order, see the total, then jump
// to the real online ordering. Prices come from the same POS-synced data the
// menu uses, so the math always matches the register.
//
// Heartland's ordering app has no cart prefill or deep links (verified), so a
// clean copy-paste list is the best handoff, great for phone orders too.

type PackKey = 'single' | 'pack'
type Line = { taco: string; pack: PackKey; each: number; qty: number }

const tacoGroup = menuGroups.find((g) => g.title === 'Funky Tacos')
const TACOS = (tacoGroup?.items ?? [])
  .map((it) => {
    const m = /^\$([\d.]+) \/ \$([\d.]+)$/.exec(it.price ?? '')
    return m ? { name: it.name, single: Number(m[1]), pack: Number(m[2]) } : null
  })
  .filter((t): t is { name: string; single: number; pack: number } => t !== null)

const money = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`)

export default function TacoEstimator() {
  const [taco, setTaco] = useState<string>(TACOS[0]?.name ?? '')
  const [pack, setPack] = useState<PackKey>('single')
  const [qty, setQty] = useState(1)
  const [lines, setLines] = useState<Line[]>([])
  const [copied, setCopied] = useState(false)

  const sel = TACOS.find((t) => t.name === taco)
  const current = sel ? (pack === 'single' ? sel.single : sel.pack) : null
  const total = useMemo(() => lines.reduce((s, l) => s + l.each * l.qty, 0), [lines])

  const add = () => {
    if (current == null) return
    setLines((prev) => {
      const i = prev.findIndex((l) => l.taco === taco && l.pack === pack)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: Math.min(20, next[i].qty + qty) }
        return next
      }
      return [...prev, { taco, pack, each: current, qty }]
    })
    setQty(1)
  }

  const copyList = async () => {
    const text = [
      'My Funky Truckeria order:',
      ...lines.map((l) => `${l.qty}x ${l.taco} (${l.pack === 'single' ? 'single' : '3-pack'}) ${money(l.each * l.qty)}`),
      `Estimated total: ${money(total)}`,
    ].join('\n')
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        ta.remove()
      } catch {
        /* clipboard unavailable */
      }
    }
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (TACOS.length === 0) return null

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="border-b border-line bg-brick px-6 py-4 text-on-brick sm:px-7">
        <h3 className="flex items-center gap-2 font-display text-[22px] uppercase tracking-[0.03em]">
          <Calculator size={22} /> Build Your Taco Run
        </h3>
        <p className="mt-1 font-body text-[13px] normal-case tracking-normal text-on-brick/85">
          Price it out before you order. Live register prices.
        </p>
      </div>

      <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[1fr_340px]">
        {/* Builder */}
        <div>
          <label className="block text-label-sm uppercase tracking-[0.2em] text-ink-faint">
            Pick your taco
            <span className="relative mt-2 block">
              <select
                value={taco}
                onChange={(e) => setTaco(e.target.value)}
                className="w-full appearance-none rounded border border-line bg-paper-2 px-4 py-3.5 pr-11 font-display text-[15px] uppercase tracking-[0.03em] text-ink focus:border-marigold focus:outline-none"
              >
                {TACOS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" />
            </span>
          </label>

          <p className="mt-5 text-label-sm uppercase tracking-[0.2em] text-ink-faint">How many per order</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                { key: 'single' as PackKey, label: 'Single', sub: sel ? money(sel.single) : '' },
                { key: 'pack' as PackKey, label: '3-Pack', sub: sel ? `${money(sel.pack)} · same taco` : '' },
              ]
            ).map((o) => {
              const on = pack === o.key
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setPack(o.key)}
                  aria-pressed={on}
                  className={`rounded-md border px-3 py-3 text-center transition-all ${
                    on
                      ? 'border-marigold bg-marigold text-steel'
                      : 'border-line bg-paper-2 text-ink hover:border-marigold/60'
                  }`}
                >
                  <span className="block font-display text-[16px] uppercase leading-none">{o.label}</span>
                  <span className={`mt-1 block text-[11px] font-semibold uppercase tracking-[0.08em] ${on ? 'text-steel/75' : 'text-ink-faint'}`}>
                    {o.sub}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-label-sm uppercase tracking-[0.2em] text-ink-faint">Quantity</p>
              <div className="mt-2 inline-flex items-center rounded border border-line">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 text-ink hover:bg-paper-3" aria-label="Fewer">
                  <Minus size={16} />
                </button>
                <span className="min-w-10 text-center font-display text-lg text-ink">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} className="px-3 py-2.5 text-ink hover:bg-paper-3" aria-label="More">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-label-sm uppercase tracking-[0.2em] text-ink-faint">This line</span>
              <span className="font-display text-3xl leading-none text-brick-light">
                {current != null ? money(current * qty) : ''}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={add}
            className="mt-5 w-full rounded bg-marigold px-6 py-3.5 text-label-lg font-bold uppercase tracking-[0.16em] text-steel transition-colors hover:bg-marigold-light"
          >
            <Plus size={15} className="mr-1 inline" /> Add to My Run
          </button>
        </div>

        {/* Ticket */}
        <div className="flex flex-col rounded-lg border border-line bg-paper-2 p-5">
          <p className="text-label-sm uppercase tracking-[0.2em] text-ink-faint">Your taco run</p>
          {lines.length === 0 ? (
            <p className="mt-4 flex-1 font-body text-[14px] normal-case leading-relaxed tracking-normal text-ink-faint">
              Nothing yet. Build a line on the left and add it here to see your total.
            </p>
          ) : (
            <ul className="mt-3 flex-1 divide-y divide-line/70">
              {lines.map((l) => (
                <li key={`${l.taco}-${l.pack}`} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[14px] uppercase text-ink">
                      {l.qty} × {l.taco}
                    </p>
                    <p className="font-body text-[12px] normal-case tracking-normal text-ink-faint">
                      {l.pack === 'single' ? 'Single' : '3-pack'} · {money(l.each)} each
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display text-sm tabular-nums text-ink">{money(l.each * l.qty)}</span>
                    <button
                      type="button"
                      onClick={() => setLines(lines.filter((x) => x !== l))}
                      className="text-ink-faint transition-colors hover:text-brick-light"
                      aria-label={`Remove ${l.taco}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-label-sm uppercase tracking-[0.2em] text-ink-soft">Estimated total</span>
            <span className="font-display text-3xl leading-none text-brick-light">{money(total)}</span>
          </div>
          <a
            href={company.orderOnline}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brick px-6 py-3.5 text-label-lg font-bold uppercase tracking-[0.16em] text-on-brick transition-colors hover:bg-brick-dark"
          >
            <ShoppingBag size={15} /> Order For Real
          </a>
          {lines.length > 0 && (
            <button
              type="button"
              onClick={copyList}
              className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded border border-line px-6 py-2.5 text-label-sm font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-marigold hover:text-ink"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-marigold" /> Copied, read it off while you order
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy List
                </>
              )}
            </button>
          )}
          <p className="mt-3 text-center font-body text-[11px] normal-case leading-relaxed tracking-normal text-ink-faint">
            Prices mirror the register and sync daily. Add-ons and extras may change the final total.
          </p>
        </div>
      </div>
    </div>
  )
}
