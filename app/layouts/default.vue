<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import SkeletonHeader from '~/components/SkeletonHeader.vue';

const mainStore = useMainStore();
const route = useRoute();
const {
  isLoadingCompanies,
  isLoadingMenu,
  isUserSessionValid,
  leftDrawer,
  userCompanies,
  userMenuFormatted,
  userSession,
} = storeToRefs(mainStore);
const { start, finish } = useLoadingIndicator();
const sidebarLinksUI = {
  label: 'text-lg lg:text-sm truncate relative',
  active: 'text-primary-500 dark:text-primary-400 before:bg-gray-100 dark:before:bg-gray-800',
  dot: {
    wrapper: 'w-px h-full mx-[9.5px] bg-gray-200 dark:bg-gray-700 relative',
    after: 'after:absolute after:z-[1] after:w-px after:h-full after:bg-gray-200 after:dark:bg-gray-700 after:transform after:translate-y-full',
    base: 'w-1 h-1 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    active: 'bg-primary-400 dark:bg-primary',
    inactive: 'bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-700 dark:group-hover:bg-gray-200'
  },
};
type screenSize = 'mobile' | 'tablet' | 'desktop';
const myScreenSize = computed<screenSize>(() => {
  const isClient = import.meta.client;
  if (isClient) {
    const { width } = useWindowSize();
    if (width.value < 768) { return 'mobile' }
    if (width.value < 1024) { return 'tablet' }
    return 'desktop';
  }
  return 'desktop';
});

//ACTIONS
const logout = async(error?: string) => {
  start();
  const { supabase } = useSupabase();
  await supabase.auth.signOut();
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  isUserSessionValid.value = false;
  error?.length
    ? await navigateTo(`/auth/login${error ?? ''}`)
    : await navigateTo('/auth/login');
  finish();
};

const refreshSessionOrLogout = async() => {
  start();
  const { supabase } = useSupabase();
  const { data, error } = await supabase.auth.refreshSession();
  userSession.value = data.session;
  if (error) {
    console.error('Error refreshing session', error);
    isUserSessionValid.value = false;
    finish();
    logout('?error=session_expired');
    return;
  }
  finish();
};

//HOOKS and WATCHERS
onMounted(() => {
  import.meta.client && refreshSessionOrLogout();
  import.meta.client && mainStore.fetchUserCompanies();
  import.meta.client && mainStore.fetchUserMenu();
});

watch(() => isUserSessionValid.value, (value) => {
  if (!value) {
    refreshSessionOrLogout();
  }
});

watch(() => route.fullPath, () => {
  if (myScreenSize.value === 'mobile') {
    leftDrawer.value = false;
  }
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
      <UPage>
        <AppHeader />

        <div v-if="myScreenSize === 'mobile'">
          <USlideover
            v-model="leftDrawer"
            prevent-close
            side="left">
            <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Slideover
                  </h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="leftDrawer = false" />
                </div>
              </template>

              <SkeletonHeader
                v-if="isLoadingMenu"
                v-for="n in 5" />
              <UDashboardSidebarLinks
                v-else
                :links="userMenuFormatted"
                :ui="sidebarLinksUI" />
            </UCard>
          </USlideover>
          <NuxtPage />
        </div>

        <div v-if="myScreenSize !== 'mobile'">
          <UDashboardLayout>
            <UDashboardPanel
              v-if="leftDrawer"
              class="bg-gray-50"
              resizable>
              <UDashboardPanelContent class="mt-14">
                <SkeletonHeader
                  class="py-1"
                  v-if="isLoadingMenu"
                  v-for="n in 5" />
                <UDashboardSidebarLinks
                  v-else
                  :links="userMenuFormatted"
                  :ui="sidebarLinksUI" />
              </UDashboardPanelContent>
            </UDashboardPanel>

            <UDashboardPanel grow>
              <UDashboardPanelContent class="mt-12">
                <NuxtPage />
              </UDashboardPanelContent>
            </UDashboardPanel>

          </UDashboardLayout>
        </div>
      </UPage>
    <UNotifications />
  </div>
</template>