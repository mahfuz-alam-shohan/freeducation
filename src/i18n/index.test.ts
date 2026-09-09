import { describe, expect, it } from 'vitest'
import { createTranslator, formatDate, resolveText } from './index.js'

describe('resolveText', () => {
  it('returns the requested language', () => {
    expect(resolveText({ bn: 'নোটিশ', en: 'Notice' }, 'bn')).toBe('নোটিশ')
  })

  it('falls back when the requested language is missing', () => {
    expect(resolveText({ en: 'Notice' }, 'bn')).toBe('Notice')
  })

  it('treats blank strings as missing', () => {
    expect(resolveText({ bn: '   ', en: 'Notice' }, 'bn')).toBe('Notice')
  })

  it('returns an empty string rather than throwing on missing content', () => {
    expect(resolveText(undefined, 'bn')).toBe('')
    expect(resolveText({}, 'bn')).toBe('')
  })
})

describe('createTranslator', () => {
  it('translates a known key', () => {
    expect(createTranslator('en')('notice.title')).toBe('Notices')
    expect(createTranslator('bn')('notice.title')).toBe('নোটিশ')
  })
})

describe('formatDate', () => {
  it('formats per locale', () => {
    expect(formatDate('2026-01-05T04:00:00.000Z', 'en')).toContain('2026')
  })

  it('returns an empty string for unusable input', () => {
    expect(formatDate('not-a-date', 'en')).toBe('')
    expect(formatDate(undefined, 'en')).toBe('')
  })
})
