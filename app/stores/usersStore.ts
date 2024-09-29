import type { sys_users, sys_users_form, sys_users_sort_enum } from '@/types/sys_users';
import type { sys_companies } from '@/types/sys_companies';
import type { sys_profiles } from '@/types/sys_profiles';

export const useUsersStore = defineStore('users', () => {
  const searchString = ref<string>('');
  const page = ref<number>(1);
  const pageSize = ref<number>(50);
  const pagesLoaded = ref<number[]>([]);
  const sortBy = ref<sys_users_sort_enum>('a.user_lastname');
  const filterSex = ref<boolean[]>([]);
  const filterProfile = ref<number[]>([]);
  const rows = ref<{ [k: string]: sys_users[] }>({});
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const isDownloading = ref<boolean>(false);
  const selectedRowId = ref<string>();
  const formModel = ref<'edit'|'create'>('edit');
  const selectedRowData = ref<sys_users_form>();
  const lookupCompanies = ref<sys_companies[]>();
  const lookupProfiles = ref<sys_profiles[]>();

  const hasFilter = computed<boolean>(() => searchString.value !== '' || filterSex.value.length > 0 || filterProfile.value.length > 0 );

  return {
    searchString,
    page,
    pageSize,
    sortBy,
    filterSex,
    filterProfile,
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
    // Getters
    hasFilter,
  };
});
