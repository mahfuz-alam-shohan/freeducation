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

      const configPath = join(root, 'schools', `${school}.json`)
      const chosen = JSON.parse(readFileSync(configPath, 'utf8')).variants ?? {}

      const views = readdirSync(join(root, 'src/views'))
        .filter(name => statSync(join(root, 'src/views', name)).isDirectory())

      const entries = views.map(view => {
        const { registered, defaultVariant } = readView(root, view)
        const wanted = chosen[view]
        const id = wanted && registered[wanted] ? wanted : defaultVariant

        if (!id || !registered[id]) {
          throw new Error(
            `[fe] school '${school}' resolves view '${view}' to variant '${wanted ?? id}', which is not registered.`,
          )
        }
        return `  '${view}': () => import('/src/views/${view}/variants/${registered[id]}.astro'),`
      })

      return `// generated for school '${school}'\nexport const activeVariants = {\n${entries.join('\n')}\n}\n`
    },
  }
}
