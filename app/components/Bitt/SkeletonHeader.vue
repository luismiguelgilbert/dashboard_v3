<script setup lang="ts">
const props = defineProps({
  lines: {
    type: Number,
    required: true,
    default: 1,
  },
});

const ui = {
  base: 'animate-pulse',
  background: 'bg-gray-200 dark:bg-gray-800',
  rounded: 'rounded-md'
};
</script>

<template>
  <div 
    v-for="n in props.lines"
    :key="n"
    class="flex items-center space-x-4 w-full">
    <div class="space-y-2 w-full px-2 py-2">
      <USkeleton
        class="h-4 w-full"
        :ui="ui" />
      <USkeleton
        class="h-4 w-5/6"
        :ui="ui" />
    </div>
  </div>
</template>
