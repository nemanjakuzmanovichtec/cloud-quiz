import { InferType, object, string } from 'yup';

const bodySchema = object({
  action: string().required(),
  quizId: string().required(),
});

export type JoinQuizBody = InferType<typeof bodySchema>;

export const joinQuizSchema = object({
  body: bodySchema,
});
