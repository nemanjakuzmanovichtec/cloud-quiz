import { handlerPath } from '@libs/handler-resolver';
import { LambdaFunction } from '@libs/types';

type CustomCognitoAuthorizer =
  | string
  | { name: string; arn: string | { 'Fn::GetAtt': string[] } };

const authorizer: CustomCognitoAuthorizer = {
  name: 'custom-cognito-authorizer',
  arn: { 'Fn::GetAtt': ['AuthorizerHandlerLambdaFunction', 'Arn'] },
};

export const connectionHandler: LambdaFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    { websocket: { route: '$connect', authorizer } },
    { websocket: { route: '$disconnect' } },
  ],
};
