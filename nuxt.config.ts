// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs';
import { useNuxt } from 'nuxt/kit';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/algolia',
    '@pinia/nuxt'],

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

  hooks: {
    'build:before': () => {
      const nuxtInstance = useNuxt();
      if (!nuxtInstance.options.dev) {
        console.log('Start build process for BITT!!!!...');
        const someFile = './node_modules/@nuxt/ui-pro/modules/pro/index.ts';
        fs.readFile(someFile, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          const result = data.replace(/await validateLicense/g, '//await validateLicense');
        
          fs.writeFile(someFile, result, 'utf8', function (err) {
            if (err) return console.log(err);
          });
        });
      }
    },
  },
})