export { loadViewModel } from './viewModel.js'
export type { HomeViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'newsroom': () => import('./variants/newsroom.astro'),
  'editorial': () => import('./variants/editorial.astro'),
  'notice-first': () => import('./variants/notice-first.astro'),
  'minimal-stack': () => import('./variants/minimal-stack.astro'),
}

export const defaultVariant = 'newsroom'
