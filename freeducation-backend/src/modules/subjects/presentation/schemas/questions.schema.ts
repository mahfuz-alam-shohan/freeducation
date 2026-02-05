import { z } from 'zod';

export const questionCreateSchema = z.object({
  typeKey: z.enum(['CQ', 'MCQ']),
  sectionKey: z.enum(['KNOWLEDGE', 'TWO', 'THREE', 'FOUR']).optional().nullable(),
  questionText: z.string().min(1),
  answerText: z.string().min(1)
});

export const questionUpdateSchema = z.object({
  questionText: z.string().min(1).optional(),
  answerText: z.string().min(1).optional()
});
