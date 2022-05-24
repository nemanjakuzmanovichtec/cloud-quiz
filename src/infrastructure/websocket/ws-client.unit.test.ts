import { mockClient } from 'aws-sdk-client-mock';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

import { makeWSClient } from './ws-client';
import { IWSClient } from './types';

describe('makeWSClient', () => {
  const clientMock = mockClient(new ApiGatewayManagementApiClient({}));
  let wsClient: IWSClient;

  beforeEach(() => {
    // @ts-ignore
    wsClient = makeWSClient({ client: clientMock });

    clientMock.reset();
  });

  it('send - should throw connection required error', async () => {
    try {
      await wsClient.send(null, {});
    } catch (error) {
      expect(error.message).toEqual('Recipient is required to send a message');
    }
  });

  it('send - should throw Websocket ERROR: Sending a message failed', async () => {
    const connectionId = '1234';
    const input = { ConnectionId: connectionId, Data: null };

    clientMock
      .on(PostToConnectionCommand, input)
      .rejects(new Error('mocked rejection'));

    try {
      await wsClient.send(connectionId, null);
    } catch (error) {
      expect(error.message).toEqual(
        `Websocket ERROR: Sending a message to recipient ${connectionId} failed`
      );
    }
  });

  it('sends message successfully', async () => {
    clientMock
      .on(PostToConnectionCommand)
      .resolves({ $metadata: { httpStatusCode: 204 } });

    const connectionId = '1234';
    const payload = { message: `Hello World` };

    const result = await wsClient.send(connectionId, payload);

    expect(result).toBe(undefined);
  });

  it('broadcasts message successfully', async () => {
    clientMock
      .on(PostToConnectionCommand)
      .resolves({ $metadata: { httpStatusCode: 204 } });

    const connectionIds = ['1234', '2345'];
    const payload = { message: `Hello World` };

    const result = await wsClient.broadcast(connectionIds, payload);

    expect(result).toBe(undefined);
  });
});
