import { z } from 'zod';

export const noteCreateSchema = z.object({
  note: z.string().min(1),
  imageKey: z.string().optional().nullable()
});
