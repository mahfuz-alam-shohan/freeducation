/**
 * Design tokens. The only place a raw value may appear.
 * Components read var(--fe-*) so a school can restyle the whole site without touching code.
 */
export const baseTokens = {
  'color.bg': '#ffffff',
  'color.surface': '#f6f7f9',
  'color.border': '#dfe3e8',
  'color.text': '#16202b',
  'color.textMuted': '#5b6b7c',
  'color.primary': '#0b6e4f',
  'color.primaryText': '#ffffff',
  'color.accent': '#b8860b',
  'color.danger': '#b3261e',
  'color.focus': '#1a73e8',
  'color.scrim': 'rgb(8 14 20 / 0.5)',
  'color.onPrimarySurface': 'rgb(255 255 255 / 0.28)',
  'color.onPrimaryHover': 'rgb(0 0 0 / 0.16)',

  /*
   * Two scripts, one voice. The browser picks the Latin face for Latin characters and
   * the Bengali face for Bengali ones, and unicode-range means it only downloads the
   * subsets a page actually uses.
   *
   * Body: Inter + Anek Bangla — both are highly legible at small sizes, which is what
   * lets the layout stay dense without becoming hard to read.
   * Headings: Source Serif 4 + Tiro Bangla — Tiro Bangla is a book face designed for
   * sustained Bengali reading, and gives the site an institutional rather than app-like voice.
   */
  'font.body': "'Inter Variable', 'Anek Bangla Variable', system-ui, -apple-system, sans-serif",
  'font.heading': "'Source Serif 4 Variable', 'Tiro Bangla', Georgia, serif",
  'font.numeric': "'Inter Variable', system-ui, sans-serif",

  /*
   * A small, tightly-spaced scale. Body text sits at 15px rather than 16px: at these
   * sizes Inter and Anek Bangla stay crisp, and more of the page is usable at a glance.
   */
  'size.2xs': '0.6875rem',
  'size.xs': '0.75rem',
  'size.sm': '0.8125rem',
  'size.base': '0.9375rem',
  'size.lg': '1.0625rem',
  'size.xl': '1.3125rem',
  'size.2xl': '1.625rem',
  'size.3xl': '2.125rem',

  'leading.tight': '1.18',
  'leading.snug': '1.4',
  'leading.normal': '1.55',

  /* Headings tighten; small capitalised labels open up. */
  'tracking.tight': '-0.012em',
  'tracking.normal': '0',
  'tracking.wide': '0.02em',
  'tracking.caps': '0.085em',

  'weight.regular': '400',
  'weight.medium': '500',
  'weight.semibold': '600',
  'weight.bold': '700',

  'space.1': '0.1875rem',
  'space.2': '0.375rem',
  'space.3': '0.5625rem',
  'space.4': '0.75rem',
  'space.6': '1.125rem',
  'space.8': '1.5rem',
  'space.12': '2.25rem',
  'space.16': '3rem',

  /* Restrained corners: a sharper edge reads as considered rather than playful. */
  'radius.sm': '3px',
  'radius.md': '5px',
  'radius.lg': '10px',
  'shadow.sm': '0 1px 2px rgba(16, 24, 40, 0.05)',
  'shadow.md': '0 6px 18px rgba(16, 24, 40, 0.09)',
  'container.max': '1160px',
  'rule.hair': 'rgb(16 24 40 / 0.09)',
} as const

export type TokenName = keyof typeof baseTokens

export const darkTokens: Partial<Record<TokenName, string>> = {
  'color.bg': '#10161d',
  'color.surface': '#18212b',
  'color.border': '#2a3644',
  'color.text': '#e8edf2',
  'color.textMuted': '#9aabbc',
  'color.primary': '#3fbc8e',
  'color.primaryText': '#06231a',
  'color.scrim': 'rgb(0 0 0 / 0.66)',
  'color.onPrimarySurface': 'rgb(255 255 255 / 0.22)',
  'color.onPrimaryHover': 'rgb(0 0 0 / 0.3)',
  'rule.hair': 'rgb(255 255 255 / 0.11)',
  'shadow.sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
  'shadow.md': '0 4px 12px rgba(0, 0, 0, 0.5)',
}

/** Named starting points a school picks in config, then overrides individually. */
export const themePresets: Record<string, Partial<Record<TokenName, string>>> = {
  emerald: {},
  sapphire: { 'color.primary': '#14508c', 'color.accent': '#c2703d' },
  maroon: { 'color.primary': '#7b1e3a', 'color.accent': '#0f766e' },
  indigo: { 'color.primary': '#3730a3', 'color.accent': '#b45309' },
}

const cssVar = (name: string) => `--fe-${name.replace(/\./g, '-')}`

export function tokensToCss(overrides: Partial<Record<TokenName, string>> = {}): string {
  const light = { ...baseTokens, ...overrides }
  const dark = { ...darkTokens }

  const declare = (entries: Record<string, string>) =>
    Object.entries(entries).map(([name, value]) => `${cssVar(name)}: ${value};`).join('\n  ')

  return `:root {\n  ${declare(light)}\n}\n` +
    `:root[data-theme='dark'] {\n  ${declare(dark as Record<string, string>)}\n}\n` +
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n    ${declare(dark as Record<string, string>)}\n  }\n}\n`
}

export const isTokenName = (name: string): name is TokenName => name in baseTokens
