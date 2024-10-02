import { createClient } from '@supabase/supabase-js';

export const supabaseInstance = () => {
  const config = useRuntimeConfig();
  const supabase = createClient(`${config.public.supabaseUrl}`, `${config.supabaseServiceKey}`);

  return { supabase };
};
