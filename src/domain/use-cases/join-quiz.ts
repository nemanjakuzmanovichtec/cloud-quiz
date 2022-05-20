import { notifyPlayers } from '@domain/use-cases';
import { makeConnection } from '@domain/entities/connection';
import { ConnectionDb } from '@data-access/connection-db';

interface Dependencies {
  connectionDb: ConnectionDb;
  notifyPlayers: typeof notifyPlayers;
}

interface JoinQuizInput {
  connectionId: string;
  quizId: string;
}

export const makeJoinQuiz = ({ connectionDb, notifyPlayers }: Dependencies) => {
  const joinQuiz = async (input: JoinQuizInput) => {
    console.log('makeJoinQuiz.joinQuiz', input);

    const { connectionId, quizId } = input;
    const entity = makeConnection({ connectionId, roomId: quizId });

    const connection = await connectionDb.save(entity);
    await notifyPlayers(quizId, {
      message: `Player ${connectionId} has joined`,
    });

    return connection;
  };

  return joinQuiz;
};
