<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import type { sys_profiles } from '@/types/sys_profiles';

const emits = defineEmits(['row-click', 'data-request']);

const mainStore = useMainStore();
const rolesStore = useRolesStore();
const { isMobile } = storeToRefs(mainStore);
const {
  searchString,
  isLoading,
  totalRows,
  page,
  pageSize,
  hasFilter,
  filterIsActive,
  sortBy,
} = storeToRefs(rolesStore);
const searchStringDebounced = refDebounced(searchString, 250);
const rows = shallowRef<sys_profiles[]>([]);
const mainTable = useTemplateRef('mainTable');
const columns = computed(() => [
  { key: 'id', label: '', class: 'hidden' },
  { key: 'name', label: 'Name', class: 'hidden' },
  { key: 'is_active', label: 'Estado', class: 'hidden' },
].filter(x => (isMobile.value && ['id', 'name'].includes(x.key)) || (!isMobile.value))
);

const refreshData = async () => {
  try {
    isLoading.value = true;
    const resultSet = await $fetch('/api/security/roles', {
      method: 'POST',
      body: {
        searchString: searchString.value.toLocaleLowerCase().replaceAll(' ', ''),
        page: page.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
        filterIsActive: filterIsActive.value,
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
const selectRow = (row: sys_profiles) => emits('row-click', row);

watch(() => sortBy.value, () => { refreshData(); }, { deep: true });
watch(() => [
  searchStringDebounced.value,
  filterIsActive.value,
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
      <template #id-data="{row} : {row: sys_profiles}">
        <UAvatar
          :alt="row.name_es[0]"
          size="sm" />
      </template>
      <template #name-data="{row} : {row: sys_profiles}">
        <span class="text-xs sm:text-base font-semibold dark:text-white text-black truncate text-ellipsis ml-5 sm:ml-0">
          {{ row.name_es }}
        </span>
      </template>
      <template #is_active-data="{row} : {row: sys_profiles}">
        <UBadge
          variant="subtle"
          :color="row.is_active ? 'green' : 'rose'"
          size="lg">
          {{ row.is_active ? 'Activo' : 'Inactivo' }}
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

<style scoped>
:deep(table > tbody > tr > td:nth-child(1)) {
  max-width: 20px;
}
</style>