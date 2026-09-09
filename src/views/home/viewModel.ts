import type { Notice, SchoolEvent, SchoolProfile, Stat } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface HomeViewModel {
  profile: SchoolProfile
  stats: Stat[]
  notices: Notice[]
  events: SchoolEvent[]
  noticesPath: string
}

export async function loadViewModel({ client }: ViewContext): Promise<HomeViewModel> {
  const [profile, stats, notices, events] = await Promise.all([
    client.get('site.profile'),
    client.get('site.stats'),
    client.get('notice.list', { pageSize: 5 }),
    client.get('event.list', { pageSize: 3 }),
  ])
  return { profile, stats, notices: notices.items, events: events.items, noticesPath: 'notice' }
}
