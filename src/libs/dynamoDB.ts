import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  DynamoDBClient,
  DynamoDBClientConfig,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

interface WriteInput {
  data: Record<string, unknown>;
  tableName: string;
}

interface DeleteInput {
  hashKey: string;
  hashValue: string;
  rangeKey?: string;
  rangeValue?: string;
  tableName: string;
}

interface DynamoDB {
  write: (
    input: WriteInput
  ) => Promise<Record<string, unknown>> | Promise<PutItemCommandOutput>;
  remove: (input: DeleteInput) => Promise<DeleteItemCommandOutput>;
}

const makeDynamoDB = (configuration: DynamoDBClientConfig): DynamoDB => {
  const client = new DynamoDBClient(configuration);

  const write = async (writeInput: WriteInput) => {
    const { data, tableName } = writeInput;

    const input: PutItemCommandInput = {
      TableName: tableName,
      Item: marshallObj(data),
    };

    const command = new PutItemCommand(input);

    try {
      await client.send(command);
    } catch (error) {
      console.log('DB ERROR - Failed to write to DB', error);
    }

    return data;
  };

  const remove = async (deleteInput: DeleteInput) => {
    const { hashKey, hashValue, rangeKey, rangeValue, tableName } = deleteInput;

    const input: DeleteItemCommandInput = {
      TableName: tableName,
      Key: marshallObj({
        [hashKey]: hashValue,
        [rangeKey]: rangeValue,
      }),
    };

    const command = new DeleteItemCommand(input);

    try {
      return await client.send(command);
    } catch (error) {
      console.log('DB ERROR - Failed to delete from DB', error);
    }
  };

  const marshallObj = (data: Record<string, unknown>) => {
    return marshall(data, { removeUndefinedValues: true });
  };

  return { write, remove };
};

const DynamoDB = makeDynamoDB({ region: process.env.REGION });

export { DynamoDB };
