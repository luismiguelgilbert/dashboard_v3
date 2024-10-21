<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
  id: {
    type: String,
    required: false,
    default: null,
  },
});
const emits = defineEmits(['cancel','save']);

const mainStore = useMainStore();
const companiesStore = useCompaniesStore();
const { isMobile } = storeToRefs(mainStore);
const {
  isLoading,
  selectedRowData,
  selectedRowDataAvatarHelper,
  formModel,
} = storeToRefs(companiesStore);
const hasError = ref(false);
const isSaveSuccess = ref(false);

const formComponent = useTemplateRef('formComponent');

const cardUi = {
  body: {
    base: 'flex-1',
    padding: 'px-4 py-2 sm:p-6',
  },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
  rounded: 'rounded-none',
};

const closeSlideOder = () => {
  emits('cancel');
  selectedRowData.value = undefined;
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    if (formModel.value === 'edit') {
      if (useRoute().query.id) {
        hasError.value = false;
        isSaveSuccess.value = false;
  
        const results = await Promise.all([
          $fetch(`/api/security/companies/:${useRoute().query.id}`),
        ]);
        selectedRowData.value = results[0];
        isLoading.value = false;
      }
    } else {
      hasError.value = false;
      isSaveSuccess.value = false;
      isLoading.value = false;
      selectedRowData.value = {
        id: props.id,
        name_es: '',
        name_es_short: '',
        company_number: '',
        billing_phone: '',
        billing_address: '',
        avatar_url: null,
        is_active: true,
        disabled: false,
        created_at: null,
        updated_at: null,
        rows_count: 0,
      };
    }
  } catch (error) {
    console.error(error);
    hasError.value = true;
    isLoading.value = false;
  }
};

const validateAndSave = async () => {
  try {
    await formComponent.value?.validateMainForm();
    isLoading.value = true;
    isSaveSuccess.value = false;
    hasError.value = false;
    const userData = await $fetch(`/api/security/companies/:${useRoute().query.id}`, {
      method: formModel.value === 'edit' ? 'PATCH' : 'POST',
      body: selectedRowData.value,
    });
    if (selectedRowData.value?.avatar_url && selectedRowDataAvatarHelper.value ) {
      const body = new FormData();
      body.append('file', selectedRowDataAvatarHelper.value);
      await $fetch(`/api/security/companies/:${userData.id}/avatar`, {
        method: 'PATCH',
        body: body,
      });
    }
    isLoading.value = false;
    isSaveSuccess.value = true;
    emits('save');
  } catch (error) {
    isLoading.value = false;
    hasError.value = true;
    isSaveSuccess.value = false;
    console.error(error);
  }
};

onMounted(() => fetchData());
watch(() => useRoute().query.id, (value) => { if (value) { fetchData(); } });
</script>

<template>
  <div>
    <USlideover
      :model-value="props.isOpen"
      prevent-close
      :transition="false"
      :ui="{ width: 'max-w-4xl' }">
      <UCard :ui="cardUi">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ formModel === 'create' ? 'Crear' : 'Editar' }} organización:
            </h3>
            <div class="flex gap-3">
              <UButton
                icon="i-hugeicons-cancel-circle"
                color="gray"
                :disabled="isLoading"
                :loading="isLoading"
                @click="closeSlideOder">
                <span v-if="!isMobile">Cerrar</span>
              </UButton>
              <UButton
                icon="i-hugeicons-checkmark-circle-01"
                :disabled="isLoading"
                :loading="isLoading"
                @click="validateAndSave">
                <span v-if="!isMobile">Guardar</span>
              </UButton>
            </div>
          </div>
        </template>

        <div
          v-if="isLoading"
          class="h-[calc(100dvh-82px)] sm:h-[calc(100dvh-100px)] overflow-y-auto">
          <BittSkeletonHeader
            :lines="20" />
        </div>
        
        <div
          v-if="!isLoading"
          class="h-[calc(100dvh-82px)] sm:h-[calc(100dvh-100px)] overflow-y-auto">

          <UAlert
            v-if="hasError"
            class="col-span-1 sm:col-span-2 my-5 sm:my-5"
            icon="i-hugeicons-settings-error-01"
            color="rose"
            variant="subtle"
            title="Se ha producido un error; por favor revise sus datos y reintente." />

          <UAlert
            v-if="isSaveSuccess"
            class="col-span-1 sm:col-span-2 my-5 sm:my-5"
            icon="i-hugeicons-checkmark-circle-01"
            color="green"
            variant="subtle"
            title="Datos guardados correctamente." />

          <SecurityCompaniesFormBasic
            :key="props.id"
            ref="formComponent" />
        </div>
      </UCard>
    </USlideover>
  </div>
</template>
