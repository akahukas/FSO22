module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'prettier'],
  env: {
    es2021: true,
    node: true,
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 0,
  },
}
