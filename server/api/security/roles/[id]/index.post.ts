import serverDB from '@@/server/utils/db';
import { sys_profiles_form_schema } from '@/types/sys_profiles';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    let id = getRouterParam(event, 'id');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.ROLES_CREATE);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    await serverDB.query('BEGIN');

    //Insert user data
    const sqlInsertUserData = `insert into public.sys_profiles (name_es, is_active, updated_by)
      values ('${payload.name_es}', ${payload.is_active}, '${user_id}') RETURNING id;`;

    const { rows } = await serverDB.query(sqlInsertUserData);
    id = rows[0].id;
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