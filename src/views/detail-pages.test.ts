import { describe, expect, it } from 'vitest'
import { isNotFound } from './types.js'
import { loadViewModel as loadNotice } from './notice-detail/viewModel.js'
import { loadViewModel as loadEvent } from './event-detail/viewModel.js'
import { loadViewModel as loadAlbum } from './gallery-album/viewModel.js'
import { loadViewModel as loadCalendar } from './event-calendar/viewModel.js'
import { loadViewModel as loadHome } from './home/viewModel.js'
import { createClient, fixtureSource } from '../data/index.js'
import { SchoolConfig } from '../config/schema.js'
import { buildRoutes } from '../routing/resolver.js'
import { Navigation } from '../contracts/index.js'
import { fixtures } from '../testing/fixtures/index.js'
import { idleSubmission } from '../runtime/forms.js'
import type { ViewContext } from './types.js'
import type { Route } from '../routing/resolver.js'

const config = SchoolConfig.parse({
  slug: 'demo',
  locales: { supported: ['bn', 'en'], default: 'bn' },
})

const routes = buildRoutes(Navigation.parse(fixtures.navigation))

const contextFor = (path: string, params: Record<string, string> = {}): ViewContext => {
  const route: Route = {
    path,
    view: 'rich-page',
    params,
    item: { id: 'x', label: { en: 'Test' }, path, view: 'rich-page', params, visible: true, highlighted: false, children: [] },
    trail: [],
  }
  return {
    client: createClient(fixtureSource(), { strict: true }),
    locale: 'bn',
    route,
    routes,
    config,
    url: new URL(`https://example.test/${path}`),
    submission: idleSubmission,
  }
}

describe('isNotFound', () => {
  it('only reacts to an explicit flag', () => {
    expect(isNotFound({ notFound: true })).toBe(true)
    expect(isNotFound({ notFound: false })).toBe(false)
    expect(isNotFound({})).toBe(false)
    expect(isNotFound(null)).toBe(false)
    expect(isNotFound('notFound')).toBe(false)
  })
})

describe('detail pages report absent content', () => {
  it('flags a notice that does not exist', async () => {
    expect(isNotFound(await loadNotice(contextFor('notice/ghost', { slug: 'ghost' })))).toBe(true)
  })

  it('does not flag a notice that does', async () => {
    expect(isNotFound(await loadNotice(contextFor('notice/admission-2026', { slug: 'admission-2026' })))).toBe(false)
  })

  it('flags a missing event and a missing album', async () => {
    expect(isNotFound(await loadEvent(contextFor('events/ghost', { slug: 'ghost' })))).toBe(true)
    expect(isNotFound(await loadAlbum(contextFor('gallery/ghost', { slug: 'ghost' })))).toBe(true)
  })
})

describe('cross-page links come from the menu', () => {
  it('sends calendar entries to the event list, not to the calendar itself', async () => {
    const vm = await loadCalendar(contextFor('events/calendar'))
    expect(vm.basePath).toBe('events/calendar')
    // '/events/calendar/<slug>' resolves to nothing; '/events/<slug>' is the detail page.
    expect(vm.eventPath).toBe('events')
  })

  it('resolves the home page links from the school’s own menu', async () => {
    const vm = await loadHome(contextFor(''))
    expect(vm.noticesPath).toBe('notice')
    expect(vm.eventsPath).toBe('events')
    expect(vm.galleryPath).toBe('gallery')
  })
})
