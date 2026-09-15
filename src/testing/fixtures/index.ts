import type { SearchHit } from '../../contracts/index.js'
import { navigation } from './navigation.js'
import { people } from './people.js'
import { events, notices } from './notices.js'
import { albums, pages, profile, stats, videos } from './content.js'
import { classes, exams, results, routines } from './academics.js'

/** Substring search across the sample content, standing in for what a backend would do. */
function search(query: string): SearchHit[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const matches = (text: Record<string, string> | undefined) =>
    Object.values(text ?? {}).some(value => value.toLowerCase().includes(needle))

  return [
    ...notices.filter(notice => matches(notice.title) || matches(notice.summary))
      .map((notice): SearchHit => ({
        title: notice.title, path: `notice/${notice.slug}`, kind: 'notice',
        snippet: notice.summary, date: notice.publishedAt,
      })),
    ...pages.filter(page => matches(page.title))
      .map((page): SearchHit => ({ title: page.title, path: page.slug, kind: 'page' })),
    ...people.filter(person => matches(person.name) || matches(person.designation))
      .map((person): SearchHit => ({
        title: person.name, path: `administration/${person.group}`, kind: 'person',
        snippet: person.designation,
      })),
    ...events.filter(event => matches(event.title))
      .map((event): SearchHit => ({
        title: event.title, path: `events/${event.slug}`, kind: 'event', date: event.startsAt,
      })),
  ]
}

export const fixtures = {
  profile, stats, navigation,
  notices, events, people, pages, albums, videos,
  classes, routines, exams, results,
  search,
}
