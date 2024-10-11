import serverDB from '@@/server/utils/db';
import { sys_companies_schema, sys_companies_query_schema } from '@/types/sys_companies';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler( async (event) => {
  try {
    await hasPermission(event, PermissionsList.USERS_READ);
    const { data: payload, error } = await readValidatedBody(event, sys_companies_query_schema.safeParse);
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
      ,INITCAP(a.name_es_short) as name_es_short
      ,a.company_number
      ,a.billing_phone
      ,a.billing_address
      ,a.is_active
      ,a.avatar_url
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      , count(*) OVER() AS rows_count
      from sys_companies a
      where (1 = 1)
      ${payload.searchString?.length > 0
        ? `and (
            a.name_es &@ '${payload.searchString}'
            or a.name_es_short &@ '${payload.searchString}'
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
    return sys_companies_schema.array().parse(result.rows);
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${err}`,
    });
  }
});