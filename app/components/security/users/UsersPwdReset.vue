<script setup lang="ts">

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const emits = defineEmits(['cancel']);

const mainStore = useMainStore();
const { isMobile } = storeToRefs(mainStore);

const cardUi = {
  body: {
    base: 'flex-1 h-[calc(100dvh-70px)] overflow-y-auto',
    padding: 'px-0 py-2 sm:p-0',
  },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
  rounded: 'rounded-none',
};

const closeSlideOder = () => {
  emits('cancel');
};
</script>

<template>
  <USlideover
    :model-value="props.isOpen"
    prevent-close
    :ui="{ width: 'max-w-lg' }">
    <UCard :ui="cardUi">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Restablecer contraseña
          </h3>
          <div class="flex gap-3">
            <UButton
              icon="i-hugeicons-transition-right"
              @click="closeSlideOder">
              <span v-if="!isMobile">Cerrar</span>
            </UButton>
          </div>
        </div>
      </template>
      <div class="grid gap-y-2 py-5 px-7">
        Content here
      </div>
    </UCard>
  </USlideover>
</template>