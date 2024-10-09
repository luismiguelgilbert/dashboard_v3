import { z } from 'zod';

export const sys_profiles_schema = z.object({
  id: z.coerce.number().default(0),
  name_es: z.string().min(3, 'Debe incluir 3 o más caracteres.'),
  is_active: z.coerce.boolean().default(true),
  disabled: z.coerce.boolean().default(true),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  rows_count: z.coerce.number().optional().nullable().default(0),
});

export type sys_profiles = z.infer<typeof sys_profiles_schema>

export const sys_profiles_form_schema = sys_profiles_schema.extend({
  is_active: z.coerce.boolean(),
  disabled: z.coerce.boolean().optional(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
}).strict();
export type sys_profiles_form = z.infer<typeof sys_profiles_form_schema>

export const sys_profiles_sort_enum = z.enum(['a.name_es', 'a.is_active']);
export type sys_profiles_sort_enum = z.infer<typeof sys_profiles_sort_enum>;

export const sys_profiles_sort_options_schema = z.object({
  value: sys_profiles_sort_enum,
  label: z.string(),
});
export type sys_profiles_sort_options = z.infer<typeof sys_profiles_sort_options_schema>

export const sys_profiles_query_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  filterIsActive: z.coerce.boolean().array(),
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(1),
  sortBy: sys_profiles_sort_enum,
}).strict();
export type sys_users_query = z.infer<typeof sys_profiles_query_schema>

export const sys_profiles_query_download_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  filterIsActive: z.coerce.boolean().array(),
  sortBy: sys_profiles_sort_enum,
}).strict();