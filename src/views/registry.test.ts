import { describe, expect, it } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { views, pickVariant, isRenderable, type RenderableView } from './registry.js'
import type { VariantLoader, ViewContext } from './types.js'
import { createClient, fixtureSource } from '../data/index.js'
import { createTranslator } from '../i18n/index.js'
import { SchoolConfig } from '../config/schema.js'
import type { MenuItem, ViewType } from '../contracts/index.js'
import type { Route } from '../routing/resolver.js'
import { idleSubmission } from '../runtime/forms.js'

/**
 * The contract harness.
 *
 * Every variant of every view is rendered against every fixture state. This is what
 * makes variants genuinely interchangeable: a school can switch design without
 * discovering that the new one crashes on an empty list or a missing photo.
 */

const config = SchoolConfig.parse({
  slug: 'demo',
  locales: { supported: ['bn', 'en'], default: 'bn' },
  theme: { preset: 'emerald', overrides: {} },
  variants: {},
  features: {},
  data: { source: 'fixture' },
})

const menuItem = (view: ViewType, path: string, params: Record<string, string> = {}): MenuItem => ({
  id: `test-${view}`,
  label: { bn: 'পরীক্ষা', en: 'Test' },
  path, view, params, visible: true, highlighted: false, children: [],
})

/** Params each view needs to reach real fixture content. */
const routeParams: Record<RenderableView, Record<string, string>> = {
  'home': {},
  'notice-list': {},
  'notice-detail': { slug: 'admission-2026' },
  'rich-page': { slug: 'about' },
  'person-list': { group: 'teachers' },
  'event-list': {},
  'event-detail': { slug: 'annual-sports-2026' },
  'gallery-albums': {},
  'gallery-album': { slug: 'annual-sports-2026' },
  'contact': {},
  'routine': {},
  'result-lookup': {},
  'search': {},
  'admission-form': {},
}

/** Query strings that drive the views whose content depends on user input. */
const routeQuery: Partial<Record<RenderableView, string>> = {
  'search': '?q=admission',
  'result-lookup': '?exam=half-yearly-2026&roll=101',
  'routine': '?class=nine',
}

/** Every state a variant must survive. */
const states = {
  typical: () => fixtureSource(),
  empty: () =>
    fixtureSource({
      'notice.list': { items: [], page: 1, pageSize: 20, total: 0 },
      'person.list': { items: [], page: 1, pageSize: 20, total: 0 },
      'event.list': { items: [], page: 1, pageSize: 20, total: 0 },
      'gallery.albums': { items: [], page: 1, pageSize: 20, total: 0 },
      'site.stats': [],
      'site.search': { items: [], page: 1, pageSize: 20, total: 0 },
      'routine.classes': [],
      'routine.byClass': null,
      'result.exams': [],
      'result.lookup': null,
      'notice.bySlug': null,
      'event.bySlug': null,
      'gallery.album': null,
      'page.bySlug': null,
    }),
  singleLocale: () =>
    fixtureSource({
      'site.profile': { name: { en: 'English Only School' }, phones: [], emails: [], social: {} },
    }),
}

const contextFor = (view: RenderableView, source: ReturnType<typeof fixtureSource>): ViewContext => {
  const path = view === 'home' ? '' : view
  const params = routeParams[view]
  const route: Route = {
    path, view, params,
    item: menuItem(view, path, params),
    trail: [],
  }
  return {
    client: createClient(source, { strict: false }),
    locale: 'bn',
    route,
    config,
    url: new URL(`https://example.test/${path}${routeQuery[view] ?? ''}`),
    submission: idleSubmission,
  }
}

const viewNames = Object.keys(views) as RenderableView[]

describe('view registry', () => {
  it('exposes at least one view', () => {
    expect(viewNames.length).toBeGreaterThan(0)
  })

  it.each(viewNames)("'%s' has a default variant that is registered", view => {
    const module = views[view]
    expect(Object.keys(module.variants)).toContain(module.defaultVariant)
  })

  it('reports external-link as not renderable', () => {
    expect(isRenderable('external-link')).toBe(false)
  })

  it('falls back to the view default when a school asks for an unknown variant', () => {
    const chosen = pickVariant('home', { home: 'does-not-exist' })
    expect(chosen.id).toBe(views.home.defaultVariant)
  })

  it("honours the school's choice over the view default", () => {
    expect(pickVariant('home', { home: 'notice-first' }).id).toBe('notice-first')
  })
})

describe('contract harness: every variant renders in every state', () => {
  const cases = viewNames.flatMap(view =>
    Object.keys(views[view].variants).flatMap(variant =>
      Object.keys(states).map(state => ({ view, variant, state: state as keyof typeof states })),
    ),
  )

  it.each(cases)('$view / $variant / $state', async ({ view, variant, state }) => {
    const container = await AstroContainer.create()
    const context = contextFor(view, states[state]())
    const viewModel = await views[view].loadViewModel(context)
    const load = (views[view].variants as Record<string, VariantLoader>)[variant]
    if (!load) throw new Error(`${view} has no variant '${variant}'`)
    const Component = (await load()).default

    const html = await container.renderToString(Component as never, {
      props: { vm: viewModel, locale: 'bn', t: createTranslator('bn') },
    })

    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
    // An empty state must say something, never render a blank hole.
    expect(html.replace(/<[^>]*>/g, '').trim().length).toBeGreaterThan(0)
  })
})
