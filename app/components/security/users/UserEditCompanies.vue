<script setup lang="ts">
const usersStore = useUsersStore();
const { lookupCompanies } = storeToRefs(usersStore);
</script>

<template>
  <UCard
    :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
    class="mx-1 mt-5 min-w-0 overflow-x-hidden">
    <ul
      role="list"
      class="divide-y divide-gray-200 dark:divide-gray-800">
      <div
        v-for="company in lookupCompanies"
        :key="company.id"
        class="flex w-full align-middle gap-3 py-3 px-2 sm:px-5">
        <div class="flex min-w-0 items-center  w-full justify-between">
          <div class="flex items-center gap-3">
            <UAvatar
              v-if="company.avatar_url"
              :src="company.avatar_url"
              size="lg"
              alt="Avatar" />
            <UAvatar
              v-else
              :alt="company.name_es_short"
              size="lg" />
            <div class="min-w-0 flex-auto text-base font-semibold">
              <p class="dark:text-white text-black truncate text-ellipsis">
                {{ company.name_es_short }}
              </p>
            </div>
          </div>
          <div>
            <UToggle
              :model-value="lookupCompanies?.some(x => x.id === company.id)"
              class="mt-4 mr-1 sm:mr-4" />
          </div>
        </div>
      </div>
    </ul>
  </UCard>
  <br /><br />
</template>
