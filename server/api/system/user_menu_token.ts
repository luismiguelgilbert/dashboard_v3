import serverDB from '@@/server/utils/db';
import { requiresUser } from '@@/server/utils/handler';
import { encryptData } from '~~/server/utils/encrypt';

export default defineEventHandler(async (event) => {
  try {
    await requiresUser(event);
    const user_id = event.context.user.id;
    const userMenuResultset = await serverDB.query(`
      select
      c.id
      from sys_users a
      inner join sys_profiles_links b on a.sys_profile_id = b.sys_profile_id
      inner join sys_links c on b.sys_link_id = c.id
      where a.id = '${user_id}'
      order by c.id
    `);

    return await encryptData(JSON.stringify(userMenuResultset.rows));
  }
  catch (err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
