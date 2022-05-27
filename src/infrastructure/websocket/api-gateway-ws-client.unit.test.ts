import { mockClient } from 'aws-sdk-client-mock';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

import {
  ApiGatewayWSClient,
  buildConfig,
  makeApiGatewayWSClient,
} from './api-gateway-ws-client';

describe('api gateway client', () => {
  const apiGWClientMock = mockClient(new ApiGatewayManagementApiClient({}));

  // System under test
  let sut: typeof ApiGatewayWSClient;

  beforeEach(() => {
    // @ts-ignore
    sut = makeApiGatewayWSClient({ apiGatewayClient: apiGWClientMock });

    apiGWClientMock.reset();
  });

  it('PostConnectionCommand fails', async () => {
    apiGWClientMock.on(PostToConnectionCommand).rejects();

    const ConnectionId = '1234';
    const Data = Buffer.from('hello');

    const output = await sut.postToConnection(ConnectionId, Data);

    expect(output).toBe(undefined);
  });

  it('PostConnectionCommand sent successfully', async () => {
    apiGWClientMock
      .on(PostToConnectionCommand)
      .resolves({ $metadata: { httpStatusCode: 204 } });

    const ConnectionId = '1234';
    const Data = Buffer.from('hello');

    const output = await sut.postToConnection(ConnectionId, Data);

    expect(output).toMatchObject({ $metadata: { httpStatusCode: 204 } });
  });

  it('serialize payload', () => {
    const payload = { message: 'hello' };
    const expectedResult = [
      123, 34, 109, 101, 115, 115, 97, 103, 101, 34, 58, 34, 104, 101, 108, 108,
      111, 34, 125,
    ];

    const serializedPayload = sut.serializePayload(payload);

    expect(new Set(serializedPayload)).toEqual(new Set(expectedResult));
  });
});

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
