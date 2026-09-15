import en from './catalogs/en.json' with { type: 'json' }
import bn from './catalogs/bn.json' with { type: 'json' }
import type { Locale, LocalizedText } from '../contracts/index.js'

const catalogs = { en, bn } as const

/** Every interface string key. A typo fails the build rather than shipping blank text. */
export type MessageKey = keyof typeof en

export type Translator = (key: MessageKey) => string

export function createTranslator(locale: Locale): Translator {
  const catalog = catalogs[locale] ?? catalogs.en
  return key => (catalog as Record<string, string>)[key] ?? (en as Record<string, string>)[key] ?? key
}

/**
 * Reads multilingual content with a fallback chain.
 * Always use this — a school may be single-language, and translations go missing.
 */
export function resolveText(
  text: LocalizedText | undefined,
  locale: Locale,
  fallbacks: Locale[] = ['en', 'bn'],
): string {
  if (!text) return ''
  const direct = text[locale]
  if (direct?.trim()) return direct
  for (const candidate of fallbacks) {
    const value = text[candidate]
    if (value?.trim()) return value
  }
  const first = Object.values(text).find(value => value?.trim())
  return first ?? ''
}

const intlLocale = (locale: Locale) => (locale === 'bn' ? 'bn-BD' : 'en-GB')

export function formatDate(value: string | undefined, locale: Locale, timeZone?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric', month: 'long', year: 'numeric', ...(timeZone ? { timeZone } : {}),
  }).format(date)
}

export function formatTime(value: string | undefined, locale: Locale, timeZone?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: 'numeric', minute: '2-digit', ...(timeZone ? { timeZone } : {}),
  }).format(date)
}

/**
 * Which calendar day an instant falls on, in the school's own timezone.
 * A 09:00 event in Dhaka is on the Dhaka date even when the server runs in UTC.
 */
export function dateKeyInZone(value: string, timeZone: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  // en-CA formats as YYYY-MM-DD, which sorts and compares correctly.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date)
}

/** 'September 2026' in the reader's language. */
export function formatMonth(year: number, month: number, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month, 1)))
}

/** Weekday names starting from the day the school's week starts on. */
export function weekdayNames(locale: Locale, weekStartsOn: number): string[] {
  const formatter = new Intl.DateTimeFormat(intlLocale(locale), { weekday: 'short', timeZone: 'UTC' })
  // 4 January 1970 was a Sunday, so it anchors the week cleanly.
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(Date.UTC(1970, 0, 4 + ((weekStartsOn + index) % 7)))))
}

/** Turns rich text into a single clean line suitable for a meta description. */
export function toPlainText(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&[a-zA-Z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

/** 5:12 — minutes and seconds, in the reader's digits. */
export function formatDuration(seconds: number | undefined, locale: Locale): string {
  if (!seconds || seconds <= 0) return ''
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  const digits = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', { useGrouping: false })
  return `${digits.format(minutes)}:${digits.format(rest).padStart(2, digits.format(0))}`
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB').format(value)
}
