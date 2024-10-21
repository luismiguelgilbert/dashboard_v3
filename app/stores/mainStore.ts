import type { Session } from '@supabase/supabase-js';
import type { sys_companies } from '@/types/sys_companies';
import type { sys_links } from '@/types/sys_links';
import type { sys_users } from '@/types/sys_users';

export const useMainStore = defineStore('main', () => {
  const isLoadingCompanies = ref<boolean>(false);
  const isLoadingMenu = ref<boolean>(true);
  const isLoadingUserData = ref<boolean>(true);
  const isMobile = ref<boolean>(false);
  const isUserSessionValid = ref<boolean>(false);
  const leftDrawer = ref<boolean>(true);
  const userCompany = ref<sys_companies>();
  const userCompanies = ref<sys_companies[]>([]);
  const userData = ref<sys_users | null>(null);
  const userMenu = ref<sys_links[]>([]);
  const userSession = ref<Session | null>(null);

  // Actions
  const fetchUserCompanies = async () => {
    try {
      isLoadingCompanies.value = true;
      const headers = useRequestHeaders(['cookie']);
      const { data, error } = await useFetch('/api/system/user_companies', { headers });
      if (error.value) {
        throw new Error(`Error fetching user companies: ${error.value.statusMessage}`);
      }
      if (data.value) {
        userCompanies.value = data.value;
        userCompany.value = userCompanies.value[0] ?? undefined;
      }
    }
    catch (error) {
      throw new Error(`Error fetching user companies B: ${error}`);
    }
    finally {
      isLoadingCompanies.value = false;
    }
  };

  /** fetchUserData is a ClientSide oriented action*/
  const fetchUserData = async () => {
    try {
      isLoadingUserData.value = true;
      isLoadingMenu.value = true;

      //Refresh Session if exists
      const { supabase } = useSupabase();
      const { data: sessionData } = await supabase.auth.refreshSession();
      if (sessionData?.session) {
        //Set tokens
        const accessToken = await useCookie('sb-access-token');
        const refreshToken = await useCookie('sb-refresh-token');
        accessToken.value = sessionData.session.access_token;
        refreshToken.value = sessionData.session.refresh_token;
        //Fetch user data
        const headers = useRequestHeaders(['cookie']);
        const { data, error } = await useFetch('/api/system/user_data', { headers, credentials: 'include' });
        if (error.value) {
          throw new Error(`Error fetching user data: ${error.value.message}`);
        }
        if (data.value) {
          userData.value = data.value;
        }
        //Fetch menu token
        const { data: userMenuData, error: userMenuError } = await useFetch('/api/system/user_menu_token', { headers, credentials: 'include' });
        if (userMenuError.value) {
          throw new Error('Error fetching user menu token');
        }
        const menuToken = useCookie('sb-menu-token');
        menuToken.value = userMenuData.value;
        //Fetch user menu
        const { data: menuData, error: menuError } = await useFetch('/api/system/user_menu', { headers });
        if (menuError.value) {
          throw new Error(`Error fetching user menu: ${menuError.value?.message}`);
        }
        if (menuData.value) {
          userMenu.value = menuData.value;
        }
        isUserSessionValid.value = true;
      }
    }
    catch (error) {
      isUserSessionValid.value = false;
      throw new Error(`Error fetching user data B: ${error}`);
    }
    finally {
      isLoadingUserData.value = false;
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
    const { supabase } = useSupabase();
    await supabase.auth.signOut();
    const accessToken = useCookie('sb-access-token');
    const refreshToken = useCookie('sb-refresh-token');
    const menuToken = useCookie('sb-menu-token');
    accessToken.value = null;
    refreshToken.value = null;
    menuToken.value = null;
    isUserSessionValid.value = false;
    localStorage.clear();//
    await navigateTo('/auth/login');
    finish();
  };

  // Getters
  const isDarkMode = computed<boolean>(() => useColorMode().value === 'dark');
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
    isLoadingCompanies,
    isLoadingMenu,
    isLoadingUserData,
    isMobile,
    isUserSessionValid,
    leftDrawer,
    userCompany,
    userCompanies,
    userData,
    userMenu,
    userSession,
    // Getters
    isDarkMode,
    userCompaniesFormatted,
    userMenuFormatted,
    // Actions
    clearUserDataAndLogout,
    fetchUserCompanies,
    fetchUserData,
  };
});
