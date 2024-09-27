<script setup lang="ts">

const handleSpecialColors = () => {
  if (useColorMode().value === 'dark') {
    useAppConfig().ui.primary = 'indigo';
  } else {
    useAppConfig().ui.primary = 'bitt';
  }
};

onMounted(async () => {
  if (import.meta.client) {
    useAppConfig().ui.primary = 'bitt';
    handleSpecialColors();
  }
});
</script>
<template>
  <div class="h-screen flex items-center justify-center overlay">
    <div class="gradient"></div>
    <NuxtPage />
  </div>
</template>

<style scoped>
.gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(80% 80% at 50% 50%, rgb(var(--color-primary-500) / 0.25) 0, #FFF 100%);
}

.dark {
  .gradient {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(80% 80% at 50% 50%, rgb(var(--color-gray-600) / 0.25) 0, rgb(var(--color-gray-950)) 100%);
  }
}

.overlay {
  background-size: 100px 100px;
  background-image:
    linear-gradient(to right, rgb(var(--color-gray-200)) 2.5px, transparent 0.5px),
    linear-gradient(to bottom, rgb(var(--color-gray-200)) 2.5px, transparent 0.5px);
}
.dark {
  .overlay {
    background-size: 100px 100px;
    background-image:
      linear-gradient(to right, rgb(var(--color-gray-800)) 2.5px, transparent 0.5px),
      linear-gradient(to bottom, rgb(var(--color-gray-800)) 2.5px, transparent 0.5px);
  }
}
</style>
