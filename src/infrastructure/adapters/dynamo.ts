import { DynamoClient } from '../db/dynamo-client';
import { Database, Metadata, WhereCondition } from '../db/types';

interface Deps {
  DynamoDB: typeof DynamoClient;
}

export const makeDynamoDBAdapter = ({ DynamoDB }: Deps): Database => {
  const findOne = async (where: WhereCondition, metadata: Metadata) => {
    const {
      primaryKey: hashKey,
      primaryKeyValue: hashValue,
      secondaryKey: rangeKey,
      secondaryKeyValue: rangeValue,
    } = where;
    const { tableName } = metadata;

    return DynamoDB.get({
      hashKey,
      hashValue,
      rangeKey,
      rangeValue,
      tableName,
    });
  };

  const save = async <T>(data: T, metadata: Metadata) => {
    const { tableName } = metadata;

    return DynamoDB.write<T>({ data, tableName });
  };

  const remove = async (where: WhereCondition, metadata: Metadata) => {
    const {
      primaryKey: hashKey,
      primaryKeyValue: hashValue,
      secondaryKey: rangeKey,
      secondaryKeyValue: rangeValue,
    } = where;
    const { tableName } = metadata;

    return DynamoDB.remove({
      hashKey,
      hashValue,
      rangeKey,
      rangeValue,
      tableName,
    });
  };

  return { findOne, save, remove };
};
