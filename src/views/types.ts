import type { Client } from '../data/index.js'
import type { SchoolConfig } from '../config/index.js'
import type { Locale } from '../contracts/index.js'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import type { Route } from '../routing/resolver.js'
import type { SubmissionState } from '../contracts/index.js'

/** Everything a page controller is allowed to know. */
export interface ViewContext {
  client: Client
  locale: Locale
  route: Route
  /** Every page this school publishes, so cross-links survive a renamed menu. */
  routes: Route[]
  config: SchoolConfig
  url: URL
  /** The result of a form posted to this page, if any. */
  submission: SubmissionState
}

/**
 * What a page tells search engines and link previews about itself.
 * A view model may expose this; the route falls back to the school's own details.
 */
export interface PageMeta {
  /** Overrides the menu label. A notice detail page is titled by its headline, not by 'Notice'. */
  title?: string
  description?: string
  image?: string
}

/**
 * Whether a view model represents content that does not exist, so the route can answer
 * 404 rather than 200 with an apology — search engines and link checkers rely on it.
 */
export function isNotFound(viewModel: unknown): boolean {
  return typeof viewModel === 'object'
    && viewModel !== null
    && 'notFound' in viewModel
    && (viewModel as { notFound: unknown }).notFound === true
}

/** Reads the optional meta off a view model without assuming its shape. */
export function metaOf(viewModel: unknown): PageMeta {
  if (typeof viewModel !== 'object' || viewModel === null || !('meta' in viewModel)) return {}
  const meta = (viewModel as { meta: unknown }).meta
  if (typeof meta !== 'object' || meta === null) return {}

  const { title, description, image } = meta as PageMeta
  const keep = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

  return {
    ...(keep(title) ? { title } : {}),
    ...(keep(description) ? { description } : {}),
    ...(keep(image) ? { image } : {}),
  }
}

/** A variant is loaded on demand; its code and CSS are a separate chunk. */
export type VariantLoader = () => Promise<{ default: AstroComponentFactory }>

/** Every view module has this shape. The registry and the verifier both rely on it. */
export interface ViewModule {
  loadViewModel(context: ViewContext): Promise<unknown>
  variants: Record<string, VariantLoader>
  defaultVariant: string
}
