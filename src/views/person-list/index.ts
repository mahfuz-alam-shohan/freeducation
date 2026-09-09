export { loadViewModel } from './viewModel.js'
export type { PersonListViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'grid-photo': () => import('./variants/grid-photo.astro'),
  'table-compact': () => import('./variants/table-compact.astro'),
}

export const defaultVariant = 'grid-photo'
