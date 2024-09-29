import type { H3Event } from 'h3';
import { decryptData } from '~~/server/utils/encrypt';
import type { PermissionsList } from '@/types/permissionsEnum';

export const requiresUser = async (event: H3Event) => {
  try {
    const sessionCookie = getCookie(event, 'sb-access-token') || '';
    if (!sessionCookie) throw createError({ status: 401, statusMessage: 'Unauthorized' });
    const userSessionData = await supabaseInstance().supabase.auth.getUser(sessionCookie);
    if (!userSessionData.error) event.context.user = userSessionData.data.user;
    // Refresh session
    // console.log('No session, or expired; refreshing');
    // if (userSessionData.error) {
    //   console.log('should I catch session expired here?');
    //   const refreshCookie = getCookie(event, 'sb-refresh-token') || '';
    //   console.log('refreshCookie', refreshCookie);
    //   const newUserSession = await supabaseInstance().supabase.auth.refreshSession({ refresh_token: refreshCookie });
    //   const sbAccessToken = newUserSession.data.session?.access_token ?? '';
    //   const sbRefreshToken = newUserSession.data.session?.refresh_token ?? '';
    //   setCookie(event, 'sb-access-token', sbAccessToken);
    //   setCookie(event, 'sb-refresh-token', sbRefreshToken);
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
      throw createError({ status: 401, statusMessage: 'Menu token error' });
    }
  } catch (error) {
    console.error(`User does not have permission: ${permission}`);
    console.log(error);
    throw createError({ status: 401, statusMessage: 'Menu token error' });
  }
};

export function useSanitizeParams(eventContextParams: Record<string, string> | undefined) {
  if (eventContextParams) {
    Object.keys(eventContextParams).forEach(function(key) {
      eventContextParams[key] = eventContextParams[key].replaceAll(':','');
    });
  }
  return eventContextParams;
}