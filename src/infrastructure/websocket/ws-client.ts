import { AnyObj } from '@utils/types';
import { ApiGatewayWSClient } from './api-gateway-ws-client';

import { IWSClient } from './types';

interface Dependencies {
  client: typeof ApiGatewayWSClient;
}

export const makeWSClient = ({ client }: Dependencies): IWSClient => {
  const send = async (
    recipient: string,
    payload: AnyObj
  ): Promise<{ statusCode: number }> => {
    console.log('WSClient.send', { recipient, payload });

    if (!recipient) {
      throw new Error('Recipient is required to send a message');
    }

    const data = client.serializePayload(payload);
    const result = await client.postToConnection(recipient, data);

    return { statusCode: result.$metadata.httpStatusCode };
  };

  const broadcast = async (
    recipients: string[],
    payload: AnyObj
  ): Promise<{ statusCode: number }> => {
    console.log('WSClient.broadcast', { recipients, payload });

    const data = client.serializePayload(payload);

    const promises = recipients.map((recipient) =>
      client.postToConnection(recipient, data)
    );

    await Promise.all(promises);

    return { statusCode: 204 };
  };

  return { send, broadcast };
};
