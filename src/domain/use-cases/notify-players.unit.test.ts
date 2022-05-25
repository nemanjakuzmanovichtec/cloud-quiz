import { mock, MockProxy } from 'jest-mock-extended';
import { IWSClient } from '@infrastructure/websocket/types';
import { IConnectionRepo } from '@infrastructure/repository/connection-db';

import { makeNotifyPlayers } from './notify-players';
import { notifyPlayer } from '.';

describe('notify many players', () => {
  let connectionDbMock: MockProxy<IConnectionRepo>;
  let WSClientMock: MockProxy<IWSClient>;

  // System under test
  let sut: typeof notifyPlayer;

  beforeEach(() => {
    connectionDbMock = mock<IConnectionRepo>();
    WSClientMock = mock<IWSClient>();

    sut = makeNotifyPlayers({
      connectionDb: connectionDbMock,
      WSClient: WSClientMock,
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('must supply quizId', async () => {
    const quizId = undefined;
    const payload = { message: 'test-message' };

    try {
      await sut(quizId, payload);
    } catch (error) {
      expect(error.message).toEqual('Must supply quizId');
    }
  });

  it('finds players of a specific quiz & sends message to all of them', async () => {
    const resolved = [
      { roomId: 'test-quiz', connectionId: '1234' },
      { roomId: 'test-quiz', connectionId: '12345' },
    ];
    connectionDbMock.findByRoomId.mockResolvedValue(resolved);

    const quizId = 'test-quiz';
    const payload = { message: 'test-message' };

    await sut(quizId, payload);

    expect(connectionDbMock.findByRoomId).toBeCalledWith(quizId);
    expect(WSClientMock.broadcast).toBeCalledWith(['1234', '12345'], payload);
  });
});
