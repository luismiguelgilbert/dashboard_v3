<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  rows: {
    // type: Array<type_sys_users>,
    type: Object,
    required: false,
    default: () => {},
  },
  selectedRow: {
    type: Object,
    required: false,
  },
  rowsTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  listKey: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(['row-click', 'data-request']);
const rowHeight = 88;

const myRows = computed(() => Array.from(Array(props.rowsTotal).keys()));

const getRowPage = (item: number) => Math.ceil((item + 1) / props.pageSize);
const getRowIndexInPage = (item: number) => (item) % props.pageSize;
const getRowExists = (item: number) => Boolean(props.rows[getRowPage(item)]);
const getRowData = (item: number) => props.rows[getRowPage(item)][getRowIndexInPage(item)];

const containerScroll = useDebounceFn((startIndex: number, endIndex: number) => {
  const topRowPage = Math.ceil(startIndex / props.pageSize);
  const lastRowPage = Math.ceil(endIndex / props.pageSize);
  emits('data-request', [topRowPage > 0 ? topRowPage : 1, lastRowPage])
}, 250);

const rowClicked = (record: any) => emits('row-click', record);
</script>

<template>
  <RecycleScroller
    :items="myRows"
    :item-size="rowHeight"
    :emitUpdate="true"
    page-mode
    key-field="id"
    v-slot="{ item }"
    @update="containerScroll">
    <div class="border-b border-gray-200 dark:border-gray-800">
      <BittSkeletonHeader
        v-if="!getRowExists(item)"
        class="pl-6" />
      <div
        v-else-if="getRowData(item)?.id"
        :class="getRowData(item)?.id == props.selectedRow
          ? 'p-4 text-sm cursor-pointer border-l-2 border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25'
          : 'p-4 text-sm cursor-pointer border-l-2 border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'"
          @click="() => rowClicked(getRowData(item))">
        <div class="flex items-center justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <UAvatar
              v-if="getRowData(item).avatar_url"
              :src="getRowData(item).avatar_url"
              size="lg"
              alt="Avatar" />
            <UAvatar
              v-else-if="getRowData(item).user_lastname"
              :alt="getRowData(item).user_lastname[0]"
              size="lg" />
            <div class="min-w-0 flex-auto text-base font-semibold">
              <p class="dark:text-white text-black truncate text-ellipsis">
                {{ getRowData(item).user_name }} {{ getRowData(item).user_lastname }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 truncate text-ellipsis text-xs">
                {{ getRowData(item).email }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 truncate text-ellipsis text-xs">
                {{ getRowData(item).sys_profile_name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RecycleScroller>
</template>