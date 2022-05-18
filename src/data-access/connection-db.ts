import { DateUtils } from '@utils/date-utils';
import { ConnectionEntity } from '@domain/entities/connection';
import { Database } from '@infrastructure/db/types';

interface Dependencies {
  db: Database;
}

export interface ConnectionDataModel {
  roomId: string;
  connectionId: string;
  createdAt: number;
  TTL: number;
}

export const makeConnectionDb = ({ db }: Dependencies) => {
  const tableName = process.env.ConnectionsTable;

  const save = async (entity: ConnectionEntity) => {
    console.log('makeConnectionDb.save', entity);

    const { connectionId, roomId } = entity;

    const twoHoursFromToday = DateUtils.addHoursToDate(new Date(), 2);
    const TTL = DateUtils.getSecondsSinceEpoch(twoHoursFromToday);

    const data: ConnectionDataModel = {
      connectionId,
      roomId,
      createdAt: Date.now(),
      TTL,
    };

    await db.save(data, { tableName });
  };

  const remove = async (entity: ConnectionEntity) => {
    console.log('makeConnectionDb.remove', entity);

    const { connectionId, roomId } = entity;

    const data = {
      primaryKey: 'connectionId',
      primaryKeyValue: connectionId,
      secondaryKey: 'roomId',
      secondaryKeyValue: roomId,
    };

    await db.remove(data, { tableName });
  };

  return { save, remove };
};
