import { z } from 'zod';

export const numericFilterItemSchema = z.object({
  id: z.coerce.number(),
  label: z.coerce.string(),
});

export type numericFilterItem = z.infer<typeof numericFilterItemSchema>

export const booleanFilterItemSchema = z.object({
  id: z.coerce.boolean(),
  label: z.coerce.string(),
});

export type booleanFilterItem = z.infer<typeof booleanFilterItemSchema>