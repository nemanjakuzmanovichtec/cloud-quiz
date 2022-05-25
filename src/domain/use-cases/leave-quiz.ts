import { notifyPlayers } from '@domain/use-cases';
import { connectionDb } from '@infrastructure/repository';

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

    const connectionData = { myConnectionId: connectionId, quizId };
    const payload = { message: `Player ${connectionId} has left` };
    await notifyPlayers(connectionData, payload);
  };

  return leaveQuiz;
};
