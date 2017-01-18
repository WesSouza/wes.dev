module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: 'eslint:recommended',
  rules: {
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'no-console': [
      'off',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
  },
};
