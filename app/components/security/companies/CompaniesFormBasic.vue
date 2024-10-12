<script setup lang="ts">
import { sys_companies_form_schema } from '@/types/sys_companies';

const companiesStore = useCompaniesStore();
const mainRef = useTemplateRef('mainForm');
const fileRef = useTemplateRef('fileRef');

const {
  selectedRowData,
  selectedRowDataAvatarHelper,
  isLoading,
} = storeToRefs(companiesStore);

const inputSize = 'xl';

defineExpose({
  validateMainForm: async () => {
    return await mainRef.value?.validate(undefined);
  }
});

const onFileClick = () => { fileRef.value?.input.click(); };
const onFileChange = (e: FileList) => {
  try {
    if (!e.length) { throw new Error('No se seleccionó archivo.'); }
    if (e[0] && e[0].size / 1024 / 1024 > 1) { throw new Error('Tamaño incorrecto.'); }
    if (e[0] && selectedRowData.value) {
      selectedRowDataAvatarHelper.value = e[0];
      selectedRowData.value.avatar_url = URL.createObjectURL(e[0]);
    }
  } catch (error) {
    useToast().add({
      title: `Error al cargar archivo: ${error}`,
      icon: 'i-hugeicons-settings-error-01',
      color: 'rose',
    });
  }
};
</script>

<template>
  <UForm
    v-if="selectedRowData"
    ref="mainForm"
    class="pl-1 pr-1 md:pl-2 md:pr-2 pt-4 md:pt-0"
    :schema="sys_companies_form_schema"
    :state="selectedRowData">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-1 sm:px-4 items-end">
      <div class="col-span-1 sm:col-span-2 pt-1"></div>
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Nombre:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nombre comercial de la organización.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="name_es_short">
        <UInput
          v-model:model-value="selectedRowData.name_es_short"
          required
          placeholder="Nombre de la organización del Usuario"
          icon="i-hugeicons-building-06"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Razón Social:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Nombre legal de la organización.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="name_es">
        <UInput
          v-model:model-value="selectedRowData.name_es"
          required
          placeholder="Razón Social de la organización"
          icon="i-hugeicons-building-02"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          RUC:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Registro Único del Contribuyente (cédula o pasaporte).
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="company_number">
        <UInput
          v-model:model-value="selectedRowData.company_number"
          required
          placeholder="RUC"
          icon="i-hugeicons-file-validation"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Estado:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Estado de la organización.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="user_sex">
        <UToggle
          v-model="selectedRowData.is_active"
          :disabled="isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ selectedRowData.is_active ? 'Activa' : 'Inactiva' }}</span>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Avatar:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Foto del usuario (1MB max).
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="avatar_url">
        <div class="flex items-center">
          <UAvatar
            v-if="selectedRowData.avatar_url"
            :src="selectedRowData.avatar_url"
            :alt="selectedRowData.name_es_short"
            size="lg" />
          <UAvatar
            v-else
            :alt="selectedRowData.name_es_short"
            size="lg" />
          <UButton
            label="Seleccionar"
            trailing-icon="i-hugeicons-cloud-upload"
            color="white"
            size="md"
            class="ml-5"
            @click="onFileClick" />
          <UInput
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange" />
        </div>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Teléfono principal:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Teléfono utilizado en documentos electrónicos.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="billing_phone">
        <UInput
          v-model:model-value="selectedRowData.billing_phone"
          required
          placeholder="Teléfono"
          icon="i-hugeicons-call"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Dirección principal:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Dirección utilizada en documentos electrónicos.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="billing_address">
        <UInput
          v-model:model-value="selectedRowData.billing_address"
          required
          placeholder="Dirección"
          icon="i-hugeicons-location-01"
          :loading="isLoading" />
      </UFormGroup>

      <br /><br />
    </div>
  </UForm>
</template>
