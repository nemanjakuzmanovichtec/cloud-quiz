import { withApiHooks } from '@hooks/withApiHooks';
import { DynamoUtils } from '@libs/dynamoDB-client';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK, BAD_REQUEST } from '@libs/response';

import { connectionSchema as schema } from './schema';

const addHoursToDate = (date: Date, hours: number): Date => {
  return new Date(new Date(date).setUTCHours(date.getUTCHours() + hours));
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { routeKey, connectionId } = event.requestContext;

  const connectionData = {
    roomId: 'test-room',
    connectionId,
    createdAt: Date.now(),
    TTL: addHoursToDate(new Date(), 2).getTime(),
  };

  switch (routeKey) {
    case '$connect':
      // add conn to DB
      // TODO - hide implementation
      await DynamoUtils.write({
        data: connectionData,
        tableName: process.env.ConnectionsTable,
      });

      console.log('Client connected', { connectionId });

      break;
    case '$disconnect':
      // remove conn from DB
      // TODO - hide implementation
      await DynamoUtils.delete({
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
