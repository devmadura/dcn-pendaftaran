import { createClient } from '@supabase/supabase-js';

const mainSupabaseUrl = process.env.MAIN_SUPABASE_URL || '';
const mainSupabaseKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY || '';

if (!mainSupabaseUrl || !mainSupabaseKey) {
  console.warn("MAIN_SUPABASE_URL or MAIN_SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.");
}

export const supabaseMainAdmin = createClient(mainSupabaseUrl, mainSupabaseKey);
