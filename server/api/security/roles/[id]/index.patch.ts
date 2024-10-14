import serverDB from '@@/server/utils/db';
import { sys_profiles_form_schema } from '@/types/sys_profiles';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.ROLES_EDIT);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    await serverDB.query('BEGIN');

    const rolesDataQuery = `
      UPDATE sys_profiles SET
      name_es = '${payload.name_es}',
      is_active = ${payload.is_active},
      updated_by = '${user_id}'
      
      where id = '${id}'
    `;

    const usersDataQuery = `
      UPDATE sys_users SET
      sys_profile_name = '${payload.name_es}'
      
      where sys_profile_id = '${id}'
    `;

    const sqlLinksDelete = `delete from sys_profiles_links where sys_profile_id = '${id}'`;

    await serverDB.query(rolesDataQuery);
    await serverDB.query(usersDataQuery);
    await serverDB.query(sqlLinksDelete);

    if (payload.sys_profiles_links && payload.sys_profiles_links.length > 0) {
      let sqlLinksInsert = 'insert into sys_profiles_links (sys_profile_id, sys_link_id) values';
      payload.sys_profiles_links?.forEach((linkId) => {
        sqlLinksInsert += `('${id}', '${linkId.sys_link_id}'),`;
      });
      sqlLinksInsert = sqlLinksInsert.substring(0, sqlLinksInsert.length - 1);//remove last comma
      await serverDB.query(sqlLinksInsert);
    }

    await serverDB.query('COMMIT');
    
    return await event.$fetch(`/api/security/roles/:${id}`);
  } catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});