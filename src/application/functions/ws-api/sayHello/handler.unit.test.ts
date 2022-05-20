import { MockProxy, mock } from 'jest-mock-extended';
import { handler } from '@application/functions/ws-api/sayHello/handler';
import { HelloBody } from '@application/functions/ws-api/sayHello/schema';
import { APIGatewayProxyEvent, AWSContext } from '@application/types';
import { OK } from '@application/helpers/response';
import { notifyPlayer } from '@domain/use-cases';

jest.mock('@domain/use-cases');

describe('sayHello', () => {
  let event: MockProxy<APIGatewayProxyEvent<HelloBody>>;
  let context: MockProxy<AWSContext>;

  beforeEach(() => {
    event = mock<APIGatewayProxyEvent<HelloBody>>();
    context = mock<AWSContext>();

    jest.resetAllMocks();
  });

  it('should call send with Hello John & return OK', async () => {
    const name = 'John';
    const connectionId = '123456';
    const payload = { message: `Hello ${name}` };

    event.body = { action: 'sayHello', name };
    event.requestContext.connectionId = connectionId;

    const result = await handler(event, context);

    expect(notifyPlayer).toHaveBeenCalledWith(connectionId, payload);
    expect(result).toEqual(OK());
  });

  it('should call send with Hello World & return OK', async () => {
    const connectionId = '654321';
    const payload = { message: `Hello World` };

    event.body = { action: 'sayHello', name: undefined };
    event.requestContext.connectionId = connectionId;

    const result = await handler(event, context);

    expect(notifyPlayer).toHaveBeenCalledWith(connectionId, payload);
    expect(result).toEqual(OK());
  });
});
