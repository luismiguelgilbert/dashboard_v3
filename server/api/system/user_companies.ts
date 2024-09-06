import serverDB from '@@/server/utils/db';
import { sys_companies_schema } from '@/types/sys_companies';

export default defineEventHandler(async (event) => {
  try {
    const userCompaniesResultset = await serverDB.query(`
      select
      id
      ,company_number
      ,name_es
      ,INITCAP(name_es_short) as name_es_short
      ,billing_phone
      ,billing_address
      ,is_active
      ,created_at
      ,updated_at
      ,updated_by
      ,avatar_url
      from sys_companies
      order by name_es_short
    `);

    return sys_companies_schema.array().parse(userCompaniesResultset.rows);
  }
  catch (err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
