import { describe, expect, it } from 'vitest'
import { buildMonthView, monthParam, parseMonth, shiftMonth } from './calendar.js'
import type { SchoolEvent } from '../../contracts/index.js'

const dhaka = 'Asia/Dhaka'

const event = (id: string, startsAt: string): SchoolEvent => ({
  id, slug: id, title: { en: id }, startsAt,
})

describe('parseMonth', () => {
  const fallback = { year: 2026, month: 8 }

  it('reads a well-formed month', () => {
    expect(parseMonth('2026-01', fallback)).toEqual({ year: 2026, month: 0 })
    expect(parseMonth('2026-12', fallback)).toEqual({ year: 2026, month: 11 })
  })

  it('falls back on anything it cannot trust', () => {
    for (const bad of [null, '', 'nonsense', '2026-13', '2026-00', '26-01', '2026-1']) {
      expect(parseMonth(bad, fallback)).toEqual(fallback)
    }
  })
})

describe('shiftMonth', () => {
  it('moves within a year', () => {
    expect(shiftMonth(2026, 5, 1)).toEqual({ year: 2026, month: 6 })
  })

  it('rolls forward across December', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 })
  })

  it('rolls back across January', () => {
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 })
  })
})

describe('monthParam', () => {
  it('pads the month so the value sorts', () => {
    expect(monthParam(2026, 0)).toBe('2026-01')
    expect(monthParam(2026, 11)).toBe('2026-12')
  })
})

describe('buildMonthView', () => {
  const view = (year: number, month: number, weekStartsOn = 6, events: SchoolEvent[] = []) =>
    buildMonthView(year, month, { weekStartsOn, timeZone: dhaka, events, today: new Date('2026-09-15T00:00:00Z') })

  it('always produces whole weeks of seven days', () => {
    for (let month = 0; month < 12; month++) {
      for (const week of view(2026, month).weeks) expect(week).toHaveLength(7)
    }
  })

  it('covers every day of the month exactly once', () => {
    const days = view(2026, 8).weeks.flat().filter(day => day.inMonth)
    expect(days).toHaveLength(30)
    expect(days[0]?.dayOfMonth).toBe(1)
    expect(days[29]?.dayOfMonth).toBe(30)
  })

  it('handles a leap February', () => {
    expect(view(2024, 1).weeks.flat().filter(day => day.inMonth)).toHaveLength(29)
  })

  it('handles a common February', () => {
    expect(view(2026, 1).weeks.flat().filter(day => day.inMonth)).toHaveLength(28)
  })

  it('starts the week on the day the school chose', () => {
    // 1 September 2026 is a Tuesday, so a Saturday-start week leads with 29 August.
    const first = view(2026, 8, 6).weeks[0]?.[0]
    expect(first?.key).toBe('2026-08-29')
    expect(first?.inMonth).toBe(false)
  })

  it('respects a different week start', () => {
    expect(view(2026, 8, 0).weeks[0]?.[0]?.key).toBe('2026-08-30')
    expect(view(2026, 8, 1).weeks[0]?.[0]?.key).toBe('2026-08-31')
  })

  it('pads the final week with the next month', () => {
    const weeks = view(2026, 8, 6).weeks
    const last = weeks[weeks.length - 1]?.[6]
    expect(last?.inMonth).toBe(false)
    expect(last?.key.startsWith('2026-10')).toBe(true)
  })

  it('reports the range it covers, so only visible events need loading', () => {
    const grid = view(2026, 8, 6)
    expect(grid.from).toBe('2026-08-29')
    expect(grid.to).toBe(grid.weeks[grid.weeks.length - 1]?.[6]?.key)
  })

  it('places an event on the school’s local day, not the server’s', () => {
    // 20:00 UTC on 1 September is 02:00 on 2 September in Dhaka.
    const grid = view(2026, 8, 6, [event('late', '2026-09-01T20:00:00.000Z')])
    const first = grid.weeks.flat().find(day => day.key === '2026-09-01')
    const second = grid.weeks.flat().find(day => day.key === '2026-09-02')
    expect(first?.events).toHaveLength(0)
    expect(second?.events.map(e => e.id)).toEqual(['late'])
  })

  it('keeps several events on the same day together', () => {
    const grid = view(2026, 8, 6, [
      event('a', '2026-09-10T04:00:00.000Z'),
      event('b', '2026-09-10T06:00:00.000Z'),
    ])
    const day = grid.weeks.flat().find(entry => entry.key === '2026-09-10')
    expect(day?.events.map(e => e.id)).toEqual(['a', 'b'])
  })

  it('ignores an event whose date cannot be read', () => {
    const grid = view(2026, 8, 6, [event('broken', 'not-a-date')])
    expect(grid.weeks.flat().every(day => day.events.length === 0)).toBe(true)
  })

  it('marks today, and only today', () => {
    const marked = view(2026, 8).weeks.flat().filter(day => day.isToday)
    expect(marked).toHaveLength(1)
    expect(marked[0]?.key).toBe('2026-09-15')
  })
})
