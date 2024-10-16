import serverDB from '@@/server/utils/db';
import { bitacora_cars_schema, bitacora_cars_form_schema } from '@/types/bitacora_cars';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const sys_company_id = getRouterParam(event, 'company');
    await hasPermission(event, PermissionsList.BITACORA_CARS_READ);

    const userDataQuery = `
      SELECT
      a.id,
      a.sys_company_id,
      COALESCE(a.name_es, '') as name_es,
      COALESCE(a.name_es_short, '') as name_es_short,
      COALESCE(a.is_active, false) as is_active,
      NOT(a.is_active) as disabled,
      a.avatar_url
      from bita_cars a
      WHERE a.id = '${id}' and a.sys_company_id = '${sys_company_id}'
    `;

    const results = await Promise.all([
      serverDB.query(userDataQuery),
    ]);
    
    return bitacora_cars_form_schema.parse({
      ...bitacora_cars_schema.array().parse(results[0].rows)[0],
    });
  }catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});