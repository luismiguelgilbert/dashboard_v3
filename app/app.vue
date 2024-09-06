<script setup lang="ts">
const { seo } = useAppConfig();
const mainStore = useMainStore();

useHead({
  meta: [
    { name: 'viewport', content: `width=device-width, initial-scale=0.85}, user-scalable=0` },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
});

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  ogImage: 'https://docs-template.nuxt.dev/social-card.png',
  twitterImage: 'https://docs-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator
      :throttle="100"
      :height="7" />
    
    <BittAppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UNotifications />
  </div>
</template>