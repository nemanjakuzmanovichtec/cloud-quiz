import { IWSClient } from '@infrastructure/websocket/types';
import { AnyObj } from '@utils/types';

interface Dependencies {
  WSClient: IWSClient;
}

export const makeNotifyPlayer = ({ WSClient }: Dependencies) => {
  const notifyPlayer = async (connectionId: string, payload: AnyObj) => {
    console.log('makeNotifyPlayer.notifyPlayer', payload);

    await WSClient.send(connectionId, payload);
  };

  return notifyPlayer;
};
