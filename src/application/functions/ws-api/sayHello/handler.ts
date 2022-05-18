import { APIGatewayProxyHandler } from '@application/types';
import { OK } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';
import { notifyPlayer } from '@domain/use-cases';

import { HelloBody, helloSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler<HelloBody> = async (event) => {
  const { connectionId } = event.requestContext;
  const { name = 'World' } = event.body;

  await notifyPlayer(connectionId, { message: `Hello ${name}` });

  return OK();
};

export const main = withApiHooks(handler, { schema });
