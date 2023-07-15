module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    chrome: 'readonly',
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
  },
};
