import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import importPlugin from 'eslint-plugin-import'
import fe from './tools/eslint-plugin-fe/index.js'

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
    // The runtime composes config and data for entry points only.
    target: ['./src/ui', './src/sections', './src/contracts', './src/tokens', './src/data', './src/config', './src/i18n', './src/routing'],
    from: ['./src/runtime'],
    message: 'Only routes and layouts may use src/runtime.',
  },
  {
    target: './src',
    from: ['./src/pages'],
    except: ['./pages'],
    message: 'Nothing may import from src/pages — routes are the outermost layer.',
  },
]

/**
 * ESLint replaces a rule's options wholesale when a later config block sets the same
 * rule, so the presentation layers must repeat the shared selectors rather than only
 * adding their own.
 */
const sharedSyntaxRules = [
  {
    selector: "MemberExpression[object.type='Identifier'][property.name=/^(bn|en)$/]",
    message: 'Read localized content through resolveText(), never a language branch.',
  },
  {
    selector: "BinaryExpression[operator=/^[=!]==$/] > MemberExpression[object.name=/^(school|tenant)$/][property.name='slug']",
    message: 'No per-school branching. Express the difference as config, a token or a variant.',
  },
  {
    selector: "CallExpression[callee.property.name=/^toLocale(Date|Time)?String$/]",
    message: 'Use formatDate/formatNumber from src/i18n so every locale is handled the same way.',
  },
]

const presentationSyntaxRules = [
  ...sharedSyntaxRules,
  {
    selector: "MemberExpression[object.type='MetaProperty']",
    message: 'import.meta.env is not available to presentation code. Pass values in through the view-model or config.',
  },
]

export default [
  { ignores: ['dist/**', 'node_modules/**', '.astro/**'] },

  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    plugins: { import: importPlugin, fe },
    rules: {
      'fe/no-raw-color': 'error',
      'fe/no-bare-string': 'error',
      'import/no-restricted-paths': ['error', { zones: restrictedZones }],
      'import/no-cycle': ['error', { maxDepth: 6 }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'no-restricted-syntax': ['error', ...sharedSyntaxRules],
    },
    settings: {
      'import/resolver': { typescript: true, node: true },
    },
  },

  {
    // Presentation layers render what they are given; environment access belongs to
    // the data, config and route layers.
    files: ['src/ui/**', 'src/sections/**', 'src/views/**'],
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'process', property: 'env', message: 'Environment access belongs in src/data or src/config.' },
      ],
      'no-restricted-syntax': ['error', ...presentationSyntaxRules],
    },
  },

  {
    // Design tokens are declared here, so this is the one place raw colours may appear.
    files: ['src/tokens/**'],
    rules: { 'fe/no-raw-color': 'off' },
  },

  {
    // Build tooling legitimately compares configuration slugs to filenames.
    files: ['tools/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  {
    // Fixtures are sample content, not interface text.
    files: ['src/testing/**', '**/*.test.ts'],
    rules: { 'fe/no-bare-string': 'off', 'fe/no-raw-color': 'off' },
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
