import type { LoaderFunctionArgs } from "react-router";
import { getSupabaseMainAdmin } from "../lib/supabase/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const nim = url.searchParams.get("nim");
  const email = url.searchParams.get("email");

  if (!nim || !email) {
    return Response.json({
      nim: false,
      email: false,
    });
  }

  const { data: nimData } = await getSupabaseMainAdmin()
    .from("kontributor")
    .select("nim")
    .eq("nim", nim)
    .maybeSingle();

  const { data: emailData } = await getSupabaseMainAdmin()
    .from("kontributor")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  const { data: bothData } = await getSupabaseMainAdmin()
    .from("kontributor")
    .select("nim, email")
    .eq("nim", nim)
    .eq("email", email)
    .maybeSingle();

  return Response.json({
    nim: !!nimData,
    email: !!emailData,
    match: !!bothData,
  });
}
