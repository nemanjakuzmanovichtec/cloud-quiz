import {
  ApiGatewayManagementApiClientConfig,
  PostToConnectionCommandInput,
} from '@aws-sdk/client-apigatewaymanagementapi';

const sendFn = jest.fn().mockResolvedValue(null);

export class ApiGatewayManagementApiClient {
  readonly configuration: ApiGatewayManagementApiClientConfig;

  constructor(configuration: ApiGatewayManagementApiClientConfig) {
    this.configuration = configuration;
  }

  send = sendFn;
}

export class PostToConnectionCommand {
  readonly input: PostToConnectionCommandInput;

  constructor(input: PostToConnectionCommandInput) {
    this.input = input;
  }
}
