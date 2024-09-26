<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import type { sys_users } from '~/types/sys_users';

const router = useRouter();
const searchinputcomponent = ref<{ input: HTMLInputElement }>();
const mainStore = useMainStore();
const { isMobile } = storeToRefs(mainStore);
const usersStore = useUsersStore();
const {
  searchString,
  isLoading,
  isDownloading,
  formModel,
  selectedRowId,
} = storeToRefs(usersStore);
const showUserForm = ref<boolean>(false);

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
  router.replace({ query: { new: newID } });
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
</script>

<template>
  <div>
    <UHeader
      class="z-10"
      :ui="{
        container: 'mx-0 px-2 sm:px-4 lg:px-4 flex items-center justify-between gap-3 h-[--header-height] overflow-hidden max-w-full',
      }">
      <template #left>
        <UInput
          ref="searchinputcomponent"
          v-model="searchString"
          class="min-w-40"
          icon="i-hugeicons-search-01"
          placeholder="Buscar..."
          size="md"
          :disabled="isDownloading">
          <template #trailing>
            <UKbd value="/" />
          </template>
        </UInput>
        <UIcon
          v-show="isLoading"
          name="i-hugeicons-loading-03"
          size="lg"
          class="animate-spin ml-2" />
      </template>
      <template #right>
        <UButton
          class="ml-2"
          variant="solid"
          size="md"

          :disabled="isDownloading"
          @click="newClicked">
          <span v-if="!isMobile">Nuevo</span>
          <template #trailing>
            <UIcon
              name="i-hugeicons-plus-sign-circle"
              class="w-5 h-5" />
          </template>
        </UButton>
        <UButton
          class="ml-2"
          variant="outline"
          size="md"
          
          :loading="isDownloading"
          :disabled="isDownloading"
          @click="downloadList">
          <template #trailing>
            <span v-if="!isMobile">Descargar</span>
            <UIcon
              name="i-ri-file-excel-2-line"
              class="w-5 h-5" />
          </template>
        </UButton>
        <UButton
          class="ml-2"
          variant="outline"
          size="md"
          :disabled="isDownloading">
          <template #trailing>
            <span v-if="!isMobile">Filtros</span>
            <UIcon
              name="i-hugeicons-filter"
              class="w-5 h-5" />
          </template>
        </UButton>
      </template>
    </UHeader>

    <!-- <SecurityUsersList
      :rows="rows"
      :rows-total="totalRows"
      :page-size="pageSize"
      :selected-row="selectedRowId"
      @data-request="updatePageAndRefresh"
      @row-click="rowClicked" /> -->
    <SecurityUsersListB
      @row-click="rowClicked" />

    <SecurityUsersUserForm
      :id="selectedRowId"
      :is-open="showUserForm"
      @cancel="closeUserForm" />
  </div>
</template>
