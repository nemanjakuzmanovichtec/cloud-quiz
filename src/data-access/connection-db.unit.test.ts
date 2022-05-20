import { DB } from '@infrastructure/db';
import { makeFakeConnection } from '@tests/fixtures/connection';

import { ConnectionDb, makeConnectionDb } from './connection-db';

describe('connection db', () => {
  let connectionDb: ConnectionDb;

  beforeEach(() => {
    connectionDb = makeConnectionDb({ DB });
  });

  it('save a connection', async () => {
    const timestamp = 1653035283875;
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => timestamp);

    const fakeEntity = makeFakeConnection();

    const result = await connectionDb.save(fakeEntity);

    expect(result).toMatchObject({
      ...fakeEntity,
      createdAt: timestamp,
      TTL: 1653042483,
    });
  });

  it('remove a connection', async () => {
    const fakeEntity = makeFakeConnection();

    await connectionDb.save(fakeEntity);
    const result = await connectionDb.remove(fakeEntity);

    expect(result).toMatchObject({ deletedCount: 1 });
  });
});
