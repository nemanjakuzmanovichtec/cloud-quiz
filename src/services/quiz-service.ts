import { WSClient } from '@libs/ws-client';
import { ConnectionPersistance } from '@persistence/connection-persistance';

interface QuizServiceDependencies {
  WSClient: typeof WSClient;
  ConnectionPersistance: typeof ConnectionPersistance;
}
interface ConnectionInput {
  quizId: string;
  connectionId: string;
}

const makeQuizService = ({
  WSClient,
  ConnectionPersistance,
}: QuizServiceDependencies) => {
  const joinQuiz = async (input: ConnectionInput) => {
    console.log('QuizService.joinQuiz', input);

    const { connectionId, quizId } = input;

    await ConnectionPersistance.save({ connectionId, roomId: quizId });
    await notifyAllPlayers({ message: `Player ${connectionId} has joined` });
  };

  const leaveQuiz = async (input: ConnectionInput) => {
    console.log('QuizService.leaveQuiz', input);

    const { connectionId, quizId } = input;

    await ConnectionPersistance.remove({ connectionId, roomId: quizId });
    await notifyAllPlayers({ message: `Player ${connectionId} has left` });
  };

  const notifyAllPlayers = async (payload: Record<string, unknown>) => {
    console.log('QuizService.notifyAllPlayers', payload);

    const players = [];

    // TODO - implement fetch all connections with roomId

    await WSClient.sendToMany(players, payload);
  };

  return { joinQuiz, leaveQuiz };
};

const QuizService = makeQuizService({ WSClient, ConnectionPersistance });

export { QuizService };
