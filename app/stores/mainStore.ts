import type { Session } from '@supabase/supabase-js';
import type { sys_companies } from '@/types/sys_companies';
import type { sys_links } from '@/types/sys_links';
import type { sys_users } from '@/types/sys_users';

export const useMainStore = defineStore('main', () => {
  const badgeLabel = ref<string | number>('');
  const isLoadingCompanies = ref<boolean>(false);
  const isLoadingMenu = ref<boolean>(false);
  const isLoadingUserData = ref<boolean>(false);
  const isMobile = ref<boolean>(false);
  const isUserSessionValid = ref<boolean>(false);
  const leftDrawer = ref<boolean>(true);
  const showBadge = ref<boolean>(false);
  const userCompany = ref<sys_companies>();
  const userCompanies = ref<sys_companies[]>([]);
  const userData = ref<sys_users | null>(null);
  const userMenu = ref<sys_links[]>([]);
  const userSession = ref<Session | null>(null);

  // Actions
  const fetchUserCompanies = async () => {
    try {
      isLoadingCompanies.value = true;
      userCompanies.value = await $fetch('/api/system/user_companies');
    }
    catch (error) {
      console.error(`Error fetching user companies: ${error}`);
    }
    finally {
      const defaultCompany = userCompanies.value.find((company) => company.is_default);
      userCompany.value = defaultCompany ?? userCompanies.value[0] ?? undefined;
      isLoadingCompanies.value = false;
    }
  };

  const fetchUserData = async () => {
    try {
      isLoadingUserData.value = true;
      const response = await $fetch('/api/system/user_data');
      if (response.length && response[0]) {
        userData.value = response[0];
      }
    }
    catch (error) {
      console.error(`Error fetching user data: ${error}`);
    }
    finally {
      isLoadingUserData.value = false;
    }
  };

  const fetchUserMenu = async () => {
    try {
      isLoadingMenu.value = true;
      userMenu.value = await $fetch('/api/system/user_menu');
    }
    catch (error) {
      console.error(`Error fetching user menu: ${error}`);
    }
    finally {
      isLoadingMenu.value = false;
    }
  };

  const clearUserDataAndLogout = async () => {
    const { start, finish } = useLoadingIndicator();
    start();
    userData.value = null;
    userCompanies.value = [];
    userCompany.value = undefined;
    userMenu.value = [];
    userSession.value = null;
    showBadge.value = false;
    const { supabase } = useSupabase();
    await supabase.auth.signOut();
    const accessToken = useCookie('sb-access-token');
    const refreshToken = useCookie('sb-refresh-token');
    accessToken.value = null;
    refreshToken.value = null;
    isUserSessionValid.value = false;
    await navigateTo('/auth/login');
    finish();
  };


  // Getters
  const userMenuFormatted = computed(() => {
    return userMenu.value?.filter(root => !root.parent)
      ?.map((menu) => {
        const children = userMenu.value?.filter(child => child.parent === menu.id)
          .map((x) => {
            return {
              label: x.name_es!,
              to: x.link!,
              icon: '',
            };
          });

        return {
          label: menu.name_es!,
          icon: menu.icon!,
          to: menu.id === '0' ? '/' : undefined,
          children: menu.id != '0' ? children : undefined,
        };
      }) ?? [];
  });

  const userCompaniesFormatted = computed(() => {
    return userCompanies.value
      ?.map((company) => {
        return {
          ...company,
          avatar: { 
            src: (company.avatar_url && company.avatar_url != 'null') ? company.avatar_url : undefined,
            alt: company.name_es_short[0] ?? 'N',
          },
          // icon: (company.avatar_url && company.avatar_url != 'null') ? company.avatar_url : undefined ,
        };
      }) ?? [];
  });

  return {
    badgeLabel,
    isLoadingCompanies,
    isLoadingMenu,
    isLoadingUserData,
    isMobile,
    isUserSessionValid,
    leftDrawer,
    showBadge,
    userCompany,
    userCompanies,
    userData,
    userMenu,
    userSession,
    // Getters
    userCompaniesFormatted,
    userMenuFormatted,
    // Actions
    clearUserDataAndLogout,
    fetchUserCompanies,
    fetchUserData,
    fetchUserMenu,
  };
});
