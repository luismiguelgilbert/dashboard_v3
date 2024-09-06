<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore';

const navBarUI = {
  wrapper: 'bg-background/75 backdrop-blur h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 sticky top-0 z-50',
};

const { header } = useAppConfig();
const mainStore = useMainStore();
const route = useRoute();
const {
  isMobile,
  leftDrawer,
  userMenu,
  isLoadingMenu,
  showBadge,
  badgeLabel,
} = storeToRefs(mainStore);

const links = computed(() => {
  const routes = [];
  routes.push(
    {
      label: 'Inicio',
      icon: 'i-hugeicons-house-04',
      to: '/',
    },
  );
  const innerRoutes = route.path.split('/').filter(x => x.length);
  innerRoutes.forEach((route) => {
    const menuRouteFound = userMenu.value.find(menu => menu.link.includes(route));
    routes.push(
      {
        label: menuRouteFound?.name_es,
        icon: menuRouteFound?.icon,
      },
    );
  });

  return !isMobile.value ? routes : routes.slice(-1);
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
        <span class="font-bold pl-2 hidden sm:block">Dashboard</span>
        <UBreadcrumb
          v-if="!isLoadingMenu"
          class="pl-1 sm:pl-10 overflow-hidden text-wrap max-w-[calc(100dvw-180px)] sm:max-w-full"
          :links="links" />
        <UBadge
          v-if="showBadge"
          variant="subtle"
          class="ml-2">
          {{ badgeLabel }}
        </UBadge>
      </div>
    </template>
    <template #right>
      <UColorModeButton
        v-if="header?.colorMode"
        class="my-2" />
      <UButton
        variant="ghost"
        color="gray"
        :ui="{ rounded: 'rounded-xl' }"
        to="/">
        <UAvatar
          alt="L"
          size="sm" />
      </UButton>
    </template>
  </UDashboardNavbar>
</template>
