export { loadViewModel } from './viewModel.js'
export type { VideoListViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'editorial': () => import('./variants/editorial.astro'),
  'grid': () => import('./variants/grid.astro'),
}

export const defaultVariant = 'grid'
