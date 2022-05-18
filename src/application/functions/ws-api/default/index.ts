import { LambdaFunction } from '@application/types';
import { handlerPath } from '@application/helpers/handler-resolver';

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
