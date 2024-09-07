<script setup lang="ts">
const props = defineProps({
  lines: {
    type: Number,
    required: true,
    default: 1,
  },
});
</script>

<template>
  <div 
    v-for="n in props.lines"
    :key="n"
    class="flex items-center space-x-4 w-full">
    <div class="space-y-2 w-full px-2 py-2">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-5/6" />
    </div>
  </div>
</template>
