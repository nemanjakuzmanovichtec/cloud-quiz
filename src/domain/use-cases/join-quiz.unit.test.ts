import { mock, MockProxy } from 'jest-mock-extended';
import { IConnectionRepo } from '@infrastructure/repository/connection-db';

import { makeJoinQuiz } from './join-quiz';
import { joinQuiz, notifyPlayers } from '.';

describe('join quiz', () => {
  let connectionDbMock: MockProxy<IConnectionRepo>;
  let notifyPlayersMock: MockProxy<typeof notifyPlayers>;

  // System under test
  let sut: typeof joinQuiz;

  beforeEach(() => {
    connectionDbMock = mock<IConnectionRepo>();
    notifyPlayersMock = jest.fn();

    sut = makeJoinQuiz({
      connectionDb: connectionDbMock,
      notifyPlayers: notifyPlayersMock,
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('saves connection entity to the db', async () => {
    const resolved = {
      connectionId: '1234',
      roomId: 'test-quiz',
      createdAt: 123456789,
      TTL: 123456,
    };
    connectionDbMock.save.mockResolvedValue(resolved);
    const input = { connectionId: '1234', quizId: 'test-quiz' };

    const result = await sut(input);

    expect(notifyPlayersMock).toBeCalledWith(resolved.roomId, {
      message: `Player ${resolved.connectionId} has joined`,
    });
    expect(result).toMatchObject({
      connectionId: input.connectionId,
      roomId: input.quizId,
    });
  });
});
