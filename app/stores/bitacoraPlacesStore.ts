import type { bitacora_places_form, bitacora_places_sort_enum } from '@/types/bitacora_places';

export const useBitacoraPlacesStore = defineStore('bitacoraPlaces', () => {
  const searchString = ref<string>('');
  const page = ref<number>(1);
  const pageSize = ref<number>(50);
  const pagesLoaded = ref<number[]>([]);
  const sortBy = ref<bitacora_places_sort_enum>('a.name_es');
  const filterIsActive = ref<boolean[]>([]);
  const totalRows = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const isDownloading = ref<boolean>(false);
  const selectedRowId = ref<string>();
  const formModel = ref<'edit'|'create'>('edit');
  const selectedRowData = ref<bitacora_places_form>();
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
    formModel,
    selectedRowId,
    selectedRowData,
    selectedRowDataAvatarHelper,
    // Getters
    hasFilter,
  };
});
