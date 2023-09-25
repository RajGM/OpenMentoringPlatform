/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Use 'jsdom' for a DOM environment, not 'node'
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1.tsx',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.vercel/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Ensure correct file extension here
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }
  }
};
