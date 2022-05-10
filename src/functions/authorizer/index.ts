import { handlerPath } from '@libs/handler-resolver';
import { LambdaFunction } from '@libs/types';

export const authorizerHandler: LambdaFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
};
