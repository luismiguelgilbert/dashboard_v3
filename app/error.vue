<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError
}>();

definePageMeta({
  layout: 'auth'
});

useSeoMeta({
  title: 'Página no existe',
  description: 'Lo sentimos, no podemos encontrar esta página.'
});
</script>

<template>
  <div>
    <UContainer>
      <UMain>
        <UPage>
          <UPageError
            name="Lo sentimos, ha ocurrido un error"
            :message="props.error.message" />
        </UPage>
      </UMain>
    </UContainer>
  </div>
</template>

