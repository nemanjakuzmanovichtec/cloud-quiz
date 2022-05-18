import { notifyPlayers } from '@domain/use-cases';
import { connectionDb } from 'src/data-access';

interface Dependencies {
  connectionDb: typeof connectionDb;
  notifyPlayers: typeof notifyPlayers;
}

interface LeaveQuizInput {
  connectionId: string;
  quizId: string;
}

export const makeLeaveQuiz = ({
  connectionDb,
  notifyPlayers,
}: Dependencies) => {
  const leaveQuiz = async (input: LeaveQuizInput) => {
    console.log('QuizService.leaveQuiz', input);

    const { connectionId, quizId } = input;

    if (!connectionId || !quizId) {
      throw new Error('You must supply connectionId & quizId.');
    }

    await connectionDb.remove({ connectionId, roomId: quizId });
    await notifyPlayers(quizId, { message: `Player ${connectionId} has left` });
  };

  return leaveQuiz;
};
