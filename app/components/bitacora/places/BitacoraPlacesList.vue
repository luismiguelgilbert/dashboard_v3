<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import type { bitacora_places } from '@/types/bitacora_places';

const emits = defineEmits(['row-click', 'data-request']);

const mainStore = useMainStore();
const bitacoraPlacesStore = useBitacoraPlacesStore();
const { isMobile, userCompany } = storeToRefs(mainStore);
const {
  searchString,
  isLoading,
  totalRows,
  page,
  pageSize,
  filterIsActive,
  hasFilter,
  sortBy,
} = storeToRefs(bitacoraPlacesStore);
const searchStringDebounced = refDebounced(searchString, 250);
const rows = shallowRef<bitacora_places[]>([]);
const mainTable = useTemplateRef('mainTable');
const columns = computed(() => [
  { key: 'id', label: '', class: 'hidden' },
  { key: 'name_es_short', label: 'Nombre', class: 'hidden' },
  { key: 'name_es', label: 'Razón Social', class: 'hidden' },
  { key: 'is_active', label: 'Estado', class: 'hidden' },
].filter(x => (isMobile.value && ['id', 'name_es_short'].includes(x.key)) || (!isMobile.value))
);

const refreshData = async () => {
  try {
    isLoading.value = true;
    const resultSet = await $fetch('/api/bitacora/places', {
      method: 'POST',
      body: {
        searchString: searchString.value.toLocaleLowerCase().replaceAll(' ', ''),
        sys_company_id: userCompany.value?.id,
        filterIsActive: filterIsActive.value,
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
const selectRow = (row: bitacora_places) => emits('row-click', row);

watch(() => sortBy.value, () => { refreshData(); }, { deep: true });
watch(() => [
  searchStringDebounced.value,
  filterIsActive.value,
  userCompany.value?.id,
], () => { page.value = 1; refreshData(); }, { deep: true });
refreshData();
defineExpose({refreshData});
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
      <template #id-data="{row} : {row: bitacora_places}">
        <UAvatar
          v-if="row.avatar_url"
          :src="row.avatar_url"
          size="sm"
          alt="Avatar" />
        <UAvatar
          v-else
          :alt="row.name_es_short[0]"
          size="sm" />
      </template>
      <template #name_es_short-data="{row} : {row: bitacora_places}">
        <span class="text-xs sm:text-base font-semibold dark:text-white text-black truncate text-ellipsis ml-0 sm:ml-5">
          {{ row.name_es_short }}
        </span>
        <p class="flex sm:hidden text-xs truncate text-ellipsis">
          {{ row.name_es }}
        </p>
      </template>
      <template #name_es-data="{row} : {row: bitacora_places}">
        <span class="sm:flex text-base text-gray-500 dark:text-gray-400 truncate text-ellipsis">
          {{ row.name_es }}
        </span>
      </template>
      <template #is_active-data="{row} : {row: bitacora_places}">
        <UBadge
          variant="subtle"
          :color="row.is_active ? 'green' : 'rose'"
          size="sm">
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