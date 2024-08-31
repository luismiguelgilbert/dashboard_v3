import serverDB from '@@/server/utils/db';
import { sys_companies_schema } from '@/types/sys_companies';

export default defineEventHandler( async (event) => {
  try{
    const userCompaniesResultset = await serverDB.query(`
      select
      *
      from sys_companies
    `);
    
    return sys_companies_schema.array().parse(userCompaniesResultset.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});
