import { withApiHooks } from '@hooks/withApiHooks';
import { APIGatewayProxyHandler } from '@libs/types';
import { OK, BAD_REQUEST } from '@libs/response';
import { QuizService } from '@services/quiz-service';

import { connectionSchema as schema } from './schema';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { routeKey, connectionId } = event.requestContext;
  const quizId = 'test-quiz';

  switch (routeKey) {
    case '$connect':
      await QuizService.joinQuiz({ quizId, connectionId });
      break;
    case '$disconnect':
      await QuizService.leaveQuiz({ quizId, connectionId });
      break;
    default:
      return BAD_REQUEST({ message: `RouteKey ${routeKey} not supported` });
  }

  return OK();
};

export const main = withApiHooks(handler, { schema });
