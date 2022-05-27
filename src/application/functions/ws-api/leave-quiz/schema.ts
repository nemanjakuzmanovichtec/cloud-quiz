import { InferType, object, string } from 'yup';

const bodySchema = object({
  action: string().required(),
  quizId: string().required(),
});

export type LeaveQuizBody = InferType<typeof bodySchema>;

export const leaveQuizSchema = object({
  body: bodySchema,
});
