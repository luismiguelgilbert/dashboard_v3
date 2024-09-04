import { type Session } from "@supabase/supabase-js";
import { type sys_companies } from "@/types/sys_companies";
import { type sys_links } from "@/types/sys_links.js";

export const useMainStore = defineStore('main', () => {
  const isMobile = ref<boolean>(false);
  const isLoadingCompanies = ref<boolean>(false);
  const isLoadingMenu = ref<boolean>(false);
  const isUserSessionValid = ref<boolean>(false);
  const leftDrawer = ref<boolean>(true);
  const userCompanies = ref<sys_companies[]>([]);
  const userMenu = ref<sys_links[]>([]);
  const userSession = ref<Session | null>(null);
  const showBadge = ref<boolean>(false);
  const badgeLabel = ref<string|number>('');

  //Actions
  const fetchUserCompanies = async () => {
    try {
      isLoadingCompanies.value = true;
      userCompanies.value = await $fetch('/api/system/user_companies');
    } catch (error) {
      console.error('Error fetching user companies:');
    } finally {
      isLoadingCompanies.value = false;
    }
  };

  const fetchUserMenu = async () => {
    try {
      isLoadingMenu.value = true;
      userMenu.value = await $fetch('/api/system/user_menu');
    } catch (error) {
      console.error('Error fetching user menu:');
    } finally {
      isLoadingMenu.value = false;
    }
  };

  //Getters
  const userMenuFormatted = computed(() => {
    return userMenu.value?.filter(root => !root.parent)
      ?.map(menu => { 
        const children = userMenu.value?.filter((child) => child.parent === menu.id)
          .map(x => { return {
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

  return {
    isMobile,
    isLoadingCompanies,
    isLoadingMenu,
    isUserSessionValid,
    leftDrawer,
    userCompanies,
    userMenu,
    userSession,
    showBadge,
    badgeLabel,
    //Getters
    userMenuFormatted,
    //Actions
    fetchUserCompanies,
    fetchUserMenu,
  }
})