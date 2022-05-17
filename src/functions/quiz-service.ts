import { DynamoDB } from '@libs/dynamoDB';
import { addHoursToDate, getSecondsSinceEpoch } from '@utils/dateUtils';
import { WSClient } from '../libs/ws-client';

interface ConnectionInput {
  quizId: string;
  connectionId: string;
}

const makeQuizService = ({ WSClient }) => {
  const joinQuiz = async (input: ConnectionInput) => {
    const { connectionId, quizId } = input;

    const twoHoursFromToday = addHoursToDate(new Date(), 2);
    const TTL = getSecondsSinceEpoch(twoHoursFromToday);
    const tableName = process.env.ConnectionsTable;

    const data = {
      connectionId,
      roomId: quizId,
      createdAt: Date.now(),
      TTL,
    };

    await DynamoDB.write({ data, tableName });
    await notifyAllPlayers({ message: `Player ${connectionId} has joined` });
  };

  const leaveQuiz = async (input: ConnectionInput) => {
    const { connectionId, quizId } = input;

    const tableName = process.env.ConnectionsTable;

    await DynamoDB.remove({
      hashKey: 'connectionId',
      hashValue: connectionId,
      rangeKey: 'roomId',
      rangeValue: quizId,
      tableName,
    });
    await notifyAllPlayers({ message: `Player ${connectionId} has left` });
  };

  const notifyAllPlayers = async (payload: Record<string, unknown>) => {
    const players = [];

    // TODO - implement fetch all connections with roomId

    await WSClient.sendToMany(players, payload);
  };

  return { joinQuiz, leaveQuiz };
};

const QuizService = makeQuizService({ WSClient });

export { QuizService };
