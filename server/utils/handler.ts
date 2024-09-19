import type { H3Event } from 'h3';
import { decryptData } from '~~/server/utils/encrypt';
import type { PermissionsList } from '@/types/permissionsEnum';

export const requiresUser = async (event: H3Event) => {
  try {
    const sessionCookie = getCookie(event, 'sb-access-token') || '';
    if (!sessionCookie) throw createError({ status: 401, statusMessage: 'Unauthorized' });
    const userSessionData = await supabaseInstance().supabase.auth.getUser(sessionCookie);
    if (!userSessionData.error) event.context.user = userSessionData.data.user;
    // if (userSessionData.error) {
      // const refreshCookie = getCookie(event, 'sb-refresh-token') || '';
      // const newUserSession = await supabaseInstance().supabase.auth.refreshSession({ refresh_token: refreshCookie });
      // const sbAccessToken = newUserSession.data.session?.access_token ?? '';
      // const sbRefreshToken = newUserSession.data.session?.refresh_token ?? '';
      // setCookie(event, 'sb-access-token', sbAccessToken);
      // setCookie(event, 'sb-refresh-token', sbRefreshToken);
    // }
    return event;
  } catch (error) {
    console.error(error);
    throw createError({ status: 401, statusMessage: 'Session error' });
  }
};

export const hasPermission = (event: H3Event, permission: PermissionsList) => {
  try {
    const menuToken = getCookie(event, 'sb-menu-token') || '';
    const userMenuToken = JSON.parse(decryptData(menuToken)) as {id: string}[];
    if (!userMenuToken.some((item) => item.id === permission)) {
      throw createError({ status: 401, statusMessage: 'Session error' });
    }
  } catch (error) {
    console.error(`User does not have permission: ${permission}`, error);
    throw createError({ status: 401, statusMessage: 'Menu token error' });
  }
};