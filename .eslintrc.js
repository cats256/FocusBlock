module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
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
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: { consistent: true },
        ObjectPattern: { consistent: true },
        ImportDeclaration: { consistent: true },
        ExportDeclaration: { consistent: true },
      },
    ],
  },
  globals: {
    chrome: "readonly",
  },
  plugins: ["jest"],
};
