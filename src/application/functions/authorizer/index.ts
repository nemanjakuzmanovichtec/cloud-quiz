import { handlerPath } from '@application/helpers/handler-resolver';
import { LambdaFunction } from '@application/types';

export const authorizerHandler: LambdaFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    USER_POOL_ID: { Ref: 'CognitoUserPool' },
    APP_CLIENT_ID: { Ref: 'CognitoUserPoolClient' },
  },
};
