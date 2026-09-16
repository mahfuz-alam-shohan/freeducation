export { loadViewModel } from './viewModel.js'
export type { NoticeListViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'campus': () => import('./variants/campus.astro'),
  'broadsheet': () => import('./variants/broadsheet.astro'),
  'editorial': () => import('./variants/editorial.astro'),
  'table-dense': () => import('./variants/table-dense.astro'),
  'card-stack': () => import('./variants/card-stack.astro'),
  'timeline': () => import('./variants/timeline.astro'),
}

export const defaultVariant = 'table-dense'
