import { State } from 'lambda-hooks';
import { object } from 'yup';
import * as validation from '@hooks/validateEvent';
import { BAD_REQUEST } from '@libs/response';

const validSchema = object({});
const invalidSchema = object({
  body: object().required(),
});

describe('validateEvent', () => {
  it('called without validation schema', async () => {
    const state: State = { event: {}, context: {}, config: {}, exit: false };

    try {
      await validation.validateEvent(state);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        'Missing required schema for validation'
      );
    }
  });

  it('called with invalid validation schema', async () => {
    const state: State = {
      event: {},
      context: {},
      config: { schema: invalidSchema },
      exit: false,
    };

    const expectedResponse = BAD_REQUEST({ error: 'Event failed validation' });

    const result = await validation.validateEvent(state);

    expect(result.exit).toBeTruthy();
    expect(result.response).toEqual(expectedResponse);
  });
});

describe('validateSchema', () => {
  const state: State = {
    event: {},
    context: {},
    config: {},
    exit: false,
  };

  it('called with invalid schema', async () => {
    state.config = { schema: invalidSchema };

    const isValid = await validation.validateSchema(
      state.event,
      state.config.schema
    );
    expect(isValid).toBeFalsy();
  });

  it('called with valid schema', async () => {
    state.config = { schema: validSchema };

    const isValid = await validation.validateSchema(
      state.event,
      state.config.schema
    );
    expect(isValid).toBeTruthy();
  });
});
