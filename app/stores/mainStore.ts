export const useMainStore = defineStore('main', () => {
  const isUserSessionValid = ref<boolean>(false);
  const leftDrawer = ref<boolean>(true);

  return {
    isUserSessionValid,
    leftDrawer,
  }
})