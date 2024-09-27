<script setup lang="ts">
import type { numericFilterItem } from '@/types/filters';

interface FilterItemProps {
  title: string,
  // rows: { [key: string]: any; }[],
  // rows: [],
  rows: numericFilterItem[],
}

const props = withDefaults(defineProps<FilterItemProps>(), {
  title: 'Filter Item',
  // rows: [],
});

const mainStore = useMainStore();
const { isMobile } = storeToRefs(mainStore);
const showBody = ref(false);
// const searchString = ref('');
const selectedRows = ref([]);
const pageCount = 7;
const page = ref(1);
const pagedRows = computed(() => {
  return props.rows.slice((page.value - 1) * pageCount, (page.value) * pageCount);
});
const cardUI = computed(() => {
  return {
    divide: showBody.value ? 'divide-y divide-gray-200 dark:divide-gray-800' : '',
    header: { 
      padding: '',
      background: showBody.value ? 'bg-gray-50 dark:bg-gray-800 rounded-t-lg' : 'bg-gray-50 dark:bg-gray-800 rounded-t-lg rounded-b-lg'
    },
    body: { 
      padding: '' 
    }
  };
});

const select = (row) => {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1);
  }
};

defineExpose({selectedRows});
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
          <span class="pl-3">{{ props.title }}: {{ selectedRows.length > 0 ? `${selectedRows.length} seleccionado(s)` : '' }}</span>
        </div>
        <div class="flex items-center">
          <UButton
            trailing-icon="i-hugeicons-square"
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
        <UTable
          v-model="selectedRows"
          :ui="{
            thead: 'hidden',
          }"
          :columns="[ { key: 'label', label: 'Valor' } ]"
          :rows="pagedRows"
          @select="select" />
        <UDivider v-if="props.rows.length > pageCount" />
        <div
          v-if="props.rows.length > pageCount"
          class="flex justify-between items-center p-2">
          <UPagination
            v-model="page"
            :max="isMobile ? 3 : 7"
            :page-count="pageCount"
            :total="props.rows.length" />
        </div>
        <!-- <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        </div> -->
      </slot>
    </div>
  </UCard>
</template>

<style scoped>
:deep(tr > td):nth-child(1) {
  width: 50px !important;
  max-width: 50px !important;
}
:deep(tr > td > div):nth-child(1) {
  width: 50px !important;
  max-width: 50px !important;
}
</style>