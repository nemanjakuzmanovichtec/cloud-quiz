import { makeConnectionDb } from '@data-access/connection-db';
import { DB } from '@infrastructure/db';
import { WSClient } from '@infrastructure/websocket';

import { makeJoinQuiz } from './join-quiz';
import { makeNotifyPlayers } from './notify-players';

describe('joinQuiz', () => {
  let connectionDb;
  let notifyPlayers;
  let joinQuiz;

  beforeAll(() => {
    connectionDb = makeConnectionDb({ DB });
    notifyPlayers = makeNotifyPlayers({ connectionDb, WSClient });
    joinQuiz = makeJoinQuiz({ connectionDb, notifyPlayers });
  });

  it('saves connection entity to the db', async () => {
    const input = { connectionId: '1234', quizId: 'test-quiz' };

    const result = await joinQuiz(input);

    expect(result).toMatchObject({
      connectionId: input.connectionId,
      roomId: input.quizId,
    });
  });
});
