import { unprotectedPaths } from '@/types/unsecuredRoutes';
export default defineNuxtRouteMiddleware(async (to) => {
  const isProtectedPath = !unprotectedPaths.includes(to.path);
  if (isProtectedPath) {
    try {
      // Fetch data if it's not already loaded
      const mainStore = useMainStore();
      const { userData, userCompanies, userMenu } = storeToRefs(mainStore);
      if (!userData.value) { await mainStore.fetchUserData(); }
      if (!userCompanies.value.length) { await mainStore.fetchUserCompanies(); }
      if (!userMenu.value.length) { await mainStore.fetchUserMenu(); }
      // Check if user has permissions for the route
      const routeIsAllowed = mainStore.userMenu.some(menu => to.path === menu.link);
      if (to.path !== '/' && !routeIsAllowed) {
        return showError({ message: 'Privilegios insuficientes!', statusCode: 403, status: 403, statusText: 'Forbidden', fatal: true });
      }
    } catch(error) {
      console.error({error});
      if (to.path !== '/auth/login') {
        return await navigateTo('/auth/login?error=unauthorized');
      }
    }
  }
});