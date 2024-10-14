<script setup lang="ts">
import { sys_profiles_form_schema } from '@/types/sys_profiles';
import type { sys_links } from '@/types/sys_links';

const rolesStore = useRolesStore();
const mainRef = useTemplateRef('mainForm');

const {
  selectedRowData,
  lookupSysLinks,
  isLoading,
} = storeToRefs(rolesStore);

const inputSize = 'xl';

const isRowSelected = (row: sys_links): boolean => {
  return Boolean(selectedRowData.value?.sys_profiles_links?.some(x => x.sys_link_id === row.id));
};

const toggleRow = (row: sys_links, value: boolean) => {
  if (value) {
    if (selectedRowData.value?.sys_profiles_links) {
      selectedRowData.value?.sys_profiles_links.push({ sys_link_id: row.id });
    }
  }
  else {
    if (selectedRowData.value?.sys_profiles_links) {
      selectedRowData.value.sys_profiles_links = selectedRowData.value?.sys_profiles_links.filter((item) => item.sys_link_id != row.id) ?? [];
    }
  }
};

defineExpose({
  validateMainForm: async () => {
    return await mainRef.value?.validate(undefined);
  }
});
</script>

<template>
  <UForm
    v-if="selectedRowData"
    ref="mainForm"
    class="pl-1 pr-1 md:pl-2 md:pr-2 pt-4 md:pt-0"
    :schema="sys_profiles_form_schema"
    :state="selectedRowData">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-1 sm:px-4 items-end">
      <div class="col-span-1 sm:col-span-2 pt-1"></div>
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Rol:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nombre del perfil.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="name_es">
        <UInput
          v-model:model-value="selectedRowData.name_es"
          required
          placeholder="Nombre del Rol"
          icon="i-hugeicons-account-setting-01"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Estado:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Activar o inactivar perfil.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="is_active">
        <UToggle
          v-model="selectedRowData.is_active"
          :disabled="isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ selectedRowData.is_active ? 'Activo' : 'Inactivo' }}</span>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Permisos:
        </p>
      </div>
      <div class="overflow-y-auto">
        <div
          v-for="row in lookupSysLinks"
          :key="Number(row.id)">
          <UCheckbox
            class="pl-4 py-3 items-center"
            :model-value="isRowSelected(row)"
            @change="(value) => toggleRow(row, value)">
            <template #label>
              <span class="text-base text-gray-900 dark:text-gray-50 cursor-pointer">
                <span
                  v-if="row.row_level === 0"
                  class="font-black">
                  <UIcon :name="row.icon!" />
                  {{ row.name_es }}
                </span>
                <span
                  v-if="row.row_level === 1"
                  class="font-bold ml-5">
                  <UIcon :name="row.icon!" />
                  {{ row.name_es }}
                </span>
                <span
                  v-if="row.row_level > 1"
                  class="font-normal ml-10">
                  <UIcon :name="row.icon!" />
                  {{ row.name_es }}
                </span>
              </span>
            </template>
          </UCheckbox>
          <UDivider />
        </div>
      </div>
      <br /><br />
    </div>
  </UForm>
</template>
