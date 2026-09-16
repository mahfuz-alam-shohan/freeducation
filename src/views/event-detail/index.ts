export { loadViewModel } from './viewModel.js'
export type { EventDetailViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'campus': () => import('./variants/campus.astro'),
  'broadsheet': () => import('./variants/broadsheet.astro'),
  'editorial': () => import('./variants/editorial.astro'),
  'standard': () => import('./variants/standard.astro'),
}

export const defaultVariant = 'standard'
