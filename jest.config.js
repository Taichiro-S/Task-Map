const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/src/'],
  roots: ['<rootDir>/src/'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/__tests__/utils/setup.ts'],
}

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: ['node_modules/(?!nanoid/)', '^.+\\.module\\.(css|sass|scss)$'],
})
