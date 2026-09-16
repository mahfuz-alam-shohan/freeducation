export { loadViewModel } from './viewModel.js'
export type { EventCalendarViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'broadsheet': () => import('./variants/broadsheet.astro'),
  'editorial': () => import('./variants/editorial.astro'),
  'month-grid': () => import('./variants/month-grid.astro'),
}

export const defaultVariant = 'month-grid'
