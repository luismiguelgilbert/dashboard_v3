import { unprotectedPaths } from '@/types/unsecuredRoutes';

export default defineNuxtRouteMiddleware(to => {
  if (import.meta.client) {
    const isProtectedPath = !unprotectedPaths.includes(to.path);
    if (isProtectedPath) {
      const mainStore = useMainStore();
      if (mainStore.userMenu.length > 0) {//we need to check data after first load, else let the user fetch data first
        const routeIsAllowed = mainStore.userMenu.some(menu => to.path === menu.link);
        if (!routeIsAllowed) {
          return showError({ message: 'Privilegios insuficientes!', statusCode: 403, status: 403, statusText: 'Forbidden', fatal: true });
        }
      }
    }
  }
});