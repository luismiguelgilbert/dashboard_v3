// import { type Session } from "@supabase/supabase-js";

export const useUsersStore = defineStore('users', () => {
  const searchString = ref<string>('');
  const listKey = ref<number>(1);
  const page = ref<number>(1);
  const pageSize = ref<number>(100);
  const pagesLoaded = ref<number[]>([]);
  const rows = ref<{[k: string]: any}>({});
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const selectedRow = ref<any>();

  //Actions
  const addToPagesLoaded = (page: number) => {
    if (!pagesLoaded.value.includes(page)) {
      pagesLoaded.value.push(page);
    }
    // pagesLoaded.value = Array.from(new Set([...pagesLoaded.value, page])).sort((a, b) => a - b);
  };

  const resetLoadedData = () => {
    page.value = 1;
    pagesLoaded.value = [];
    rows.value = {};
    totalRows.value = 0;
    listKey.value++;
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

  //Getters
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
    listKey,
    selectedRow,
    //Actions
    addToPagesLoaded,
    resetLoadedData,
  }
})