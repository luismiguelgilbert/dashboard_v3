<script setup lang="ts">
import type { FormError, FormGroupSize } from '#ui/types';
useHead({ title: 'BITT - Ingreso' });

definePageMeta({
  layout: 'auth',
});
const loading = ref<boolean>(false);
const mainStore = useMainStore();
const { isUserSessionValid } = storeToRefs(mainStore);
const queryParams = useRoute().query;
const errorMessage = ref<string>(queryParams.error ? 'Su sesión expiró!' : '');

const sizeXL: FormGroupSize = 'xl';
const fields = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Ingrese su email',
    color: 'gray',
    size: sizeXL,
  },
  {
    name: 'password',
    label: 'Clave',
    type: 'password',
    placeholder: 'Ingrese su clave',
    color: 'gray',
    size: sizeXL,
  },
];
type CredentialData = {
  email: string;
  password: string;
};

const validate = (state: CredentialData) => {
  const errors: FormError[] = [];
  if (!state.email) errors.push({ path: 'email', message: 'Email es obligatorio' });
  if (!state.password) errors.push({ path: 'password', message: 'Password es obligatorio' });
  return errors;
};

const onSubmit = async (credentialData: CredentialData) => {
  try {
    loading.value = true;
    const credentials = ({
      email: credentialData.email,
      password: credentialData.password,
    });
    const { supabase } = useSupabase();
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      errorMessage.value = error.message;
      throw error;
    }

    const accessToken = useCookie('sb-access-token');
    const refreshToken = useCookie('sb-refresh-token');
    accessToken.value = data.session.access_token;
    refreshToken.value = data.session.refresh_token;
    isUserSessionValid.value = true;

    const headers = useRequestHeaders(['cookie']);
    const { data: userMenuData, error: userMenuError } = await useFetch('/api/system/user_menu_token', { headers });
    if (userMenuError.value) throw new Error('Error fetching user menu token');
    const menuToken = useCookie('sb-menu-token');
    menuToken.value = userMenuData.value;

    await navigateTo('/');
  }
  catch (error) {
    loading.value = false;
    isUserSessionValid.value = false;
    console.error(error);
  }
};
</script>

<template>
  <div class="h-full sm:h-0 flex items-start sm:items-center backdrop-blur">
    <UCard class="w-dvw h-full sm:h-auto sm:w-96">
      <UAuthForm
        :fields="fields"
        align="top"
        title="Iniciar sesión"
        :loading="loading"
        :validate="validate"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :submit-button="{ label: 'Iniciar sesión', trailingIcon: 'i-heroicons-arrow-right-20-solid', size: 'xl' }"
        @submit="onSubmit">
        <template
          v-if="errorMessage.length && !loading"
          #footer>
          <UAlert
            icon="i-hugeicons-alert-diamond"
            color="rose"
            variant="subtle"
            :description="errorMessage" />
        </template>
        <!-- <template #email-hint>
          <NuxtLink
            to="/auth/signup"
            class="text-primary font-medium">
            No tiene una cuenta?
          </NuxtLink>
        </template>
        <template #password-hint>
          <NuxtLink
            to="/auth/forgot"
            class="text-primary font-medium">
            Olvidó su clave?
          </NuxtLink>
        </template> -->
      </UAuthForm>
    </UCard>
  </div>
</template>
