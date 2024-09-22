import { z } from 'zod';

export const sys_companies_schema = z.object({
  id: z.coerce.string().uuid(),
  company_number: z.coerce.string(),
  name_es: z.coerce.string(),
  name_es_short: z.coerce.string(),
  billing_phone: z.coerce.string().optional(),
  billing_address: z.coerce.string().optional(),
  is_active: z.coerce.boolean().default(true),
  disabled: z.coerce.boolean().default(true),
  created_at: z.coerce.string().optional().nullable(),
  updated_at: z.coerce.string().optional().nullable(),
  updated_by: z.coerce.string().optional().nullable(),
  avatar_url: z.coerce.string().optional().nullable(),
  // is_default: z.coerce.boolean().optional().default(false),
});

export type sys_companies = z.infer<typeof sys_companies_schema>
