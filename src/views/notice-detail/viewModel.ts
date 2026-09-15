import type { Notice } from '../../contracts/index.js'
import type { PageMeta, ViewContext } from '../types.js'
import { resolveText, toPlainText } from '../../i18n/index.js'

export interface NoticeDetailViewModel {
  notice: Notice | null
  backPath: string
  notFound: boolean
  meta: PageMeta
}

export async function loadViewModel({ client, route, locale }: ViewContext): Promise<NoticeDetailViewModel> {
  const slug = route.params.slug ?? ''
  const notice = slug ? await client.get('notice.bySlug', { slug }) : null
  const description = notice
    ? toPlainText(resolveText(notice.summary ?? notice.body, locale))
    : ''

  return {
    notice,
    notFound: notice === null,
    backPath: route.path.split('/').slice(0, -1).join('/'),
    meta: {
      ...(notice ? { title: resolveText(notice.title, locale) } : {}),
      ...(description ? { description } : {}),
    },
  }
}
