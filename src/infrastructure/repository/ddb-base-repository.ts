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
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';

import { ddbClient } from '../db/dynamodb-client';

export interface IDynamoDBRepo {
  query: (commandInput: QueryCommandInput) => Promise<QueryCommandOutput>;
  get: (commandInput: GetCommandInput) => Promise<GetCommandOutput>;
  put: (commandInput: PutCommandInput) => Promise<PutCommandOutput>;
  remove: (commandInput: DeleteCommandInput) => Promise<DeleteCommandOutput>;
}

const baseRepository = (client: DynamoDBDocumentClient): IDynamoDBRepo => {
  const query = async (
    commandInput: QueryCommandInput
  ): Promise<QueryCommandOutput> => {
    try {
      const command = new QueryCommand(commandInput);

      console.log('Executing QueryCommand with: ', commandInput);

      const output = await client.send(command);

      console.log('QueryCommand executed successfully: ', output);

      return output;
    } catch (error) {
      console.error('DB ERROR - Failed to query items from DB', error);
      throw new Error('DB ERROR - Failed to query items from DB');
    }
  };

  const get = async (
    commandInput: GetCommandInput
  ): Promise<GetCommandOutput> => {
    try {
      const command = new GetCommand(commandInput);

      console.log('Executing GetCommand with: ', commandInput);

      const output = await client.send(command);

      console.log('GetCommand executed successfully: ', output);

      return output;
    } catch (error) {
      console.error('DB ERROR - Failed to get item from DB', error);
      throw new Error('DB ERROR - Failed to get item from DB');
    }
  };

  const put = async (
    commandInput: PutCommandInput
  ): Promise<PutCommandOutput> => {
    try {
      const command = new PutCommand(commandInput);

      console.log('Executing PutCommand with: ', commandInput);

      const output = await client.send(command);

      console.log('PutCommand executed successfully: ', output);

      return output;
    } catch (error) {
      console.error('DB ERROR - Failed to write to DB', error);
      throw new Error('DB ERROR - Failed to write to DB');
    }
  };

  const remove = async (
    commandInput: DeleteCommandInput
  ): Promise<DeleteCommandOutput> => {
    try {
      const command = new DeleteCommand(commandInput);

      console.log('Executing DeleteCommand with: ', commandInput);

      const output = await client.send(command);

      console.log('DeleteCommand executed successfully: ', output);

      return output;
    } catch (error) {
      console.error('DB ERROR - Failed to delete from DB', error);
      throw new Error('DB ERROR - Failed to delete from DB');
    }
  };

  return { query, get, put, remove };
};

const ddbBaseRepository = baseRepository(ddbClient);

export { ddbBaseRepository };
