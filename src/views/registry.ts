import type { ViewType } from '../contracts/index.js'
import type { ViewModule, VariantLoader } from './types.js'

import * as home from './home/index.js'
import * as noticeList from './notice-list/index.js'
import * as noticeDetail from './notice-detail/index.js'
import * as richPage from './rich-page/index.js'
import * as personList from './person-list/index.js'
import * as eventList from './event-list/index.js'
import * as eventDetail from './event-detail/index.js'
import * as galleryAlbums from './gallery-albums/index.js'
import * as galleryAlbum from './gallery-album/index.js'
import * as contact from './contact/index.js'
import * as routine from './routine/index.js'
import * as resultLookup from './result-lookup/index.js'
import * as search from './search/index.js'
import * as admissionForm from './admission-form/index.js'

/**
 * Every renderable view type maps to exactly one module.
 * 'external-link' is deliberately absent — it navigates away rather than rendering.
 */
export const views = {
  'home': home,
  'notice-list': noticeList,
  'notice-detail': noticeDetail,
  'rich-page': richPage,
  'person-list': personList,
  'event-list': eventList,
  'event-detail': eventDetail,
  'gallery-albums': galleryAlbums,
  'gallery-album': galleryAlbum,
  'contact': contact,
  'routine': routine,
  'result-lookup': resultLookup,
  'search': search,
  'admission-form': admissionForm,
} satisfies Record<Exclude<ViewType, 'external-link'>, ViewModule>

export type RenderableView = keyof typeof views

export const isRenderable = (view: ViewType): view is RenderableView => view in views

/** Resolves the design for a view: the school's choice, then the view's default. */
export function pickVariant(
  view: RenderableView,
  configured: Record<string, string>,
): { id: string; load: VariantLoader } {
  const module: ViewModule = views[view]
  const candidates = [configured[view], module.defaultVariant]
  for (const id of candidates) {
    const load = id ? module.variants[id] : undefined
    if (id && load) return { id, load }
  }
  throw new Error(`View '${view}' has no usable variant. Tried: ${candidates.filter(Boolean).join(', ')}`)
}
