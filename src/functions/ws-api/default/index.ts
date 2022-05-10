import { handlerPath } from '@libs/handler-resolver';
import { LambdaFunction } from '@libs/types';

export const defaultHandler: LambdaFunction = {
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
