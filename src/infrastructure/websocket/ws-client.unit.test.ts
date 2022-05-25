import { mock, MockProxy } from 'jest-mock-extended';

import { makeWSClient } from './ws-client';
import { ApiGatewayWSClient } from './api-gateway-ws-client';
import { IWSClient } from './types';

describe('makeWSClient', () => {
  let clientMock: MockProxy<typeof ApiGatewayWSClient>;
  let sut: IWSClient;

  beforeEach(() => {
    clientMock = mock<typeof ApiGatewayWSClient>();

    // System under test
    sut = makeWSClient({ client: clientMock });

    jest.resetAllMocks();
  });

  it('throws recipient required error', async () => {
    try {
      await sut.send(null, {});
    } catch (error) {
      expect(error.message).toEqual('Recipient is required to send a message');
    }
  });

  it('sends message successfully', async () => {
    clientMock.postToConnection.mockResolvedValue({
      $metadata: { httpStatusCode: 204 },
    });

    const recipient = '1234';
    const payload = { message: `Hello World` };

    const result = await sut.send(recipient, payload);

    expect(result).toMatchObject({ statusCode: 204 });
  });

  it('broadcasts message successfully', async () => {
    clientMock.postToConnection.mockResolvedValue({
      $metadata: { httpStatusCode: 204 },
    });

    const recipients = ['1234', '2345'];
    const payload = { message: `Hello World` };

    const result = await sut.broadcast(recipients, payload);

    expect(clientMock.postToConnection).toBeCalledTimes(recipients.length);
    expect(result).toMatchObject({ statusCode: 204 });
  });
});
