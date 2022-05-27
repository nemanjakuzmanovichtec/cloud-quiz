import { mock, MockProxy } from 'jest-mock-extended';
import { IConnectionRepo } from '@infrastructure/repository/connection-db';

import { makeJoinQuizCommand } from './join-quiz';
import { JoinQuizCommand, notifyPlayers } from '.';

describe('join quiz', () => {
  let connectionDbMock: MockProxy<IConnectionRepo>;
  let notifyPlayersMock: MockProxy<typeof notifyPlayers>;

  // System under test
  let sut: typeof JoinQuizCommand;

  beforeEach(() => {
    connectionDbMock = mock<IConnectionRepo>();
    notifyPlayersMock = jest.fn();

    sut = makeJoinQuizCommand({
      connectionDb: connectionDbMock,
      notifyPlayers: notifyPlayersMock,
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('A new player joins the quiz', async () => {
    const resolved = {
      connectionId: '1234',
      roomId: 'test-quiz',
      createdAt: 123456789,
      TTL: 123456,
    };
    connectionDbMock.save.mockResolvedValue(resolved);
    const input = { connectionId: '1234', quizId: 'test-quiz' };

    const result = await sut.execute(input);

    expect(notifyPlayersMock).toBeCalledWith(
      { myConnectionId: resolved.connectionId, quizId: resolved.roomId },
      { message: `Player ${resolved.connectionId} has joined` }
    );
    expect(result).toMatchObject({
      connectionId: input.connectionId,
      roomId: input.quizId,
    });
  });
});
