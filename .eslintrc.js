module.exports = {
  plugins: ['node', 'security'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=8.3.0',
        ignores: [],
      },
    ],
    'node/no-extraneous-require': 'off',
    'node/exports-style': ['error', 'module.exports'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: 'flow',
        trailingComma: 'all',
      },
    ],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'should|expect',
      },
    ],
  },
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    mocha: true,
    node: true,
  },
};
