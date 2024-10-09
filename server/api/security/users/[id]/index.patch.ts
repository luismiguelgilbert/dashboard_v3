import serverDB from '@@/server/utils/db';
import { sys_users_form_schema } from '@/types/sys_users';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.USERS_EDIT);
    const { data: payload, error } = await readValidatedBody(event, sys_users_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    await serverDB.query('BEGIN');

    const userDataQuery = `
      UPDATE sys_users SET
      user_name = '${payload.user_name}',
      user_lastname = '${payload.user_lastname}',
      avatar_url = '${payload.avatar_url}',
      website = '${payload.email}',
      dark_enabled = ${payload.dark_enabled},
      default_color = '${payload.default_color}',
      default_dark_color = '${payload.default_dark_color}',
      user_sex = ${payload.user_sex},
      sys_profile_id = ${payload.sys_profile_id},
      sys_profile_name = '${payload.sys_profile_name}',
      updated_by = '${user_id}'
      
      where id = '${id}'
    `;

    const userDataProfileNameQuery = `
      with userProfileName as (
        select b.id, b.name_es
        from sys_users a
        inner join sys_profiles b on a.sys_profile_id = b.id
        where a.id = '${id}'
      )
      update sys_users set 
      sys_profile_name = (select name_es from userProfileName limit 1)
      where id = '${id}'
    `;

    const userCompaniesQueryClear = `
      delete from sys_companies_users
      where user_id = '${id}'
    `;

    const userCompaniesQueryAdd = `
      INSERT INTO sys_companies_users (sys_company_id, user_id, is_default) VALUES
      ${payload.sys_companies_users.map((company_id) => `('${company_id}', '${id}', ${company_id === payload.default_user_company})`).join(',')}
    `;
    
    await serverDB.query(userDataQuery);
    await serverDB.query(userDataProfileNameQuery);
    await serverDB.query(userCompaniesQueryClear);
    await serverDB.query(userCompaniesQueryAdd);

    await serverDB.query('COMMIT');
    
    return await event.$fetch(`/api/security/users/:${id}`);
  } catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});