import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from '@jest/types';

import { compilerOptions } from './tsconfig.paths.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/**/*',
    '!<rootDir>/src/application/functions/**/index.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/.*[./]test([.].*)*[.](js|ts)x?$'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  setupFiles: ['<rootDir>/tests/config/test-env.ts'],
};

export default config;
