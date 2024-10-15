import serverDB from '@@/server/utils/db';
import { bitacora_places_schema, bitacora_places_query_schema } from '@/types/bitacora_places';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler( async (event) => {
  try {
    await hasPermission(event, PermissionsList.BITACORA_PLACES_READ);
    const { data: payload, error } = await readValidatedBody(event, bitacora_places_query_schema.safeParse);
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
      ,a.sys_company_id
      ,INITCAP(a.name_es) as name_es
      ,INITCAP(a.name_es_short) as name_es_short
      ,a.is_active
      ,a.avatar_url
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      , count(*) OVER() AS rows_count
      from bita_places a
      where (1 = 1)
      and a.sys_company_id = '${payload.sys_company_id}' 
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
    return bitacora_places_schema.array().parse(result.rows);
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${err}`,
    });
  }
});