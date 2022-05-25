import { AnyObj } from '@utils/types';

export interface IWSClient {
  send: (recipient: string, payload: AnyObj) => Promise<{ statusCode: number }>;
  broadcast: (
    recipients: string[],
    payload: AnyObj
  ) => Promise<{ statusCode: number }>;
}
