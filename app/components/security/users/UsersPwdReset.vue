<script setup lang="ts">
import { sys_users_password_reset_schema, type sys_users_password_reset } from '@/types/sys_users';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const emits = defineEmits(['cancel']);

const mainStore = useMainStore();
const { isMobile } = storeToRefs(mainStore);
const mainRef = useTemplateRef('mainRef');
const loading = ref(false);
const hasError = ref(false);
const isSaveSuccess = ref(false);
const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);
const resetData = ref<sys_users_password_reset>({
  id: '',
  password: '',
  passwordConfirm: '',
});

const cardUi = {
  body: {
    base: 'flex-1 h-[calc(100dvh-70px)] overflow-y-auto',
    padding: 'px-0 py-2 sm:p-0',
  },
  ring: '',
  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
  rounded: 'rounded-none',
};

const closeSlideOder = () => {
  resetData.value = {
    id: '',
    password: '',
    passwordConfirm: '',
  };
  emits('cancel');
};

const search = async (q: string) => {
  loading.value = true;

  const users = await $fetch('/api/security/users', {
      method: 'POST',
      body: {
        searchString: q.toLocaleLowerCase().replaceAll(' ', ''),
        filterProfile: [],
        filterSex: [],
        page: 1,
        pageSize: 50,
        sortBy: 'a.user_lastname',
      }
    });

  loading.value = false;

  return users.map(x => ({
    id: x.id,
    full_name: `${x.user_name} ${x.user_lastname}`,
    email: x.email,
    avatar_url: x.avatar_url
  }));
};

const validateAndSave = async () => {
  try {
    isSaveSuccess.value = false;
    hasError.value = false;
    mainRef.value?.validate(undefined);
    sys_users_password_reset_schema.parse(resetData.value);
    await $fetch(`/api/security/users/:${resetData.value.id}/reset`, {
      method: 'POST',
      body: resetData.value,
    });
    isSaveSuccess.value = true;
    hasError.value = false;
  } catch (error) {
    isSaveSuccess.value = false;
    hasError.value = true;
    console.error(error);
  }
};
</script>

<template>
  <USlideover
    :model-value="props.isOpen"
    prevent-close
    :ui="{ width: 'max-w-lg' }">
    <UCard :ui="cardUi">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Restablecer contraseña
          </h3>
          <div class="flex gap-3">
            <UButton
              icon="i-hugeicons-transition-right"
              @click="closeSlideOder">
              <span v-if="!isMobile">Cerrar</span>
            </UButton>
          </div>
        </div>
      </template>

      <div class="mx-5">
        <UAlert
          v-if="hasError"
          class="my-5"
          icon="i-hugeicons-settings-error-01"
          color="rose"
          variant="subtle"
          title="Se ha producido un error; por favor revise sus datos y reintente." />

        <UAlert
          v-if="isSaveSuccess"
          class="my-5"
          icon="i-hugeicons-checkmark-circle-01"
          color="green"
          variant="subtle"
          title="Datos guardados correctamente." />
      </div>

      <UForm
        ref="mainRef"
        class="grid gap-y-5 py-5 px-7"
        :state="resetData"
        :schema="sys_users_password_reset_schema">
        
        <UFormGroup
          size="lg"
          label="Usuario:"
          name="id">
          <USelectMenu
            v-model="resetData.id"
            :loading="loading"
            :searchable="search"
            required
            class="max-w-"
            icon="i-heroicons-user-circle"
            placeholder="Seleccionar usuario..."
            searchable-placeholder="mostrando primeros 50 resultados.."
            value-attribute="id"
            option-attribute="full_name">
            <template #option="{ option }">
              <div class="flex items-center gap-3">
                <UAvatar
                  v-if="option.avatar_url && option.avatar_url.length > 1"
                  :src="option.avatar_url"
                  size="sm"
                  alt="Avatar" />
                <UAvatar
                  v-else
                  :alt="option.full_name[0]"
                  size="sm" />
                <div class="text-base font-semibold dark:text-white text-black truncate">
                  {{ option.full_name }}
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ option.email }}
                  </p>
                </div>
              </div>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          class="w-full"
          size="lg"
          label="Nueva contraseña"
          name="password">
          <UButtonGroup
            class="w-full"
            size="lg">
            <UInput
              v-model.trim="resetData.password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="new-password"
              class="w-full"
              icon="i-hugeicons-password-validation" />
            <UButton
              icon="i-hugeicons-view"
              color="gray"
              @click="passwordVisible = !passwordVisible" />
          </UButtonGroup>
        </UFormGroup>

        <UFormGroup
          class="w-full"
          size="lg"
          label="Confirmar contraseña"
          name="passwordConfirm">
          <UButtonGroup
            class="w-full"
            size="lg">
            <UInput
              v-model.trim="resetData.passwordConfirm"
              :type="passwordConfirmVisible ? 'text' : 'password'"
              autocomplete="new-password"
              class="w-full"
              icon="i-hugeicons-password-validation" />
            <UButton
              icon="i-hugeicons-view"
              color="gray"
              @click="passwordConfirmVisible = !passwordConfirmVisible" />
          </UButtonGroup>
        </UFormGroup>

        <UButton
          block
          icon="i-hugeicons-password-validation"
          size="lg"
          label="Restablecer contraseña"
          :disabled="loading"
          :loading="loading"
          @click="validateAndSave" />
      </UForm>
    </UCard>
  </USlideover>
</template>