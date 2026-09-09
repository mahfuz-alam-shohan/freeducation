import type { GalleryAlbum } from '../../contracts/index.js'
import type { ViewContext } from '../types.js'

export interface GalleryAlbumViewModel { album: GalleryAlbum | null; backPath: string }

export async function loadViewModel({ client, route }: ViewContext): Promise<GalleryAlbumViewModel> {
  const slug = route.params.slug ?? ''
  const album = slug ? await client.get('gallery.album', { slug }) : null
  return { album, backPath: route.path.split('/').slice(0, -1).join('/') }
}
