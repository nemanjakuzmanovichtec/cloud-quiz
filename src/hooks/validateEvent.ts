import { State } from 'lambda-hooks';
import { AnyObjectSchema } from 'yup';
import { BAD_REQUEST } from '@libs/response';
import { APIGatewayProxyEvent } from '@libs/types';

export const validateEvent = async (state: State) => {
  const { schema } = state.config;

  if (!schema) {
    throw Error('Missing required schema for validation');
  }

  const { event } = state;
  const isValid = await validateSchema(event, schema);

  if (!isValid) {
    state.exit = true;
    state.response = BAD_REQUEST({ error: 'Event failed validation' });
  }

  return state;
};

export const validateSchema = async (
  event: APIGatewayProxyEvent,
  schema: AnyObjectSchema
) => {
  try {
    await schema.validate(event, { strict: true });
    return true;
  } catch (error) {
    console.log(`yup error validating event: ${error}`);
    return false;
  }
};
