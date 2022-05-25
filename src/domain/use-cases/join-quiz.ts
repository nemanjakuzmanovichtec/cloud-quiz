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

export const makeJoinQuiz = ({ connectionDb, notifyPlayers }: Dependencies) => {
  const joinQuiz = async (input: JoinQuizInput) => {
    console.log('makeJoinQuiz.joinQuiz', input);

    const entity = makeConnection({ ...input, roomId: input.quizId });
    const connection = await connectionDb.save(entity);

    const { roomId, connectionId } = connection;

    const connectionData = { myConnectionId: connectionId, quizId: roomId };
    const payload = { message: `Player ${connectionId} has joined` };

    await notifyPlayers(connectionData, payload);

    return connection;
  };

  return joinQuiz;
};
