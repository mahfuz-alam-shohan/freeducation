import type { Client } from '../data/index.js'
import type { SchoolConfig } from '../config/index.js'
import type { Locale } from '../contracts/index.js'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import type { Route } from '../routing/resolver.js'

/** Everything a page controller is allowed to know. */
export interface ViewContext {
  client: Client
  locale: Locale
  route: Route
  config: SchoolConfig
  url: URL
}

/** A variant is loaded on demand; its code and CSS are a separate chunk. */
export type VariantLoader = () => Promise<{ default: AstroComponentFactory }>

/** Every view module has this shape. The registry and the verifier both rely on it. */
export interface ViewModule {
  loadViewModel(context: ViewContext): Promise<unknown>
  variants: Record<string, VariantLoader>
  defaultVariant: string
}
