<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore';

const navBarUI = {
  wrapper: 'bg-background/75 backdrop-blur h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 sticky top-0 z-50',
}

const { header } = useAppConfig();
const mainStore = useMainStore();
const route = useRoute();
const {
  leftDrawer,
  userMenu,
  isLoadingMenu,
} = storeToRefs(mainStore);

const links = computed(() => {
  let routes = [];
  routes.push(
    {
      label: 'Home',
      icon: 'i-hugeicons-house-04',
      to: '/'
    }
  );
  const innerRoutes = route.path.split('/').filter(x => x.length);
  innerRoutes.forEach(route => {
    const menuRouteFound = userMenu.value.find(menu => menu.link.includes(route));
    routes.push(
      {
        label: menuRouteFound?.name_es,
        icon: menuRouteFound?.icon,
      }
    );
  })

  return routes;
});
</script>

<template>
  <UDashboardNavbar
    :ui="navBarUI"
    title="Inbox"
    badge="5">
    <template #left>
      <div class="flex items-center">
        <UButton
          variant="ghost"
          color="gray"
          size="lg"
          icon="i-heroicons-bars-3-16-solid"
          @click="leftDrawer = !leftDrawer" />
        <span class="font-bold pl-2">Dashboard</span>
        <UBreadcrumb
          v-if="!isLoadingMenu"
          class="pl-10"
          :links="links" />
      </div>
    </template>
    <template #right>
      <UColorModeButton v-if="header?.colorMode" />
      <UAvatar
        alt="L"
        size="md" />
    </template>
  </UDashboardNavbar>
</template>