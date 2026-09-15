import { z } from 'zod'
import { Locale } from '../contracts/index.js'
import { isTokenName, themePresets } from '../tokens/tokens.js'

const TokenOverrides = z.record(z.string(), z.string()).default({}).superRefine((value, ctx) => {
  for (const name of Object.keys(value)) {
    if (!isTokenName(name)) {
      ctx.addIssue({ code: 'custom', message: `Unknown design token '${name}'` })
    }
  }
})

export const SchoolConfig = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),

  locales: z.object({
    supported: z.array(Locale).min(1),
    default: Locale,
  }).refine(v => v.supported.includes(v.default), {
    message: 'default locale must be one of the supported locales',
  }),

  /** IANA zone used to decide which calendar day an event falls on. */
  timezone: z.string().min(1).default('Asia/Dhaka'),

  /** 0 is Sunday. Bangladeshi wall calendars normally begin the week on Saturday. */
  weekStartsOn: z.number().int().min(0).max(6).default(6),

  theme: z.object({
    preset: z.string().refine(p => p in themePresets, { message: 'unknown theme preset' }).default('emerald'),
    overrides: TokenOverrides,
  }).default({ preset: 'emerald', overrides: {} }),

  /** Design choice per view type. Unknown ids are rejected at boot by the registry check. */
  variants: z.record(z.string(), z.string()).default({}),

  features: z.object({
    search: z.boolean().default(true),
    noticeTicker: z.boolean().default(true),
    themeToggle: z.boolean().default(true),
    languageSwitch: z.boolean().default(true),
  }).default({ search: true, noticeTicker: true, themeToggle: true, languageSwitch: true }),

  data: z.object({
    source: z.enum(['http', 'fixture']).default('fixture'),
    baseUrl: z.string().optional(),
    tenant: z.string().optional(),
  }).default({ source: 'fixture' }),
})

export type SchoolConfig = z.infer<typeof SchoolConfig>
