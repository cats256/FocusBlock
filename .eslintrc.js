module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "airbnb-base",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    quotes: "off",
    "max-len": ["error", { code: 120 }],
  },
  globals: {
    chrome: "readonly",
  },
};
