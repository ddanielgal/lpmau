import { z } from 'zod';

export const JobModel = z.object({
  id: z.number().int(),
  status: z.string(),
  result: z.string().nullable(),
  input: z.string(),
});

export type Job = z.infer<typeof JobModel>;
