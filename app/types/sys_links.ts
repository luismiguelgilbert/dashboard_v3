import { z } from "zod"

export const sys_links_schema = z.object({
  id: z.string(),
  parent: z.string().nullable(),
  position: z.coerce.number(),
  link: z.coerce.string(),
  name_es: z.coerce.string(),
  icon: z.coerce.string().optional().nullable(),
  comment_es: z.coerce.string().optional().nullable(),
  requires_company: z.coerce.boolean(),
});

export type sys_links = z.infer<typeof sys_links_schema>;