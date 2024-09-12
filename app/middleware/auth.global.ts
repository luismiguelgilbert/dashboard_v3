import { unprotectedPaths } from '@/types/unsecuredRoutes';

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    const isProtectedPath = !unprotectedPaths.includes(to.fullPath);
    if (isProtectedPath) {
      const mainStore = useMainStore();
      if (mainStore.userMenu.length > 0) {//we need to check data after first load, else let the user fetch data first
        const routeIsAllowed = mainStore.userMenu.some(menu => to.fullPath === menu.link);
        if (!routeIsAllowed) {
          return showError('Privilegios insuficientes!');
        }
      }
    }
  }
});