import type { GalleryAlbum, LocalizedText } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface GalleryAlbumsViewModel { title: LocalizedText; albums: GalleryAlbum[]; basePath: string }

export async function loadViewModel({ client, route }: ViewContext): Promise<GalleryAlbumsViewModel> {
  const result = await client.get('gallery.albums', { pageSize: 48 })
  return { title: route.item.label, albums: result.items, basePath: route.path }
}
