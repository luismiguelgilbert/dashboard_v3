import type { sys_users, sys_users_form } from '@/types/sys_users';
import type { sys_companies } from '@/types/sys_companies';
import type { sys_profiles } from '@/types/sys_profiles';

export const useUsersStore = defineStore('users', () => {
  const searchString = ref<string>('');
  const page = ref<number>(1);
  const pageSize = ref<number>(50);
  const pagesLoaded = ref<number[]>([]);
  const rows = ref<{ [k: string]: sys_users[] }>({});
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const isDownloading = ref<boolean>(false);
  const selectedRowId = ref<string>();
  const formModel = ref<'edit'|'create'>('edit');
  const selectedRowData = ref<sys_users_form>();
  const lookupCompanies = ref<sys_companies[]>();
  const lookupProfiles = ref<sys_profiles[]>();

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

  return {
    searchString,
    page,
    pageSize,
    pagesLoaded,
    totalRows,
    isLoading,
    isDownloading,
    rows,
    formModel,
    selectedRowId,
    selectedRowData,
    lookupCompanies,
    lookupProfiles,
    // Actions
    addToPagesLoaded,
    resetLoadedData,
  };
});
