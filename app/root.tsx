import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate
} from "react-router";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased min-h-screen relative overflow-x-hidden">
        {/* Background Animation */}
        <div className="background-wrapper">
          <div className="background-gradient"></div>
          {/* Particles */}
          <div className="background-particles">
            <div className="absolute w-[2px] h-[2px] bg-white/30 rounded-full animate-[float-particle_15s_infinite_ease-in-out_0s] left-[10%] top-[20%]" />
            <div className="absolute w-[2px] h-[2px] bg-white/30 rounded-full animate-[float-particle_15s_infinite_ease-in-out_2s] left-[30%] top-[60%]" />
            <div className="absolute w-[2px] h-[2px] bg-white/30 rounded-full animate-[float-particle_15s_infinite_ease-in-out_4s] left-[50%] top-[40%]" />
            <div className="absolute w-[2px] h-[2px] bg-white/30 rounded-full animate-[float-particle_15s_infinite_ease-in-out_6s] left-[70%] top-[70%]" />
            <div className="absolute w-[2px] h-[2px] bg-white/30 rounded-full animate-[float-particle_15s_infinite_ease-in-out_8s] left-[90%] top-[30%]" />
          </div>
        </div>

        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/");
      } else if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('accounts')
          .select('status')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.status !== 'active') {
          const errorMsg = profile?.status === 'pending'
            ? "Akun kamu belum disetujui admin"
            : profile?.status === 'rejected'
            ? "Pendaftaran kamu ditolak, hubungi admin"
            : "Akun tidak aktif";

          await supabase.auth.signOut();
          sessionStorage.setItem('login_error', errorMsg);
          navigate("/");
        } else {
          if (window.location.pathname === "/") {
            navigate("/dashboard");
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Terjadi kesalahan tak terduga.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "Halaman tidak ditemukan."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-3xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-display font-bold text-red-400 mb-4">{message}</h1>
        <p className="text-white/80 mb-6">{details}</p>
        <a href="/" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
          Kembali ke Beranda
        </a>
        {stack && (
          <pre className="w-full p-4 mt-8 bg-black/40 rounded-xl overflow-x-auto text-left text-sm text-white/60">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
