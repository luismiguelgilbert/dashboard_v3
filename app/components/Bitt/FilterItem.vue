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
const selectedRows = defineModel<(number|boolean)[]>('selectedRows', { default: [] });

const showBody = ref<boolean>(false);
const searchString = ref<string>('');

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

const isRowSelected = (row: numericFilterItem | booleanFilterItem): boolean => {
  return Boolean(selectedRows.value?.includes(row.id));
};

const toggleRow = (row: numericFilterItem | booleanFilterItem, value: boolean) => {
  if (value) {
    selectedRows.value.push(row.id);
  } else {
    selectedRows.value = selectedRows.value.filter((item) => item != row.id);
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
            v-if="selectedRows.length"
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
        <div class="max-h-60 overflow-y-auto">
          <div
            v-for="row in filteredRows"
            :key="Number(row.id)">
            <UCheckbox
              class="pl-4 py-3 items-center"
              :model-value="isRowSelected(row)"
              :label="`${row.label} - ${isRowSelected(row)}`"
              @change="(value) => toggleRow(row, value)">
              <template #label>
                <span class="font-bold text-base text-gray-900 dark:text-gray-50 cursor-pointer">
                  {{ row.label }}
                </span>
              </template>
            </UCheckbox>
            <UDivider />
          </div>
        </div>
      </slot>
    </div>
  </UCard>
</template>
