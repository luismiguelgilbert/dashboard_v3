// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs';
import { useNuxt } from 'nuxt/kit';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/algolia', '@pinia/nuxt', '@nuxt/icon'],

  eslint: {
    config: {
      stylistic: false, // <---
    },
  },

  runtimeConfig: {
    // Private keys are only available on the server
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    algoliaAppId: process.env.ALGOLIA_APPLICATION_ID,
    algoliaAdminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
    newUserDefaultPwd: process.env.NEWUSERSDEFAULTPWD,

    // Public keys that are exposed to the client
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  hooks: {
    'build:before': () => {
      const nuxtInstance = useNuxt();
      if (!nuxtInstance.options.dev) {
        console.log('Start build process for BITT!!!!...');
        const someFile = './node_modules/@nuxt/ui-pro/modules/pro/index.ts';
        fs.readFile(someFile, 'utf8', function (err, data) {
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

  icon: {
    clientBundle: {
      // list of icons to include in the client bundle
      icons: [
        //HugeIcons
        'hugeicons-account-setting-01',
        'hugeicons-ai-security-01',
        'hugeicons-alert-circle',
        'hugeicons-alert-diamond',
        'hugeicons-building-03',
        'hugeicons-building-06',
        'hugeicons-cancel-circle',
        'hugeicons-car-03',
        'hugeicons-circle-arrow-down-01',
        'hugeicons-checkmark-circle-01',
        'hugeicons-database',
        'hugeicons-filter',
        'hugeicons-house-04',
        'hugeicons-loading-03',
        'hugeicons-logout-04',
        'hugeicons-plus-sign-circle',
        'hugeicons-transition-right',
        'hugeicons-search-01',
        'hugeicons-settings-error-01',
        'hugeicons-user-group',
        'hugeicons-user-circle',
        'hugeicons-user-circle-02',
        //HeroIcons
        'heroicons-archive-box',
        'heroicons-arrow-path-20-solid',
        'heroicons-banknotes',
        'heroicons-building-storefront',
        'hugeicons-church',
        'heroicons-circle-stack',
        'heroicons-cog-6-tooth',
        'heroicons-currency-dollar',
        'heroicons-shopping-bag',
        'heroicons-sun-20-solid',
        'heroicons-user-group',
        'heroicons-wrench',
        'heroicons-wrench-screwdriver',
      ],

      // scan all components in the project and include icons 
      scan: true,

      // include all custom collections in the client bundle
      includeCustomCollections: true, 

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },

  tailwindcss: {
    config: {
      /* Extend the Tailwind config here */
      theme: {
        extend: {
          colors: {
            bitt: {
              //  '50': '#e7e5e4',
              // '100: '#e7e5e4',
              // '200: '#030712',
              // '300: '#030712',
              // '400: '#262626',
              // '500: '#030712',
              // '600: '#030712',
              // '700: '#030712',
              // '800: '#262626',
              // '900: '#030712',
              // '950': '#030712',
              // '50': '#6d6d6d',
              // '100: '#5d5d5d',
              //000000
              //E5E5E5
              //First Accepted Attempt
              //  50: '#F6F6F6',
              // 100: '#E7E7E7',
              // 200: '#D1D1D1',
              // 300: '#B0B0B0',
              // 400: '#888888',

              //button dark > 400; hover: 500
              //button light > 500; hover: 600
              50: '#F6F6F6',
              100: '#E7E7E7',
              200: '#D1D1D1',
              300: '#B0B0B0',
              400: '#888888',
              500: '#000000',
              600: '#1D2841',
              // 600: '#3D3D3D',
              700: '#454545',
              800: '#4F4F4F',
              900: '#5D5D5D',
              950: '#6D6D6D',
            }
          },
        }
      }
    }
  }
});