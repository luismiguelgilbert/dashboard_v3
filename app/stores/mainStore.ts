import { type Session } from "@supabase/supabase-js";

export const useMainStore = defineStore('main', () => {
  const isUserSessionValid = ref<boolean>(false);
  const leftDrawer = ref<boolean>(true);
  const userSession: Ref<Session | null> = ref(null);

  return {
    isUserSessionValid,
    leftDrawer,
    userSession,
  }
})