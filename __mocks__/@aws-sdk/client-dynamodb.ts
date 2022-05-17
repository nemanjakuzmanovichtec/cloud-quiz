import {
  DynamoDBClientConfig,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';

const sendFn = jest.fn().mockResolvedValue(null);

export class DynamoDBClient {
  readonly configuration: DynamoDBClientConfig;

  constructor(configuration: DynamoDBClientConfig) {
    this.configuration = configuration;
  }

  send = sendFn;
}

export class PutItemCommand {
  readonly input: PutItemCommandInput;

  constructor(input: PutItemCommandInput) {
    this.input = input;
  }
}
