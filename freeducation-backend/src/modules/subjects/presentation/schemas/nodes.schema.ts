import { z } from 'zod';

export const nodeOverrideSchema = z.object({
  displayName: z.string().optional().nullable(),
  imageKey: z.string().optional().nullable()
});
