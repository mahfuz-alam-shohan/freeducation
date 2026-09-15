import type { APIRoute } from 'astro'
import { loadSite } from '../runtime/site.js'
import { buildNoticeFeed } from '../runtime/feeds.js'

export const GET: APIRoute = async ({ url }) => {
  const { client, profile, locale } = await loadSite(url)
  const notices = await client.get('notice.list', { pageSize: 50 })

  return new Response(buildNoticeFeed(url.origin, profile, notices.items, locale), {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'max-age=1800' },
  })
}
