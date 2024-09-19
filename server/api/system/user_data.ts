import serverDB from '@@/server/utils/db';
import { requiresUser } from '@@/server/utils/handler';
import { sys_users_schema } from '@/types/sys_users';

export default defineEventHandler(async (event) => {
  try {
    await requiresUser(event);
    const user_id = event.context.user.id;
    const query = await serverDB.query(`
      select
      a.id
      ,b.email
      ,INITCAP(a.user_name) as user_name
      ,INITCAP(a.user_lastname) as user_lastname
      ,a.avatar_url
      ,a.website
      ,a.dark_enabled
      ,a.default_color
      ,a.default_dark_color
      ,a.updated_by
      ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      ,a.user_sex
      ,a.sys_profile_id
      ,c.name_es as sys_profile_name
      from sys_users a
      inner join auth.users b on a.id = b.id
      left join sys_profiles c on a.sys_profile_id = c.id
      where a.id = '${user_id}'
    `);

    return sys_users_schema.parse(query.rows[0]);
  }
  catch (err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception server',
    });
  }
});
