import type { DataSource } from '../source.js'
import type { DataKey } from '../keys.js'

export interface HttpSourceOptions {
  baseUrl: string
  /** Sent as `X-Api-Key`. Read from env at the edge — it must never reach the browser bundle. */
  apiKey?: string
  tenant?: string
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

/** Maps a data key to an endpoint. The only place URL shapes are known. */
const endpoints: Record<DataKey, string> = {
  'site.profile': 'site/profile',
  'site.navigation': 'site/navigation',
  'site.stats': 'site/stats',
  'notice.list': 'notices',
  'notice.bySlug': 'notices/:slug',
  'page.bySlug': 'pages/:slug',
  'person.list': 'people',
  'event.list': 'events',
  'event.bySlug': 'events/:slug',
  'gallery.albums': 'gallery/albums',
  'gallery.album': 'gallery/albums/:slug',
  'routine.classes': 'routine/classes',
  'routine.byClass': 'routine',
  'result.exams': 'results/exams',
  'result.lookup': 'results/lookup',
  'site.search': 'search',
}

export function httpSource(options: HttpSourceOptions): DataSource {
  const { baseUrl, apiKey, tenant, timeoutMs = 8000, fetchImpl = fetch } = options

  return {
    name: 'http',
    async fetch(key, params) {
      let path = endpoints[key]
      const query = new URLSearchParams()

      for (const [name, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue
        const token = `:${name}`
        if (path.includes(token)) path = path.replace(token, encodeURIComponent(String(value)))
        else query.set(name, String(value))
      }

      const url = `${baseUrl.replace(/\/$/, '')}/${path}${query.size ? `?${query}` : ''}`
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetchImpl(url, {
          headers: {
            accept: 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {}),
            ...(tenant ? { 'x-tenant': tenant } : {}),
          },
          signal: controller.signal,
        })
        if (response.status === 404) return null
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
        return await response.json()
      } finally {
        clearTimeout(timer)
      }
    },
  }
}
