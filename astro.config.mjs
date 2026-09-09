import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import node from '@astrojs/node'
import { activeVariants } from './tools/active-variants-plugin.mjs'

// Cloudflare Workers in production; the Node adapter is used to preview a real
// production build locally (ADAPTER=node astro build && astro preview).
const adapter = process.env.ADAPTER === 'node'
  ? node({ mode: 'standalone' })
  // Local assets are optimised at build time; images from the content API are served
  // as-is. Neither needs the paid Cloudflare Images binding.
  : cloudflare({ imageService: { build: 'compile', runtime: 'passthrough' } })

const school = process.env.PUBLIC_SCHOOL ?? 'demo'

export default defineConfig({
  vite: {
    plugins: [activeVariants({ root: process.cwd(), school })],
  },
  // Server rendering: menus, pages and content all come from the API at request time,
  // so a school can change any of it without a rebuild.
  output: 'server',
  adapter,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
})
