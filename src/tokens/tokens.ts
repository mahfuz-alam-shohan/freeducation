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
  'color.onPrimarySurface': 'rgb(255 255 255 / 0.12)',
  'color.onPrimaryHover': 'rgb(0 0 0 / 0.16)',

  'font.body': "'Noto Sans Bengali', 'Noto Sans', system-ui, -apple-system, sans-serif",
  'font.heading': "'Noto Serif Bengali', 'Noto Serif', Georgia, serif",
  'size.xs': '0.75rem',
  'size.sm': '0.875rem',
  'size.base': '1rem',
  'size.lg': '1.25rem',
  'size.xl': '1.5rem',
  'size.2xl': '2rem',
  'size.3xl': '2.5rem',
  'leading.tight': '1.25',
  'leading.normal': '1.6',

  'space.1': '0.25rem',
  'space.2': '0.5rem',
  'space.3': '0.75rem',
  'space.4': '1rem',
  'space.6': '1.5rem',
  'space.8': '2rem',
  'space.12': '3rem',
  'space.16': '4rem',

  'radius.sm': '4px',
  'radius.md': '8px',
  'radius.lg': '16px',
  'shadow.sm': '0 1px 2px rgba(16, 24, 40, 0.06)',
  'shadow.md': '0 4px 12px rgba(16, 24, 40, 0.1)',
  'container.max': '1200px',
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
  'color.onPrimarySurface': 'rgb(255 255 255 / 0.1)',
  'color.onPrimaryHover': 'rgb(0 0 0 / 0.3)',
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
