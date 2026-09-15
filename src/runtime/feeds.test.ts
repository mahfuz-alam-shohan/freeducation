import { describe, expect, it } from 'vitest'
import { buildNoticeFeed, buildRobots, buildSitemap, escapeXml } from './feeds.js'
import { fixtures } from '../testing/fixtures/index.js'
import { buildRoutes } from '../routing/resolver.js'
import { Navigation, Notice, SchoolProfile } from '../contracts/index.js'

const origin = 'https://school.example'
const routes = buildRoutes(Navigation.parse(fixtures.navigation))
const notices = fixtures.notices.map(notice => Notice.parse(notice))
const profile = SchoolProfile.parse(fixtures.profile)

describe('escapeXml', () => {
  it('escapes every character that would break a document', () => {
    expect(escapeXml(`<a href="x">Tom & Jerry's</a>`))
      .toBe('&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/a&gt;')
  })
})

describe('buildSitemap', () => {
  const xml = buildSitemap(origin, routes, notices)

  it('lists the pages the menu defines', () => {
    expect(xml).toContain(`<loc>${origin}/notice</loc>`)
    expect(xml).toContain(`<loc>${origin}/about/history</loc>`)
  })

  it('includes the home page', () => {
    expect(xml).toContain(`<loc>${origin}/</loc>`)
  })

  it('includes notice detail pages, which are not menu items', () => {
    expect(xml).toContain(`<loc>${origin}/notice/admission-2026</loc>`)
  })

  it('leaves the search page out — it is a tool, not content', () => {
    expect(xml).not.toContain(`${origin}/search<`)
  })

  it('never repeats a URL', () => {
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    expect(new Set(locs).size).toBe(locs.length)
  })

  it('records when a notice was published', () => {
    expect(xml).toContain('<lastmod>2026-01-05T04:00:00.000Z</lastmod>')
  })

  it('is a well-formed document', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
  })
})

describe('buildRobots', () => {
  it('points crawlers at the sitemap', () => {
    expect(buildRobots(origin)).toContain(`Sitemap: ${origin}/sitemap.xml`)
  })
})

describe('buildNoticeFeed', () => {
  const xml = buildNoticeFeed(origin, profile, notices, 'en')

  it('names the channel after the school', () => {
    expect(xml).toContain('<title>Adarsha School &amp; College</title>')
  })

  it('links each notice to its page', () => {
    expect(xml).toContain(`<link>${origin}/notice/admission-2026</link>`)
    expect(xml).toContain(`<guid isPermaLink="true">${origin}/notice/admission-2026</guid>`)
  })

  it('formats publication dates as RSS expects', () => {
    expect(xml).toMatch(/<pubDate>\w{3}, \d{2} \w{3} \d{4}/)
  })

  it('strips markup out of descriptions', () => {
    expect(xml).not.toContain('&lt;p&gt;')
  })

  it('survives an unparseable date without emitting a broken element', () => {
    const broken = [{ ...notices[0]!, publishedAt: 'not-a-date' }]
    const output = buildNoticeFeed(origin, profile, broken, 'en')
    expect(output).not.toContain('<pubDate>Invalid')
    expect(output).not.toContain('<pubDate></pubDate>')
  })

  it('produces a valid empty channel when there are no notices', () => {
    const output = buildNoticeFeed(origin, profile, [], 'en')
    expect(output).toContain('<channel>')
    expect(output).not.toContain('<item>')
    expect(output.trimEnd().endsWith('</rss>')).toBe(true)
  })

  it('uses the requested language', () => {
    expect(buildNoticeFeed(origin, profile, notices, 'bn')).toContain('<language>bn</language>')
  })
})
