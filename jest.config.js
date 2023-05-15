/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1', '^~~/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  modulePathIgnorePatterns: [
    "src/v2/routes",
    "src/middlewares",
    "src/functions",
    "src/database",
    "src/controllers",
    "src/types",
    "src/index.ts",
    "src/utils/mail.ts",
    "src/utils/winston.ts",
    "src/utils/articles.ts",
    "src/services/photos.ts",
    "src/services/fogetPasswrodService.ts"
  ],
  "testPathIgnorePatterns" : [
    "__tests__/ignore/" 
  ]
};
