import { withApiHooks } from '@hooks/withApiHooks';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK } from '@libs/response';
import { WSClient } from '@libs/ws-client';

import { HelloBody, helloSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler<HelloBody> = async (event) => {
  const { connectionId } = event.requestContext;
  const { name = 'World' } = event.body;

  await WSClient.sendToOne(connectionId, { message: `Hello ${name}` });

  return OK();
};

export const main = withApiHooks(handler, { schema });
