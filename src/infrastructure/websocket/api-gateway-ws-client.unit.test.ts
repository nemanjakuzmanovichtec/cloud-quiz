import { buildConfig } from './api-gateway-ws-client';

describe('buildConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, WS_ENDPOINT: 'actualEndpoint' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return config with local endpoint', () => {
    process.env.IS_OFFLINE = 'true';

    const config = buildConfig();

    expect(config).toEqual({
      region: 'eu-central-1',
      endpoint: 'http://localhost:3001',
    });
  });

  it('should return config with actual endpoint', () => {
    process.env.IS_OFFLINE = undefined;

    const config = buildConfig();

    expect(config).toEqual({
      region: 'eu-central-1',
      endpoint: 'actualEndpoint',
    });
  });
});
