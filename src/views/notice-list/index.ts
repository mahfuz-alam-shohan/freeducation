export { loadViewModel } from './viewModel.js'
export type { NoticeListViewModel } from './viewModel.js'

/** Lazily loaded so a page ships only the design it actually uses. */
export const variants = {
  'table-dense': () => import('./variants/table-dense.astro'),
  'card-stack': () => import('./variants/card-stack.astro'),
}

export const defaultVariant = 'table-dense'
