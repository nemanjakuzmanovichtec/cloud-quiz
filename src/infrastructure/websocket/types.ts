import { AnyObj } from '@utils/types';

export interface WSClientResponse {
  statusCode: number;
}

export interface IWSClient {
  send: (recipient: string, payload: AnyObj) => Promise<WSClientResponse>;
  broadcast: (
    recipients: string[],
    payload: AnyObj
  ) => Promise<WSClientResponse[]>;
}
