import serverDB from '@@/server/utils/db';
import { booleanFilterItemSchema } from '@/types/filters';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    await requiresUser(event);
    const id = getRouterParam(event, 'id');
    const text = `
      select distinct
      bita_places.is_active as id,
      case bita_places.is_active when true then 'Activo' else 'Inactivo' end label
      from bita_places
      where bita_places.sys_company_id = '${id}'
      `;
    const data = await serverDB.query(text);
    return booleanFilterItemSchema.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});