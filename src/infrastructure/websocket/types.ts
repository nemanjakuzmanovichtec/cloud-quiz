import { PostToConnectionCommandOutput } from '@aws-sdk/client-apigatewaymanagementapi';
import { AnyObj } from '@utils/types';

export interface IWSClient {
  send: (
    recipient: string,
    payload: AnyObj
  ) => Promise<PostToConnectionCommandOutput>;
  broadcast: (recipients: string[], payload: AnyObj) => Promise<void>;
}
