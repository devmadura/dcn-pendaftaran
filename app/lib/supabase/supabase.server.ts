import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

/**
 * Buat Supabase client untuk server-side (loader / action).
 * Kompatibel dengan @supabase/ssr v0.9.x
 *
 * Kenapa tidak pakai createClient biasa?
 * → createClient baca session dari localStorage (browser only) → selalu null di loader.
 * → createServerClient baca session dari cookie request → benar untuk server-side.
 */
export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();

  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Fix: filter value yang undefined agar sesuai type GetAllCookies
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "").filter(
            (cookie): cookie is { name: string; value: string } =>
              cookie.value !== undefined,
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            );
          });
        },
      },
    },
  );

  // headers dikembalikan agar bisa di-set di response (refresh token)
  return { supabase, headers };
}
