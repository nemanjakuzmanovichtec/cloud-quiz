import { APIGatewayProxyHandler } from '@application/types';
import { OK } from '@application/helpers/response';
import { withApiHooks } from '@application/hooks/withApiHooks';
import { LeaveQuizCommand } from '@domain/use-cases';

import { LeaveQuizBody, leaveQuizSchema } from './schema';

export const handler: APIGatewayProxyHandler<LeaveQuizBody> = async (event) => {
  const { quizId } = event.body;
  const { connectionId } = event.requestContext;

  await LeaveQuizCommand.execute({ connectionId, quizId });

  return OK({
    message: `Player with connectionId ${connectionId} left the quiz`,
  });
};

export const main = withApiHooks(handler, { schema: leaveQuizSchema });
