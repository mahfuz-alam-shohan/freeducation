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

export function formatDate(value: string | undefined, locale: Locale): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-GB').format(value)
}
