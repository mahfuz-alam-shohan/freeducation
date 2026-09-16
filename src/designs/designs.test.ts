import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { designs, designNames, resolveVariants } from './index.js'
import { views, type RenderableView } from '../views/registry.js'
import { loadSchool, knownSchools } from '../config/index.js'
import { activeVariants as activeVariantsPlugin } from '../../tools/active-variants-plugin.mjs'

/**
 * The integration these tests protect: a school picks one design, and every page it
 * serves renders that design. Three things have to agree for that to hold — the sets,
 * the config loader that resolves them, and the build plugin that decides which CSS
 * ships. Each is checked here against the others rather than on its own.
 */

const renderableViews = Object.keys(views) as RenderableView[]

describe('design sets', () => {
  it('offers more than one', () => {
    expect(designNames.length).toBeGreaterThan(1)
  })

  it.each(designNames)('%s covers every renderable view', name => {
    expect(Object.keys(designs[name]!.views).sort()).toEqual([...renderableViews].sort())
  })

  it.each(designNames)('%s names variants that exist', name => {
    for (const [view, variant] of Object.entries(designs[name]!.views)) {
      expect(Object.keys(views[view as RenderableView].variants)).toContain(variant)
    }
  })

  it('leaves no variant unreachable', () => {
    const claimed = new Set(
      designNames.flatMap(name =>
        Object.entries(designs[name]!.views).map(([view, variant]) => `${view}/${variant}`)),
    )
    const all = renderableViews.flatMap(view =>
      Object.keys(views[view].variants).map(variant => `${view}/${variant}`))

    expect([...all].filter(entry => !claimed.has(entry))).toEqual([])
  })
})

describe('resolveVariants', () => {
  it('returns a complete map', () => {
    expect(Object.keys(resolveVariants('classic')).sort()).toEqual([...renderableViews].sort())
  })

  it('lets a school override one page without losing the rest', () => {
    const resolved = resolveVariants('editorial', { 'notice-list': 'card-stack' })
    expect(resolved['notice-list']).toBe('card-stack')
    expect(resolved['home']).toBe(designs['editorial']!.views['home'])
  })

  it('ignores an override for a view that does not exist', () => {
    expect(resolveVariants('classic', { 'not-a-view': 'whatever' })['not-a-view']).toBeUndefined()
  })

  it('refuses an unknown design rather than guessing one', () => {
    expect(() => resolveVariants('no-such-design')).toThrow(/Unknown design/)
  })
})

describe('every school', () => {
  it.each(knownSchools())('%s resolves a variant for every view', slug => {
    const config = loadSchool(slug)
    expect(Object.keys(config.variants).sort()).toEqual([...renderableViews].sort())
  })

  it.each(knownSchools())('%s renders one design across the whole site', slug => {
    const config = loadSchool(slug)
    const set = designs[config.design]!

    // Anything that differs from the set is an override the school declared on purpose.
    const raw = JSON.parse(readFileSync(join(process.cwd(), 'schools', `${slug}.json`), 'utf8'))
    const declared = Object.keys(raw.variants ?? {})

    for (const [view, variant] of Object.entries(config.variants)) {
      if (declared.includes(view)) continue
      expect(variant).toBe(set.views[view])
    }
  })
})

describe('the build plugin and the config loader', () => {
  const variantFiles = (view: string) =>
    Object.fromEntries(
      [...readFileSync(join(process.cwd(), 'src/views', view, 'index.ts'), 'utf8')
        .matchAll(/'([^']+)':\s*\(\)\s*=>\s*import\('\.\/variants\/([^']+)\.astro'\)/g)]
        .map(([, id, file]) => [id, file]),
    )

  it.each(knownSchools())('agree about every page of %s', slug => {
    const plugin = activeVariantsPlugin({ root: process.cwd(), school: slug })
    const generated = plugin.load('\0virtual:fe/active-variants') as string
    const config = loadSchool(slug)

    // The CSS a page ships is decided by the plugin; the markup by the resolved config.
    // If those two ever disagree, a school gets one design's HTML in another's styles.
    for (const [view, variant] of Object.entries(config.variants)) {
      const file = variantFiles(view)[variant]
      expect(generated).toContain(`'${view}': () => import('/src/views/${view}/variants/${file}.astro')`)
    }
  })
})

describe('schools on disk', () => {
  it('all name a design', () => {
    for (const file of readdirSync(join(process.cwd(), 'schools'))) {
      const raw = JSON.parse(readFileSync(join(process.cwd(), 'schools', file), 'utf8'))
      expect(raw.design, `schools/${file} does not name a design`).toBeTypeOf('string')
    }
  })
})
