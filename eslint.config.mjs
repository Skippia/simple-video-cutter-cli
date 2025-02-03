import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  ignores: ['node_modules/*', 'tsconfig.json', 'vite.config.ts', '*.md'],
}, {
  files: ['**/*.ts'],
  rules: {
    'no-console': 'off',
    'style/max-len': [
      'error',
      {
        code: 120,
        comments: 120,
        // ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
      },
    ],
  },
})
