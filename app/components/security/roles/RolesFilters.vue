<script setup lang="ts">
import type { booleanFilterItem } from '@/types/filters';
import type { sys_profiles_sort_options } from '@/types/sys_profiles';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const emits = defineEmits(['cancel']);

const mainStore = useMainStore();
const rolesStore = useRolesStore();
const { isMobile } = storeToRefs(mainStore);
const {
  filterIsActive,
  sortBy,
  isLoading,
  totalRows,
} = storeToRefs(rolesStore);

const rowsIsActive = ref<booleanFilterItem[]>([]);
const sortOptions: sys_profiles_sort_options[] = [
  {
    value: 'a.name_es',
    label: 'Nombre'
  },
  {
    value: 'a.is_active',
    label: 'Estado'
  },
];

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

onMounted(async () => {
  if (import.meta.client) {
    $fetch('/api/filters/security/rolesActive').then((data) => rowsIsActive.value = data);
  }
});
</script>

<template>
  <div>
    <USlideover
      :model-value="props.isOpen"
      prevent-close
      :ui="{ width: 'max-w-lg' }">
      <UCard :ui="cardUi">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ `Orden y Filtros (${totalRows} registros)` }}
            </h3>
            <div class="flex gap-3">
              <UButton
                icon="i-hugeicons-transition-right"
                :disabled="isLoading"
                :loading="isLoading"
                @click="closeSlideOder">
                <span v-if="!isMobile">Cerrar</span>
              </UButton>
            </div>
          </div>
        </template>

        <div class="grid gap-y-2 py-5 px-7">
          <span class="text-base font-bold">Orden:</span>
          <URadioGroup
            v-model="sortBy"
            :options="sortOptions">
            <template #label="{ option }">
              <p class="font-bold text-base text-gray-900 dark:text-gray-50 cursor-pointer">
                {{ option.label }}
              </p>
            </template>
          </URadioGroup>
        </div>
        <UDivider />


        <div class="grid gap-y-5 py-5 px-7">
          <div class="flex justify-between">
            <div class="text-base font-bold">Filtros:</div>
          </div>
          <BittFilterItem
            v-model:selected-rows="filterIsActive"
            title="Estado"
            :rows="rowsIsActive" />
        </div>

      </UCard>
    </USlideover>
  </div>
</template>