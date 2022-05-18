import { notifyPlayers } from '@domain/use-cases';
import { connectionDb } from '@domain/data-access';
import { makeConnection } from '@domain/entities/connection';

interface Dependencies {
  connectionDb: typeof connectionDb;
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

    await connectionDb.save(entity);
    await notifyPlayers(quizId, {
      message: `Player ${connectionId} has joined`,
    });
  };

  return joinQuiz;
};
