import { withApiHooks } from '@hooks/withApiHooks';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK } from '@libs/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('$default route triggered', event);

  return OK({ message: 'Action value does not match any route keys' });
};

export const main = withApiHooks(handler);
