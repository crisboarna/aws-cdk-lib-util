import { getJestProjectsAsync } from '@nx/jest';

/* eslint-disable */
export default async  () => ({
  projects: await getJestProjectsAsync(),
  displayName: 'infra',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'coverage',
});
