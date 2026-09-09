import type { LocalizedText, SearchHit } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface SearchViewModel {
  title: LocalizedText
  query: string
  hits: SearchHit[]
  page: number
  pageSize: number
  total: number
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<SearchViewModel> {
  const query = (url.searchParams.get('q') ?? '').trim()
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)

  if (!query) {
    return { title: route.item.label, query, hits: [], page: 1, pageSize: 20, total: 0, basePath: route.path }
  }

  const result = await client.get('site.search', { q: query, page, pageSize: 20 })
  return {
    title: route.item.label,
    query,
    hits: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    basePath: route.path,
  }
}
