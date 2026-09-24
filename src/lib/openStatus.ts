// Shared restaurant-clock logic. Everything computes NORTON's current time
// (America/New_York) regardless of the visitor's timezone. Used by the live
// "Open Now" pill and the "Tonight at the Truckeria" band.

import { hours } from '../data/site'

export const hoursTimezone = 'America/New_York'

// Open/close ranges in minutes since midnight, restaurant-local, derived from
// the posted hours so the live pill can never disagree with the hours table.
// This used to be a hand-written copy and it silently went stale: the table
// read 9pm while the hero still said 8pm. Anything that doesn't parse as
// "h:mm am - h:mm pm" (such as "Closed") gets no entry, meaning closed all day.
function parseClock(raw: string): number | null {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(raw.trim())
  if (!m) return null
  return ((Number(m[1]) % 12) + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + Number(m[2] ?? 0)
}

export const hoursRanges: Record<number, { open: number; close: number }> = Object.fromEntries(
  hours.flatMap((h) => {
    const [open, close] = h.time.split(/\s*-\s*/).map(parseClock)
    return open != null && close != null ? [[h.dow, { open, close }]] : []
  }),
)

export type Status =
  | { kind: 'open'; closes: string; dow: number }
  | { kind: 'closing'; closes: string; dow: number }
  | { kind: 'closed'; opensDay: string | null; opens: string; dow: number }

export function fmt(mins: number): string {
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  const ampm = h24 < 12 ? 'AM' : 'PM'
  return m === 0 ? `${h} ${ampm}` : `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

const DOW: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

export function restaurantNow(): { dow: number; mins: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: hoursTimezone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return { dow: DOW[get('weekday')] ?? 0, mins: Number(get('hour')) * 60 + Number(get('minute')) }
}

export function computeStatus(): Status {
  const { dow, mins } = restaurantNow()
  const today = hoursRanges[dow]
  if (today && mins >= today.open && mins < today.close) {
    const left = today.close - mins
    return left <= 60
      ? { kind: 'closing', closes: fmt(today.close), dow }
      : { kind: 'open', closes: fmt(today.close), dow }
  }
  if (today && mins < today.open) {
    return { kind: 'closed', opensDay: null, opens: fmt(today.open), dow }
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dow + i) % 7
    const r = hoursRanges[d]
    if (r) {
      const dayName = i === 1 ? 'tomorrow' : hours.find((h) => h.dow === d)?.day ?? ''
      return { kind: 'closed', opensDay: dayName, opens: fmt(r.open), dow }
    }
  }
  return { kind: 'closed', opensDay: null, opens: '', dow }
}
