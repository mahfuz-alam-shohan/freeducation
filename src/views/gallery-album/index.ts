export { loadViewModel } from './viewModel.js'
export type { GalleryAlbumViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'standard': () => import('./variants/standard.astro'),
}

export const defaultVariant = 'standard'
