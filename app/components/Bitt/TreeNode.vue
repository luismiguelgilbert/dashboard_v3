<script setup lang="ts">

const props = defineProps({
  treeData: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const treeDataFormat = computed(() => {
  return props.treeData?.map(x => {
    return {
      id: x.id,
      label: x.data.name_es,
      icon: x.data.icon,
      nodes: x.nodes,
      disabled: x.nodes.length === 0,
    };
  });
});

</script>

<template>
  <UAccordion
    :items="treeDataFormat"
    variant="soft"
    size="xl">
    <template #default="{ item }">
      <UButton
        v-if="item.nodes.length"
        color="gray"
        variant="soft"
        size="xl"
        block
        :icon="item.icon"
        class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-base gap-x-2.5 px-3.5 py-2.5 text-primary-500 dark:text-primary-400 bg-primary-50 hover:bg-primary-100 disabled:bg-primary-50 aria-disabled:bg-primary-50 dark:bg-primary-950 dark:hover:bg-primary-900 dark:disabled:bg-primary-950 dark:aria-disabled:bg-primary-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center mb-1.5 w-full">
        <span class="truncate"> {{ item.label }} </span>
        <template #trailing>
          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="w-5 h-5 ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']" />
        </template>
      </UButton>
      <div
        v-else
        class="flex justify-between flex-shrink-0 justify-center focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-base gap-x-2.5 px-3.5 py-2.5 text-primary-500 dark:text-primary-400 hover:bg-primary-50 disabled:bg-primary-50 aria-disabled:bg-primary-50 dark:hover:bg-primary-900 dark:disabled:bg-primary-950 dark:aria-disabled:bg-primary-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center mb-1.5 w-full">
        <div class="flex items-center">
          <UIcon
            :name="item.icon"
            class="font-bold text-2xl" />
          <span class="pl-3">{{ item.label }}</span>
        </div>
        <span>
          <UToggle />
        </span>
      </div>
    </template>
    <template #item="{ item }">
      <div
        v-if="item.nodes"
        class="pl-5">
        <TreeNode :treeData="item.nodes" />
      </div>
    </template>
  </UAccordion>
</template>