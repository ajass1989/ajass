module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '*e2e-spec.ts'],
  rules: {
    'no-console': 'warn',
  },
};

// /** @type {import("eslint").Linter.Config} */
// {
//   "extends": ["@repo/eslint-config/next.js"],
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "project": true
//   }
// }
