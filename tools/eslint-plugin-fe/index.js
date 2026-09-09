/**
 * Project lint rules.
 *
 * Both rules scan raw source text rather than the AST, because the things they guard
 * live in Astro <style> blocks and template text, which the JavaScript AST does not
 * describe.
 */

const HEX_OR_FUNCTION = /#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z_-])|\b(?:rgba?|hsla?)\s*\(/g

/** Attributes whose literal value is read out by a screen reader or shown on hover. */
const TEXT_ATTRIBUTES = /\b(?:aria-label|aria-description|title|alt|placeholder)\s*=\s*"([^"{}]*[A-Za-zঀ-৿]{3,}[^"{}]*)"/g

const WORD_RUN = /[A-Za-zঀ-৿]{3,}/

const reportAt = (context, index, messageId, data) => {
  let loc
  try {
    loc = context.sourceCode.getLocFromIndex(index)
  } catch {
    loc = { line: 1, column: 0 }
  }
  context.report({ loc: { start: loc, end: loc }, messageId, data })
}

/**
 * Walks an .astro file and yields the text a visitor actually reads: outside the
 * frontmatter, outside tags, outside style and script blocks, and outside {expressions}.
 */
function* templateText(source) {
  let index = 0

  if (source.startsWith('---')) {
    const end = source.indexOf('\n---', 3)
    if (end !== -1) index = end + 4
  }

  let braceDepth = 0
  while (index < source.length) {
    const char = source[index]

    if (char === '<') {
      const blockMatch = /^<(style|script)\b/i.exec(source.slice(index))
      if (blockMatch) {
        const closing = `</${blockMatch[1]}>`
        const end = source.toLowerCase().indexOf(closing, index)
        index = end === -1 ? source.length : end + closing.length
        continue
      }
      const tagEnd = source.indexOf('>', index)
      index = tagEnd === -1 ? source.length : tagEnd + 1
      continue
    }

    if (char === '{') { braceDepth += 1; index += 1; continue }
    if (char === '}') { braceDepth = Math.max(0, braceDepth - 1); index += 1; continue }

    if (braceDepth === 0) {
      const nextBreak = source.slice(index).search(/[<{}]/)
      const end = nextBreak === -1 ? source.length : index + nextBreak
      yield { text: source.slice(index, end), index }
      index = end
      continue
    }
    index += 1
  }
}

export default {
  rules: {
    'no-raw-color': {
      meta: {
        type: 'problem',
        docs: { description: 'Colours come from design tokens so a school can restyle without touching code.' },
        messages: {
          rawColor: "Raw colour '{{value}}'. Use a design token: var(--fe-color-*). Tokens are declared in src/tokens.",
        },
        schema: [],
      },
      create(context) {
        return {
          Program() {
            const source = context.sourceCode.getText()
            for (const match of source.matchAll(HEX_OR_FUNCTION)) {
              reportAt(context, match.index, 'rawColor', { value: match[0] })
            }
          },
        }
      },
    },

    'no-bare-string': {
      meta: {
        type: 'problem',
        docs: { description: 'User-facing text comes from the translation catalogues.' },
        messages: {
          bareText: "Hard-coded text '{{value}}'. Use t('key') so the site works in every language.",
          bareAttribute: "Hard-coded text in an attribute: '{{value}}'. Use t('key').",
        },
        schema: [],
      },
      create(context) {
        const filename = context.filename ?? ''
        if (!filename.endsWith('.astro')) return {}

        return {
          Program() {
            const source = context.sourceCode.getText()

            for (const { text, index } of templateText(source)) {
              // HTML entities such as &larr; are markup, not prose.
              const prose = text.replace(/&[a-zA-Z]+;|&#\d+;/g, ' ')
              const match = WORD_RUN.exec(prose)
              if (match) {
                reportAt(context, index, 'bareText', { value: prose.trim().slice(0, 40) })
              }
            }

            for (const match of source.matchAll(TEXT_ATTRIBUTES)) {
              reportAt(context, match.index, 'bareAttribute', { value: match[1].slice(0, 40) })
            }
          },
        }
      },
    },
  },
}
