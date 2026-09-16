import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MODULE_ID = 'virtual:fe/active-variants'
const RESOLVED_ID = `\0${MODULE_ID}`

/** Reads the variants a view registers, and which one it defaults to. */
function readView(root, view) {
  const source = readFileSync(join(root, 'src/views', view, 'index.ts'), 'utf8')
  const registered = Object.fromEntries(
    [...source.matchAll(/'([^']+)':\s*\(\)\s*=>\s*import\('\.\/variants\/([^']+)\.astro'\)/g)]
      .map(([, id, file]) => [id, file]),
  )
  const defaultVariant = source.match(/defaultVariant\s*=\s*'([^']+)'/)?.[1]
  return { registered, defaultVariant }
}

/** The school's design set, then its own per-view exceptions. Mirrors src/designs. */
function chosenVariants(root, school) {
  const config = JSON.parse(readFileSync(join(root, 'schools', `${school}.json`), 'utf8'))
  const sets = JSON.parse(readFileSync(join(root, 'src/designs/sets.json'), 'utf8'))

  const design = config.design ?? 'classic'
  const set = sets[design]
  if (!set) {
    throw new Error(
      `[fe] school '${school}' names design '${design}', which does not exist in src/designs/sets.json.`,
    )
  }

  const chosen = { ...set.views }
  for (const [view, variant] of Object.entries(config.variants ?? {})) {
    if (view in chosen) chosen[view] = variant
  }
  return { design, chosen }
}

/**
 * Emits a module containing one variant per view: exactly the design this school uses.
 *
 * Astro collects the styles of every component reachable from a route, including
 * through dynamic imports. Referencing only the chosen variants here is what keeps a
 * school from downloading the CSS of designs it never renders.
 */
export function activeVariants({ root, school }) {
  return {
    name: 'fe-active-variants',
    resolveId: id => (id === MODULE_ID ? RESOLVED_ID : null),
    load(id) {
      if (id !== RESOLVED_ID) return null

      const { design, chosen } = chosenVariants(root, school)

      const views = readdirSync(join(root, 'src/views'))
        .filter(name => statSync(join(root, 'src/views', name)).isDirectory())

      const entries = views.map(view => {
        const { registered, defaultVariant } = readView(root, view)
        // No silent fall-back to the view's default: a design set that cannot answer
        // for a view is a hole in the design, and shipping the wrong look quietly is
        // worse than refusing to build.
        const id = chosen[view] ?? defaultVariant

        if (!id || !registered[id]) {
          throw new Error(
            `[fe] school '${school}' (design '${design}') resolves view '${view}' to variant `
            + `'${id ?? '(none)'}', which is not registered. Known: ${Object.keys(registered).join(', ')}.`,
          )
        }
        return `  '${view}': () => import('/src/views/${view}/variants/${registered[id]}.astro'),`
      })

      return `// generated for school '${school}', design '${design}'\n`
        + `export const activeVariants = {\n${entries.join('\n')}\n}\n`
    },
  }
}
