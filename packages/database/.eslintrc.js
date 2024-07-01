module.exports = {
  ignorePatterns: ['.eslintrc.js', 'jest.config.js', '**/__test__/**/*.ts'],
  extends: ['@repo/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};

// /** @type {import("eslint").Linter.Config} */
// module.exports = {
//   extends: ['@repo/eslint-config/library.js'],
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: true,
//   },
// };
