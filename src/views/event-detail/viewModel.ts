import type { SchoolEvent } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface EventDetailViewModel { event: SchoolEvent | null; backPath: string }

export async function loadViewModel({ client, route }: ViewContext): Promise<EventDetailViewModel> {
  const slug = route.params.slug ?? ''
  const event = slug ? await client.get('event.bySlug', { slug }) : null
  return { event, backPath: route.path.split('/').slice(0, -1).join('/') }
}
