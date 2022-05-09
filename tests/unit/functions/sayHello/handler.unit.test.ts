import { MockProxy, mock } from 'jest-mock-extended';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '@functions/sayHello/handler';
import { APIGatewayProxyEvent, AWSContext } from '@libs/types';
import { HelloBody } from '@functions/sayHello/schema';
import { OK } from '@libs/response';

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@mocks/@aws-sdk/client-apigatewaymanagementapi';

const client = new ApiGatewayManagementApiClient({});

describe('sayHello', () => {
  let event: MockProxy<APIGatewayProxyEvent<HelloBody>>;
  let context: MockProxy<AWSContext>;
  const expectedResult: APIGatewayProxyResult = OK();

  const connectionId = '123456';

  beforeEach(() => {
    event = mock<APIGatewayProxyEvent<HelloBody>>();
    context = mock<AWSContext>();

    event.requestContext.connectionId = connectionId;
  });

  it('should call client.send with PostToConnectionCommand with Hello John message', async () => {
    const name = 'John';
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify({ message: `Hello ${name}` })),
    });

    event.body = { action: 'sayHello', name };

    const result = await handler(event, context);

    expect(command).toEqual(command);
    expect(client.send).toHaveBeenCalledWith(command);
    expect(result).toEqual(expectedResult);
  });

  it('should call client.send with PostToConnectionCommand with message Hello World', async () => {
    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify({ message: `Hello World` })),
    });

    event.body = { action: 'sayHello', name: undefined };

    const result = await handler(event, context);

    expect(command).toEqual(command);
    expect(client.send).toHaveBeenCalledWith(command);
    expect(result).toEqual(expectedResult);
  });
});
