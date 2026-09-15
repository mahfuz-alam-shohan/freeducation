import type { DataSource } from '../source.js'
import type { DataKey } from '../keys.js'
import type { Notice } from '../../contracts/index.js'
import { fixtures } from '../../testing/fixtures/index.js'

/**
 * Serves local sample content. Used for development, previews and every test,
 * so the whole site can be built and verified with no backend at all.
 */
export function fixtureSource(overrides: Partial<Record<DataKey, unknown>> = {}): DataSource {
  return {
    name: 'fixture',
    async fetch(key, params) {
      if (key in overrides) return overrides[key]

      switch (key) {
        case 'site.profile': return fixtures.profile
        case 'site.navigation': return fixtures.navigation
        case 'site.stats': return fixtures.stats

        case 'notice.list': {
          const category = params.category as string | undefined
          const all = category ? fixtures.notices.filter(n => n.category === category) : fixtures.notices
          return page([...all].sort(byPinnedThenNewest), params)
        }
        case 'notice.bySlug':
          return fixtures.notices.find(n => n.slug === params.slug) ?? null

        case 'page.bySlug':
          return fixtures.pages.find(p => p.slug === params.slug) ?? null

        case 'person.list': {
          const group = params.group as string | undefined
          const all = group ? fixtures.people.filter(p => p.group === group) : fixtures.people
          return page(all, params)
        }

        case 'event.list':
          return page([...fixtures.events].sort((a, b) => a.startsAt.localeCompare(b.startsAt)), params)
        case 'event.bySlug': return fixtures.events.find(e => e.slug === params.slug) ?? null

        case 'gallery.albums':
          return page([...fixtures.albums].sort((a, b) => (b.takenAt ?? '').localeCompare(a.takenAt ?? '')), params)
        case 'gallery.album': return fixtures.albums.find(a => a.slug === params.slug) ?? null

        case 'routine.classes': return fixtures.classes
        case 'routine.byClass': {
          const requested = (params.class as string | undefined) ?? fixtures.classes[0]?.id
          return requested ? fixtures.routines[requested] ?? null : null
        }

        case 'result.exams': return fixtures.exams
        case 'result.lookup': {
          const exam = fixtures.exams.find(e => e.id === params.exam)
          if (!exam) return null
          return fixtures.results.find(
            r => r.roll === String(params.roll) && r.exam.en === exam.label.en,
          ) ?? null
        }

        case 'site.search': return page(fixtures.search(String(params.q ?? '')), params)
      }
    },
  }
}

const byPinnedThenNewest = (a: Notice, b: Notice) =>
  Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt)

function page<T>(all: T[], params: Record<string, unknown>) {
  const pageNumber = Number(params.page ?? 1)
  const pageSize = Number(params.pageSize ?? 20)
  const start = (pageNumber - 1) * pageSize
  return { items: all.slice(start, start + pageSize), page: pageNumber, pageSize, total: all.length }
}
