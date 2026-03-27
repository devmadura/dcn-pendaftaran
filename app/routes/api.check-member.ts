import type { LoaderFunctionArgs } from "react-router";
import { supabaseMainAdmin } from "../lib/supabaseMain";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const nim = url.searchParams.get("nim");
  const email = url.searchParams.get("email");

  if (!nim || !email) {
    return Response.json({ active: false });
  }

  const { data: oldMember } = await supabaseMainAdmin
    .from('kontributor')
    .select('nim, email')
    .eq('nim', nim)
    .eq('email', email)
    .maybeSingle();

  return Response.json({ active: !!oldMember });
}
