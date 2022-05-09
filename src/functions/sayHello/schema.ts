import { InferType, object, string } from 'yup';

const bodySchema = object({
  action: string().required(),
  name: string().optional(),
});

export type HelloBody = InferType<typeof bodySchema>;

export const helloSchema = object({
  body: bodySchema,
});
