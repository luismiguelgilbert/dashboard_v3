import serverDB from '@@/server/utils/db';
import { sys_companies_schema } from '@/types/sys_companies';
import { requiresUser } from '@@/server/utils/handler';

export default defineEventHandler( async (event) => {
  try{
    await requiresUser(event);
    const text = `
      SELECT
      a.id,
      a.company_number,
      a.name_es,
      a.name_es_short,
      a.billing_phone,
      a.billing_address,
      a.avatar_url
      from sys_companies a
      order by a.name_es_short
    `;
    const data = await serverDB.query(text);
    return sys_companies_schema.array().parse(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});