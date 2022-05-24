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
    console.log('makeJoinQuiz.joinQuiz', input, notifyPlayers);

    const entity = makeConnection({ ...input, roomId: input.quizId });
    const connection = await connectionDb.save(entity);
    const { roomId, connectionId } = connection;

    await notifyPlayers(roomId, {
      message: `Player ${connectionId} has joined`,
    });

    return connection;
  };

  return joinQuiz;
};
