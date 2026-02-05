import { z } from 'zod';

export const videoCreateSchema = z.object({
  mode: z.enum(['link', 'upload']),
  title: z.string().min(1),
  url: z.string().url().optional().nullable(),
  author: z.string().optional().nullable(),
  fileKey: z.string().optional().nullable()
});
