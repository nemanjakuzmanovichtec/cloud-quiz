import { buildConfig } from '.';

describe('buildConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return config with local endpoint', () => {
    process.env.IS_OFFLINE = 'true';

    const config = buildConfig();

    expect(config).toEqual({
      region: 'eu-central-1',
      endpoint: 'http://localhost:8000',
    });
  });

  it('should return config with actual endpoint', () => {
    process.env.IS_OFFLINE = undefined;
    const config = buildConfig();

    expect(config).toEqual({ region: 'eu-central-1' });
  });
});
