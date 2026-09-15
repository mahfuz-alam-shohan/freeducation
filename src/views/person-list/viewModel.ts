import type { LocalizedText, Person } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface PersonListViewModel {
  title: LocalizedText
  people: Person[]
  page: number
  pageSize: number
  total: number
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<PersonListViewModel> {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
  const result = await client.get('person.list', { group: route.params.group, page, pageSize: 60 })

  return {
    title: route.item.label,
    people: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    basePath: route.path,
  }
}
