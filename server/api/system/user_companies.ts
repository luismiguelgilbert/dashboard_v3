import serverDB from '@@/server/utils/db';
import { requiresUser } from '@@/server/utils/handler';
import { sys_companies_schema } from '@/types/sys_companies';

export default defineEventHandler(async (event) => {
  try {
    await requiresUser(event);
    const user_id = event.context.user.id;
    const query = await serverDB.query(`
      with userCompanies as (
        select *
        from sys_companies_users
        where user_id = '${user_id}'
      )
      select
      a.id
      ,a.company_number
      ,a.name_es
      ,INITCAP(a.name_es_short) as name_es_short
      ,a.billing_phone
      ,a.billing_address
      ,a.is_active
      ,a.created_at
      ,a.updated_at
      ,a.updated_by
      ,a.avatar_url
      ,b.is_default
      from sys_companies a
      inner join userCompanies b on a.id = b.sys_company_id
      order by a.name_es_short
    `);

    return sys_companies_schema.array().parse(query.rows);
  }
  catch (err) {
    console.error(`Error at ${event.path}: ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
