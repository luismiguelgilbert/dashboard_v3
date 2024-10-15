import serverDB from '@@/server/utils/db';
import Excel from 'exceljs';
import { hasPermission } from '@@/server/utils/handler';
import { PermissionsList } from '@/types/permissionsEnum';
import { bitacora_places_query_download_schema } from '@/types/bitacora_places';

export default defineEventHandler( async (event) => {
  try{
    await hasPermission(event, PermissionsList.BITACORA_PLACES_EXPORT);
    const { data: payload, error } = await readValidatedBody(event, bitacora_places_query_download_schema.safeParse);
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
    `;

    console.time(`${event.method} ${event.path}`);
    const data = await serverDB.query(userDataQuery);
    console.timeEnd(`${event.method} ${event.path}`);
    
    const workbook = new Excel.Workbook();
    const worksheet = await workbook.addWorksheet('PuntosDeControl');
    const fileColumns = [
      { key: 'id', header: 'Código', width: 35  },
      { key: 'name_es_short', header: 'Nombre', width: 20 },
      { key: 'name_es', header: 'Razón Social', width: 30 },
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