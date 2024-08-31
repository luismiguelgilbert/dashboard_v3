import serverDB from '@@/server/utils/db';
import { sys_links_schema } from '@/types/sys_links';

export default defineEventHandler( async (event) => {
  try{
    const userMenuResultset = await serverDB.query(`
      select
      *
      from sys_links
      order by case when parent is null then 1 else 2 end, position, parent
    `);
    return sys_links_schema.array().parse(userMenuResultset.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});