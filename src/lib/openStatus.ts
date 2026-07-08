// Shared restaurant-clock logic. Everything computes NORTON's current time
// (America/New_York) regardless of the visitor's timezone. Used by the live
// "Open Now" pill and the "Tonight at the Truckeria" band.

import { hours } from '../data/site'

// Structured open/close ranges (minutes since midnight, restaurant-local).
// No Sunday entry = closed all day. dow matches Date.getDay() (0 = Sun).
export const hoursTimezone = 'America/New_York'
export const hoursRanges: Record<number, { open: number; close: number }> = {
  1: { open: 11 * 60, close: 20 * 60 }, // Mon 11–8
  2: { open: 11 * 60, close: 20 * 60 }, // Tue
  3: { open: 11 * 60, close: 20 * 60 }, // Wed
  4: { open: 11 * 60, close: 20 * 60 }, // Thu
  5: { open: 11 * 60, close: 21 * 60 }, // Fri 11–9
  6: { open: 11 * 60, close: 21 * 60 }, // Sat 11–9
}

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
