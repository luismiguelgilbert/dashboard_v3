import { z } from 'zod';

export const sys_links_schema = z.object({
  id: z.string(),
  parent: z.string().nullable(),
  position: z.coerce.number(),
  link: z.coerce.string(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().optional().nullable(),
  comment_es: z.coerce.string().optional().nullable(),
  row_level: z.coerce.number(),
  requires_company: z.coerce.boolean(),
});

export type sys_links = z.infer<typeof sys_links_schema>

export const sys_profiles_link_schema = z.object({
  sys_link_id: z.string(),
});

export type sys_profiles_link = z.infer<typeof sys_profiles_link_schema>