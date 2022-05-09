import { withApiHooks } from '@hooks/withApiHooks';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK, BAD_REQUEST } from '@libs/response';

import { connectionSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { routeKey, connectionId } = event.requestContext;

  switch (routeKey) {
    case '$connect':
      // add conn to DB
      console.log('Client connected', { connectionId });
      break;
    case '$disconnect':
      // remove conn from DB
      console.log('Client disconnected', { connectionId });
      break;
    default:
      return BAD_REQUEST({ message: `RouteKey ${routeKey} not supported` });
  }

  return OK();
};

export const main = withApiHooks(handler, { schema });
