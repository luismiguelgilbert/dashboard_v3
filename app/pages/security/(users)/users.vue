<script setup lang="ts">
const router = useRouter();
const searchinputcomponent = ref<{ input: HTMLInputElement }>();
const mainStore = useMainStore();
const { isMobile, showBadge, badgeLabel } = storeToRefs(mainStore);
const usersStore = useUsersStore();
const {
  searchString,
  pageSize,
  pagesLoaded,
  totalRows,
  isLoading,
  rows,
  listKey,
  selectedRow,
} = storeToRefs(usersStore);
const showEditForm = ref<boolean>(false);

defineShortcuts({'/': () => { searchinputcomponent.value?.input?.focus()}});
const refresh = async(pages: number[]) => {
  try {
    isLoading.value = true;
    showBadge.value = true;
    badgeLabel.value = totalRows.value;
    pages.forEach(async(pageToLoad) => {
      if (!pagesLoaded.value.includes(pageToLoad)) {
        usersStore.addToPagesLoaded(pageToLoad);
        const { data: algoliaData } = await useAsyncAlgoliaSearch({ 
          indexName: 'sys_users',
          query: searchString.value ?? '',
          requestOptions: {
            page: (pageToLoad - 1) >= 0 ? (pageToLoad - 1) : 0,
            hitsPerPage: pageSize.value,
            cacheable: false,
            // facetFilters: selectedFiltersFacet.value ? selectedFiltersFacet.value : undefined,
          }
        });
        totalRows.value = algoliaData.value?.nbHits ?? 0;
        badgeLabel.value = totalRows.value;
        rows.value[pageToLoad] = algoliaData.value?.hits ?? [];
        // data.value =  array(sys_users).cast(algoliaData.value.hits) ?? [];
      }
    })
  } catch(error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
const updatePageAndRefresh = async (newPages: number[]) => await refresh(newPages);
const resetLoadedDataAndRefresh = async () => {
  usersStore.resetLoadedData();
  await refresh([1]);
};
const closeEditForm = () => {
  showEditForm.value = false;
  router.replace({ query: { } })
};
const rowClicked = (record: any) => {
  selectedRow.value = record.id;
  showEditForm.value = true;
  router.replace({ query: { id: selectedRow.value } })
};

//HOOKS and WATCHERS
onMounted(async() => {
  if (import.meta.client) {
    selectedRow.value = router.currentRoute.value.query.id?.toLocaleString();
    selectedRow.value && (showEditForm.value = true);
    router.replace({ query: { id: selectedRow.value } })
  }
});
watch(() => searchString.value, () => resetLoadedDataAndRefresh(), { deep: true });
</script>

<template>
  <div>
    <UHeader
      class="z-10"
      :ui="{
        container: 'mx-0 px-4 sm:px-4 lg:px-4 flex items-center justify-between gap-3 h-[--header-height]',
      }">
      <template #left>
        <div class="flex">
          <UInput
            ref="searchinputcomponent"
            v-model="searchString"
            class="min-w-40"
            icon="i-hugeicons-search-01"
            placeholder="Buscar..."
            size="md">
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
          <UButton class="ml-2" color="gray" variant="ghost" size="md">
            <span v-if="!isMobile">Nuevo</span>
            <template #trailing>
              <UIcon name="i-hugeicons-plus-sign-circle" class="w-5 h-5" />
            </template>
          </UButton>
          <UButton class="ml-2" color="gray" variant="ghost" size="md">
            <template #trailing>
              <span v-if="!isMobile">Descargar</span>
              <UIcon name="i-ri-file-excel-2-line" class="w-5 h-5" />
            </template>
          </UButton>
          <UButton class="ml-2" color="gray" variant="ghost" size="md">
            <template #trailing>
              <span v-if="!isMobile">Filtros</span>
              <UIcon name="i-hugeicons-filter" class="w-5 h-5" />
            </template>
          </UButton>
        </div>
      </template>
    </UHeader>
    
    <LazySecurityUsersList
      :rows="rows"
      :rowsTotal="totalRows"
      :pageSize="pageSize"
      :listKey="listKey"
      :selectedRow="selectedRow"
      @data-request="updatePageAndRefresh"
      @row-click="rowClicked" />
    
    <SecurityUsersUserEdit
      :isOpen="showEditForm"
      :id="selectedRow"
      @cancel="closeEditForm" />
  </div>
</template>
