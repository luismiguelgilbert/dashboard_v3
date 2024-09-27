import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const sys_users_schema = z.object({
  id: z.string().uuid().default(uuidv4()),
  user_name: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
  user_lastname: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
  user_sex: z.coerce.boolean().default(true),
  avatar_url: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  email: z.coerce.string().email().optional().nullable(),
  sys_profile_id: z.number(),
  sys_profile_name: z.string(),
  default_color: z.coerce.string().default('indigo'),
  default_dark_color: z.coerce.string().default('zinc'),
  dark_enabled: z.coerce.boolean().default(false),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  last_sign_in_at: z.string().optional().nullable(),
  rows_count: z.coerce.number().optional().nullable(),
});

export type sys_users = z.infer<typeof sys_users_schema>

export type sys_users_object = { [k: string]: sys_users[] }

export const sys_users_form_schema = sys_users_schema.extend({
  sys_companies_users: z.array(z.string().uuid()).min(1, 'Debe seleccionar al menos una opción.').default([]),
  default_user_company: z.string().uuid().optional(),
});

export type sys_users_form = z.infer<typeof sys_users_form_schema>

export const sys_users_sort_enum = z.enum(['a.user_name', 'a.user_lastname', 'a.sys_profile_name', 'a.user_sex']);
export type sys_users_sort_enum = z.infer<typeof sys_users_sort_enum>;

export const sys_users_sort_options_schema = z.object({
  value: sys_users_sort_enum,
  label: z.string(),
});
export type sys_users_sort_options = z.infer<typeof sys_users_sort_options_schema>