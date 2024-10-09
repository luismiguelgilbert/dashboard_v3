import serverDB from '@@/server/utils/db';
import Excel from 'exceljs';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';
import { sys_profiles_query_download_schema } from '@/types/sys_profiles';

export default defineEventHandler( async (event) => {
  try{
    await hasPermission(event, PermissionsList.ROLES_EXPORT);
    const { data: payload, error } = await readValidatedBody(event, sys_profiles_query_download_schema.safeParse);
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
    `;

    console.time(`${event.method} ${event.path}`);
    const data = await serverDB.query(userDataQuery);
    console.timeEnd(`${event.method} ${event.path}`);
    
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('Usuarios');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 15  },
      { key: 'name_es', header: 'Perfil', width: 25 },
      { key: 'is_active', header: 'Estado', width: 10 },
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
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});