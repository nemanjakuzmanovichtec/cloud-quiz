import { APIGatewayProxyHandler } from '@application/types';
import { OK } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('$default route triggered', event);

  return OK({ message: 'Action value does not match any route keys' });
};

export const main = withApiHooks(handler);
