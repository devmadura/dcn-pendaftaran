import { createSupabaseServerClient } from "../lib/supabase/supabase.server";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);

  if (request.method === "POST") {
    const { session } = await request.json();

    if (!session) {
      return new Response("Session tidak ditemukan", { status: 400, headers });
    }

    // Set session ke cookie via Supabase SSR
    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      return new Response("Gagal menyimpan session", { status: 500, headers });
    }

    return new Response("OK", { status: 200, headers });
  }

  if (request.method === "DELETE") {
    await supabase.auth.signOut();
    return new Response("OK", { status: 200, headers });
  }

  return new Response("Method not allowed", { status: 405 });
}
