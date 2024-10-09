import serverDB from '@@/server/utils/db';
import { booleanFilterItemSchema } from '@/types/filters';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    await requiresUser(event);
    const text = `
      select distinct
        sys_profiles.is_active as id,
        case sys_profiles.is_active when true then 'Activo' else 'Inactivo' end label
      from sys_profiles
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