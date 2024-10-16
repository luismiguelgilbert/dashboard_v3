import type { bitacora_cars, bitacora_cars_form, bitacora_cars_sort_enum } from '@/types/bitacora_cars';

export const useBitacoraCarsStore = defineStore('bitacoraCars', () => {
  const searchString = ref<string>('');
  const page = ref<number>(1);
  const pageSize = ref<number>(50);
  const pagesLoaded = ref<number[]>([]);
  const sortBy = ref<bitacora_cars_sort_enum>('a.name_es');
  const filterIsActive = ref<boolean[]>([]);
  const rows = ref<{ [k: string]: bitacora_cars[] }>({});
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const isDownloading = ref<boolean>(false);
  const selectedRowId = ref<string>();
  const formModel = ref<'edit'|'create'>('edit');
  const selectedRowData = ref<bitacora_cars_form>();
  const selectedRowDataAvatarHelper = ref<File | null>();

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
    rows,
    formModel,
    selectedRowId,
    selectedRowData,
    selectedRowDataAvatarHelper,
    // Getters
    hasFilter,
  };
});
