import { IConnectionRepo } from '@infrastructure/repository/connection-db';
import { IWSClient } from '@infrastructure/websocket/types';
import { AnyObj } from '@utils/types';

interface Dependencies {
  connectionDb: IConnectionRepo;
  WSClient: IWSClient;
}

interface ConnectionData {
  myConnectionId: string;
  quizId: string;
}

export const makeNotifyPlayers = ({ connectionDb, WSClient }: Dependencies) => {
  const notifyPlayers = async (
    connectionData: ConnectionData,
    payload: AnyObj
  ) => {
    console.log('makeNotifyPlayers.notifyPlayers', connectionData);

    const { quizId, myConnectionId } = connectionData;

    if (!quizId) {
      throw new Error('Must supply quizId');
    }

    const connections = await connectionDb.findByRoomId(quizId);
    const connectionIds = connections
      .map((conn) => conn.connectionId)
      .filter((connectionId) => connectionId != myConnectionId);

    return WSClient.broadcast(connectionIds, payload);
  };

  return notifyPlayers;
};
