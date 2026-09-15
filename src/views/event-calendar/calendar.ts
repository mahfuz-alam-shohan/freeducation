import type { SchoolEvent } from '../../contracts/index.js'
import { dateKeyInZone } from '../../i18n/index.js'

export interface CalendarDay {
  /** YYYY-MM-DD, which sorts and compares without parsing. */
  key: string
  dayOfMonth: number
  inMonth: boolean
  isToday: boolean
  events: SchoolEvent[]
}

export interface MonthView {
  year: number
  /** 0-11, matching Date. */
  month: number
  weeks: CalendarDay[][]
  /** Inclusive range the grid covers, so only the visible events need fetching. */
  from: string
  to: string
}

const pad = (value: number) => String(value).padStart(2, '0')
const keyOf = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`

/** Parses 'YYYY-MM'. Falls back to the given month when the input is unusable. */
export function parseMonth(value: string | null, fallback: { year: number; month: number }) {
  const match = /^(\d{4})-(\d{2})$/.exec(value ?? '')
  if (!match) return fallback
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  if (month < 0 || month > 11) return fallback
  return { year, month }
}

export const shiftMonth = (year: number, month: number, by: number) => {
  const total = year * 12 + month + by
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 }
}

export const monthParam = (year: number, month: number) => `${year}-${pad(month + 1)}`

/**
 * Builds the grid a month is drawn on: whole weeks, padded with the neighbouring
 * months' days so every row has seven cells.
 */
export function buildMonthView(
  year: number,
  month: number,
  options: { weekStartsOn: number; timeZone: string; events?: SchoolEvent[]; today?: Date },
): MonthView {
  const { weekStartsOn, timeZone, events = [], today = new Date() } = options

  const firstOfMonth = new Date(Date.UTC(year, month, 1))
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const leading = (firstOfMonth.getUTCDay() - weekStartsOn + 7) % 7
  const weekCount = Math.ceil((leading + daysInMonth) / 7)

  const byDay = new Map<string, SchoolEvent[]>()
  for (const event of events) {
    const key = dateKeyInZone(event.startsAt, timeZone)
    if (!key) continue
    const bucket = byDay.get(key)
    if (bucket) bucket.push(event)
    else byDay.set(key, [event])
  }

  const todayKey = dateKeyInZone(today.toISOString(), timeZone)
  const weeks: CalendarDay[][] = []

  for (let week = 0; week < weekCount; week++) {
    const row: CalendarDay[] = []
    for (let slot = 0; slot < 7; slot++) {
      const offset = week * 7 + slot - leading
      const cell = new Date(Date.UTC(year, month, 1 + offset))
      const key = keyOf(cell.getUTCFullYear(), cell.getUTCMonth(), cell.getUTCDate())
      row.push({
        key,
        dayOfMonth: cell.getUTCDate(),
        inMonth: cell.getUTCMonth() === month && cell.getUTCFullYear() === year,
        isToday: key === todayKey,
        events: byDay.get(key) ?? [],
      })
    }
    weeks.push(row)
  }

  return {
    year, month, weeks,
    from: weeks[0]?.[0]?.key ?? keyOf(year, month, 1),
    to: weeks[weeks.length - 1]?.[6]?.key ?? keyOf(year, month, daysInMonth),
  }
}
