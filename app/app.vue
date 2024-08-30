<script setup lang="ts">
const { seo } = useAppConfig();

// const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
// const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
//   default: () => [],
//   server: false
// })

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>