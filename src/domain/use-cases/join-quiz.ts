import { notifyPlayers } from '@domain/use-cases';
import { makeConnection } from '@domain/entities/connection';
import { IConnectionRepo } from '@infrastructure/repository/connection-db';

interface Dependencies {
  connectionDb: IConnectionRepo;
  notifyPlayers: typeof notifyPlayers;
}

interface JoinQuizInput {
  connectionId: string;
  quizId: string;
}

export const makeJoinQuizCommand = ({
  connectionDb,
  notifyPlayers,
}: Dependencies) => {
  const execute = async (input: JoinQuizInput) => {
    console.log('makeJoinQuizCommand.execute', input);

    const entity = makeConnection({ ...input, roomId: input.quizId });
    const connection = await connectionDb.save(entity);

    const { roomId, connectionId } = connection;

    const connectionData = { myConnectionId: connectionId, quizId: roomId };
    const payload = { message: `Player ${connectionId} has joined` };

    await notifyPlayers(connectionData, payload);

    return connection;
  };

  return { execute };
};
