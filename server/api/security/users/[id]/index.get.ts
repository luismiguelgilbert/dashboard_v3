import serverDB from '@@/server/utils/db';
import { sys_users_schema, sys_users_form_schema } from '@/types/sys_users';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler( async (event) => {
  try{
    const id = getRouterParam(event, 'id');
    await hasPermission(event, PermissionsList.USERS_READ);

    const userDataQuery = `
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

    const userCompaniesQuery = `
      select a.sys_company_id
      from sys_companies_users a
      WHERE a.user_id = '${id}'
    `;

    const results = await Promise.all([
      serverDB.query(userDataQuery),
      serverDB.query(userCompaniesQuery),
    ]);
    
    return sys_users_form_schema.parse({
      ...sys_users_schema.array().parse(results[0].rows)[0],
      sys_companies_users: results[1].rows.map((row) => row.sys_company_id),
    });
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});