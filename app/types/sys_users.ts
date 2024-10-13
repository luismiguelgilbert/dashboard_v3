import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { colors_enum, dark_colors_enum } from '@/types/colors';

export const sys_users_schema = z.object({
  id: z.string().uuid().default(uuidv4()),
  user_name: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
  user_lastname: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
  user_sex: z.coerce.boolean().default(true),
  avatar_url: z.coerce.string().optional().nullable(),
  website: z.string().optional().nullable(),
  email: z.coerce.string().email().optional().nullable(),
  sys_profile_id: z.coerce.number(),
  sys_profile_name: z.coerce.string(),
  default_color: colors_enum.default('indigo'),
  default_dark_color: dark_colors_enum.default('zinc'),
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
  email: z.coerce.string().email(),
  sys_profile_id: z.coerce.number().min(1, 'Debe seleccionar una opción.'),
}).strict();

export type sys_users_form = z.infer<typeof sys_users_form_schema>

export const sys_users_preferences_schema = z.object({
  id: z.string().uuid().default(uuidv4()),
  avatar_url: z.coerce.string().optional().nullable(),
  default_color: colors_enum.default('indigo'),
  default_dark_color: dark_colors_enum.default('zinc'),
  dark_enabled: z.coerce.boolean().default(false),
});
export type sys_users_preferences = z.infer<typeof sys_users_preferences_schema>

export const sys_users_sort_enum = z.enum(['a.user_name', 'a.user_lastname', 'a.sys_profile_name', 'a.user_sex']);
export type sys_users_sort_enum = z.infer<typeof sys_users_sort_enum>;

export const sys_users_sort_options_schema = z.object({
  value: sys_users_sort_enum,
  label: z.string(),
});
export type sys_users_sort_options = z.infer<typeof sys_users_sort_options_schema>

export const sys_users_query_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  filterProfile: z.coerce.number().array(),
  filterSex: z.coerce.boolean().array(),
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(1),
  sortBy: sys_users_sort_enum,
}).strict();
export type sys_users_query = z.infer<typeof sys_users_query_schema>

export const sys_users_query_download_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  filterProfile: z.coerce.number().array(),
  filterSex: z.coerce.boolean().array(),
  sortBy: sys_users_sort_enum,
}).strict();

export const sys_users_password_reset_schema = z.object({
  id: z.string().uuid('Debe seleccionar un usuario'),
  password: z.string().min(6, 'Debe incluir 6 o más caracteres.'),
  passwordConfirm: z.string().min(6, 'Debe incluir 6 o más caracteres.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Contraseñas no coinciden',
  path: ['passwordConfirm'],
});;
export type sys_users_password_reset = z.infer<typeof sys_users_password_reset_schema>