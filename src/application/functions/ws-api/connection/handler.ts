import { APIGatewayProxyHandler } from '@application/types';
import { OK, BAD_REQUEST } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';

import { connectionSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { routeKey, connectionId } = event.requestContext;

  switch (routeKey) {
    case '$connect':
      return OK({ message: `${connectionId} connected` });
    case '$disconnect':
      return OK({ message: `${connectionId} disconnected` });
    default:
      return BAD_REQUEST({ message: `RouteKey ${routeKey} not supported` });
  }
};

export const main = withApiHooks(handler, { schema });
