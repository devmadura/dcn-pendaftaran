import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// main supabase untuk db utama
let _supabaseMainAdmin: ReturnType<typeof createClient> | null = null;
export function getSupabaseMainAdmin() {
  if (_supabaseMainAdmin) return _supabaseMainAdmin;

  const url = process.env.MAIN_SUPABASE_URL;
  const key = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "MAIN_SUPABASE_URL or MAIN_SUPABASE_SERVICE_ROLE_KEY is missing",
    );
  }

  _supabaseMainAdmin = createClient(url, key);
  return _supabaseMainAdmin;
}
