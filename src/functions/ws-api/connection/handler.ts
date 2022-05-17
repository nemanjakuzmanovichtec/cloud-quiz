import { withApiHooks } from '@hooks/withApiHooks';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK, BAD_REQUEST } from '@libs/response';

import { connectionSchema as schema } from './schema';
import { QuizService } from '../../quiz-service';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { headers, requestContext } = event;
  const { routeKey, connectionId } = requestContext;
  const { quizId = 'test-quiz' } = headers;

  switch (routeKey) {
    case '$connect':
      QuizService.joinQuiz({ quizId, connectionId });
      break;
    case '$disconnect':
      QuizService.leaveQuiz({ quizId, connectionId });
      break;
    default:
      return BAD_REQUEST({ message: `RouteKey ${routeKey} not supported` });
  }

  return OK();
};

export const main = withApiHooks(handler, { schema });
