import type { GalleryAlbum, LocalizedText } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface GalleryAlbumsViewModel {
  title: LocalizedText
  albums: GalleryAlbum[]
  page: number
  pageSize: number
  total: number
  basePath: string
}

export async function loadViewModel({ client, route, url }: ViewContext): Promise<GalleryAlbumsViewModel> {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
  const result = await client.get('gallery.albums', { page, pageSize: 24 })

  return {
    title: route.item.label,
    albums: result.items,
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    basePath: route.path,
  }
}
