<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import type { sys_users } from '~/types/sys_users';

const router = useRouter();
const searchinputcomponent = ref<{ input: HTMLInputElement }>();
const mainStore = useMainStore();
const usersStore = useUsersStore();
const {
  searchString,
  isLoading,
  isDownloading,
  formModel,
  selectedRowId,
} = storeToRefs(usersStore);
const { isMobile } = storeToRefs(mainStore);
const showFilters = ref<boolean>(false);
const showUserForm = ref<boolean>(false);
const actionMenuItems = [
  [
    {
      label: 'Descargar',
      icon: 'i-ri-file-excel-2-line',
      click: () => downloadList(),
    },
  ],
  [
    {
      label: 'Orden y Filtros',
      icon: 'i-hugeicons-filter',
      click: () => showFilters.value = true,
    },
  ]
];
defineShortcuts({ '/': () => { searchinputcomponent.value?.input?.focus(); } });

const closeUserForm = () => {
  showUserForm.value = false;
  router.replace({ query: { } });
};
const rowClicked = (record: sys_users) => {
  selectedRowId.value = record.id;
  formModel.value = 'edit';
  showUserForm.value = true;
  router.replace({ query: { id: selectedRowId.value } });
};
const newClicked = () => {
  const newID = uuidv4();
  selectedRowId.value = newID;
  formModel.value = 'create';
  showUserForm.value = true;
  router.replace({ query: { id: newID } });
};
const downloadList = async() => {
  try {
    isDownloading.value = true;
    const response: Blob = await $fetch('/api/security/users/download', {
      method: 'post',
      // body: filterPayload,
    });
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Usuarios.xlsx');
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
    showUserForm.value = true;
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
          :disabled="isDownloading"
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

    <SecurityUsersList
      @row-click="rowClicked" />

    <SecurityUsersFilters
      :is-open="showFilters"
      @cancel="closeFilters" />

    <SecurityUsersUserForm
      :id="selectedRowId"
      :is-open="showUserForm"
      @cancel="closeUserForm" />
  </div>
</template>
