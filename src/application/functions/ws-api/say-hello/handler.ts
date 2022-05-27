import { APIGatewayProxyHandler } from '@application/types';
import { OK } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';

import { HelloBody, helloSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler<HelloBody> = async (event) => {
  const { name = 'World' } = event.body;

  return OK({ message: `Hello ${name}` });
};

export const main = withApiHooks(handler, { schema });
