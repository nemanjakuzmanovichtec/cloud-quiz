import { IConnectionRepo } from '@infrastructure/repository/connection-db';
import { IWSClient } from '@infrastructure/websocket/types';
import { AnyObj } from '@utils/types';

interface Dependencies {
  connectionDb: IConnectionRepo;
  WSClient: IWSClient;
}

export const makeNotifyPlayers = ({ connectionDb, WSClient }: Dependencies) => {
  const notifyPlayers = async (quizId: string, payload: AnyObj) => {
    console.log('makeNotifyPlayers.notifyPlayers', { quizId, payload });

    if (!quizId) {
      throw new Error('Must supply quizId');
    }

    const connections = await connectionDb.findByRoomId(quizId);
    const connectionIds = connections.map((conn) => conn.connectionId);

    return WSClient.broadcast(connectionIds, payload);
  };

  return notifyPlayers;
};
