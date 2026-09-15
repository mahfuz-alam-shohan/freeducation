import type { Locale, Notice, SchoolProfile } from '../contracts/index.js'
import type { Route } from '../routing/resolver.js'
import { resolveText, toPlainText } from '../i18n/index.js'

export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const absolute = (origin: string, path: string): string =>
  new URL(path.startsWith('/') ? path : `/${path}`, origin).href

export interface SitemapEntry {
  path: string
  lastModified?: string | undefined
}

/**
 * The menu is the sitemap, so search engines see exactly the pages a school published.
 * Notice detail pages are added separately because they are not menu items.
 */
export function buildSitemap(origin: string, routes: Route[], notices: Notice[]): string {
  const entries: SitemapEntry[] = [
    // The search page is a tool, not content worth indexing.
    ...routes.filter(route => route.view !== 'search').map(route => ({ path: route.path })),
    ...notices.map(notice => ({
      path: `notice/${notice.slug}`,
      lastModified: notice.publishedAt,
    })),
  ]

  const seen = new Set<string>()
  const unique = entries.filter(entry => {
    if (seen.has(entry.path)) return false
    seen.add(entry.path)
    return true
  })

  const urls = unique.map(entry => {
    const lastmod = entry.lastModified ? `\n    <lastmod>${escapeXml(entry.lastModified)}</lastmod>` : ''
    return `  <url>\n    <loc>${escapeXml(absolute(origin, entry.path))}</loc>${lastmod}\n  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function buildRobots(origin: string): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${absolute(origin, 'sitemap.xml')}`, ''].join('\n')
}

/** Notices as RSS, so parents can follow them and other sites can syndicate them. */
export function buildNoticeFeed(
  origin: string,
  profile: SchoolProfile,
  notices: Notice[],
  locale: Locale,
): string {
  const siteName = resolveText(profile.name, locale)

  const items = notices.map(notice => {
    const link = absolute(origin, `notice/${notice.slug}`)
    const description = toPlainText(resolveText(notice.summary ?? notice.body, locale), 400)
    const published = new Date(notice.publishedAt)
    const pubDate = Number.isNaN(published.getTime()) ? '' : `\n      <pubDate>${published.toUTCString()}</pubDate>`

    return [
      '    <item>',
      `      <title>${escapeXml(resolveText(notice.title, locale))}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      description ? `      <description>${escapeXml(description)}</description>` : '',
      `      <category>${escapeXml(notice.category)}</category>${pubDate}`,
      '    </item>',
    ].filter(Boolean).join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${escapeXml(origin)}</link>`,
    `    <description>${escapeXml(resolveText(profile.tagline, locale) || siteName)}</description>`,
    `    <language>${locale}</language>`,
    items.join('\n'),
    '  </channel>',
    '</rss>',
    '',
  ].filter(line => line !== '').join('\n')
}
