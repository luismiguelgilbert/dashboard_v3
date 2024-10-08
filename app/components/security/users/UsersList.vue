<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import type { sys_users } from '@/types/sys_users';

const emits = defineEmits(['row-click', 'data-request']);

const mainStore = useMainStore();
const usersStore = useUsersStore();
const { isMobile, isDarkMode } = storeToRefs(mainStore);
const {
  searchString,
  isLoading,
  totalRows,
  page,
  pageSize,
  filterProfile,
  filterSex,
  hasFilter,
  sortBy,
} = storeToRefs(usersStore);
const searchStringDebounced = refDebounced(searchString, 250);
const rows = shallowRef<sys_users[]>([]);
const mainTable = useTemplateRef('mainTable');
const columns = computed(() => [
  { key: 'id', label: '', class: 'hidden' },
  { key: 'name', label: 'Name', class: 'hidden' },
  { key: 'mail', label: 'Email', class: 'hidden' },
  { key: 'sex', label: 'Sexo', class: 'hidden' },
  { key: 'profile', label: 'Profile', class: 'hidden' },
].filter(x => (isMobile.value && ['id', 'name'].includes(x.key)) || (!isMobile.value))
);

const refreshData = async () => {
  try {
    isLoading.value = true;
    const resultSet = await $fetch('/api/security/users', {
      method: 'POST',
      body: {
        searchString: searchString.value.toLocaleLowerCase().replaceAll(' ', ''),
        filterProfile: filterProfile.value,
        filterSex: filterSex.value,
        page: page.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
      }
    });
    totalRows.value = resultSet[0]?.rows_count ?? 0;
    rows.value = resultSet!;
    mainTable.value?.$el.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
    if (import.meta.client) {
      useToast().add({
        title: 'Error al cargar datos',
        icon: 'i-hugeicons-settings-error-01',
        color: 'rose',
      });
    }
  } finally {
    isLoading.value = false;
  }
};
const selectRow = (row: sys_users) => emits('row-click', row);

watch(() => sortBy.value, () => { refreshData(); }, { deep: true });
watch(() => [
  searchStringDebounced.value,
  filterProfile.value,
  filterSex.value
], () => { page.value = 1; refreshData(); }, { deep: true });
refreshData();
</script>

<template>
  <div>  
    <UTable
      ref="mainTable"
      class="h-[calc(100dvh-185px)] w-full overflow-x-hidden"
      :columns="columns"
      :rows="rows"
      :loading="isLoading"
      @select="selectRow">
      <template #id-data="{row} : {row: sys_users}">
        <UAvatar
          v-if="row.avatar_url"
          :src="row.avatar_url"
          size="sm"
          alt="Avatar" />
        <UAvatar
          v-else
          :alt="row.user_lastname[0]"
          size="sm" />
      </template>
      <template #name-data="{row} : {row: sys_users}">
        <span class="text-xs sm:text-base font-semibold dark:text-white text-black truncate text-ellipsis">
          {{ row.user_name }} {{ row.user_lastname }}
        </span>
        <p class="flex sm:hidden text-xs truncate text-ellipsis">
          {{ row.website }}
        </p>
      </template>
      <template #mail-data="{row} : {row: sys_users}">
        <span class="hidden sm:flex text-xs text-gray-500 dark:text-gray-400 truncate text-ellipsis">
          {{ row.website }}
        </span>
      </template>
      <template #sex-data="{row} : {row: sys_users}">
        {{ row.user_sex ? 'Hombre' : 'Mujer' }}
      </template>
      <template #profile-data="{row} : {row: sys_users}">
        <UBadge
          variant="solid"
          :color="isDarkMode ? 'gray' : 'white'"
          size="lg">
          {{ row.sys_profile_name }}
        </UBadge>
      </template>
    </UTable>
    <UDivider />
    <div class="flex justify-between items-center p-2">
      <!--Left-->
      <div class="flex items-center">
        <UPagination
          v-model="page"
          class="full-width text-black"
          color="green"
          :max="isMobile ? 2 : 7"
          :page-count="pageSize"
          :total="totalRows"
          @update:model-value="refreshData" />
      </div>
      <!--Right-->
      <div class="flex items-center">
        <UBadge
          variant="subtle"
          size="lg">
          <UIcon
            :name="isLoading ? 'i-hugeicons-database-sync-01' : 'i-hugeicons-database'"
            size="lg"
            class="mr-2"/>
          <UIcon
            v-if="hasFilter"
            name="i-hugeicons-filter"
            size="lg"
            class="mr-2"/>
          {{ totalRows }}
        </UBadge>
      </div>
    </div>
  </div>
</template>
