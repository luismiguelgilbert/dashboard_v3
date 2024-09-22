import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const sys_profiles_schema = z.object({
  id: z.coerce.number().default(0),
  name_es: z.string(),
  is_active: z.coerce.boolean().default(true),
  disabled: z.coerce.boolean().default(true),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  updated_by: z.string().uuid().default(uuidv4()),
});

export type sys_profiles = z.infer<typeof sys_profiles_schema>