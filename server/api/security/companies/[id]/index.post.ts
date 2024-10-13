import serverDB from '@@/server/utils/db';
import { sys_companies_form_schema } from '@/types/sys_companies';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    let id = getRouterParam(event, 'id');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.COMPANIES_CREATE);
    const { data: payload, error } = await readValidatedBody(event, sys_companies_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    await serverDB.query('BEGIN');

    //Insert user data
    const sqlInsertData = `insert into sys_companies (company_number, name_es, name_es_short, billing_phone, billing_address, is_active, updated_by)
      values ('${payload.company_number}', '${payload.name_es}', '${payload.name_es_short}','${payload.billing_phone}','${payload.billing_address}', ${payload.is_active}, '${user_id}') RETURNING id;`;

    const { rows } = await serverDB.query(sqlInsertData);
    id = rows[0].id;

    await serverDB.query('COMMIT');

    return await event.$fetch(`/api/security/companies/:${id}`);
  } catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});