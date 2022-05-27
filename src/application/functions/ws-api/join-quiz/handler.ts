import { APIGatewayProxyHandler } from '@application/types';
import { OK } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';
import { JoinQuizCommand } from '@domain/use-cases';

import { JoinQuizBody, joinQuizSchema } from './schema';

export const handler: APIGatewayProxyHandler<JoinQuizBody> = async (event) => {
  const { quizId } = event.body;
  const { connectionId } = event.requestContext;

  await JoinQuizCommand.execute({ connectionId, quizId });

  return OK({
    message: `Player with connectionId ${connectionId} join the quiz`,
  });
};

export const main = withApiHooks(handler, { schema: joinQuizSchema });
