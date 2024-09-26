<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';

const mainStore = useMainStore();
const route = useRoute();
const {
  isMobile,
  isLoadingMenu,
  leftDrawer,
  userMenuFormatted,
  showBadge,
  badgeLabel,
  isDarkMode,
  userData,
} = storeToRefs(mainStore);

const sidebarLinksUI = {
  label: 'text-lg lg:text-sm truncate relative',
  active: 'text-primary-500 dark:text-primary-400 before:bg-gray-100 dark:before:bg-gray-800',
  dot: {
    wrapper: 'w-px h-full mx-[9.5px] bg-gray-200 dark:bg-gray-700 relative',
    after: 'after:absolute after:z-[1] after:w-px after:h-full after:bg-gray-200 after:dark:bg-gray-700 after:transform after:translate-y-full',
    base: 'w-1 h-1 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    active: 'bg-primary-400 dark:bg-primary',
    inactive: 'bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-700 dark:group-hover:bg-gray-200',
  },
};
type screenSize = 'mobile' | 'tablet' | 'desktop'
const myScreenSize = computed<screenSize>(() => {
  const isClient = import.meta.client;
  if (isClient) {
    const { width } = useWindowSize();
    if (width.value < 768) { return 'mobile'; }
    if (width.value < 1024) { return 'tablet'; }
    return 'desktop';
  }
  return 'desktop';
});

const handleSpecialColors = () => {
  if (userData.value?.default_color === 'bitt') {
    if (isDarkMode.value) {
      useAppConfig().ui.primary = 'indigo';
    } else {
      useAppConfig().ui.primary = 'bitt';
    }
  }
};
// HOOKS and WATCHERS
onMounted(async () => {
  if (import.meta.client) {
    isMobile.value = myScreenSize.value === 'mobile'; 
    useAppConfig().ui.primary = userData.value?.default_color ?? 'bitt';
    handleSpecialColors();
  }
});

watch(() => route.fullPath, () => {
  showBadge.value = false;
  badgeLabel.value = '';
  if (myScreenSize.value === 'mobile') {
    leftDrawer.value = false;
  }
});

watch(() => myScreenSize.value, () => isMobile.value = myScreenSize.value === 'mobile');
watch(() => isDarkMode.value, () => handleSpecialColors());
</script>

<template>
  <div>
    <BittAppHeader />
    <UContainer
      :ui="{
        base: 'mx-0',
        padding: 'px-0 sm:px-0 lg:px-0',
        constrained: 'max-w-full',
      }">
      <UPage
        :ui="{
          wrapper: 'flex flex-col lg:grid lg:grid-cols-10 lg:gap-0',
        }">
        <template
          v-if="leftDrawer"
          #left>
          <div class="h-[calc(100dvh-65px)] min-w-48 overflow-y-auto px-2 pt-2 border-r-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <BittSkeletonHeader
              v-if="isLoadingMenu"
              :lines="5" />
            <UDashboardSidebarLinks
              v-else
              no-prefetch
              :links="userMenuFormatted"
              :ui="sidebarLinksUI" />
            <br />
          </div>
        </template>
  
        <div class="h-[calc(100dvh-65px)] overflow-y-auto">
          <suspense>
            <NuxtPage />
          </suspense>
        </div>
      </UPage>
    </UContainer>
  </div>
</template>
