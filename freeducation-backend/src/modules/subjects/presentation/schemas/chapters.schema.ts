import { z } from 'zod';

export const chapterCreateSchema = z.object({
  nodeId: z.number(),
  name: z.string().min(2),
  imageKey: z.string().optional().nullable()
});

export const chapterUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  imageKey: z.string().optional().nullable()
});
