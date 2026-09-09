/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Which schools/<slug>.json to serve. */
  readonly PUBLIC_SCHOOL?: string
  /** Credential for the content API. Server-side only — never referenced from a component. */
  readonly CONTENT_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
