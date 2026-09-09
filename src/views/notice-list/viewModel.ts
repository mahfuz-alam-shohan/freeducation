import type { LocalizedText, Notice } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface NoticeListViewModel {
  title: LocalizedText
  notices: Notice[]
  page: number
  pageSize: number
  total: number
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<NoticeListViewModel> {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
  const result = await client.get('notice.list', { category: route.params.category, page, pageSize: 20 })
  return {
    title: route.item.label,
    notices: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    basePath: route.path,
  }
}
