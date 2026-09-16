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

// ---------------------------------------------------------------- designs
// A design set must answer for every view. That is what makes "one school, one look"
// a guarantee rather than a hope: there is no view a set can leave to chance, and
// adding a view to the platform forces every set to say what it looks like.
let designs = {}
try {
  designs = JSON.parse(read('src/designs/sets.json'))
} catch (cause) {
  fail(`src/designs/sets.json is not valid JSON: ${cause.message}`)
}

const claimed = new Set()

for (const [name, set] of Object.entries(designs)) {
  if (!/^[a-z0-9-]+$/.test(name)) fail(`design '${name}': names are kebab-case`)
  for (const field of ['label', 'note']) {
    if (typeof set?.[field] !== 'string' || set[field].length === 0) {
      fail(`design '${name}' has no ${field}`)
    }
  }

  const views = set?.views ?? {}

  for (const view of viewDirs) {
    if (!(view in views)) {
      fail(`design '${name}' does not say which variant view '${view}' uses`)
    }
  }
  for (const [view, variant] of Object.entries(views)) {
    const available = viewVariants.get(view)
    if (!available) {
      fail(`design '${name}' names view '${view}', which does not exist`)
    } else if (!available.includes(variant)) {
      fail(`design '${name}': view '${view}' has no variant '${variant}' (available: ${available.join(', ')})`)
    } else {
      claimed.add(`${view}/${variant}`)
    }
  }
}

// A variant no design set names is a design nobody can choose. Either put it in a set
// or delete it — there is no third state where it just sits in the tree.
if (Object.keys(designs).length > 0) {
  for (const [view, variants] of viewVariants) {
    for (const variant of variants) {
      if (!claimed.has(`${view}/${variant}`)) {
        fail(`src/views/${view}/variants/${variant}.astro is in no design set, so no school can use it`)
      }
    }
  }
}

// ---------------------------------------------------------------- class names
// A :global() rule in the shell applies everywhere, including inside a variant's own
// markup. When a variant then styles the same class name, the shell's declarations it
// did not think to reset are still in force — a header laid out as a flex row because
// something else already claimed '.fe-masthead'. The names have to stay distinct.
const globalClasses = new Map()
const declared = /:global\(\s*\.([a-zA-Z0-9_-]+)/g

for (const area of ['src/ui', 'src/sections', 'src/layouts']) {
  if (!existsSync(join(root, area))) continue
  for (const file of readdirSync(join(root, area))) {
    if (!file.endsWith('.astro')) continue
    for (const [, name] of read(`${area}/${file}`).matchAll(declared)) {
      if (!globalClasses.has(name)) globalClasses.set(name, `${area}/${file}`)
    }
  }
}

for (const view of viewDirs) {
  const dir = join(root, 'src/views', view, 'variants')
  if (!existsSync(dir)) continue

  for (const file of readdirSync(dir).filter((name) => name.endsWith('.astro'))) {
    const source = read(`src/views/${view}/variants/${file}`)
    const styles = source.slice(source.indexOf('<style'))

    for (const [name, owner] of globalClasses) {
      // Only a scoped declaration is a problem; targeting it through :global() is how a
      // variant is meant to reach a shared component on purpose.
      const scoped = new RegExp(`(^|[\\s,{}])\\.${name}(?![a-zA-Z0-9_-])`, 'm')
      const stripped = styles.replace(/:global\([^)]*\)/g, '')
      if (scoped.test(stripped)) {
        fail(
          `src/views/${view}/variants/${file} styles '.${name}', which ${owner} declares `
          + `:global — the shell's rules would still apply. Rename the local one.`,
        )
      }
    }
  }
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

  const design = config.design ?? 'classic'
  if (!designs[design]) {
    fail(`schools/${file}: design '${design}' does not exist (available: ${Object.keys(designs).join(', ')})`)
  }

  for (const [view, variant] of Object.entries(config.variants ?? {})) {
    const available = viewVariants.get(view)
    if (!available) fail(`schools/${file}: '${view}' is not a known view`)
    else if (!available.includes(variant)) {
      fail(`schools/${file}: view '${view}' has no variant '${variant}' (available: ${available.join(', ')})`)
    } else if (designs[design]?.views?.[view] === variant) {
      fail(`schools/${file}: override '${view}: ${variant}' is what design '${design}' already gives. Remove it.`)
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
console.log(
  `✓ structure check passed (${viewDirs.length} views, ${Object.keys(designs).length} designs, `
  + `${catalogNames.length} locales)`,
)
