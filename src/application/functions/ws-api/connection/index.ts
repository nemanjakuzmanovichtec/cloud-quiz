import { LambdaFunctionWithIam } from '@application/types';
import { handlerPath } from '@application/helpers/handler-resolver';

// type CustomCognitoAuthorizer =
//   | string
//   | { name: string; arn: string | { 'Fn::GetAtt': string[] } };

// const authorizer: CustomCognitoAuthorizer = {
//   name: 'custom-cognito-authorizer',
//   arn: { 'Fn::GetAtt': ['AuthorizerHandlerLambdaFunction', 'Arn'] },
// };

export const connectionHandler: LambdaFunctionWithIam = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    { websocket: { route: '$connect' } },
    { websocket: { route: '$disconnect' } },
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:PutItem', 'dynamodb:DeleteItem'],
      Resource: { 'Fn::GetAtt': ['ConnectionsTable', 'Arn'] },
    },
  ],
};
