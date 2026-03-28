import { redirect } from "react-router";
import { createSupabaseServerClient } from "../lib/supabase/supabase.server";

export async function requireActiveUser(request: Request) {
  const { supabase } = createSupabaseServerClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw redirect("/");
  }
  const { data: profile, error: profileError } = await supabase
    .from("accounts")
    .select("status, nim, angkatan,prodi")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw redirect("/");
  }

  if (profile.status !== "active") {
    throw redirect("/");
  }

  return { user, profile };
}
