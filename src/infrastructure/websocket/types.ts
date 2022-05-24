import { AnyObj } from '@utils/types';

export interface IWSClient {
  send: (recipient: string, payload: AnyObj) => Promise<void>;
  broadcast: (recipients: string[], payload: AnyObj) => Promise<void>;
}
