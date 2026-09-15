import type { LocalizedText } from '../../contracts/index.js'
import { dateKeyInZone, formatMonth, weekdayNames } from '../../i18n/index.js'
import type { ViewContext } from '../types.js'
import { buildMonthView, monthParam, parseMonth, shiftMonth, type MonthView } from './calendar.js'

export interface EventCalendarViewModel extends MonthView {
  title: LocalizedText
  label: string
  weekdays: string[]
  previousHref: string
  nextHref: string
  todayHref: string
  basePath: string
  timeZone: string
}

export async function loadViewModel(
  { client, route, url, config, locale }: ViewContext,
): Promise<EventCalendarViewModel> {
  const timeZone = config.timezone
  const weekStartsOn = config.weekStartsOn

  // 'Today' means today where the school is, not where the server happens to run.
  const [todayYear, todayMonth] = dateKeyInZone(new Date().toISOString(), timeZone).split('-')
  const fallback = { year: Number(todayYear), month: Number(todayMonth) - 1 }
  const { year, month } = parseMonth(url.searchParams.get('month'), fallback)

  // Build the grid once to learn which days are visible, then fetch only those events.
  const span = buildMonthView(year, month, { weekStartsOn, timeZone })
  const result = await client.get('event.list', { from: span.from, to: span.to, pageSize: 200 })
  const grid = buildMonthView(year, month, { weekStartsOn, timeZone, events: result.items })

  const previous = shiftMonth(year, month, -1)
  const next = shiftMonth(year, month, 1)
  const href = (value: string) => `/${route.path}?month=${value}`

  return {
    ...grid,
    title: route.item.label,
    label: formatMonth(year, month, locale),
    weekdays: weekdayNames(locale, weekStartsOn),
    previousHref: href(monthParam(previous.year, previous.month)),
    nextHref: href(monthParam(next.year, next.month)),
    todayHref: href(monthParam(fallback.year, fallback.month)),
    basePath: route.path,
    timeZone,
  }
}
