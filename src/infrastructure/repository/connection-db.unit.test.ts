import { mock, MockProxy } from 'jest-mock-extended';
import { makeFakeConnection } from '@tests/fixtures/connection';

import { IConnectionRepo, makeConnectionDb } from './connection-db';
import { IDynamoDBRepo } from './ddb-base-repository';

describe('connection db', () => {
  let mockRepo: MockProxy<IDynamoDBRepo>;
  let connectionDb: IConnectionRepo;

  beforeEach(() => {
    mockRepo = mock<IDynamoDBRepo>();
    connectionDb = makeConnectionDb({ repository: mockRepo });
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

    await connectionDb.remove(fakeEntity);

    expect(mockRepo.remove).toBeCalled();
  });
});
