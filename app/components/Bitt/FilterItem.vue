<script setup lang="ts">
import type { numericFilterItem, booleanFilterItem } from '@/types/filters';

interface FilterItemProps {
  title: string,
  rows: numericFilterItem[] | booleanFilterItem[],
  searchable?: boolean,
}

const props = withDefaults(defineProps<FilterItemProps>(), {
  title: 'Filter Item',
  searchable: false,
});

const showBody = ref<boolean>(false);
const searchString = ref<string>('');
const selectedRows = defineModel<numericFilterItem[] | booleanFilterItem[]>('selectedRows', { default: [] });
const cardUI = computed(() => {
  return {
    divide: showBody.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : '',
    header: { 
      padding: '',
      background: showBody.value
        ? 'bg-gray-50 dark:bg-gray-800 rounded-t-lg'
        : 'bg-gray-50 dark:bg-gray-800 rounded-t-lg rounded-b-lg'
    },
    body: { 
      padding: '' 
    }
  };
});
const filteredRows = computed(() => {
  if (!searchString.value) { return props.rows; }
  return props.rows.filter((row) => row.label.toLowerCase().includes(searchString.value.toLowerCase()));
});

const select = (row: numericFilterItem | booleanFilterItem) => {
  if (!selectedRows.value) { selectedRows.value = []; }
  
  const index = selectedRows.value?.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selectedRows.value.push(row);
  } else {
    selectedRows.value.splice(index, 1);
  }
};

</script>

<template>
  <UCard
    :ui="cardUI"
    class="min-w-0">
    <template #header>
      <div class="flex justify-between items-center text-gray-900 dark:text-white font-semibold p-3">
        <div class="flex items-center">
          <UButton
            :icon="showBody ? 'i-hugeicons-square-arrow-up-01' : 'i-hugeicons-square-arrow-down-01'"
            variant="ghost"
            color="gray"
            size="xl"
            @click="showBody = !showBody" />
          <span class="pl-3">{{ props.title }} {{ selectedRows && selectedRows?.length > 0 ? `(${selectedRows.length})` : '' }}</span>
        </div>
        <div class="flex items-center">
          <UButton
            trailing-icon="i-hugeicons-filter-remove"
            variant="ghost"
            color="gray"
            size="xl"
            label="Limpiar"
            @click="selectedRows = []" />
        </div>
      </div>
    </template>
    <div v-if="showBody">
      <slot name="default">
        <UInput
          v-if="props.searchable"
          v-model="searchString"
          class="min-w-40"
          icon="i-hugeicons-search-01"
          placeholder="Buscar..."
          size="lg"
          variant="none" />
        <UDivider v-if="props.searchable" />
        <UTable
          v-model="selectedRows"
          class="max-h-56"
          :ui="{
            thead: 'hidden',
            tr: {
              base: '',
              selected: 'bg-transparent dark:bg-transparent',
              active: 'hover:bg-transparent dark:hover:bg-transparent cursor-pointer',
            },
          }"
          :columns="[ { key: 'label', label: 'Valor' } ]"
          :rows="filteredRows"
          @select="select">
          <template #label-data="{row}">
            <span class="font-bold text-base text-gray-900 dark:text-gray-50">
              {{ row.label }}
            </span>
          </template>
        </UTable>
      </slot>
    </div>
  </UCard>
</template>

<style scoped>
:deep(tr > td):nth-child(1) {
  /* padding-left: 20px; */
  width: 50px !important;
  max-width: 50px !important;
}
:deep(tr > td > div):nth-child(1) {
  padding-left: 10px;
  width: 50px !important;
  max-width: 50px !important;
}
</style>