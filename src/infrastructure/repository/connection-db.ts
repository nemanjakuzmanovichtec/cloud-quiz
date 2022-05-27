import { DateUtils } from '@utils/date-utils';
import { ConnectionEntity } from '@domain/entities/connection';
import {
  DeleteCommandInput,
  PutCommandInput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { IDynamoDBRepo } from './ddb-base-repository';

export interface IConnectionRepo {
  findByRoomId: (roomId: string) => Promise<ConnectionDataModel[]>;
  save: (entity: ConnectionEntity) => Promise<ConnectionDataModel>;
  remove: (entity: ConnectionEntity) => Promise<void>;
}

interface Dependencies {
  repository: IDynamoDBRepo;
}

interface ConnectionDataModel {
  roomId: string;
  connectionId: string;
  createdAt?: number;
  TTL?: number;
}

export const makeConnectionDb = ({
  repository,
}: Dependencies): IConnectionRepo => {
  const TableName = process.env.ConnectionsTable;

  const findByRoomId = async (
    roomId: string
  ): Promise<ConnectionDataModel[]> => {
    console.log('makeConnectionDb.findByRoomId', { roomId });

    const commandInput: QueryCommandInput = {
      TableName,
      KeyConditionExpression: `roomId = :roomId`,
      ExpressionAttributeValues: {
        ':roomId': roomId,
      },
    };

    const output = await repository.query(commandInput);

    return output.Items as unknown as ConnectionDataModel[];
  };

  const save = async (
    entity: ConnectionEntity
  ): Promise<ConnectionDataModel> => {
    console.log('makeConnectionDb.save', entity);

    const { connectionId, roomId } = entity;

    const now = Date.now();
    const twoHoursFromToday = DateUtils.addHoursToDate(new Date(now), 2);
    const TTL = DateUtils.getSecondsSinceEpoch(twoHoursFromToday);

    const Item: ConnectionDataModel = {
      roomId,
      connectionId,
      createdAt: now,
      TTL,
    };
    const commandInput: PutCommandInput = { TableName, Item };

    await repository.put(commandInput);

    return Item;
  };

  const remove = async (entity: ConnectionEntity): Promise<void> => {
    console.log('makeConnectionDb.remove', entity);

    const { roomId, connectionId } = entity;

    const commandInput: DeleteCommandInput = {
      TableName,
      Key: { roomId, connectionId },
      ConditionExpression:
        'attribute_exists(roomId) AND attribute_exists(connectionId)',
      ReturnValues: 'ALL_OLD',
    };

    await repository.remove(commandInput);
  };

  return { findByRoomId, save, remove };
};
