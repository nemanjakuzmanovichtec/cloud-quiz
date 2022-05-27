import { mock, MockProxy } from 'jest-mock-extended';
import { IWSClient } from '@infrastructure/websocket/types';

import { makeNotifyPlayer } from './notify-player';

describe('notify a player', () => {
  let WSClientMock: MockProxy<IWSClient>;

  // System under test
  let sut;

  beforeEach(() => {
    WSClientMock = mock<IWSClient>();

    sut = makeNotifyPlayer({ WSClient: WSClientMock });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sends message to a single player', async () => {
    const connectionId = '1234';
    const payload = { message: 'test-message' };

    await sut(connectionId, payload);

    expect(WSClientMock.send).toBeCalledWith(connectionId, payload);
  });
});
