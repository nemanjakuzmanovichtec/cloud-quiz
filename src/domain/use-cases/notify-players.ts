import { WSClient } from '@infrastructure/websocket/types';
import { connectionDb } from '@domain/data-access';
import { AnyObj } from '@utils/types';

interface Dependencies {
  connectionDb: typeof connectionDb;
  WSClient: WSClient;
}

export const makeNotifyPlayers = ({ WSClient }: Dependencies) => {
  const notifyPlayers = async (quizId: string, payload: AnyObj) => {
    console.log('makeNotifyPlayers.notifyPlayers', { quizId, payload });

    const players = [];

    // TODO - implement fetch all quizId players

    await WSClient.broadcast(players, payload);
  };

  return notifyPlayers;
};
