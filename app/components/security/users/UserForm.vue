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
    default: '',
  },
});
const emits = defineEmits(['cancel']);

const mainStore = useMainStore();
const usersStore = useUsersStore();
const { isMobile } = storeToRefs(mainStore);
const {
  isLoading,
  selectedRowData,
  lookupCompanies,
  lookupProfiles,
  formModel,
} = storeToRefs(usersStore);
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
    if (formModel.value === 'edit') {
      if (useRoute().query.id) {
        hasError.value = false;
        isSaveSuccess.value = false;
        isLoading.value = true;
  
        const results = await Promise.all([
          $fetch(`/api/security/users/:${useRoute().query.id}`),
          $fetch('/api/lookups/sys_companies'),
          $fetch('/api/lookups/sys_profiles'),
        ]);
        selectedRowData.value = results[0];
        lookupCompanies.value = results[1];
        lookupProfiles.value = results[2];
        isLoading.value = false;
      }
    } else {
      selectedRowData.value = {
        id: props.id,
        user_name: '',
        user_lastname: '',
        user_sex: true,
        avatar_url: null,
        website: null,
        email: null,
        sys_profile_id: 0,
        sys_profile_name: '',
        default_color: 'indigo',
        default_dark_color: 'zinc',
        dark_enabled: false,
        created_at: null,
        updated_at: null,
        last_sign_in_at: null,
        sys_companies_users: [],
        default_user_company: undefined,
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
    await $fetch(`/api/security/users/:${useRoute().query.id}`, {
      method: 'PATCH',
      body: selectedRowData.value,
    });
    isLoading.value = false;
    isSaveSuccess.value = true;
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
              {{ formModel === 'create' ? 'Crear' : 'Editar' }} usuario:
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
          title="Usuario guardado." />

        <div
          v-if="isLoading"
          class="h-[calc(100dvh-82px)] sm:h-[calc(100dvh-100px)] overflow-y-auto">
          <BittSkeletonHeader
            :lines="20" />
        </div>
        
        <div
          v-if="!isLoading"
          class="h-[calc(100dvh-82px)] sm:h-[calc(100dvh-100px)] overflow-y-auto">
          <SecurityUsersUserFormBasic
            :key="props.id"
            ref="formComponent" />
        </div>
      </UCard>
    </USlideover>
  </div>
</template>
