const getProject = (type, color, options = {}) => ({
  displayName: {
    name: type.toUpperCase(),
    color,
  },
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [`<rootDir>/tests/${type}/**/*.spec.ts`],
  ...options,
});

const jestConfig = {
  projects: [
    getProject('db', 'red'),
    getProject('e2e', 'magenta', { setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.ts'] }),
    getProject('unit', 'blue'),
  ],
};

if (process.env.COVERAGE) {
  jestConfig.collectCoverage = true;
  jestConfig.collectCoverageFrom = ['<rootDir>/src/**/*.ts'];
}

module.exports = jestConfig;
