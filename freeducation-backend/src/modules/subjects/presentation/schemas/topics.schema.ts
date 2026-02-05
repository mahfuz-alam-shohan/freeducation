import { z } from 'zod';

export const topicCreateSchema = z.object({
  name: z.string().min(2),
  imageKey: z.string().optional().nullable()
});

export const topicUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  imageKey: z.string().optional().nullable()
});
