import { z } from 'zod'
import { Locale } from '../contracts/index.js'
import { isTokenName, themePresets } from '../tokens/tokens.js'
import { designNames, isDesignName } from '../designs/index.js'

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

  /** Traditional ornament shown as a band under the header and above the footer. */
  decor: z.enum(['none', 'alpona', 'kantha', 'terracotta']).default('none'),

  /** IANA zone used to decide which calendar day an event falls on. */
  timezone: z.string().min(1).default('Asia/Dhaka'),

  /** 0 is Sunday. Bangladeshi wall calendars normally begin the week on Saturday. */
  weekStartsOn: z.number().int().min(0).max(6).default(6),

  theme: z.object({
    preset: z.string().refine(p => p in themePresets, { message: 'unknown theme preset' }).default('emerald'),
    overrides: TokenOverrides,
  }).default({ preset: 'emerald', overrides: {} }),

  /**
   * One design for the whole site. Every page renders that set's variant, so a school
   * cannot end up looking like four different sites.
   */
  design: z.string()
    .refine(isDesignName, { message: `unknown design (available: ${designNames.join(', ')})` })
    .default('classic'),

  /**
   * Per-view exceptions to the chosen design. Deliberately narrow: if a school needs
   * more than an exception or two, it wanted a different design set.
   */
  variants: z.record(z.string(), z.string()).default({}),

  features: z.object({
    search: z.boolean().default(true),
    noticeTicker: z.boolean().default(true),
    themeToggle: z.boolean().default(true),
    languageSwitch: z.boolean().default(true),
    /**
     * Shows the bar that lets a visitor move between published demonstrations.
     * Off for a real school: it is scaffolding for evaluating the platform, and a
     * school's own visitors have nothing to switch to.
     */
    demoBar: z.boolean().default(false),
  }).default({
    search: true, noticeTicker: true, themeToggle: true, languageSwitch: true, demoBar: false,
  }),

  data: z.object({
    source: z.enum(['http', 'fixture']).default('fixture'),
    baseUrl: z.string().optional(),
    tenant: z.string().optional(),
  }).default({ source: 'fixture' }),
})

export type SchoolConfig = z.infer<typeof SchoolConfig>
