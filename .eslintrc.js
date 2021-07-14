module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'vue/no-v-html': 'off',
    'import/no-unresolved': 'off',
    "import/no-extraneous-dependencies": 'off',
    "no-tabs": 0,
    'max-len': 'off',
    'linebreak-style': 0,
    'eqeqeq' : 'off',
    'no-unused-expressions' : 'off',
    'no-param-reassign' : 'off',
    'import/prefer-default-export' : 'off',
    'no-shadow' : 'off',
    'no-underscore-dangle' : 'off',
    'no-console': 'off',
    'no-return-assign': 'off',
    'no-alert' : 'off',
    'vue/no-unused-components': 'off',
    'global-require': 'off',
    'consistent-return' : 'off',
    'no-unused-vars' : 'off',
    // Tradingview
    'new-cap' : 'off',
    'camelcase' : 'off',
    'no-use-before-define' : 'off',
    'no-restricted-globals' : 'off',
    'no-restricted-properties' : 'off',
    'radix' : 'off',
    'no-fallthrough' : 'off',
    'import/no-absolute-path' : 'off',
    'vue/require-default-prop' : 'off',
    'friendly-errors': 'off'
  }
}
