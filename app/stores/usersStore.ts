import type { sys_users } from '@/types/sys_users';
import type { sys_companies } from '@/types/sys_companies';

export const useUsersStore = defineStore('users', () => {
  const searchString = ref<string>('');
  const page = ref<number>(1);
  const pageSize = ref<number>(100);
  const pagesLoaded = ref<number[]>([]);
  const rows = ref<{ [k: string]: sys_users[] }>({});
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const selectedRowId = ref<string>();
  const selectedRowData = ref<sys_users>();
  const lookupCompanies = ref<sys_companies[]>();

  // Actions
  const addToPagesLoaded = (page: number) => {
    if (!pagesLoaded.value.includes(page)) {
      pagesLoaded.value.push(page);
    }
  };

  const resetLoadedData = () => {
    page.value = 1;
    pagesLoaded.value = [];
    rows.value = {};
    totalRows.value = 0;
  };
  // const fetchUserCompanies = async () => {
  //   try {
  //     isLoadingCompanies.value = true;
  //     userCompanies.value = await $fetch('/api/system/user_companies');
  //   } catch (error) {
  //     console.error('Error fetching user companies:');
  //   } finally {
  //     isLoadingCompanies.value = false;
  //   }
  // };

  // const fetchUserMenu = async () => {
  //   try {
  //     isLoadingMenu.value = true;
  //     userMenu.value = await $fetch('/api/system/user_menu');
  //   } catch (error) {
  //     console.error('Error fetching user menu:');
  //   } finally {
  //     isLoadingMenu.value = false;
  //   }
  // };

  // Getters
  // const userMenuFormatted = computed(() => {
  //   return userMenu.value?.filter(root => !root.parent)
  //     ?.map(menu => {
  //       const children = userMenu.value?.filter((child) => child.parent === menu.id)
  //         .map(x => { return {
  //           label: x.name_es!,
  //           to: x.link!,
  //           icon: '',
  //         };
  //       });

  //       return {
  //         label: menu.name_es!,
  //         icon: menu.icon!,
  //         to: menu.id === '0' ? '/' : undefined,
  //         children: menu.id != '0' ? children : undefined,
  //       };
  //     }) ?? [];
  // });

  return {
    searchString,
    page,
    pageSize,
    pagesLoaded,
    totalRows,
    isLoading,
    rows,
    selectedRowId,
    selectedRowData,
    lookupCompanies,
    // Actions
    addToPagesLoaded,
    resetLoadedData,
  };
});
