import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@mocks/@aws-sdk/client-apigatewaymanagementapi';

import {
  WSApiGatewayClient as WSClient,
  makeEndpoint,
} from './ws-api-gateway-client';

describe('makeWSClient', () => {
  let client: ApiGatewayManagementApiClient;

  beforeEach(() => {
    client = new ApiGatewayManagementApiClient({});
    jest.clearAllMocks();
  });

  it('sendToOne - should throw connection required error', async () => {
    try {
      await WSClient.sendToOne(null, {});
    } catch (error) {
      expect(error.message).toEqual(
        'connectionId is required to send a message'
      );
    }
  });

  it('sendToOne - should throw PostToConnectionCommand unsuccessful', async () => {
    const connectionId = '1234';

    try {
      await WSClient.sendToOne(connectionId, null);
    } catch (error) {
      expect(error.message).toEqual('PostToConnectionCommand unsuccessful');
    }
  });

  it('sendToOne - should send PostToConnectionCommand successfully', async () => {
    const connectionId = '1234';
    const payload = { message: `Hello World` };

    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify(payload)),
    });

    await WSClient.sendToOne(connectionId, payload);

    expect(command).toEqual(command);
    expect(client.send).toHaveBeenCalledWith(command);
  });

  it('sendToMany - should call sendToOne for each connectionId', async () => {
    const connectionIds = ['1234', '2345'];
    const payload = { message: `Hello World` };

    const response = await WSClient.sendToMany(connectionIds, payload);

    expect(response).toHaveLength(connectionIds.length);
  });
});

describe('makeEndpoint', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, WS_ENDPOINT: 'actualEndpoint' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return local endpoint', () => {
    process.env.IS_OFFLINE = 'true';
    const expectedResult = 'http://localhost:3001';

    const endpoint = makeEndpoint();

    expect(endpoint).toEqual(expectedResult);
  });

  it('should return actual endpoint', () => {
    process.env.IS_OFFLINE = undefined;
    const expectedResult = 'actualEndpoint';

    const endpoint = makeEndpoint();

    expect(endpoint).toEqual(expectedResult);
  });
});
