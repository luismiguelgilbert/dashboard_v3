import { z } from 'zod';

export const bitacora_places_schema = z.object({
  id: z.coerce.string().uuid(),
  sys_company_id: z.coerce.string().uuid(),
  name_es: z.coerce.string().min(3, 'Debe incluir 3 o más caracteres.'),
  name_es_short: z.coerce.string().min(3, 'Debe incluir 3 o más caracteres.'),
  is_active: z.coerce.boolean().default(true),
  disabled: z.coerce.boolean().default(true),
  created_at: z.coerce.string().optional().nullable(),
  updated_at: z.coerce.string().optional().nullable(),
  updated_by: z.coerce.string().optional().nullable(),
  avatar_url: z.coerce.string().optional().nullable(),
  // is_default: z.coerce.boolean().optional().default(false),
  rows_count: z.coerce.number().optional().nullable().default(0),
});

export type bitacora_places = z.infer<typeof bitacora_places_schema>

export const bitacora_places_form_schema = bitacora_places_schema.extend({
  is_active: z.coerce.boolean(),
  disabled: z.coerce.boolean().optional(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
}).strict();
export type bitacora_places_form = z.infer<typeof bitacora_places_form_schema>

export const bitacora_places_sort_enum = z.enum(['a.name_es', 'a.name_es_short', 'a.is_active']);
export type bitacora_places_sort_enum = z.infer<typeof bitacora_places_sort_enum>;

export const bitacora_places_sort_options_schema = z.object({
  value: bitacora_places_sort_enum,
  label: z.string(),
});
export type bitacora_places_sort_options = z.infer<typeof bitacora_places_sort_options_schema>

export const bitacora_places_query_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  sys_company_id: z.coerce.string().uuid(),
  filterIsActive: z.coerce.boolean().array(),
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(1),
  sortBy: bitacora_places_sort_enum,
}).strict();
export type sys_companies_query = z.infer<typeof bitacora_places_query_schema>

export const bitacora_places_query_download_schema = z.object({
  searchString: z.string()
    .refine(s => !s.includes(' '), 'Sin espacios!')
    .refine(s => !s.includes(';'), 'Sin caracteres especiales!')
    .refine(s => !s.includes('truncate'), 'Sin palabras claves!')
    .refine(s => !s.includes('drop'), 'Sin palabras claves!')
    .refine(s => !s.includes('delete'), 'Sin palabras claves!')
    .refine(s => !s.includes('select'), 'Sin palabras claves!')
    .refine(s => !s.includes('insert'), 'Sin palabras claves!')
    .refine(s => !s.includes('update'), 'Sin palabras claves!'),
  sys_company_id: z.coerce.string().uuid(),
  filterIsActive: z.coerce.boolean().array(),
  sortBy: bitacora_places_sort_enum,
}).strict();