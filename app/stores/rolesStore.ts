import type { sys_profiles_form, sys_profiles_sort_enum } from '@/types/sys_profiles';
import type { sys_links } from '@/types/sys_links';

export const useRolesStore = defineStore('roles', () => {
  const searchString = ref<string>('');
  const page = ref<number>(1);
  const pageSize = ref<number>(50);
  const pagesLoaded = ref<number[]>([]);
  const sortBy = ref<sys_profiles_sort_enum>('a.name_es');
  const filterIsActive = ref<boolean[]>([]);
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const isDownloading = ref<boolean>(false);
  const selectedRowId = ref<number>();
  const formModel = ref<'edit'|'create'>('edit');
  const selectedRowData = ref<sys_profiles_form>();
  const lookupSysLinks = ref<sys_links[]>();

  const hasFilter = computed<boolean>(() => searchString.value !== '' || filterIsActive.value.length > 0 );

  return {
    searchString,
    page,
    pageSize,
    sortBy,
    filterIsActive,
    pagesLoaded,
    totalRows,
    isLoading,
    isDownloading,
    formModel,
    selectedRowId,
    selectedRowData,
    lookupSysLinks,
    // Getters
    hasFilter,
  };
});
