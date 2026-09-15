import type { APIRoute } from 'astro'
import { buildRobots } from '../runtime/feeds.js'

export const GET: APIRoute = ({ url }) =>
  new Response(buildRobots(url.origin), {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'max-age=86400' },
  })
