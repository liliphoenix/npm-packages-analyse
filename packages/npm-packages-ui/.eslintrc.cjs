/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  browser: true,
  commonjs: true,
  es6: true,
  node: true,
  globals: {
    // "Atomics": "readonly",
    // "SharedArrayBuffer": "readonly",
    "process": true,

  },
}
