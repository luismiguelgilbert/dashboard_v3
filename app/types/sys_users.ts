import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const sys_users_schema = z.object({
  id: z.string().uuid().default(uuidv4()),
  user_name: z.string(),
  user_lastname: z.string(),
  user_sex: z.coerce.boolean().default(true),
  avatar_url: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  email: z.coerce.string().email().optional().nullable(),
  sys_profile_id: z.number(),
  sys_profile_name: z.string(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  last_sign_in_at: z.string().optional().nullable(),
});

export type sys_users = z.infer<typeof sys_users_schema>

export type sys_users_object = { [k: string]: sys_users[] }
