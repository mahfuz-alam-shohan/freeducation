export { loadViewModel } from './viewModel.js'
export type { EventListViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'broadsheet': () => import('./variants/broadsheet.astro'),
  'editorial': () => import('./variants/editorial.astro'),
  'standard': () => import('./variants/standard.astro'),
}

export const defaultVariant = 'standard'
