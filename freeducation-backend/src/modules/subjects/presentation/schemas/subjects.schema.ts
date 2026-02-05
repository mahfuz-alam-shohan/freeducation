import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(2),
  templateId: z.number()
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2).optional(),
  isActive: z.boolean().optional()
});

export const labelUpdateSchema = z.object({
  typeLabels: z.record(z.string()).optional(),
  sectionLabels: z.record(z.string()).optional()
});
