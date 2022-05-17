import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  DynamoDBClientConfig,
  PutItemCommand,
  PutItemCommandInput,
  GetItemCommandInput,
  GetItemCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

interface WriteInput {
  data: Record<string, unknown>;
  tableName: string;
}

interface ItemInput {
  hashKey: string;
  hashValue: string;
  rangeKey?: string;
  rangeValue?: string;
  tableName: string;
}

type DeleteInput = ItemInput;
type GetInput = ItemInput;

interface DynamoDB {
  write: (input: WriteInput) => Promise<Record<string, unknown>>;
  remove: (input: DeleteInput) => Promise<void>;
  get: (input: GetInput) => Promise<Record<string, unknown>>;
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
      await client.send(command);
    } catch (error) {
      console.log('DB ERROR - Failed to delete from DB', error);
    }
  };

  const get = async (getInput: GetInput) => {
    const { hashKey, hashValue, rangeKey, rangeValue, tableName } = getInput;

    const input: GetItemCommandInput = {
      TableName: tableName,
      Key: marshallObj({
        [hashKey]: hashValue,
        [rangeKey]: rangeValue,
      }),
    };

    const command = new GetItemCommand(input);

    try {
      const output = await client.send(command);

      return unmarshallObj(output.Item);
    } catch (error) {
      console.log('DB ERROR - Failed to get item from DB', error);
    }
  };

  const marshallObj = (data: Record<string, unknown>) => {
    return marshall(data, { removeUndefinedValues: true });
  };

  const unmarshallObj = (data: { [key: string]: AttributeValue }) => {
    return unmarshall(data);
  };

  return { write, remove, get };
};

const DynamoDB = makeDynamoDB({ region: process.env.REGION });

export { DynamoDB };
