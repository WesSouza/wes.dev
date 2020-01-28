module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react-hooks'],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-duplicate-imports': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-no-bind': 'error',
    'react/prop-types': 'off',
    curly: 'error',
  },
  settings: {
    react: { version: 'detect' },
  },
  overrides: [
    {
      files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/jsx-no-bind': 'off',
      },
    },
  ],
};
