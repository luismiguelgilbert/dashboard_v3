import serverDB from '@@/server/utils/db';
import { sys_profiles_schema } from '@/types/sys_profiles';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    await requiresUser(event);
    const text = `
      select
      a.id
      ,a.name_es
      ,a.is_active
      ,NOT(a.is_active) as disabled
      from sys_profiles a
      order by a.name_es
    `;
    const data = await serverDB.query(text);
    return sys_profiles_schema.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});