import { object, string } from 'yup';

export const connectionSchema = object({
  requestContext: object({
    routeKey: string().required(),
    connectionId: string().required(),
  }),
});
