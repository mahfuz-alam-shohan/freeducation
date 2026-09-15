import type { LocalizedText, SchoolEvent } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface EventListViewModel {
  title: LocalizedText
  events: SchoolEvent[]
  basePath: string
  timeZone: string
}

export async function loadViewModel({ client, route, config }: ViewContext): Promise<EventListViewModel> {
  const result = await client.get('event.list', { pageSize: 50 })
  return {
    title: route.item.label,
    events: result.items,
    basePath: route.path,
    timeZone: config.timezone,
  }
}
