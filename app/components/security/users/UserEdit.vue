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
const { isLoading, selectedRowData } = storeToRefs(usersStore);

const cardUi = {
  body: {
    base: 'flex-1',
    padding: 'px-4 py-2 sm:p-6',
  },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
  rounded: 'rounded-none',
};

const tabsUi = {
  list: {
    tab: {
      icon: 'w-5 h-5 flex-shrink-0 mr-2',
    },
  },
};

const tabs = [
  {
    slot: 'user',
    label: 'Usuario',
    icon: 'i-hugeicons-location-user-01',
  },
  {
    slot: 'companies',
    label: 'Organizaciones',
    icon: 'i-hugeicons-user-lock-01',
  },
];

const closeSlideOder = () => {
  emits('cancel');
  selectedRowData.value = undefined;
};

const fetchData = async () => {
  if (useRoute().query.id) {
    isLoading.value = true;
    selectedRowData.value = await $fetch(`/api/security/users/${useRoute().query.id}`);
    isLoading.value = false;
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
      :ui="{ width: 'max-w-4xl' }">
      <UCard :ui="cardUi">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Editar usuario:
            </h3>
            <div class="flex gap-3">
              <UButton
                icon="i-hugeicons-cancel-circle"
                color="gray"
                :disabled="isLoading"
                @click="closeSlideOder">
                <span v-if="!isMobile">Cancelar</span>
              </UButton>
              <UButton
                icon="i-hugeicons-checkmark-circle-01"
                :disabled="isLoading">
                <span v-if="!isMobile">Guardar</span>
              </UButton>
            </div>
          </div>
        </template>

        <UTabs
          :items="tabs"
          :ui="tabsUi">
          <template #user>
            <div class="h-[calc(100dvh-135px)] sm:h-[calc(100dvh-150px)] overflow-y-auto">
              <SecurityUsersUserEditUser />
            </div>
          </template>
          <template #companies>
            <SecurityUsersUserEditCompanies />
          </template>
        </UTabs>
      </UCard>
    </USlideover>
  </div>
</template>
