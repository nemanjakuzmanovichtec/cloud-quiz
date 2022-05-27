import { handlerPath } from '@application/helpers/handler-resolver';
import { LambdaFunction } from '@application/types';

export const sayHelloHandler: LambdaFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      websocket: {
        route: 'sayHello',
        routeResponseSelectionExpression: '$default',
      },
    },
  ],
};
