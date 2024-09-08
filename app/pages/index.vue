<script setup lang="ts">
const mainStore = useMainStore();
const { userData, isLoadingUserData, isMobile } = storeToRefs(mainStore);
const inputSize = 'xl';
const inputUI = 'md';
</script>

<template>
  <UDashboardPage>
    <div class="overflow-y-scroll w-full">
      <div
        v-if="isLoadingUserData"
        class="m-5">
        <LazyBittSkeletonHeader :lines="5" />
      </div>
      <div v-else-if="userData">
        <ULandingCard
          class="m-10"
          :title="`${userData.user_name} ${userData.user_lastname}`"
          :description="userData.email!"
          orientation="horizontal"
          icon="i-hugeicons-house-04">
          <UAvatar
            :src="userData.avatar_url!"
            :alt="userData.user_lastname"
            size="3xl" />
          <!-- <UAvatar
            alt="Luis Miguel Gilbert"
            size="2xl" /> -->
        </ULandingCard>
        <UForm
          ref="form"
          :state="userData ?? {}"
          class="pl-6 pr-6 md:pl-10 md:pr-10 pt-4 md:pt-0">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-2 sm:px-4 items-end">
            <div class="col-span-1 sm:col-span-2 pt-1"></div>
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Email:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Correo electrónico (requerido en el inicio de sesión).
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="email">
              <UInput
                v-model:model-value="userData.email!"
                required
                placeholder="Email del Usuario"
                icon="i-heroicons-envelope"
                :disabled="!!userData.id"
                :ui="inputUI"
                :loading="isLoadingUserData" />
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Nombres:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Nombres del usuario.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="user_name">
              <UInput
                v-model:model-value="userData.user_name"
                required
                placeholder="Nombres del Usuario"
                icon="i-heroicons-user"
                :ui="inputUI"
                :loading="isLoadingUserData" />
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Apellidos:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Apellidos del usuarios.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="user_lastname">
              <UInput
                v-model:model-value="userData.user_lastname"
                required
                placeholder="Apellidos del Usuario"
                icon="i-heroicons-user"
                :ui="inputUI"
                :loading="isLoadingUserData" />
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Sexo:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Sexo del usuario.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="user_sex">
              <UToggle
                v-model="userData.user_sex"
                :disabled="isLoadingUserData" />
              <span
                class="ml-5"
                style="vertical-align: text-bottom;">{{ userData.user_sex ? 'Hombre' : 'Mujer' }}</span>
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Rol:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Define acceso a funcionalidades.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="sys_profile_id">
              <USelectMenu
                v-model="userData.sys_profile_id"
                searchable
                required
                :loading="true"
                searchable-placeholder="Buscar rol..."
                placeholder="Seleccionar rol..."
                icon="i-heroicons-user-circle"
                value-attribute="id"
                option-attribute="name_es"
                :options="[]" />
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Avatar:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Foto del usuario (1MB max).
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="avatar_url">
              <div class="flex items-center">
                <UAvatar
                  :src="userData.avatar_url!"
                  :alt="userData.user_lastname"
                  size="lg" />
                <UButton
                  label="Seleccionar"
                  color="white"
                  size="md"
                  class="ml-5" />
                <UInput
                  ref="fileRef"
                  type="file"
                  class="hidden"
                  accept=".jpg, .jpeg, .png, .gif" />
              </div>
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Color de fondo:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Utilizar fondo oscuro.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="dark_enabled">
              <UColorModeSelect />
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Tonalidad de fondo oscuro:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Al activar el fondo oscuro, se usará el tono seleccionado.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="default_dark_color">
              <USelectMenu
                v-model="userData.dark_enabled"
                icon="i-heroicons-moon"
                :options="[]"
                :loading="isLoadingUserData" />
            </UFormGroup>
  
            <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div>
              <p class="text-gray-900 dark:text-white font-semibold">
                Color:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Color de acentuación preferido.
              </p>
            </div>
            <UFormGroup
              :size="inputSize"
              name="default_dark_color">
              <USelectMenu
                v-model="userData.default_color"
                icon="i-heroicons-swatch"
                :options="[]"
                :loading="isLoadingUserData" />
            </UFormGroup>
  
            <UDivider
              v-if="userData.id"
              class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
            <div v-if="userData.id">
              <p class="text-gray-900 dark:text-white font-semibold">
                Código:
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Código reservado para uso del sistema.
              </p>
            </div>
            <UInput
              v-if="userData.id"
              v-model:model-value="userData.id"
              required
              label="Código"
              :size="inputSize"
              readonly
              placeholder="ID del Usuario"
              icon="i-heroicons-circle-stack"
              :ui="inputUI"
              :loading="isLoadingUserData" />
            <br />
            <UAlert
              class="col-span-1 sm:col-span-2 my-5 sm:my-0"
              icon="i-hugeicons-logout-04"
              color="rose"
              variant="subtle"
              :title="isMobile? 'Salir del Sistema' : 'Salir del sistema y regresar a página de inicio de sesión.'"
              :actions="[{ variant: 'solid', color: 'rose', label: 'Cerrar sesión', click: mainStore.clearUserDataAndLogout }]" />
            <br /><br />
          </div>
        </UForm>
      </div>
    </div>
  </UDashboardPage>
</template>
