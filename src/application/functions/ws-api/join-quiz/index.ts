import { LambdaFunctionWithIam } from '@application/types';
import { handlerPath } from '@application/helpers/handler-resolver';

export const joinQuizHandler: LambdaFunctionWithIam = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      websocket: {
        route: 'joinQuiz',
        routeResponseSelectionExpression: '$default',
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:PutItem'],
      Resource: { 'Fn::GetAtt': ['ConnectionsTable', 'Arn'] },
    },
  ],
};
