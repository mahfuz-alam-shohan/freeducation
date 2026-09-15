import type { SchoolEvent } from '../../contracts/index.js'
import type { PageMeta, ViewContext } from '../types.js'
import { resolveText, toPlainText } from '../../i18n/index.js'

export interface EventDetailViewModel {
  event: SchoolEvent | null
  backPath: string
  notFound: boolean
  meta: PageMeta
}

export async function loadViewModel({ client, route, locale }: ViewContext): Promise<EventDetailViewModel> {
  const slug = route.params.slug ?? ''
  const event = slug ? await client.get('event.bySlug', { slug }) : null
  const description = event ? toPlainText(resolveText(event.description, locale)) : ''

  return {
    event,
    notFound: event === null,
    backPath: route.path.split('/').slice(0, -1).join('/'),
    meta: {
      ...(event ? { title: resolveText(event.title, locale) } : {}),
      ...(description ? { description } : {}),
      ...(event?.cover ? { image: event.cover.url } : {}),
    },
  }
}
