import { LambdaFunctionWithIam } from '@application/types';
import { handlerPath } from '@application/helpers/handler-resolver';

export const leaveQuizHandler: LambdaFunctionWithIam = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      websocket: {
        route: 'leaveQuiz',
        routeResponseSelectionExpression: '$default',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:DeleteItem'],
      Resource: { 'Fn::GetAtt': ['ConnectionsTable', 'Arn'] },
    },
  ],
};
