import { mock, MockProxy } from 'jest-mock-extended';
import { IConnectionRepo } from '@infrastructure/repository/connection-db';

import { makeLeaveQuizCommand } from './leave-quiz';
import { LeaveQuizCommand, notifyPlayers } from '.';

describe('leave quiz', () => {
  let connectionDbMock: MockProxy<IConnectionRepo>;
  let notifyPlayersMock: MockProxy<typeof notifyPlayers>;

  // System under test
  let sut: typeof LeaveQuizCommand;

  beforeEach(() => {
    connectionDbMock = mock<IConnectionRepo>();
    notifyPlayersMock = jest.fn();

    sut = makeLeaveQuizCommand({
      connectionDb: connectionDbMock,
      notifyPlayers: notifyPlayersMock,
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('must supply connectionId', async () => {
    const input = { connectionId: undefined, quizId: 'test-quiz' };

    try {
      await sut.execute(input);
    } catch (error) {
      expect(error.message).toEqual('You must supply connectionId & quizId.');
    }
  });

  it('must supply quizId', async () => {
    const input = { connectionId: '1234', quizId: undefined };

    try {
      await sut.execute(input);
    } catch (error) {
      expect(error.message).toEqual('You must supply connectionId & quizId.');
    }
  });

  it('must supply both connectionId & quizId', async () => {
    const input = { connectionId: undefined, quizId: undefined };

    try {
      await sut.execute(input);
    } catch (error) {
      expect(error.message).toEqual('You must supply connectionId & quizId.');
    }
  });

  it('A player leaves the quiz', async () => {
    const input = { connectionId: '1234', quizId: 'test-quiz' };

    await sut.execute(input);

    expect(connectionDbMock.remove).toBeCalledWith({
      connectionId: input.connectionId,
      roomId: input.quizId,
    });
    expect(notifyPlayersMock).toBeCalledWith(
      { myConnectionId: input.connectionId, quizId: input.quizId },
      { message: `Player ${input.connectionId} has left` }
    );
  });
});
