export { loadViewModel } from './viewModel.js'
export type { RoutineViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'grid': () => import('./variants/grid.astro'),
  'day-cards': () => import('./variants/day-cards.astro'),
}

export const defaultVariant = 'grid'
