import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  DynamoDBClientConfig,
  PutItemCommand,
  PutItemCommandInput,
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

class DynamoUtils {
  private client: DynamoDBClient;

  constructor(configuration: DynamoDBClientConfig) {
    this.client = new DynamoDBClient(configuration);
  }

  async write({ data, tableName }: WriteInput) {
    const input: PutItemCommandInput = {
      TableName: tableName,
      Item: this.marshallObj(data),
    };

    const command = new PutItemCommand(input);

    try {
      return await this.client.send(command);
    } catch (error) {
      console.log('DB ERROR - Failed to write to DB', error);
    }

    return data;
  }

  async delete({
    hashKey,
    hashValue,
    rangeKey,
    rangeValue,
    tableName,
  }: DeleteInput) {
    const input: DeleteItemCommandInput = {
      TableName: tableName,
      Key: this.marshallObj({
        [hashKey]: hashValue,
        [rangeKey]: rangeValue,
      }),
    };

    const command = new DeleteItemCommand(input);

    try {
      return await this.client.send(command);
    } catch (error) {
      console.log('DB ERROR - Failed to delete from DB', error);
    }
  }

  private marshallObj(data: Record<string, unknown>) {
    return marshall(data, { removeUndefinedValues: true });
  }

  // private unmarshallValues(data: { [key: string]: AttributeValue }) {
  //   return unmarshall(data);
  // }
}

const DynamoDB = new DynamoUtils({ region: process.env.REGION });

export { DynamoDB as DynamoUtils };
