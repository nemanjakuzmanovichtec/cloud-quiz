import { WSClient } from '@infrastructure/websocket/types';
import { AnyObj } from '@utils/types';

interface Dependencies {
  WSClient: WSClient;
}

export const makeNotifyPlayer = ({ WSClient }: Dependencies) => {
  const notifyPlayer = async (playerId: string, payload: AnyObj) => {
    console.log('makeNotifyPlayer.notifyPlayer', payload);

    await WSClient.send(playerId, payload);
  };

  return notifyPlayer;
};
