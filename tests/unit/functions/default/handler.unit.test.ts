import { MockProxy, mock } from 'jest-mock-extended';
import { handler } from '@functions/default/handler';
import { APIGatewayProxyEvent, AWSContext } from '@libs/types';
import { OK } from '@libs/response';

describe('sayHello', () => {
  let event: MockProxy<APIGatewayProxyEvent>;
  let context: MockProxy<AWSContext>;

  beforeEach(() => {
    event = mock<APIGatewayProxyEvent>();
    context = mock<AWSContext>();
  });

  it('should return OK response with message', async () => {
    const expectedResult = OK({
      message: 'Action value does not match any route keys',
    });

    const result = await handler(event, context);

    expect(result).toEqual(expectedResult);
  });
});
