import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from '@jest/types';

import { compilerOptions } from './tsconfig.paths.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/functions/**/handler.ts',
    '<rootDir>/src/hooks/**/*',
    '<rootDir>/src/libs/**/*',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/.*[./]test([.].*)*[.](js|ts)x?$'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default config;
