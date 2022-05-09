import { handlerPath } from '@libs/handler-resolver';

describe('handlerPath', () => {
  it('should return absolute path', async () => {
    const context = __dirname;
    const result = handlerPath(context);
    expect(result).toBe('tests/unit/libs');
  });
});
