import { describe, expect, it } from 'vitest'
import { buildRoutes, matchRoute, normalisePath } from './resolver.js'
import { fixtures } from '../testing/fixtures/index.js'
import { Navigation } from '../contracts/index.js'

const navigation = Navigation.parse(fixtures.navigation)
const routes = buildRoutes(navigation)

describe('normalisePath', () => {
  it('strips leading and trailing slashes', () => {
    expect(normalisePath('/notice/')).toBe('notice')
    expect(normalisePath('')).toBe('')
  })
})

describe('buildRoutes', () => {
  it('flattens nested menu items into routes', () => {
    const paths = routes.map(route => route.path)
    expect(paths).toContain('')
    expect(paths).toContain('notice')
    expect(paths).toContain('about/history')
    expect(paths).toContain('administration/teachers')
  })

  it('never emits the same path twice', () => {
    const paths = routes.map(route => route.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('excludes external links, which navigate away rather than render', () => {
    expect(routes.some(route => route.view === 'external-link')).toBe(false)
  })

  it('carries menu params through to the route', () => {
    const academic = routes.find(route => route.path === 'notice/academic')
    expect(academic?.params.category).toBe('academic')
  })
})

describe('matchRoute', () => {
  it('matches an exact path', () => {
    expect(matchRoute(routes, '/notice')?.view).toBe('notice-list')
  })

  it('resolves a detail page against its parent list', () => {
    const match = matchRoute(routes, 'notice/admission-2026')
    expect(match?.view).toBe('notice-detail')
    expect(match?.params.slug).toBe('admission-2026')
  })

  it('prefers an exact child route over treating it as a detail slug', () => {
    expect(matchRoute(routes, 'notice/academic')?.view).toBe('notice-list')
  })

  it('returns undefined for an unknown path', () => {
    expect(matchRoute(routes, 'no/such/page')).toBeUndefined()
  })
})
