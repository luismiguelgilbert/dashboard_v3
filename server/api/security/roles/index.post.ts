import serverDB from '@@/server/utils/db';
import { sys_profiles_schema, sys_profiles_query_schema } from '@/types/sys_profiles';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler( async (event) => {
  try {
    await hasPermission(event, PermissionsList.USERS_READ);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_query_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const pageSize = payload.pageSize > 0 ? payload.pageSize : 50;
    const page = payload.page > 0 ? payload.page : 1;
    const sortBy = payload.sortBy;
    const offset = pageSize * (page - 1);

    //QUERIES
    const userDataQuery = `
      select
       a.id
      ,INITCAP(a.name_es) as name_es
      ,a.is_active
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      , count(*) OVER() AS rows_count
      from sys_profiles a
      where (1 = 1)
      ${payload.searchString?.length > 0
        ? `and (
            a.name_es &@ '${payload.searchString}'
          )`
        : ''
      }
      ${payload.filterIsActive?.length > 0
        ? `and (a.is_active in (${payload.filterIsActive}))`
        : ''
      }
      ORDER BY ${ sortBy }
      OFFSET ${ offset }
      LIMIT ${ pageSize }
    `;

    console.time(`${event.method} ${event.path}`);
    const result = await serverDB.query(userDataQuery);
    console.timeEnd(`${event.method} ${event.path}`);
    return sys_profiles_schema.array().parse(result.rows);
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${err}`,
    });
  }
});