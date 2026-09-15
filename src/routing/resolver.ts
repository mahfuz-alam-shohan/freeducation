import type { MenuItem, Navigation, ViewType } from '../contracts/index.js'

export interface Route {
  /** Normalised path with no leading or trailing slash. '' is the home page. */
  path: string
  view: ViewType
  params: Record<string, string>
  item: MenuItem
  trail: MenuItem[]
}

export const normalisePath = (path: string): string => path.replace(/^\/+|\/+$/g, '')

function walk(items: MenuItem[], trail: MenuItem[], out: Route[]): void {
  for (const item of items) {
    // Hidden items are still routable: `visible` controls the menu, not reachability.
    if (item.view !== 'external-link') {
      out.push({
        path: normalisePath(item.path),
        view: item.view,
        params: item.params,
        item,
        trail: [...trail, item],
      })
    }
    if (item.children.length) walk(item.children, [...trail, item], out)
  }
}

/**
 * Flattens the whole navigation tree into routes.
 * The menu IS the sitemap — a school adds a page by adding a menu item, with no code change.
 */
export function buildRoutes(navigation: Navigation): Route[] {
  const out: Route[] = []
  walk(navigation.primary, [], out)
  walk(navigation.utility, [], out)
  walk(navigation.footer, [], out)

  const seen = new Set<string>()
  return out.filter(route => {
    if (seen.has(route.path)) return false
    seen.add(route.path)
    return true
  })
}

export function matchRoute(routes: Route[], path: string): Route | undefined {
  const target = normalisePath(path)
  const exact = routes.find(route => route.path === target)
  if (exact) return exact

  // Detail pages hang off their list: 'notice/admission-2026' resolves against 'notice'.
  const segments = target.split('/')
  for (let i = segments.length - 1; i > 0; i--) {
    const parentPath = segments.slice(0, i).join('/')
    const parent = routes.find(route => route.path === parentPath)
    if (!parent) continue
    const detailView = detailViewFor(parent.view)
    if (!detailView) continue
    return {
      ...parent,
      path: target,
      view: detailView,
      params: { ...parent.params, slug: segments.slice(i).join('/') },
    }
  }
  return undefined
}

function detailViewFor(view: ViewType): ViewType | undefined {
  switch (view) {
    case 'notice-list': return 'notice-detail'
    case 'event-list': return 'event-detail'
    case 'gallery-albums': return 'gallery-album'
    default: return undefined
  }
}

/**
 * Finds the school's main page for a kind of view, wherever it sits in the menu.
 *
 * Several pages can share a view — a notice list filtered to admission notices is
 * still a notice list — so the plain, top-level one wins over a filtered or nested
 * one. Taking simply the first match would link the home page at a category page.
 */
export function findByView(routes: Route[], view: ViewType): Route | undefined {
  const candidates = routes.filter(route => route.view === view)
  if (candidates.length <= 1) return candidates[0]

  return [...candidates].sort((a, b) =>
    // Unfiltered first, then the shallowest menu position, then the shortest path.
    Object.keys(a.params).length - Object.keys(b.params).length
    || a.trail.length - b.trail.length
    || a.path.length - b.path.length,
  )[0]
}

export const isActive = (route: Route, currentPath: string): boolean => {
  const current = normalisePath(currentPath)
  return current === route.path || (route.path !== '' && current.startsWith(`${route.path}/`))
}
