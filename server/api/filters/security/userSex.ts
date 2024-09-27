import serverDB from '@@/server/utils/db';
import { booleanFilterItemSchema } from '@/types/filters';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    await requiresUser(event);
    const text = `
      select distinct
        sys_users.user_sex as id,
        case sys_users.user_sex when true then 'Hombre' else 'Mujer' end label
      from sys_users
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