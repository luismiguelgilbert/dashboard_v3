import type { PermissionsList } from '@/types/permissionsEnum';

export const hasClientPermission = (permission: PermissionsList): boolean => {
  try {
    const mainStore = useMainStore();
    return mainStore.userMenu.some((item) => item.id === permission);
  } catch (error) {
    console.log(error);
    return false;
  }
};