import type { DataSource } from '../source.js'
import type { DataKey } from '../keys.js'
import type { FormKey } from '../forms.js'

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
  'video.list': 'gallery/videos',
  'routine.classes': 'routine/classes',
  'routine.byClass': 'routine',
  'result.exams': 'results/exams',
  'result.lookup': 'results/lookup',
  'site.search': 'search',
}

/** Where a submitted form is sent. */
const formEndpoints: Record<FormKey, string> = {
  'contact.message': 'forms/contact',
  'admission.application': 'forms/admission',
}

export function httpSource(options: HttpSourceOptions): DataSource {
  const { baseUrl, apiKey, tenant, timeoutMs = 8000, fetchImpl = fetch } = options

  const headers = () => ({
    accept: 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...(tenant ? { 'x-tenant': tenant } : {}),
  })

  return {
    name: 'http',

    async submit(key, payload) {
      const url = `${baseUrl.replace(/\/$/, '')}/${formEndpoints[key]}`
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetchImpl(url, {
          method: 'POST',
          headers: { ...headers(), 'content-type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
        return await response.json()
      } finally {
        clearTimeout(timer)
      }
    },
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
        const response = await fetchImpl(url, { headers: headers(), signal: controller.signal })
        if (response.status === 404) return null
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
        return await response.json()
      } finally {
        clearTimeout(timer)
      }
    },
  }
}
