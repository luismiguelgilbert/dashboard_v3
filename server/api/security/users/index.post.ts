import serverDB from '@@/server/utils/db';
import { sys_users_schema, sys_users_query_schema } from '@/types/sys_users';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler( async (event) => {
  try {
    await hasPermission(event, PermissionsList.USERS_READ);
    const { data: payload, error } = await readValidatedBody(event, sys_users_query_schema.safeParse);
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
      ,INITCAP(a.user_name) as user_name
      ,INITCAP(a.user_lastname) as user_lastname
      ,a.user_sex
      ,a.avatar_url
      ,a.website
      ,a.website as email
      ,a.sys_profile_id
      ,INITCAP(a.sys_profile_name) as sys_profile_name
      ,a.default_color
      ,a.default_dark_color
      ,a.dark_enabled
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
      ,to_char (now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as last_sign_in_at
      , count(*) OVER() AS rows_count
      from sys_users a
      where (1 = 1)
      ${payload.searchString?.length > 0
        ? `and (
            a.user_name &@ '${payload.searchString}'
            or a.user_lastname &@ '${payload.searchString}'
            or a.website &@ '${payload.searchString}'
            or a.sys_profile_name &@ '${payload.searchString}'
          )`
        : ''
      }
      ${payload.filterProfile?.length > 0
        ? `and (a.sys_profile_id in (${payload.filterProfile}))`
        : ''
      }
      ${payload.filterSex?.length > 0
        ? `and (a.user_sex in (${payload.filterSex}))`
        : ''
      }
      ORDER BY ${ sortBy }
      OFFSET ${ offset }
      LIMIT ${ pageSize }
    `;

    console.time(`${event.method} ${event.path}`);
    const result = await serverDB.query(userDataQuery);
    console.timeEnd(`${event.method} ${event.path}`);
    return sys_users_schema.array().parse(result.rows);
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error: ${err}`,
    });
  }
});