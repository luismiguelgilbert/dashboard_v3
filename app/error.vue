<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
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
          <UPageError :error="error" />
        </UPage>
      </UMain>
    </UContainer>
  </div>
</template>

