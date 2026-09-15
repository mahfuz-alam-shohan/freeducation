import type { APIRoute } from 'astro'
import { loadSite } from '../runtime/site.js'
import { buildSitemap } from '../runtime/feeds.js'

export const GET: APIRoute = async ({ url }) => {
  const { client, routes } = await loadSite(url)
  const notices = await client.get('notice.list', { pageSize: 200 })

  return new Response(buildSitemap(url.origin, routes, notices.items), {
    headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'max-age=3600' },
  })
}
