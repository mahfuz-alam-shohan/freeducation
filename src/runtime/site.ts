import { loadSchool, type SchoolConfig } from '../config/index.js'
import { createClient, fixtureSource, httpSource, type Client } from '../data/index.js'
import { buildRoutes, type Route } from '../routing/resolver.js'
import { createTranslator, type Translator } from '../i18n/index.js'
import type { Locale, Navigation, Notice, SchoolProfile } from '../contracts/index.js'

/**
 * Everything a route needs before it can render anything.
 *
 * This lives in one place so every entry point — the catch-all, the error page, the
 * feeds — agrees on the school, the data source and the locale. A page that built its
 * own client would quietly drift from the rest of the site.
 */
export interface Site {
  config: SchoolConfig
  client: Client
  locale: Locale
  t: Translator
  navigation: Navigation
  profile: SchoolProfile
  routes: Route[]
  /** Where the search page lives, if the school has one in its menu. */
  searchPath: string | undefined
  /** Recent notices for the header ticker; empty when the school has it switched off. */
  ticker: Notice[]
}

function sourceFor(config: SchoolConfig) {
  if (config.data.source !== 'http') return fixtureSource()
  return httpSource({
    baseUrl: config.data.baseUrl ?? '',
    apiKey: import.meta.env.CONTENT_API_KEY,
    tenant: config.data.tenant,
  })
}

export function resolveLocale(config: SchoolConfig, url: URL): Locale {
  const requested = url.searchParams.get('lang') as Locale | null
  return requested && config.locales.supported.includes(requested)
    ? requested
    : config.locales.default
}

export async function loadSite(url: URL): Promise<Site> {
  const config = loadSchool()
  const client = createClient(sourceFor(config))
  const locale = resolveLocale(config, url)

  const [navigation, profile] = await Promise.all([
    client.get('site.navigation'),
    client.get('site.profile'),
  ])

  const routes = buildRoutes(navigation)

  const ticker = config.features.noticeTicker
    ? (await client.get('notice.list', { pageSize: 6 })).items
    : []

  return {
    config, client, locale, t: createTranslator(locale),
    navigation, profile, routes,
    searchPath: routes.find(route => route.view === 'search')?.path,
    ticker,
  }
}
