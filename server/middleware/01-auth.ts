import { unprotectedPaths } from '@/types/unsecuredRoutes';
import { supabaseInstance } from '../utils/supabase';

export default defineEventHandler(async (event) => {
  const requestedURL = await getRequestURL(event);
  const isProtectedPath = requestedURL.pathname.startsWith('/api')
    && !unprotectedPaths.includes(requestedURL.pathname);
  
  if (isProtectedPath) {
    try {
      const sessionCookie = getCookie(event, 'sb-access-token') || '';
      // console.log('01-auth.ts > 001');
      if (!sessionCookie) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized (invalid token found)',
        });
      }
      // console.log('01-auth.ts > 002');
      const userSessionData = await supabaseInstance().supabase.auth.getUser(sessionCookie);
      // console.log('01-auth.ts > 003');
      if (userSessionData.error) {
        // console.log('01-auth.ts > 005 > refresh token section');
        const refreshCookie = getCookie(event, 'sb-refresh-token') || '';
        const newUserSession = await supabaseInstance().supabase.auth.refreshSession({ refresh_token: refreshCookie });
        // console.log('newUserSession > newUserSession.error!!!!', newUserSession.error);
        // console.log('newUserSession', newUserSession.data);
        const sbAccessToken = newUserSession.data.session?.access_token ?? '';
        const sbRefreshToken = newUserSession.data.session?.refresh_token ?? '';
        setCookie(event, 'sb-access-token', sbAccessToken);
        setCookie(event, 'sb-refresh-token', sbRefreshToken);
      }
      // console.log('01-auth.ts > 004');
      event.context.user = userSessionData.data.user;
    } catch(error) {
      throw createError({
        statusCode: 401,
        message: `Unauthorized, ${error}`,
      });
    }
  }
});