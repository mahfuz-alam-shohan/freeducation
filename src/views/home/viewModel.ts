import type { Notice, SchoolEvent, SchoolProfile, Stat } from '../../contracts/index.js'
import type { PageMeta, ViewContext } from '../types.js'
import { resolveText } from '../../i18n/index.js'

export interface HomeViewModel {
  profile: SchoolProfile
  stats: Stat[]
  notices: Notice[]
  events: SchoolEvent[]
  noticesPath: string
  meta: PageMeta
}

export async function loadViewModel({ client, locale }: ViewContext): Promise<HomeViewModel> {
  const [profile, stats, notices, events] = await Promise.all([
    client.get('site.profile'),
    client.get('site.stats'),
    client.get('notice.list', { pageSize: 5 }),
    client.get('event.list', { pageSize: 3 }),
  ])
  const description = resolveText(profile.tagline ?? profile.address, locale)

  return {
    profile, stats,
    notices: notices.items, events: events.items,
    noticesPath: 'notice',
    meta: description ? { description } : {},
  }
}
