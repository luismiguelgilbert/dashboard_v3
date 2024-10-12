import serverDB from '@@/server/utils/db';
import { sys_companies_schema, sys_companies_form_schema } from '@/types/sys_companies';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    await hasPermission(event, PermissionsList.COMPANIES_READ);

    const userDataQuery = `
      SELECT
      a.id,
      a.company_number,
      COALESCE(a.name_es, '') as name_es,
      COALESCE(a.name_es_short, '') as name_es_short,
      COALESCE(a.billing_phone, '') as billing_phone,
      COALESCE(a.billing_address, '') as billing_address,
      COALESCE(a.is_active, false) as is_active,
      NOT(a.is_active) as disabled,
      a.avatar_url
      from sys_companies a
      WHERE a.id = '${id}'
    `;

    const results = await Promise.all([
      serverDB.query(userDataQuery),
    ]);
    
    return sys_companies_form_schema.parse({
      ...sys_companies_schema.array().parse(results[0].rows)[0],
    });
  }catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});