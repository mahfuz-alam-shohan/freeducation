import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import node from '@astrojs/node'

// Cloudflare Workers in production; the Node adapter is used to preview a real
// production build locally (ADAPTER=node astro build && astro preview).
const adapter = process.env.ADAPTER === 'node'
  ? node({ mode: 'standalone' })
  : cloudflare()

export default defineConfig({
  // Server rendering: menus, pages and content all come from the API at request time,
  // so a school can change any of it without a rebuild.
  output: 'server',
  adapter,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
})
