import { z } from 'zod';

const mcqOptionSchema = z.array(z.string().min(1)).length(4);

export const questionCreateSchema = z.object({
  typeKey: z.enum(['CQ', 'MCQ']),
  sectionKey: z.enum(['KNOWLEDGE', 'TWO', 'THREE', 'FOUR']).optional().nullable(),
  questionText: z.string().min(1),
  answerText: z.string().min(1),
  imageKey: z.string().optional().nullable(),
  options: mcqOptionSchema.optional(),
  correctOption: z.enum(['A', 'B', 'C', 'D']).optional()
}).superRefine((data, ctx) => {
  if (data.typeKey === 'CQ' && !data.sectionKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'CQ section is required',
      path: ['sectionKey']
    });
  }

  if (data.typeKey === 'MCQ') {
    if (!data.options) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MCQ options are required',
        path: ['options']
      });
    }
    if (!data.correctOption) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'MCQ correct option is required',
        path: ['correctOption']
      });
    }
  }
});

export const questionUpdateSchema = z.object({
  questionText: z.string().min(1).optional(),
  answerText: z.string().min(1).optional(),
  imageKey: z.string().optional().nullable(),
  options: mcqOptionSchema.optional(),
  correctOption: z.enum(['A', 'B', 'C', 'D']).optional()
});
