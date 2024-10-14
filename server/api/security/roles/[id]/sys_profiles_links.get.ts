import serverDB from '@@/server/utils/db';
import { sys_profiles_link_schema } from '@/types/sys_links';
import { useSanitizeParams, hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    await hasPermission(event, PermissionsList.ROLES_READ);

    const userDataQuery = `
      SELECT
      a.sys_link_id
      from sys_profiles_links a
      WHERE a.sys_profile_id = '${id}'
    `;

    const results = await Promise.all([
      serverDB.query(userDataQuery),
    ]);
    
    return sys_profiles_link_schema.array().parse(results[0].rows);
  }catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});