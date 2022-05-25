import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  PostToConnectionCommandInput,
  PostToConnectionCommandOutput,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { AnyObj } from '@utils/types';

import { IWSClient } from './types';

interface Dependencies {
  client: ApiGatewayManagementApiClient;
}

export const makeWSClient = ({ client }: Dependencies): IWSClient => {
  const send = async (
    recipient: string,
    payload: AnyObj
  ): Promise<PostToConnectionCommandOutput> => {
    console.log('WSClient.send', { recipient, payload });

    if (!recipient) {
      throw new Error('Recipient is required to send a message');
    }

    const input: PostToConnectionCommandInput = {
      ConnectionId: recipient,
      Data: Buffer.from(JSON.stringify(payload)),
    };

    const command = new PostToConnectionCommand(input);

    try {
      console.log('Executing PostToConnectionCommand with:', input);

      const output = await client.send(command);

      console.log('PostToConnectionCommand executed successfully:', output);

      return output;
    } catch (error) {
      console.error('Websocket ERROR:', error);
      throw new Error(
        `Websocket ERROR: Sending a message to recipient ${recipient} failed`
      );
    }
  };

  const broadcast = async (
    recipients: string[],
    payload: AnyObj
  ): Promise<void> => {
    console.log('WSClient.broadcast', { recipients, payload });

    recipients.forEach((recipient) => send(recipient, payload));
  };

  return { send, broadcast };
};
