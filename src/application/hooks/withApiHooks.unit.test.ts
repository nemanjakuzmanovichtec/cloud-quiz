import useHooks, {
  handleUnexpectedError,
  logEvent,
  parseEvent,
} from 'lambda-hooks';
import { AnyObjectSchema } from 'yup';
import { withApiHooks } from '@application/hooks/withApiHooks';
import { validateEvent } from '@application/hooks/validateEvent';
import { OK } from '@application/helpers/response';

import { APIGatewayProxyHandler } from '../types';

jest.mock('lambda-hooks');

const withHooksMock = jest.fn();
const useHooksMock = jest.mocked(useHooks, true);
useHooksMock.mockReturnValue(withHooksMock);

describe('withApiHooks', () => {
  const lambda: APIGatewayProxyHandler = async () => OK();
  const hooks = {
    before: [parseEvent, logEvent],
    onError: [handleUnexpectedError],
  };

  it('called without config', async () => {
    withApiHooks(lambda);
    expect(useHooksMock).toHaveBeenCalledWith(hooks, {});
    expect(withHooksMock).toHaveBeenCalledWith(lambda);
  });

  it('called without schema', async () => {
    const config = {};
    withApiHooks(lambda, config);
    expect(useHooksMock).toHaveBeenCalledWith(hooks, config);
    expect(withHooksMock).toHaveBeenCalledWith(lambda);
  });

  it('called with schema', async () => {
    hooks.before = [...hooks.before, validateEvent];
    const config = { schema: {} as AnyObjectSchema };

    withApiHooks(lambda, config);
    expect(useHooksMock).toHaveBeenCalledWith(hooks, config);
    expect(withHooksMock).toHaveBeenCalledWith(lambda);
  });
});
