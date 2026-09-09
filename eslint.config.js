import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import importPlugin from 'eslint-plugin-import'

/**
 * Layer boundaries are enforced here, not by convention.
 * The direction is: contracts <- everything; ui/sections render only; pages fetch.
 */
const restrictedZones = [
  {
    target: './src/ui',
    from: ['./src/data', './src/config', './src/views'],
    message: 'ui is presentation only: it must not read data, config or views.',
  },
  {
    target: './src/sections',
    from: ['./src/data', './src/views'],
    message: 'sections render what they are given: no data access.',
  },
  {
    target: './src/contracts',
    from: ['./src/data', './src/config', './src/ui', './src/sections', './src/views', './src/pages'],
    message: 'contracts is a leaf: it may not depend on anything.',
  },
  {
    target: './src/tokens',
    from: ['./src/data', './src/config', './src/ui', './src/sections', './src/views'],
    message: 'tokens is a leaf.',
  },
  {
    target: './src/views/*/variants',
    from: ['./src/data', './src/config'],
    message: 'A variant renders its view-model and nothing else: no fetching, no config.',
  },
  {
    target: './src',
    from: ['./src/pages'],
    except: ['./pages'],
    message: 'Nothing may import from src/pages — routes are the outermost layer.',
  },
]

export default [
  { ignores: ['dist/**', 'node_modules/**', '.astro/**'] },

  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    plugins: { import: importPlugin },
    rules: {
      'import/no-restricted-paths': ['error', { zones: restrictedZones }],
      'import/no-cycle': ['error', { maxDepth: 6 }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.type='Identifier'][property.name=/^(bn|en)$/]",
          message: 'Read localized content through resolveText(), never a language branch.',
        },
      ],
    },
    settings: {
      'import/resolver': { typescript: true, node: true },
    },
  },

  {
    // The i18n module is where language fallback is implemented, so it is the one
    // place allowed to touch a language branch directly.
    files: ['src/i18n/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  {
    files: ['**/*.astro'],
    rules: {
      // Astro components legitimately exceed the line budget with their scoped styles.
      'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },
]
