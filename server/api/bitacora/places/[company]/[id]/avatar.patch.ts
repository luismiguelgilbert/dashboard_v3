import serverDB from '@@/server/utils/db';
import { PermissionsList } from '@/types/permissionsEnum';

export default defineEventHandler(async(event) => {
  try {
    event.context.params = useSanitizeParams(event.context.params);
    const id = getRouterParam(event, 'id');
    const sys_company_id = getRouterParam(event, 'company');
    await requiresUser(event);
    await hasPermission(event, PermissionsList.BITACORA_PLACES_EDIT);
    const files = await readMultipartFormData(event);
    if (files && files[0]) {
      const fileExt = files[0].filename?.split('.').pop();
      const newfilename = `${id}.${fileExt}`;
  
      const { data: avatarData, error: avatarError } = await supabaseInstance().supabase.storage
        .from('avatars')
        .upload(newfilename, files[0].data,
          {contentType: 'image', cacheControl: '100', upsert: true}
        );
      
      if (!avatarError && avatarData) {
        const { data } = await supabaseInstance().supabase.storage
          .from('avatars')
          .getPublicUrl(avatarData.path);
  
        const sqlUpdateUserData = `update bita_places set
        avatar_url = COALESCE('${data.publicUrl}', avatar_url)
        WHERE bita_places.id = '${id}' and bita_places.sys_company_id = '${sys_company_id}'`;
        await serverDB.query(sqlUpdateUserData);
        return new Response('Avatar updated', { status: 200 });
      }
    }
  } catch(err) {
    console.error(`Error at ${event.method} ${event.path}. ${err}`);
    await serverDB.query('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});