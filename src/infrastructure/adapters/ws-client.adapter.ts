import { AnyObj } from '@utils/types';
import { WSClient } from '@infrastructure/websocket/types';
import { WSApiGatewayClient } from '@infrastructure/websocket/ws-api-gateway-client';

interface Deps {
  client: typeof WSApiGatewayClient;
}

export const makeWSApiGatewayClientAdapter = ({ client }: Deps): WSClient => {
  const send = async (to: string, payload: AnyObj) => {
    client.sendToOne(to, payload);
  };

  const broadcast = async (to: string[], payload: AnyObj) => {
    client.sendToMany(to, payload);
  };

  return { send, broadcast };
};
