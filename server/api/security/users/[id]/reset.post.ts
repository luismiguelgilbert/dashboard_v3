import serverDB from '@@/server/utils/db';
import { sys_users_password_reset_schema } from '@/types/sys_users';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    await requiresUser(event);
    await hasPermission(event, PermissionsList.USERS_EDIT);
    const { data: payload, error } = await readValidatedBody(event, sys_users_password_reset_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    const { error: updateError  } = await supabaseInstance().supabase.auth.admin.updateUserById(payload.id, {
      password: payload.password
    });

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: updateError?.message ?? 'Unhandled exception' });
    }

    await serverDB.query('BEGIN');

    const userDataQuery = `
      UPDATE sys_users SET
      updated_by = '${user_id}'
      where id = '${payload.id}'
    `;

    await serverDB.query(userDataQuery);

    await serverDB.query('COMMIT');

    return await event.$fetch(`/api/security/users/:${payload.id}`);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});