import { handlerPath } from '@libs/handler-resolver';
import { APIGatewayFunction } from '@libs/types';

export const connectionHandler: APIGatewayFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    { websocket: { route: '$connect' } },
    { websocket: { route: '$disconnect' } },
  ],
};
