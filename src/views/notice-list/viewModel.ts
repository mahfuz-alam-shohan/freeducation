import type { LocalizedText, MenuItem, Notice } from '../../contracts/index.js'
import { normalisePath } from '../../routing/resolver.js'
import type { ViewContext } from '../types.js'

export interface NoticeFilter {
  label: LocalizedText
  href: string
  active: boolean
}

export interface NoticeListViewModel {
  title: LocalizedText
  notices: Notice[]
  page: number
  pageSize: number
  total: number
  basePath: string
  /** Sibling notice pages, so categories can be switched from the page itself. */
  filters: NoticeFilter[]
}

/** The nearest menu item whose children are other notice lists. */
function filterSource(trail: MenuItem[]): MenuItem | undefined {
  for (let index = trail.length - 1; index >= 0; index--) {
    const candidate = trail[index]
    if (candidate?.children.some(child => child.view === 'notice-list' && child.visible)) return candidate
  }
  return undefined
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<NoticeListViewModel> {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
  const result = await client.get('notice.list', { category: route.params.category, page, pageSize: 20 })

  const source = filterSource(route.trail)
  const siblings = source?.children.filter(child => child.view === 'notice-list' && child.visible) ?? []
  const filters: NoticeFilter[] = siblings.length > 1
    ? siblings.map(child => ({
        label: child.label,
        href: `/${normalisePath(child.path)}`,
        active: normalisePath(child.path) === route.path,
      }))
    : []

  return {
    filters,
    title: route.item.label,
    notices: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    basePath: route.path,
  }
}
