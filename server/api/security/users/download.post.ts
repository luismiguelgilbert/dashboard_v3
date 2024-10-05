import serverDB from '@@/server/utils/db';
import Excel from 'exceljs';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';
import { sys_users_query_download_schema } from '@/types/sys_users';

export default defineEventHandler( async (event) => {
  try{
    await hasPermission(event, PermissionsList.USERS_EXPORT);
    const { data: payload, error } = await readValidatedBody(event, sys_users_query_download_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    const sortBy = payload.sortBy;

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
    `;

    console.time(`${event.method} ${event.path}`);
    const data = await serverDB.query(userDataQuery);
    console.timeEnd(`${event.method} ${event.path}`);
    
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 50  },
      { key: 'user_name', header: 'Nombres', width: 25 },
      { key: 'user_lastname', header: 'Apellidos', width: 25 },
      { key: 'user_sex', header: 'Sexo', width: 10 },
      { key: 'email', header: 'Email', width: 35 },
      { key: 'sys_profile_name', header: 'Perfil', width: 25 },
      { key: 'last_sign_in_at', header: 'Último_Ingreso', width: 25 },
      { key: 'created_at', header: 'Fecha_Creación', width: 25 },
      { key: 'updated_at', header: 'Fecha_Actualización', width: 25 },
    ];
    worksheet.columns = fileColumns;
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.views = [{state: 'frozen', ySplit: 1}];
    worksheet.addRows(data.rows);
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return await workbook.xlsx.writeBuffer();
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});