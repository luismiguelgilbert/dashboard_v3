import serverDB from '@@/server/utils/db';
import { sys_users_schema } from '@/types/sys_users';

export default defineEventHandler( async (event) => {
  try{
    const id = getRouterParam(event, 'id');
    const text = `
      SELECT
      a.id,
      COALESCE(b.user_name, '') as user_name,
      COALESCE(b.user_lastname, '') as user_lastname,
      COALESCE(b.user_sex, false) as user_sex,
      b.avatar_url,
      b.website,
      a.email,
      b.sys_profile_id,
      d.name_es as sys_profile_name,
      b.dark_enabled,
      b.default_color,
      b.default_dark_color
      from auth.users a
      left join sys_users b on a.id = b.id
      left join sys_profiles d on b.sys_profile_id = d.id
      WHERE a.id = '${id}'
    `;
    const data = await serverDB.query(text);
    return sys_users_schema.array().parse(data.rows)[0];
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});