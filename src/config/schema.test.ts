import { describe, expect, it } from 'vitest'
import { SchoolConfig } from './schema.js'

const valid = {
  slug: 'demo',
  locales: { supported: ['bn', 'en'], default: 'bn' },
  theme: { preset: 'emerald', overrides: {} },
  variants: {},
  features: {},
  data: { source: 'fixture' },
}

describe('SchoolConfig', () => {
  it('accepts a valid configuration', () => {
    expect(SchoolConfig.safeParse(valid).success).toBe(true)
  })

  it('rejects a default locale that is not supported', () => {
    const result = SchoolConfig.safeParse({ ...valid, locales: { supported: ['bn'], default: 'en' } })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown design token, so typos cannot silently do nothing', () => {
    const result = SchoolConfig.safeParse({
      ...valid,
      theme: { preset: 'emerald', overrides: { 'color.primry': '#fff' } },
    })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown theme preset', () => {
    expect(SchoolConfig.safeParse({ ...valid, theme: { preset: 'neon', overrides: {} } }).success).toBe(false)
  })

  it('rejects a slug that is not kebab-case', () => {
    expect(SchoolConfig.safeParse({ ...valid, slug: 'Demo School' }).success).toBe(false)
  })
})
