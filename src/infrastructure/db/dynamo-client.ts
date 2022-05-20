import {
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { IDatabase, Metadata, RemoveOutput, WhereCondition } from './types';

interface Dependencies {
  client: DynamoDBDocumentClient;
}

export const makeDynamoDb = ({ client }: Dependencies): IDatabase => {
  const findOne = async (where: WhereCondition, metadata: Metadata) => {
    console.log('DynamoDb.findOne', { where, metadata });

    try {
      const output = await dynamoGet(where, metadata);

      return output.Item;
    } catch (error) {
      console.error('DB ERROR - Failed to get item from DB', error);
      throw new Error('DB ERROR - Failed to get item from DB');
    }
  };

  const save = async <T>(data: T, metadata: Metadata): Promise<T> => {
    console.log('DynamoDb.save', { data, metadata });

    try {
      await dynamoPut<T>(data, metadata);

      return data;
    } catch (error) {
      console.error('DB ERROR - Failed to write to DB', error);
      throw new Error('DB ERROR - Failed to write to DB');
    }
  };

  const remove = async (
    where: WhereCondition,
    metadata: Metadata
  ): Promise<RemoveOutput> => {
    console.log('DynamoDb.remove', { where, metadata });

    try {
      const output = await dynamoDelete(where, metadata);

      return { deletedCount: output.Attributes ? 1 : 0 };
    } catch (error) {
      console.error('DB ERROR - Failed to delete from DB', error);
      throw new Error('DB ERROR - Failed to delete from DB');
    }
  };

  const dynamoGet = async (
    where: WhereCondition,
    metadata: Metadata
  ): Promise<GetCommandOutput> => {
    const { primaryKey, primaryKeyValue, secondaryKey, secondaryKeyValue } =
      where;
    const { tableName } = metadata;

    const commandInput: GetCommandInput = {
      TableName: tableName,
      Key: { [primaryKey]: primaryKeyValue, [secondaryKey]: secondaryKeyValue },
    };

    const command = new GetCommand(commandInput);

    return client.send(command);
  };

  const dynamoPut = async <T>(
    data: T,
    metadata: Metadata
  ): Promise<PutCommandOutput> => {
    const { tableName } = metadata;

    const commandInput: PutCommandInput = {
      TableName: tableName,
      Item: data,
    };

    const command = new PutCommand(commandInput);

    return client.send(command);
  };

  const dynamoDelete = async (
    where: WhereCondition,
    metadata: Metadata
  ): Promise<DeleteCommandOutput> => {
    const { primaryKey, primaryKeyValue, secondaryKey, secondaryKeyValue } =
      where;
    const { tableName } = metadata;

    const commandInput: DeleteCommandInput = {
      TableName: tableName,
      Key: {
        [primaryKey]: primaryKeyValue,
        [secondaryKey]: secondaryKeyValue,
      },
      ConditionExpression: `attribute_exists(${primaryKey})`,
      ReturnValues: 'ALL_OLD',
    };

    const command = new DeleteCommand(commandInput);

    return client.send(command);
  };

  return { findOne, save, remove };
};
