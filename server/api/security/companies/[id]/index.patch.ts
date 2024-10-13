import serverDB from '@@/server/utils/db';
import { sys_companies_form_schema } from '@/types/sys_companies';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.COMPANIES_EDIT);
    const { data: payload, error } = await readValidatedBody(event, sys_companies_form_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const user_id = event.context.user.id;

    await serverDB.query('BEGIN');

    const companiesDataQuery = `
      UPDATE sys_companies SET
      company_number = '${payload.company_number}',
      name_es = '${payload.name_es}',
      name_es_short = '${payload.name_es_short}',
      billing_phone = '${payload.billing_phone}',
      billing_address = '${payload.billing_address}',
      is_active = ${payload.is_active},
      updated_by = '${user_id}'
      
      where id = '${id}'
    `;
    
    await serverDB.query(companiesDataQuery);

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