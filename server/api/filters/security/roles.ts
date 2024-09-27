import serverDB from '@@/server/utils/db';
import { numericFilterItemSchema } from '@/types/filters';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    await requiresUser(event);
    const text = `
      select
      id
      ,initcap(name_es) as label
      from sys_profiles
      order by name_es
    `;
    const data = await serverDB.query(text);
    return numericFilterItemSchema.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});