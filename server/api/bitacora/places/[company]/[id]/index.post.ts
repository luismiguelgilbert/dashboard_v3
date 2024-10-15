import serverDB from '@@/server/utils/db';
import { bitacora_places_form_schema } from '@/types/bitacora_places';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const sys_company_id = getRouterParam(event, 'company');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.COMPANIES_CREATE);
    const { data: payload, error } = await readValidatedBody(event, bitacora_places_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    await serverDB.query('BEGIN');

    //Insert user data
    const sqlInsertData = `insert into bita_places (sys_company_id, name_es, name_es_short, is_active, updated_by)
      values ('${sys_company_id}', '${payload.name_es}', '${payload.name_es_short}', ${payload.is_active}, '${user_id}') RETURNING id;`;

    const { rows } = await serverDB.query(sqlInsertData);
    const id = rows[0].id;

    await serverDB.query('COMMIT');

    return await event.$fetch(`/api/bitacora/places/:${sys_company_id}/:${id}`);
  } catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});