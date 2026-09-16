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
  /* Keeps display type legible over any photograph, dark at both ends, open in the middle. */
  'gradient.stage': 'linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / 0.38) 46%, rgb(0 0 0 / 0.76))',
  /* A far lighter shade, for a photograph whose caption sits on a solid card rather
     than on the image itself: enough for the card's edge to read, no more. */
  'gradient.veil': 'linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / 0.3))',
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
  'size.3xs': '0.625rem',
  'size.2xs': '0.6875rem',
  'size.xs': '0.75rem',
  'size.sm': '0.8125rem',
  'size.base': '0.9375rem',
  'size.lg': '1.0625rem',
  'size.xl': '1.3125rem',
  'size.2xl': '1.625rem',
  'size.3xl': '2.125rem',
  /* Only the largest display settings use this; it scales with the viewport. */
  'size.display': 'clamp(1.9rem, 3.4vw, 2.85rem)',

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
  /* Keeps display type readable where a photograph is bright behind it. */
  'shadow.displayText': '0 1px 24px rgb(0 0 0 / 0.35)',
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
  'gradient.stage': 'linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / 0.46) 46%, rgb(0 0 0 / 0.84))',
  'gradient.veil': 'linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / 0.42))',
  'color.onPrimarySurface': 'rgb(255 255 255 / 0.22)',
  'color.onPrimaryHover': 'rgb(0 0 0 / 0.3)',
  'rule.hair': 'rgb(255 255 255 / 0.11)',
  'shadow.sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
  'shadow.md': '0 4px 12px rgba(0, 0, 0, 0.5)',
}

/** Named starting points a school picks in config, then overrides individually. */
export const themePresets: Record<string, Partial<Record<TokenName, string>>> = {
  emerald: {},

  /*
   * Two presets for schools that want the site to look expensive. Both work by
   * restraint rather than decoration: warm paper or deep ink, a single metallic
   * accent, a serif carrying the display sizes, and almost no colour anywhere else.
   */
  ivory: {
    'color.bg': '#FBFAF7',
    'color.surface': '#F3F0EA',
    'color.border': '#E0DAD0',
    'color.text': '#15181B',
    'color.textMuted': '#6B6558',
    'color.primary': '#1B2A24',
    'color.primaryText': '#FBFAF7',
    'color.accent': '#8A6D2F',
    'color.onPrimarySurface': 'rgb(255 255 255 / 0.2)',
    'rule.hair': 'rgb(21 24 27 / 0.1)',
  },

  obsidian: {
    'color.bg': '#0E1114',
    'color.surface': '#171B20',
    'color.border': '#2A3038',
    'color.text': '#ECEAE4',
    'color.textMuted': '#9A978E',
    'color.primary': '#C8A659',
    'color.primaryText': '#14171A',
    'color.accent': '#C8A659',
    'color.scrim': 'rgb(0 0 0 / 0.72)',
    'color.onPrimarySurface': 'rgb(255 255 255 / 0.14)',
    'rule.hair': 'rgb(236 234 228 / 0.12)',
  },

  /*
   * Newsprint. Warm uncoated paper and a true black ink, with one oxblood the colour a
   * press actually ran as a second plate. There is no surface colour worth the name:
   * the broadsheet design draws with rules, not with panels, so a filled block would
   * have nothing to sit in.
   */
  newsprint: {
    'color.bg': '#F7F4ED',
    'color.surface': '#F0ECE1',
    'color.border': '#151310',
    'color.text': '#151310',
    'color.textMuted': '#5C574C',
    'color.primary': '#151310',
    'color.primaryText': '#F7F4ED',
    'color.accent': '#8C2F24',
    'color.onPrimarySurface': 'rgb(255 255 255 / 0.18)',
    'rule.hair': 'rgb(21 19 16 / 0.26)',
  },

  /*
   * The palette international school sites converge on: a clean white page, one deep
   * institutional blue doing the heavy lifting, a cool tint for the bands between
   * sections, and a warm accent so the blue is not the only colour on the page.
   */
  harbour: {
    'color.bg': '#FFFFFF',
    'color.surface': '#EEF3F6',
    'color.border': '#D3DFE6',
    'color.text': '#0F2430',
    'color.textMuted': '#546874',
    'color.primary': '#0B3C55',
    'color.primaryText': '#FFFFFF',
    'color.accent': '#C4622D',
    'color.scrim': 'rgb(8 32 45 / 0.55)',
    'color.onPrimarySurface': 'rgb(255 255 255 / 0.16)',
    'rule.hair': 'rgb(15 36 48 / 0.12)',
  },

  sapphire: { 'color.primary': '#14508c', 'color.accent': '#c2703d' },
  maroon: { 'color.primary': '#7b1e3a', 'color.accent': '#0f766e' },
  indigo: { 'color.primary': '#3730a3', 'color.accent': '#b45309' },
}

/**
 * A preset's dark counterpart. Without one a school in dark mode falls back to the
 * generic dark palette, which keeps none of its identity: a navy-and-terracotta site
 * turned green after sunset because the default primary was still in force.
 *
 * Presets that only shift primary and accent need no entry — the generic dark suits
 * them. Presets that set a whole palette have to answer for both modes.
 */
export const darkPresets: Record<string, Partial<Record<TokenName, string>>> = {
  ivory: {
    'color.bg': '#14171A',
    'color.surface': '#1C2024',
    'color.border': '#2E3339',
    'color.text': '#ECE9E2',
    'color.textMuted': '#9A958A',
    'color.primary': '#C8A659',
    'color.primaryText': '#14171A',
    'color.accent': '#C8A659',
    'rule.hair': 'rgb(236 233 226 / 0.12)',
  },

  newsprint: {
    'color.bg': '#15150F',
    'color.surface': '#1D1D16',
    'color.border': '#F2EFE6',
    'color.text': '#F2EFE6',
    'color.textMuted': '#A8A296',
    'color.primary': '#F2EFE6',
    'color.primaryText': '#15150F',
    'color.accent': '#E2856F',
    'rule.hair': 'rgb(242 239 230 / 0.3)',
  },

  harbour: {
    'color.bg': '#0B1620',
    'color.surface': '#132330',
    'color.border': '#22394A',
    'color.text': '#E8EEF2',
    'color.textMuted': '#93A7B4',
    'color.primary': '#1B5E80',
    'color.primaryText': '#FFFFFF',
    'color.accent': '#E0834A',
    'color.scrim': 'rgb(4 16 24 / 0.6)',
    'rule.hair': 'rgb(232 238 242 / 0.14)',
  },
}

const cssVar = (name: string) => `--fe-${name.replace(/\./g, '-')}`

export function tokensToCss(
  overrides: Partial<Record<TokenName, string>> = {},
  darkOverrides: Partial<Record<TokenName, string>> = {},
): string {
  const light = { ...baseTokens, ...overrides }
  const dark = { ...darkTokens, ...darkOverrides }

  const declare = (entries: Record<string, string>) =>
    Object.entries(entries).map(([name, value]) => `${cssVar(name)}: ${value};`).join('\n  ')

  return `:root {\n  ${declare(light)}\n}\n` +
    `:root[data-theme='dark'] {\n  ${declare(dark as Record<string, string>)}\n}\n` +
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n    ${declare(dark as Record<string, string>)}\n  }\n}\n`
}

export const isTokenName = (name: string): name is TokenName => name in baseTokens
