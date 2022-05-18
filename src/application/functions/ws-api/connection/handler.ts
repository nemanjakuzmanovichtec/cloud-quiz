import { APIGatewayProxyHandler } from '@application/types';
import { OK, BAD_REQUEST } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';
import { joinQuiz, leaveQuiz } from '@domain/use-cases';

import { connectionSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { routeKey, connectionId } = event.requestContext;
  const quizId = 'test-quiz';

  switch (routeKey) {
    case '$connect':
      await joinQuiz({ quizId, connectionId });
      break;
    case '$disconnect':
      await leaveQuiz({ quizId, connectionId });
      break;
    default:
      return BAD_REQUEST({ message: `RouteKey ${routeKey} not supported` });
  }

  return OK();
};

export const main = withApiHooks(handler, { schema });
