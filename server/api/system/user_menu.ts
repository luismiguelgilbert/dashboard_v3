import serverDB from '@@/server/utils/db';
import { sys_links_schema } from '@/types/sys_links';

export default defineEventHandler(async (event) => {
  try {
    const user_id = event.context.user.id;
    const userMenuResultset = await serverDB.query(`
      select
      c.*
      from sys_users a
      inner join sys_profiles_links b on a.sys_profile_id = b.sys_profile_id
      inner join sys_links c on b.sys_link_id = c.id
      where a.id = '${user_id}'
      order by case when c.parent is null then 1 else 2 end, c.position, c.parent
    `);
    return sys_links_schema.array().parse(userMenuResultset.rows);
  }
  catch (err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
