<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { PermissionsList } from '~/types/permissionsEnum';
import type { sys_companies } from '~/types/sys_companies';

const router = useRouter();
const searchinputcomponent = ref<{ input: HTMLInputElement }>();
const mainStore = useMainStore();
const rolesStore = useCompaniesStore();
const {
  searchString,
  isLoading,
  isDownloading,
  formModel,
  selectedRowId,
  filterIsActive,
  sortBy,
} = storeToRefs(rolesStore);
const { isMobile } = storeToRefs(mainStore);
const showFilters = ref<boolean>(false);
const showForm = ref<boolean>(false);
const actionMenuItems = [
  [
    {
      label: 'Descargar Lista',
      icon: 'i-ri-file-excel-2-line',
      disabled: !hasClientPermission(PermissionsList.COMPANIES_EXPORT),
      click: () => downloadList(),
    },
    {
      label: 'Orden y Filtros',
      icon: 'i-hugeicons-filter',
      click: () => showFilters.value = true,
    },
  ],
];
defineShortcuts({ '/': () => { searchinputcomponent.value?.input?.focus(); } });

// const closeForm = () => {
//   showForm.value = false;
//   router.replace({ query: { } });
// };
const rowClicked = (record: sys_companies) => {
  selectedRowId.value = record.id;
  formModel.value = 'edit';
  showForm.value = true;
  router.replace({ query: { id: selectedRowId.value } });
};
const newClicked = () => {
  const newID = uuidv4();
  selectedRowId.value = newID;
  formModel.value = 'create';
  showForm.value = true;
  router.replace({ query: { id: newID } });
};
const downloadList = async() => {
  try {
    isDownloading.value = true;
    const response: Blob = await $fetch('/api/security/companies/download', {
      method: 'POST',
      body: {
        searchString: searchString.value.toLocaleLowerCase().replaceAll(' ', ''),
        filterIsActive: filterIsActive.value,
        sortBy: sortBy.value,
      }
    }); 
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Organizaciones.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
  } finally {
    isDownloading.value = false;
  }
};
const closeFilters = () => showFilters.value = false;

onMounted(async () => {
  if (useRoute().query.id) {
    selectedRowId.value = String(useRoute().query.id);
    formModel.value = 'edit';
    showForm.value = true;
    router.replace({ query: { id: selectedRowId.value } });
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between m-4">
      <div class="flex items-center">
        <UInput
          ref="searchinputcomponent"
          v-model="searchString"
          class="min-w-40"
          icon="i-hugeicons-search-01"
          placeholder="Buscar..."
          size="md"
          :loading="isLoading"
          :disabled="isDownloading">
          <template #trailing>
            <UKbd value="/" />
          </template>
        </UInput>
      </div>
      <div class="flex items-center pl-2">
        <UButton
          :label="!isMobile ? 'Nuevo' : undefined"
          size="md"
          variant="solid"
          :disabled="isDownloading || !hasClientPermission(PermissionsList.ROLES_CREATE)"
          :loading="isDownloading || isLoading"
          icon="i-hugeicons-plus-sign-circle"
          @click="newClicked" />
        <UDropdown
          :items="actionMenuItems"
          class="ml-2" >
          <UButton
            :label="!isMobile ? 'Opciones' : undefined"
            size="md"
            variant="solid"
            color="gray"
            :disabled="isDownloading"
            :loading="isDownloading || isLoading"
            icon="i-hugeicons-circle-arrow-down-01" />
        </UDropdown>
      </div>
    </div>
    <UDivider />

    <SecurityCompaniesList
      @row-click="rowClicked" />
    
    <SecurityCompaniesFilters
      :is-open="showFilters"
      @cancel="closeFilters" />
    
    <!-- 
    <SecurityRolesForm
      :id="selectedRowId"
      :is-open="showForm"
      @cancel="closeForm" /> -->
  </div>
</template>