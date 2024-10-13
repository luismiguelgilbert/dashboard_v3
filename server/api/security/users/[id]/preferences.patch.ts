import serverDB from '@@/server/utils/db';
import { sys_users_preferences_schema } from '@/types/sys_users';

export default defineEventHandler(async(event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    await requiresUser(event);
    const { data: payload, error } = await readValidatedBody(event, sys_users_preferences_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    const sqlUpdateUserData = `UPDATE sys_users SET
      dark_enabled = ${payload.dark_enabled},
      default_color = '${payload.default_color}',
      default_dark_color = '${payload.default_dark_color}',
      updated_at = now(),
      updated_by = '${user_id}'
    WHERE id = '${user_id}'`;
    await serverDB.query(sqlUpdateUserData);
  } catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});