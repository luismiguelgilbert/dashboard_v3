import serverDB from '@@/server/utils/db';
import { sys_profiles_schema, sys_profiles_form_schema } from '@/types/sys_profiles';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    await hasPermission(event, PermissionsList.ROLES_READ);

    const userDataQuery = `
      SELECT
      a.id,
      COALESCE(a.name_es, '') as name_es,
      COALESCE(a.is_active, false) as is_active
      from sys_profiles a
      WHERE a.id = '${id}'
    `;

    const results = await Promise.all([
      serverDB.query(userDataQuery),
    ]);
    
    return sys_profiles_form_schema.parse({
      ...sys_profiles_schema.array().parse(results[0].rows)[0],
    });
  }catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});