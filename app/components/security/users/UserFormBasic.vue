<script setup lang="ts">
import { sys_users_form_schema } from '@/types/sys_users';
import { colors_enum, dark_colors_enum } from '@/types/colors';

const usersStore = useUsersStore();
const mainRef = useTemplateRef('mainForm');
const fileRef = useTemplateRef('fileRef');

const {
  selectedRowData,
  selectedRowDataAvatarHelper,
  isLoading,
  lookupCompanies,
  lookupProfiles,
  formModel,
} = storeToRefs(usersStore);

const inputSize = 'xl';

defineExpose({
  validateMainForm: async () => {
    return await mainRef.value?.validate(undefined);
  }
});

const onFileClick = () => { fileRef.value?.input.click(); };
const onFileChange = (e: FileList) => {
  try {
    if (!e.length) { throw new Error('No se seleccionó archivo.'); }
    if (e[0] && e[0].size / 1024 / 1024 > 1) { throw new Error('Tamaño incorrecto.'); }
    if (e[0] && selectedRowData.value) {
      selectedRowDataAvatarHelper.value = e[0];
      selectedRowData.value.avatar_url = URL.createObjectURL(e[0]);
    }
  } catch (error) {
    useToast().add({
      title: `Error al cargar archivo: ${error}`,
      icon: 'i-hugeicons-settings-error-01',
      color: 'rose',
    });
  }
};
</script>

<template>
  <UForm
    v-if="selectedRowData"
    ref="mainForm"
    class="pl-1 pr-1 md:pl-2 md:pr-2 pt-4 md:pt-0"
    :schema="sys_users_form_schema"
    :state="selectedRowData">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5 px-1 sm:px-4 items-end">
      <div class="col-span-1 sm:col-span-2 pt-1"></div>
      <div class="self-start">
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
          v-model:model-value="selectedRowData.email!"
          required
          placeholder="Email del Usuario"
          icon="i-heroicons-envelope"
          :disabled="formModel === 'edit'"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
          v-model:model-value="selectedRowData.user_name"
          required
          placeholder="Nombres del Usuario"
          icon="i-heroicons-user"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
          v-model:model-value="selectedRowData.user_lastname"
          required
          placeholder="Apellidos del Usuario"
          icon="i-heroicons-user"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
          v-model="selectedRowData.user_sex"
          :disabled="isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ selectedRowData.user_sex ? 'Hombre' : 'Mujer' }}</span>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
          v-model="selectedRowData.sys_profile_id"
          required
          searchable
          searchable-placeholder="Buscar rol..."
          placeholder="Seleccionar rol..."
          icon="i-heroicons-user-circle"
          value-attribute="id"
          option-attribute="name_es"
          :options="lookupProfiles" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Organizaciones:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Define Organizaciones permitidas.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="sys_companies_users">
        <USelectMenu
          v-model="selectedRowData.sys_companies_users"
          required
          searchable
          multiple
          searchable-placeholder="Buscar organizaciones..."
          placeholder="Seleccionar organizaciones..."
          icon="i-hugeicons-building-03"
          value-attribute="id"
          option-attribute="name_es"
          :options="lookupCompanies" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Organización preferida:
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Auto selecciona esta compañía durante el inicio.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="default_user_company">
        <USelectMenu
          v-model="selectedRowData.default_user_company"
          required
          searchable
          searchable-placeholder="Buscar organizaciones..."
          placeholder="Seleccionar preferida..."
          icon="i-hugeicons-building-03"
          value-attribute="id"
          option-attribute="name_es"
          :options="lookupCompanies" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
            v-if="selectedRowData.avatar_url"
            :src="selectedRowData.avatar_url"
            :alt="selectedRowData.user_lastname"
            size="lg" />
          <UAvatar
            v-else
            :alt="selectedRowData.user_lastname"
            size="lg" />
          <UButton
            label="Seleccionar"
            trailing-icon="i-hugeicons-cloud-upload"
            color="white"
            size="md"
            class="ml-5"
            @click="onFileClick" />
          <UInput
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange" />
        </div>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
        <p class="text-gray-900 dark:text-white font-semibold">
          Tema oscuro::
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Utilizar fondo oscuro.
        </p>
      </div>
      <UFormGroup
        :size="inputSize"
        name="dark_enabled">
        <UToggle
          v-model="selectedRowData.dark_enabled"
          on-icon="i-heroicons-moon"
          off-icon="i-heroicons-sun"
          :disabled="isLoading" />
        <span
          class="ml-5"
          style="vertical-align: text-bottom;">{{ selectedRowData.dark_enabled ? 'Oscuro' : 'Claro' }}</span>
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
          v-model="selectedRowData.default_dark_color"
          icon="i-heroicons-moon"
          :options="Object.keys(dark_colors_enum.Values)"
          :loading="isLoading" />
      </UFormGroup>

      <UDivider class="col-span-1 sm:col-span-2 my-5 sm:my-0" />
      <div class="self-start">
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
          v-model="selectedRowData.default_color"
          icon="i-heroicons-swatch"
          :options="Object.keys(colors_enum.Values)"
          :loading="isLoading" />
      </UFormGroup>
      <br /><br />
    </div>
  </UForm>
</template>
