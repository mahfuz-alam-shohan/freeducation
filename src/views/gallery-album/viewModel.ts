import type { GalleryAlbum } from '../../contracts/index.js'
import type { PageMeta, ViewContext } from '../types.js'
import { resolveText } from '../../i18n/index.js'

export interface GalleryAlbumViewModel {
  album: GalleryAlbum | null
  backPath: string
  meta: PageMeta
}

export async function loadViewModel({ client, route, locale }: ViewContext): Promise<GalleryAlbumViewModel> {
  const slug = route.params.slug ?? ''
  const album = slug ? await client.get('gallery.album', { slug }) : null
  return {
    album,
    backPath: route.path.split('/').slice(0, -1).join('/'),
    meta: {
      ...(album ? { title: resolveText(album.title, locale) } : {}),
      ...(album?.cover ? { image: album.cover.url } : {}),
    },
  }
}
