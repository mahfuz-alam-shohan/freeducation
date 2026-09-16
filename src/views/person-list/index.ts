export { loadViewModel } from './viewModel.js'
export type { PersonListViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'editorial': () => import('./variants/editorial.astro'),
  'grid-photo': () => import('./variants/grid-photo.astro'),
  'table-compact': () => import('./variants/table-compact.astro'),
  'detailed-rows': () => import('./variants/detailed-rows.astro'),
}

export const defaultVariant = 'grid-photo'
