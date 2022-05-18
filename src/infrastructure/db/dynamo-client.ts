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

interface WriteInput<T> {
  data: T;
  tableName: string;
}

interface GetInput {
  hashKey: string;
  hashValue: string;
  rangeKey: string;
  rangeValue: string;
  tableName: string;
}

type RemoveInput = GetInput;

const makeDynamoClient = (configuration: DynamoDBClientConfig) => {
  const client = new DynamoDBClient(configuration);

  const get = async (input: GetInput) => {
    console.log('makeDynamoClient.get', { input });

    const { hashKey, hashValue, rangeKey, rangeValue, tableName } = input;

    const commandInput: GetItemCommandInput = {
      TableName: tableName,
      Key: marshallObj({
        [hashKey]: hashValue,
        [rangeKey]: rangeValue,
      }),
    };

    const command = new GetItemCommand(commandInput);

    try {
      const output = await client.send(command);

      return unmarshallObj(output.Item);
    } catch (error) {
      console.error('DB ERROR - Failed to get item from DB', error);
      throw new Error('GetItemCommand unsuccessful');
    }
  };

  const write = async <T>(input: WriteInput<T>) => {
    console.log('makeDynamoClient.write', { input });

    const { data, tableName } = input;

    const commandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshallObj(data),
    };

    const command = new PutItemCommand(commandInput);

    try {
      await client.send(command);
    } catch (error) {
      console.error('DB ERROR - Failed to write to DB', error);
      throw new Error('PutItemCommand unsuccessful');
    }

    return data;
  };

  const remove = async (input: RemoveInput) => {
    console.log('makeDynamoClient.remove', { input });

    const { hashKey, hashValue, rangeKey, rangeValue, tableName } = input;

    const commandInput: DeleteItemCommandInput = {
      TableName: tableName,
      Key: marshallObj({
        [hashKey]: hashValue,
        [rangeKey]: rangeValue,
      }),
    };

    const command = new DeleteItemCommand(commandInput);

    try {
      await client.send(command);
    } catch (error) {
      console.error('DB ERROR - Failed to delete from DB', error);
      throw new Error('DeleteItemCommand unsuccessful');
    }
  };

  const marshallObj = <T>(data: T) => {
    console.log('makeDynamoClient.marshallObj', { data });

    return marshall(data, { removeUndefinedValues: true });
  };

  const unmarshallObj = (data: { [key: string]: AttributeValue }) => {
    console.log('makeDynamoClient.unmarshallObj', { data });

    return unmarshall(data);
  };

  return { get, write, remove };
};

const DynamoClient = makeDynamoClient({ region: process.env.REGION });

export { DynamoClient };
