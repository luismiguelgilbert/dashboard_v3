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

// const toggleRow = (row: sys_links, value: boolean) => {
const toggleRow = (row: sys_links) => {
  const rowIndex = selectedRowData.value?.sys_profiles_links?.findIndex(x => x.sys_link_id === row.id);
  if (rowIndex === -1) {
    selectedRowData.value?.sys_profiles_links?.push({ sys_link_id: row.id });
  }
  else if (selectedRowData.value) {
    selectedRowData.value.sys_profiles_links = selectedRowData.value?.sys_profiles_links.filter((item) => item.sys_link_id != row.id) ?? [];
  }
};

defineExpose({
  validateMainForm: async () => {
    return await mainRef.value?.validate(undefined);
  }
});
</script>

<template>
  <!-- <BittTreeChecklist :items="lookupSysLinks?.map(x => { return {id: x.id, parent: x.parent, name_es: x.name_es }}) ?? []" /> -->

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


      <p class="text-gray-900 dark:text-white font-semibold">
        Permisos:
      </p>

      <div class="col-span-2">

        <UAccordion
          :items="lookupSysLinks?.filter(n => !n.parent)?.map(x => { return {id: x.id, parent: x.parent, label: x.name_es, icon: x.icon ?? undefined }}) ?? []"
          variant="soft"
          size="xl">
          <template #item="{item}">
            <UAccordion
              :items="lookupSysLinks?.filter(n => n.parent === item.id).map(x => { return {id: x.id, parent: x.parent, label: x.name_es, icon: x.icon ?? undefined }}) ?? []"
              class="pl-2 sm:pl-5"
              variant="ghost"
              size="xl">
              <template #item="{item: itemChild}">
                <div class="pl-4 pr-2">
                  <UCard
                    :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
                    class="min-w-0">
                    <ul
                      role="list"
                      class="divide-y divide-gray-200 dark:divide-gray-800">
                      <li
                        v-for="(row, index) in lookupSysLinks?.filter(n => n.parent === itemChild.id) ?? []"
                        :key="Number(row.id)"
                        class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        :class="(index === 0)
                          ? 'rounded-t-lg'
                          : (index === (lookupSysLinks?.filter(n => n.parent === itemChild.id)?.length ?? 0) -1)
                            ? 'rounded-b-lg'
                            : ''"
                        @click="toggleRow(row)">
                        <div class="w-full flex items-baseline justify-between gap-3 min-w-0 font-semibold">
                          <div class="flex items-center">
                            <UIcon
                              :name="row.icon!"
                              class="h5 w5 font-black text-2xl" />
                            <span class="pl-3">{{ row.name_es }}</span>
                          </div>
                          <UToggle :model-value="isRowSelected(row)"/>
                        </div>
                      </li>
                    </ul>
                  </UCard>
                </div>
              </template>
            </UAccordion>
          </template>
        </UAccordion>

      </div>

      <br /><br />
    </div>
  </UForm>
</template>
