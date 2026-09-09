#!/usr/bin/env node
/**
 * Structure verifier.
 *
 * Conventions are only real if something checks them. This asserts the rules that
 * TypeScript and ESLint cannot see: folder shape, variant registration, translation
 * completeness, and that every school config points at things that exist.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const errors = []
const fail = (message) => errors.push(message)

const read = (path) => readFileSync(join(root, path), 'utf8')
const dirs = (path) =>
  readdirSync(join(root, path)).filter((name) => statSync(join(root, path, name)).isDirectory())

// ---------------------------------------------------------------- views
const viewDirs = dirs('src/views')
const registrySource = read('src/views/registry.ts')
const viewVariants = new Map()

for (const view of viewDirs) {
  const base = `src/views/${view}`

  for (const required of ['viewModel.ts', 'index.ts']) {
    if (!existsSync(join(root, base, required))) fail(`${base}/${required} is missing`)
  }
  if (!existsSync(join(root, base, 'variants'))) {
    fail(`${base}/variants/ is missing`)
    continue
  }

  const onDisk = readdirSync(join(root, base, 'variants'))
    .filter((file) => file.endsWith('.astro'))
    .map((file) => file.replace(/\.astro$/, ''))

  if (onDisk.length === 0) fail(`${base}/variants/ contains no variants`)

  const indexSource = existsSync(join(root, base, 'index.ts')) ? read(`${base}/index.ts`) : ''
  const registered = [...indexSource.matchAll(/'([^']+)':\s*\(\)\s*=>\s*import\('\.\/variants\/([^']+)\.astro'\)/g)]
    .map(([, id, file]) => ({ id, file }))

  for (const { file } of registered) {
    if (!onDisk.includes(file)) fail(`${base}/index.ts registers missing variant file '${file}.astro'`)
  }
  for (const file of onDisk) {
    if (!registered.some((entry) => entry.file === file)) {
      fail(`${base}/variants/${file}.astro exists but is not registered in index.ts`)
    }
  }

  const defaultMatch = indexSource.match(/defaultVariant\s*=\s*'([^']+)'/)
  if (!defaultMatch) fail(`${base}/index.ts does not export defaultVariant`)
  else if (!registered.some((entry) => entry.id === defaultMatch[1])) {
    fail(`${base}: defaultVariant '${defaultMatch[1]}' is not a registered variant`)
  }

  if (!registrySource.includes(`./${view}/index.js`)) {
    fail(`src/views/registry.ts does not register the '${view}' view`)
  }

  viewVariants.set(view, registered.map((entry) => entry.id))
}

// ---------------------------------------------------------------- translations
const catalogNames = readdirSync(join(root, 'src/i18n/catalogs')).filter((f) => f.endsWith('.json'))
const catalogs = catalogNames.map((name) => [name, JSON.parse(read(`src/i18n/catalogs/${name}`))])
const reference = catalogs[0]
if (reference) {
  const referenceKeys = Object.keys(reference[1]).sort()
  for (const [name, catalog] of catalogs.slice(1)) {
    const keys = Object.keys(catalog).sort()
    for (const key of referenceKeys) {
      if (!keys.includes(key)) fail(`translation '${key}' is missing from ${name}`)
    }
    for (const key of keys) {
      if (!referenceKeys.includes(key)) fail(`translation '${key}' in ${name} is not in ${reference[0]}`)
    }
  }
}

// ---------------------------------------------------------------- schools
for (const file of readdirSync(join(root, 'schools'))) {
  if (!file.endsWith('.json')) {
    fail(`schools/${file} is not JSON — schools hold configuration only, never code`)
    continue
  }

  let config
  try {
    config = JSON.parse(read(`schools/${file}`))
  } catch (cause) {
    fail(`schools/${file} is not valid JSON: ${cause.message}`)
    continue
  }

  const slug = file.replace(/\.json$/, '')
  if (config.slug !== slug) fail(`schools/${file}: slug '${config.slug}' does not match its filename`)

  for (const [view, variant] of Object.entries(config.variants ?? {})) {
    const available = viewVariants.get(view)
    if (!available) fail(`schools/${file}: '${view}' is not a known view`)
    else if (!available.includes(variant)) {
      fail(`schools/${file}: view '${view}' has no variant '${variant}' (available: ${available.join(', ')})`)
    }
  }
}

// ---------------------------------------------------------------- report
if (errors.length > 0) {
  console.error(`\n✖ structure check failed (${errors.length}):\n`)
  for (const message of errors) console.error(`  - ${message}`)
  console.error('')
  process.exit(1)
}
console.log(`✓ structure check passed (${viewDirs.length} views, ${catalogNames.length} locales)`)
