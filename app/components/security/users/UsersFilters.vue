<script setup lang="ts">
import type { numericFilterItem, booleanFilterItem } from '@/types/filters';
import type { sys_users_sort_options } from '@/types/sys_users';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const emits = defineEmits(['cancel']);

const mainStore = useMainStore();
const usersStore = useUsersStore();
const { isMobile } = storeToRefs(mainStore);
const {
  sortBy,
  isLoading,
} = storeToRefs(usersStore);

const rowsSex = ref<booleanFilterItem[]>([]);
const rowsProfile = ref<numericFilterItem[]>([]);
const sortOptions: sys_users_sort_options[] = [
  {
    value: 'a.user_lastname',
    label: 'Apellidos'
  },
  {
    value: 'a.user_name',
    label: 'Nombres'
  },
  {
    value: 'a.sys_profile_name',
    label: 'Perfil'
  },
  {
    value: 'a.user_sex',
    label: 'Sexo'
  },
];
const selectedSex = ref<booleanFilterItem[]>([]);
const selectedProfile = ref<numericFilterItem[]>([]);

const cardUi = {
  body: {
    base: 'flex-1 h-[calc(100dvh-70px)] overflow-y-auto',
    padding: 'px-0 py-2 sm:p-0',
  },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
  rounded: 'rounded-none',
};

const closeSlideOder = () => {
  emits('cancel');
};

const clearAllFilters = () => {
  selectedSex.value = [];
  selectedProfile.value = [];
};

onMounted(async () => {
  if (import.meta.client) {
    // isMobile.value = myScreenSize.value === 'mobile'; 
    // useAppConfig().ui.primary = userData.value?.default_color ?? 'bitt';
    // handleSpecialColors();
    $fetch('/api/filters/security/userSex').then((data) => rowsSex.value = data);
    $fetch('/api/filters/security/roles').then((data) => rowsProfile.value = data);
    // getRowsSex();
    // getRowsProfile();
  }
});
</script>

<template>
  <div>
    <USlideover
      :model-value="props.isOpen"
      prevent-close
      :transition="false"
      :ui="{ width: 'max-w-lg' }">
      <UCard :ui="cardUi">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Orden y Filtros
            </h3>
            <div class="flex gap-3">
              <UButton
                icon="i-hugeicons-cancel-circle"
                color="gray"
                :disabled="isLoading"
                :loading="isLoading"
                @click="closeSlideOder">
                <span v-if="!isMobile">Cancelar</span>
              </UButton>
              <UButton
                icon="i-hugeicons-filter-add"
                :disabled="isLoading"
                :loading="isLoading"
                @click="closeSlideOder">
                <span v-if="!isMobile">Filtrar</span>
              </UButton>
            </div>
          </div>
        </template>

        <div class="grid gap-y-2 py-5 px-7">
          <span class="text-base font-bold">Orden:</span>
          <URadioGroup
            v-model="sortBy"
            :options="sortOptions" />
        </div>
        <UDivider />


        <div class="grid gap-y-5 py-5 px-7">
          <div class="flex justify-between">
            <div class="text-base font-bold">Filtros:</div>
            <UButton
              color="gray"
              icon="i-hugeicons-filter-remove"
              label="Limpiar todos"
              size="lg"
              @click="clearAllFilters" />
          </div>
          <BittFilterItem
            v-model:selected-rows="selectedProfile"
            title="Perfil"
            searchable
            :rows="rowsProfile" />
          <BittFilterItem
            v-model:selected-rows="selectedSex"
            title="Sexo"
            :rows="rowsSex" />
        </div>

      </UCard>
    </USlideover>
  </div>
</template>