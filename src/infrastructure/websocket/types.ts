import { AnyObj } from '@utils/types';

export interface WSClient {
  send: (to: string, payload: AnyObj) => Promise<AnyObj | void>;
  broadcast: (to: string[], payload: AnyObj) => Promise<AnyObj | void>;
}
