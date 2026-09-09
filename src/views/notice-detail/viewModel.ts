import type { Notice } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface NoticeDetailViewModel { notice: Notice | null; backPath: string }

export async function loadViewModel({ client, route }: ViewContext): Promise<NoticeDetailViewModel> {
  const slug = route.params.slug ?? ''
  const notice = slug ? await client.get('notice.bySlug', { slug }) : null
  return { notice, backPath: route.path.split('/').slice(0, -1).join('/') }
}
