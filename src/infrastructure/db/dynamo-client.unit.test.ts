import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { makeDynamoDb } from './dynamo-client';
import { IDatabase } from './types';

describe('DynamoDb', () => {
  const clientMock = mockClient(DynamoDBDocumentClient);
  let db: IDatabase;

  beforeEach(() => {
    // @ts-ignore
    db = makeDynamoDb({ client: clientMock });

    clientMock.reset();
  });

  describe('findOne', () => {
    const whereCond = {
      primaryKey: 'connectionId',
      primaryKeyValue: 'SXd3xfE-FiACF1g=',
      secondaryKey: 'roomId',
      secondaryKeyValue: 'test-quiz',
    };
    const metadata = { tableName: 'ConnectionsTable' };

    it('should throw DB ERROR', async () => {
      clientMock.on(GetCommand).rejects(new Error());

      try {
        await db.findOne(whereCond, metadata);
      } catch (error) {
        expect(error.message).toEqual('DB ERROR - Failed to get item from DB');
      }
    });

    it('should return expected result', async () => {
      const resolvedValue = {
        Item: {
          connectionId: 'SXd3xfE-FiACF1g=',
          roomId: 'test-quiz',
          createdAt: 1652952229421,
        },
      };
      clientMock.on(GetCommand).resolves(resolvedValue);

      const { Item } = resolvedValue;

      const result = await db.findOne(whereCond, metadata);

      expect(result).toMatchObject(Item);
    });
  });

  describe('save', () => {
    const data = {};
    const metadata = { tableName: 'ConnectionsTable' };

    it('should throw DB ERROR - Failed to write to DB', async () => {
      clientMock.on(PutCommand).rejects(new Error());

      try {
        await db.save(data, metadata);
      } catch (error) {
        expect(error.message).toEqual('DB ERROR - Failed to write to DB');
      }
    });

    it('should return expected result', async () => {
      clientMock.on(PutCommand).resolves({});

      const result = await db.save(data, metadata);

      expect(result).toMatchObject(data);
    });
  });

  describe('remove', () => {
    const whereCond = {
      primaryKey: 'connectionId',
      primaryKeyValue: 'SXd3xfE-FiACF1g=',
      secondaryKey: 'roomId',
      secondaryKeyValue: 'test-quiz',
    };
    const metadata = { tableName: 'ConnectionsTable' };

    it('should throw DB ERROR - Failed to delete from DB', async () => {
      clientMock.on(DeleteCommand).rejects(new Error());

      try {
        await db.remove(whereCond, metadata);
      } catch (error) {
        expect(error.message).toEqual('DB ERROR - Failed to delete from DB');
      }
    });

    it('should return deletedCount 0', async () => {
      const resolvedValue = {};

      clientMock.on(DeleteCommand).resolves(resolvedValue);

      const result = await db.remove(whereCond, metadata);

      expect(result).toMatchObject({ deletedCount: 0 });
    });

    it('should return deletedCount 1', async () => {
      const resolvedValue = {
        Attributes: {
          connectionId: 'connectionId',
          roomId: 'test-quiz',
          createdAt: 1653052406811,
          TTL: 1653059606,
        },
      };

      clientMock.on(DeleteCommand).resolves(resolvedValue);

      const result = await db.remove(whereCond, metadata);

      expect(result).toMatchObject({ deletedCount: 1 });
    });
  });
});
