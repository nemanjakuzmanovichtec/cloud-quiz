import { handlerPath } from '@libs/handler-resolver';
import { APIGatewayFunction } from '@libs/types';

export const defaultHandler: APIGatewayFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      websocket: {
        route: '$default',
        routeResponseSelectionExpression: '$default',
      },
    },
  ],
};
