import { unprotectedPaths } from '@/types/unsecuredRoutes';

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    const isProtectedPath = !unprotectedPaths.includes(to.fullPath);
    if (isProtectedPath) {
      const mainStore = useMainStore();
      const routeIsAllowed = mainStore.userMenu.some(menu => to.fullPath.includes(menu.link));
      if (!routeIsAllowed) {
        return showError('Privilengios insuficientes!');
      }
    }
  }
});