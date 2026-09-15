import type { ViewType } from '../contracts/index.js'
import type { ViewContext } from './types.js'

// Controllers are imported directly from their viewModel modules, never through a
// view's index.ts. That keeps every variant out of the route's module graph, so a
// page ships only the CSS of the design it renders.
import { loadViewModel as home } from './home/viewModel.js'
import { loadViewModel as noticeList } from './notice-list/viewModel.js'
import { loadViewModel as noticeDetail } from './notice-detail/viewModel.js'
import { loadViewModel as richPage } from './rich-page/viewModel.js'
import { loadViewModel as personList } from './person-list/viewModel.js'
import { loadViewModel as eventList } from './event-list/viewModel.js'
import { loadViewModel as eventDetail } from './event-detail/viewModel.js'
import { loadViewModel as galleryAlbums } from './gallery-albums/viewModel.js'
import { loadViewModel as galleryAlbum } from './gallery-album/viewModel.js'
import { loadViewModel as contact } from './contact/viewModel.js'
import { loadViewModel as routine } from './routine/viewModel.js'
import { loadViewModel as resultLookup } from './result-lookup/viewModel.js'
import { loadViewModel as search } from './search/viewModel.js'
import { loadViewModel as admissionForm } from './admission-form/viewModel.js'

export type Controller = (context: ViewContext) => Promise<unknown>

export const controllers = {
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
} satisfies Record<Exclude<ViewType, 'external-link'>, Controller>

export type RenderableView = keyof typeof controllers

export const isRenderable = (view: ViewType): view is RenderableView => view in controllers
