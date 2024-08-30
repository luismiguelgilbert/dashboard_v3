<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore';

// import type { NavItem } from '@nuxt/content'

// const navigation = inject<NavItem[]>('navigation', [])
const headerUI = {
  // container: 'bg-primary-500 pl-0 ml-0',
  // container: 'pl-0',
  // left: 'lg:flex-1 flex items-center gap-1.5',
  panel: {
    wrapper: 'fixed inset-0 z-50 overflow-y-auto bg-background lg:hidden',
    // header: 'px-4 sm:px-6',
    // header: 'px-0 sm:px-0',
    // header: '',
    // body: 'px-4 sm:px-6 pt-3 pb-6'
    // body: 'px-0 sm:px-0 pt-3 pb-6 '
    // body: 'px-0 sm:px-0 pt-3 pb-6'
  },
  button: {
    base: 'hidden',
    // base: '',
    icon: {
      open: 'i-heroicons-bars-3-20-solid',
      close: 'i-heroicons-x-mark-20-solid'
    }
  }
}
const navBarUI = {
  // wrapper: 'bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px sticky top-0 z-50', 
  wrapper: 'bg-background/75 backdrop-blur h-[--header-height] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 sticky top-0 z-50',
}

const { header } = useAppConfig();
const mainStore = useMainStore();
const { leftDrawer } = storeToRefs(mainStore);
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
      </div>
    </template>
    <template #right>
      <UColorModeButton v-if="header?.colorMode" />
      <UAvatar
        alt="L"
        size="md" />
    </template>
  </UDashboardNavbar>

  <!-- <UHeader :ui="headerUI">
    <template #left>
      <UButton
        variant="ghost"
        color="gray"
        size="lg"
        icon="i-heroicons-bars-3-16-solid"
        @click="leftDrawer = !leftDrawer" />
      <span class="font-bold">Dashboard</span>
      <UBadge
        label="Docs"
        variant="subtle"
        class="mb-0.5" />
    </template>

    <template #right>
      <UColorModeButton v-if="header?.colorMode" />
    </template>
  </UHeader> -->
</template>