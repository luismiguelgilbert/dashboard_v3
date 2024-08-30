// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt'],

  runtimeConfig: {
    // Private keys are only available on the server
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    algoliaAppId: process.env.ALGOLIA_APPLICATION_ID,
    algoliaAdminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,

    // Public keys that are exposed to the client
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
})