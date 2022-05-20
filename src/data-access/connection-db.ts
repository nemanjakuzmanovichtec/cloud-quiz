import { DateUtils } from '@utils/date-utils';
import { ConnectionEntity } from '@domain/entities/connection';
import { IDatabase, RemoveOutput } from '@infrastructure/db/types';

interface Dependencies {
  DB: IDatabase;
}

export interface ConnectionDb {
  findByRoomId: (roomId: string) => Promise<ConnectionDataModel[]>;
  save: (entity: ConnectionEntity) => Promise<ConnectionDataModel>;
  remove: (entity: ConnectionEntity) => Promise<RemoveOutput>;
}

export interface ConnectionDataModel {
  roomId: string;
  connectionId: string;
  createdAt: number;
  TTL: number;
}

export const makeConnectionDb = ({ DB }: Dependencies): ConnectionDb => {
  const tableName = process.env.ConnectionsTable;

  const findByRoomId = async (
    roomId: string
  ): Promise<ConnectionDataModel[]> => {
    console.log('makeConnectionDb.findByRoomId', { roomId });

    // TO BE IMPLEMENTED
    return [];
  };

  const save = async (
    entity: ConnectionEntity
  ): Promise<ConnectionDataModel> => {
    console.log('makeConnectionDb.save', entity);

    const { connectionId, roomId } = entity;

    const now = Date.now();
    const twoHoursFromToday = DateUtils.addHoursToDate(new Date(now), 2);
    const TTL = DateUtils.getSecondsSinceEpoch(twoHoursFromToday);

    const data: ConnectionDataModel = {
      connectionId,
      roomId,
      createdAt: now,
      TTL,
    };

    return DB.save(data, { tableName });
  };

  const remove = async (entity: ConnectionEntity): Promise<RemoveOutput> => {
    console.log('makeConnectionDb.remove', entity);

    const { connectionId, roomId } = entity;

    const data = {
      primaryKey: 'connectionId',
      primaryKeyValue: connectionId,
      secondaryKey: 'roomId',
      secondaryKeyValue: roomId,
    };

    return DB.remove(data, { tableName });
  };

  return { findByRoomId, save, remove };
};
