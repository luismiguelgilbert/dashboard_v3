<script setup lang="ts">
import type { numericFilterItem, booleanFilterItem } from '@/types/filters';

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
  isLoading,
} = storeToRefs(usersStore);

const rowsSex = ref<booleanFilterItem[]>([]);
const rowsProfile = ref<numericFilterItem[]>([]);
const sortColumn = ref();
const options = [{
  value: 'email',
  label: 'Email'
}, {
  value: 'sms',
  label: 'Phone (SMS)'
}, {
  value: 'push',
  label: 'Push notification'
}];
// const selectedSex = ref([]);
// const selectedProfile = ref([]);

const cardUi = {
  body: {
    base: 'flex-1 h-[calc(100dvh-70px)] overflow-y-auto',
    padding: 'px-4 py-2 sm:p-6',
  },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
  rounded: 'rounded-none',
};

const closeSlideOder = () => {
  emits('cancel');
};

const getRowsSex = async () => $fetch('/api/filters/security/userSex').then((data) => rowsSex.value = data);
const getRowsProfile = async () => $fetch('/api/filters/security/roles').then((data) => rowsProfile.value = data);
getRowsSex();
getRowsProfile();
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

        <div class="grid gap-y-2">
          <span class="text-base font-bold">Orden:</span>
          <URadioGroup
            v-model="sortColumn"
            :options="options" />
        </div>


        <div class="grid gap-y-5 mt-5">
          <span class="text-base font-bold">Filtros:</span>
          <BittFilterItem
            title="Perfil"
            searchable
            :rows="rowsProfile" />
          <BittFilterItem
            title="Sexo"
            :rows="rowsSex" />
        </div>

      </UCard>
    </USlideover>
  </div>
</template>