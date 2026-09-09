/// <reference types="astro/client" />

declare module 'virtual:fe/active-variants' {
  import type { VariantLoader } from './views/types.js'
  /** One design per view: the ones this school's build actually uses. */
  export const activeVariants: Record<string, VariantLoader>
}

interface ImportMetaEnv {
  /** Which schools/<slug>.json to serve. */
  readonly PUBLIC_SCHOOL?: string
  /** Credential for the content API. Server-side only — never referenced from a component. */
  readonly CONTENT_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
