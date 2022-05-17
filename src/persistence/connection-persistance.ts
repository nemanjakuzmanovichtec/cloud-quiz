import { addHoursToDate, getSecondsSinceEpoch } from '@utils/dateUtils';
import { DynamoDB } from '@libs/dynamoDB';

interface ConnectionPersistanceDependencies {
  DynamoDB: typeof DynamoDB;
}

interface ConnectionData {
  roomId: string;
  connectionId: string;
}

const makeConnectionPersistance = ({
  DynamoDB,
}: ConnectionPersistanceDependencies) => {
  const tableName = process.env.ConnectionsTable;

  const save = async (connData: ConnectionData) => {
    console.log('ConnectionPersistance.save', connData);

    const { connectionId, roomId } = connData;

    const twoHoursFromToday = addHoursToDate(new Date(), 2);
    const TTL = getSecondsSinceEpoch(twoHoursFromToday);

    const data = { connectionId, roomId, createdAt: Date.now(), TTL };

    await DynamoDB.write({ data, tableName });
  };

  const remove = async (connData: ConnectionData) => {
    console.log('ConnectionPersistance.remove', connData);

    const { connectionId, roomId } = connData;

    await DynamoDB.remove({
      hashKey: 'connectionId',
      hashValue: connectionId,
      rangeKey: 'roomId',
      rangeValue: roomId,
      tableName,
    });
  };

  return { save, remove };
};

const ConnectionPersistance = makeConnectionPersistance({ DynamoDB });

export { ConnectionPersistance };
