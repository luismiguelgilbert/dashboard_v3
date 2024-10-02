import serverDB from '@@/server/utils/db';
import { sys_users_form_schema } from '@/types/sys_users';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  let deleteID: string | undefined = undefined;
  try {
    event.context.params = useSanitizeParams(event.context.params);
    let id = getRouterParam(event, 'id');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.USERS_CREATE);
    const { data: payload, error } = await readValidatedBody(event, sys_users_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    const { data: signUpData, error: signUpError } = await supabaseInstance().supabase.auth.admin.createUser({
      email: payload.email!,
      password: process.env.NEWUSERSDEFAULTPWD!,
      email_confirm: true,
      user_metadata: {
        user_name: payload.user_name,
        user_lastname: payload.user_lastname,
        avatar_url: ''
      }
    });
    if (signUpError) {
      throw createError({ statusCode: 500, statusMessage: signUpError?.message ?? 'Unhandled exception' });
    }

    await serverDB.query('BEGIN');
    id = signUpData?.user?.id;
    deleteID = signUpData?.user?.id;

    //Insert user data
    const sqlInsertUserData = `insert into public.sys_users (id, user_name, user_lastname, avatar_url, sys_profile_id, sys_profile_name, updated_by)
      values ('${signUpData.user?.id}', '${payload.user_name}', '${payload.user_lastname}', '', ${payload.sys_profile_id}, '${payload.sys_profile_name}', '${user_id}');`;

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

    await serverDB.query(sqlInsertUserData);
    await serverDB.query(userDataQuery);
    await serverDB.query(userDataProfileNameQuery);
    await serverDB.query(userCompaniesQueryClear);
    await serverDB.query(userCompaniesQueryAdd);

    await serverDB.query('COMMIT');

    return await event.$fetch(`/api/security/users/:${id}`);
  } catch(err) {
    if (deleteID) {
      await supabaseInstance().supabase.auth.admin.deleteUser(deleteID, false);
    }
    console.error(`Error at ${event.path}. ${err}`);
    
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});