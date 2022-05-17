import { withApiHooks } from '@hooks/withApiHooks';
import { DynamoDB } from '@libs/dynamoDB';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK, BAD_REQUEST } from '@libs/response';
import { addHoursToDate, getSecondsSinceEpoch } from '@utils/dateUtils';

import { connectionSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { routeKey, connectionId } = event.requestContext;

  const connectionData = {
    roomId: 'test-room',
    connectionId,
    createdAt: Date.now(),
    TTL: getSecondsSinceEpoch(addHoursToDate(new Date(), 2)),
  };

  switch (routeKey) {
    case '$connect':
      // add conn to DB
      // TODO - hide implementation
      await DynamoDB.write({
        data: connectionData,
        tableName: process.env.ConnectionsTable,
      });

      console.log('Client connected', { connectionId });

      break;
    case '$disconnect':
      // remove conn from DB
      // TODO - hide implementation
      await DynamoDB.remove({
        hashKey: 'connectionId',
        hashValue: connectionId,
        rangeKey: 'roomId',
        rangeValue: 'test-room',
        tableName: process.env.ConnectionsTable,
      });

      console.log('Client disconnected', { connectionId });

      break;
    default:
      return BAD_REQUEST({ message: `RouteKey ${routeKey} not supported` });
  }

  return OK();
};

export const main = withApiHooks(handler, { schema });
