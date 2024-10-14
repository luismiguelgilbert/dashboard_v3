import serverDB from '@@/server/utils/db';
import { sys_links_schema } from '@/types/sys_links';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    await requiresUser(event);
    const text = `
      select
      a.id,
      a.parent,
      a.position,
      a.link,
      a.name_es,
      a.icon,
      a.comment_es,
      a.row_level,
      a.requires_company
      from sys_links a
      order by a.id
    `;
    const data = await serverDB.query(text);
    return sys_links_schema.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});