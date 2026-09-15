import type { LocalizedText, Video } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface VideoListViewModel {
  title: LocalizedText
  videos: Video[]
  page: number
  pageSize: number
  total: number
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<VideoListViewModel> {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
  const result = await client.get('video.list', { page, pageSize: 24 })

  return {
    title: route.item.label,
    videos: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    basePath: route.path,
  }
}
