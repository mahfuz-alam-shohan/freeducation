import type {
  GalleryAlbum, LocalizedText, Notice, Person, RichPage, SchoolEvent, SchoolProfile, Stat,
  ViewType,
} from '../../contracts/index.js'
import type { PageMeta, ViewContext } from '../types.js'
import { findByView } from '../../routing/resolver.js'
import { resolveText } from '../../i18n/index.js'

/** A destination taken from the school's own menu, so its label is the school's wording. */
export interface HomeQuickLink {
  path: string
  label: LocalizedText
  view: ViewType
}

export interface HomeViewModel {
  profile: SchoolProfile
  stats: Stat[]
  notices: Notice[]
  events: SchoolEvent[]
  albums: GalleryAlbum[]
  /** The principal's message, shown as the school's own voice on the front page. */
  message: RichPage | null
  principal: Person | null
  /** Resolved from the school's own menu, so renaming a page does not break the links. */
  noticesPath: string
  eventsPath: string
  galleryPath: string
  messagePath: string
  /** The handful of pages visitors actually arrive for, in the school's own order. */
  quickLinks: HomeQuickLink[]
  meta: PageMeta
}

/** The views worth a shortcut, most-wanted first. Any the school has not published is skipped. */
const SHORTCUT_VIEWS: ViewType[] = [
  'admission-form', 'result-lookup', 'routine', 'event-calendar', 'person-list', 'notice-list',
]

export async function loadViewModel({ client, routes, locale }: ViewContext): Promise<HomeViewModel> {
  const [profile, stats, notices, events, albums, message, staff] = await Promise.all([
    client.get('site.profile'),
    client.get('site.stats'),
    client.get('notice.list', { pageSize: 7 }),
    client.get('event.list', { pageSize: 4 }),
    client.get('gallery.albums', { pageSize: 4 }),
    client.get('page.bySlug', { slug: 'administration/principal' }),
    client.get('person.list', { group: 'teachers', pageSize: 1 }),
  ])

  const description = resolveText(profile.tagline ?? profile.address, locale)

  return {
    profile, stats,
    notices: notices.items,
    events: events.items,
    albums: albums.items,
    message,
    principal: staff.items[0] ?? null,
    noticesPath: findByView(routes, 'notice-list')?.path ?? 'notice',
    eventsPath: findByView(routes, 'event-list')?.path ?? 'events',
    galleryPath: findByView(routes, 'gallery-albums')?.path ?? 'gallery',
    messagePath: message?.slug ?? '',
    quickLinks: SHORTCUT_VIEWS
      .map(view => findByView(routes, view))
      .filter((route): route is NonNullable<typeof route> => route !== undefined)
      .slice(0, 4)
      .map(route => ({ path: route.path, label: route.item.label, view: route.view })),
    meta: description ? { description } : {},
  }
}
