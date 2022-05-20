import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  PostToConnectionCommandOutput,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { AnyObj } from '@utils/types';

import { IWSClient } from './types';

interface Dependencies {
  client: ApiGatewayManagementApiClient;
}

export const makeWSClient = ({ client }: Dependencies): IWSClient => {
  console.log('makeWSClient CALLED');

  const send = async (recipient: string, payload: AnyObj) => {
    console.log('WSClient.send', { recipient, payload });

    if (!recipient) {
      throw new Error('Recipient is required to send a message');
    }

    try {
      const output = await apiGWSend(recipient, payload);

      return { statusCode: output.$metadata.httpStatusCode };
    } catch (error) {
      console.error('Websocket ERROR:', error);
      throw new Error('Websocket ERROR: Sending a message failed');
    }
  };

  const broadcast = async (recipients: string[], payload: AnyObj) => {
    console.log('WSClient.broadcast', { recipients, payload });

    const all = recipients.map((recipient) => send(recipient, payload));

    return Promise.all(all);
  };

  const apiGWSend = async (
    connectionId: string,
    payload: AnyObj
  ): Promise<PostToConnectionCommandOutput> => {
    const params = {
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify(payload)),
    };

    const command = new PostToConnectionCommand(params);

    return client.send(command);
  };

  return { send, broadcast };
};
